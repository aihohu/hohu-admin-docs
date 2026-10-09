import { watch } from 'vue';
import { useData } from 'vitepress';

export function useHomeTheme() {
  const { isDark } = useData();
  watch(
    isDark,
    dark => {
      if (typeof globalThis.document === 'undefined') return;
      const color = dark ? '#111b2b' : '#ffffff';
      globalThis.document.querySelectorAll('meta[name="theme-color"]').forEach(meta => {
        meta.setAttribute('content', color);
      });
    },
    { immediate: true, flush: 'post' }
  );
}
