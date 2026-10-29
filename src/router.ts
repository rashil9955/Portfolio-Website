import type { MouseEvent } from 'react';
import { useEffect, useState } from 'react';
import siteMeta from './siteMeta.json';

export type RouteKey = keyof typeof siteMeta.routes;

const NAVIGATE_EVENT = 'app:navigate';

const routesByPath = new Map<string, RouteKey>(
  (Object.keys(siteMeta.routes) as RouteKey[]).flatMap((key) => {
    const path = siteMeta.routes[key].path;
    return path ? [[path, key] as const] : [];
  }),
);

export function routeFromPath(pathname: string): RouteKey {
  const normalized =
    pathname
      .toLowerCase()
      .replace(/\/index\.html$/, '/')
      .replace(/\.html$/, '')
      .replace(/(.)\/+$/, '$1') || '/';
  return routesByPath.get(normalized) ?? 'notFound';
}

// The site used hash routes (#/work) before switching to real paths.
function redirectLegacyHash() {
  const match = window.location.hash.match(/^#\/(work|about|contact)\/?$/i);
  if (match) {
    window.history.replaceState(null, '', `/${match[1].toLowerCase()}`);
  }
}

export function navigate(path: string) {
  if (path === window.location.pathname) return;
  window.history.pushState(null, '', path);
  window.dispatchEvent(new Event(NAVIGATE_EVENT));
  window.scrollTo({ top: 0 });
}

export function useRoute() {
  const [route, setRoute] = useState<RouteKey>(() => {
    redirectLegacyHash();
    return routeFromPath(window.location.pathname);
  });

  useEffect(() => {
    const sync = () => setRoute(routeFromPath(window.location.pathname));
    window.addEventListener('popstate', sync);
    window.addEventListener(NAVIGATE_EVENT, sync);
    return () => {
      window.removeEventListener('popstate', sync);
      window.removeEventListener(NAVIGATE_EVENT, sync);
    };
  }, []);

  return route;
}

// Lets internal <a href="/work"> links switch pages without a full reload,
// while modifier-clicks still open new tabs as usual.
export function handleInternalLinkClick(event: MouseEvent<HTMLAnchorElement>) {
  const anchor = event.currentTarget;
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey ||
    anchor.target === '_blank' ||
    anchor.origin !== window.location.origin
  ) {
    return;
  }
  event.preventDefault();
  navigate(anchor.pathname);
}
