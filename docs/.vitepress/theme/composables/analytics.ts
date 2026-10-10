import { pagePaths } from '../../navigation.mjs';
import { canonicalUrl, siteOrigin } from '../../seo.mjs';

const actionNames = {
  demo: 'demo_click',
  get_started: 'get_started_click',
  skills_install: 'command_copy',
  cli_install: 'command_copy',
  cli_project: 'command_copy',
  cli_start: 'command_copy',
  ai_project: 'prompt_copy',
  ai_module: 'prompt_copy'
} as const;
export type AnalyticsAction = keyof typeof actionNames;
type AnalyticsEvent = { name: string; params: Record<string, string> };
const publicPaths = new Set(pagePaths.map(file => canonicalUrl(file).slice(siteOrigin.length)));
const guides = new Set([
  'quick-start',
  'cli/skills',
  'ai-coding',
  'development/index',
  'development/module',
  'development/ai-tools',
  'deploy'
]);

function context(path: string) {
  const pagePath = path.split(/[?#]/)[0].replace(/\/index\.html$/, '/');
  if (!publicPaths.has(pagePath)) return null;
  return { page_path: pagePath, locale: pagePath.startsWith('/zh/') ? 'zh-CN' : 'en' };
}

export function actionEvent(action: string, path: string): AnalyticsEvent | null {
  const page = context(path);
  if (!Object.hasOwn(actionNames, action) || !page) return null;
  return { name: actionNames[action as AnalyticsAction], params: { action_id: action, ...page } };
}

export function guideEvent(file: string): AnalyticsEvent | null {
  const guide = file
    .replace(/^zh\//, '')
    .replace(/^guide\//, '')
    .replace(/\.md$/, '');
  if (!guides.has(guide) || !pagePaths.includes(file)) return null;
  const page = context(canonicalUrl(file).slice(siteOrigin.length));
  return page ? { name: 'guide_view', params: { guide_id: guide, ...page } } : null;
}

function dispatch(event: AnalyticsEvent | null) {
  if (!event || typeof globalThis.window === 'undefined') return;
  const browser = globalThis.window as Window & {
    gtag?: (command: 'event', name: string, params: Record<string, string>) => void;
  };
  if (browser.location.origin !== siteOrigin) return;
  try {
    browser.gtag?.('event', event.name, event.params);
  } catch {
    // Analytics must never prevent navigation or turn a successful copy into a failure.
  }
}

export function trackAction(action: AnalyticsAction) {
  if (typeof globalThis.window === 'undefined') return;
  dispatch(actionEvent(action, globalThis.window.location.pathname));
}

export function trackGuideView(file: string) {
  dispatch(guideEvent(file));
}
