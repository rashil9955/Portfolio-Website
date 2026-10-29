import type { RouteKey } from './router';
import siteMeta from './siteMeta.json';

// Each page also ships with these tags pre-rendered into its own HTML file
// (see scripts/prerender.mjs); this keeps them correct during client-side navigation.
export function applyRouteMeta(route: RouteKey) {
  const meta = siteMeta.routes[route];
  const url = meta.path ? `${siteMeta.origin}${meta.path}` : null;

  document.title = meta.title;
  setMeta('name', 'description', meta.description);
  setMeta('name', 'robots', meta.index ? 'index, follow' : 'noindex, follow');
  setMeta('property', 'og:title', meta.title);
  setMeta('property', 'og:description', meta.description);
  setMeta('name', 'twitter:title', meta.title);
  setMeta('name', 'twitter:description', meta.description);

  const canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  const ogUrl = document.head.querySelector<HTMLMetaElement>('meta[property="og:url"]');
  if (url) {
    setLink(canonical, url);
    setMeta('property', 'og:url', url);
  } else {
    canonical?.remove();
    ogUrl?.remove();
  }
}

function setMeta(attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.append(element);
  }
  element.content = content;
}

function setLink(existing: HTMLLinkElement | null, href: string) {
  const element = existing ?? document.createElement('link');
  element.rel = 'canonical';
  element.href = href;
  if (!existing) document.head.append(element);
}
