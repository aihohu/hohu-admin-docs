import { computed } from 'vue';
import { useData } from 'vitepress';
import { homeContent, type HomeLocale } from './home';

export function useHomeContent() {
  const { lang } = useData();
  const locale = computed<HomeLocale>(() => (lang.value === 'zh-CN' ? 'zh' : 'en'));
  const copy = computed(() => homeContent[locale.value]);
  return { locale, copy };
}
