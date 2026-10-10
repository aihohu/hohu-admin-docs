import { siteOrigin } from './seo.mjs';

export const measurementId = 'G-K5W3P408PS';
export const analyticsBootstrap = `(() => {
  if (window.location.origin !== ${JSON.stringify(siteOrigin)}) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', ${JSON.stringify(measurementId)});
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + ${JSON.stringify(measurementId)};
  document.head.appendChild(script);
})();`;
