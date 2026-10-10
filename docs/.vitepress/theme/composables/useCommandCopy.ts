import { shallowRef, readonly } from 'vue';

export function useCommandCopy() {
  const status = shallowRef<'idle' | 'copied' | 'failed'>('idle');
  const copying = shallowRef(false);
  async function copy(text: string) {
    if (copying.value) return false;
    copying.value = true;
    status.value = 'idle';
    try {
      await window.navigator.clipboard.writeText(text);
      status.value = 'copied';
      return true;
    } catch {
      status.value = 'failed';
      return false;
    } finally {
      copying.value = false;
    }
  }
  return { status: readonly(status), copying: readonly(copying), copy };
}
