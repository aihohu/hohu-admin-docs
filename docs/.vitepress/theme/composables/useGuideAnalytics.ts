import { onMounted, watch } from 'vue';
import { useData } from 'vitepress';
import { trackGuideView } from './analytics';

export function useGuideAnalytics() {
  const { page } = useData();
  onMounted(() => trackGuideView(page.value.relativePath));
  watch(
    () => page.value.relativePath,
    file => trackGuideView(file),
    { flush: 'post' }
  );
}
