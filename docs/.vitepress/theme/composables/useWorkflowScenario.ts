import { onMounted, onUnmounted, readonly, shallowRef } from 'vue';
import type { HomeScenarioId } from './home';

export function useWorkflowScenario(ids: HomeScenarioId[]) {
  const selected = shallowRef(ids[0]);
  function syncFromUrl() {
    const hash = window.location.hash;
    const legacy = hash.match(/^#workflow-step-(\d+)$/);
    const id = legacy ? ids[Number(legacy[1]) - 1] : ids.find(item => hash === `#workflow-${item}`);
    selected.value = id ?? ids[0];
  }
  function select(id: HomeScenarioId) {
    selected.value = id;
    window.history.replaceState(window.history.state, '', `#workflow-${id}`);
  }
  onMounted(() => {
    syncFromUrl();
    window.addEventListener('hashchange', syncFromUrl);
  });
  onUnmounted(() => window.removeEventListener('hashchange', syncFromUrl));
  return { selected: readonly(selected), select };
}
