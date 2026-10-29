// Google Analytics 4, loaded only after the visitor opts in.
// Set VITE_GA_MEASUREMENT_ID at build time to turn it on; without it nothing loads.

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export type AnalyticsConsent = 'granted' | 'denied';

// Event names and parameters are fixed here so names, emails, and message text
// can never be passed along by accident.
type AnalyticsEvent =
  | { name: 'cta_click'; params: { cta: 'home_get_in_touch' | 'not_found_home' } }
  | { name: 'contact_form_submit_success'; params?: undefined }
  | { name: 'contact_form_submit_error'; params: { status: string } };

const measurementId = (import.meta.env.VITE_GA_MEASUREMENT_ID ?? '').trim();
const CONSENT_KEY = 'rshibak:analytics-consent';

export const analyticsConfigured = /^G-[A-Z0-9]+$/.test(measurementId);

let loaded = false;
let lastPageViewPath: string | null = null;

export function getAnalyticsConsent(): AnalyticsConsent | null {
  try {
    const value = window.localStorage.getItem(CONSENT_KEY);
    return value === 'granted' || value === 'denied' ? value : null;
  } catch {
    return null;
  }
}

export function setAnalyticsConsent(consent: AnalyticsConsent) {
  try {
    window.localStorage.setItem(CONSENT_KEY, consent);
  } catch {
    // Storage can be blocked; the choice then lasts for this page load only.
  }

  if (consent === 'granted') {
    loadAnalytics();
    trackPageView(document.title);
  } else {
    disableAnalytics();
  }
}

export function initAnalytics() {
  if (getAnalyticsConsent() === 'granted') loadAnalytics();
}

export function trackPageView(title: string) {
  if (!loaded || !window.gtag) return;
  const path = window.location.pathname;
  // React's StrictMode runs effects twice in development; skip the repeat.
  if (path === lastPageViewPath) return;
  lastPageViewPath = path;
  window.gtag('event', 'page_view', {
    page_title: title,
    page_path: path,
    // Origin + path only: query strings and hashes are never sent.
    page_location: `${window.location.origin}${path}`,
  });
}

export function trackEvent(event: AnalyticsEvent) {
  if (!loaded || !window.gtag) return;
  window.gtag('event', event.name, event.params ?? {});
}

function loadAnalytics() {
  if (!analyticsConfigured || loaded) return;
  loaded = true;
  (window as unknown as Record<string, unknown>)[`ga-disable-${measurementId}`] = false;

  window.dataLayer = window.dataLayer ?? [];
  window.gtag = function gtag() {
    // gtag.js expects the arguments object itself, not an array.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer?.push(arguments);
  };
  window.gtag('js', new Date());
  // GA4 treats any debug_mode value (even false) as "on", so only add it in development.
  window.gtag('config', measurementId, {
    send_page_view: false,
    ...(import.meta.env.DEV ? { debug_mode: true } : {}),
  });

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.append(script);
}

function disableAnalytics() {
  if (!analyticsConfigured) return;
  (window as unknown as Record<string, unknown>)[`ga-disable-${measurementId}`] = true;
  loaded = false;
  lastPageViewPath = null;

  // Remove the cookies GA4 sets (_ga and _ga_<id>) on this domain and its parent.
  const hostParts = window.location.hostname.split('.');
  const domains = ['', window.location.hostname, `.${hostParts.slice(-2).join('.')}`];
  document.cookie.split(';').forEach((cookie) => {
    const name = cookie.split('=')[0].trim();
    if (!name.startsWith('_ga')) return;
    domains.forEach((domain) => {
      document.cookie = `${name}=; Max-Age=0; path=/${domain ? `; domain=${domain}` : ''}`;
    });
  });
}
