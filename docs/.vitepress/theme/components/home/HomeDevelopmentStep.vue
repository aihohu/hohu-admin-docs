<script setup lang="ts">
import { computed } from 'vue';
import { useCommandCopy } from '../../composables/useCommandCopy';
import { trackAction, type AnalyticsAction } from '../../composables/analytics';

const props = defineProps<{
  step: number;
  title: string;
  text: string;
  kind: 'command' | 'prompt';
  description?: string;
  copyLabel: string;
  copied: string;
  failed: string;
  analyticsAction: AnalyticsAction;
}>();
const { status, copying, copy } = useCommandCopy();
async function copyStep() {
  if (await copy(props.text)) trackAction(props.analyticsAction);
}
const accessibleCopyLabel = computed(
  () => `${props.copyLabel}: ${props.title}${status.value === 'copied' ? ` (${props.copied})` : ''}`
);
const feedback = computed(() =>
  status.value === 'copied' ? `${props.copied}: ${props.title}` : status.value === 'failed' ? props.failed : ''
);
</script>

<template>
  <li class="development-step">
    <div class="step-heading">
      <span class="step-number" aria-hidden="true">{{ step }}</span>
      <h4 class="step-title">{{ title }}</h4>
      <button
        class="step-copy"
        type="button"
        :aria-label="accessibleCopyLabel"
        :aria-disabled="copying"
        @click="copyStep"
      >
        <span :class="{ 'copy-label-hidden': status === 'copied' }">{{ copyLabel }}</span>
        <span v-if="status === 'copied'" class="copy-success" aria-hidden="true">{{ copied }}</span>
      </button>
    </div>
    <p v-if="description" class="step-description">{{ description }}</p>
    <pre v-if="kind === 'command'" class="step-command" translate="no"><code>{{ text }}</code></pre>
    <blockquote v-else class="step-prompt">{{ text }}</blockquote>
    <p class="step-feedback" :class="{ 'is-failed': status === 'failed' }" role="status">{{ feedback }}</p>
  </li>
</template>

<style scoped>
.development-step {
  min-width: 0;
  padding: 20px 0;
}
.development-step:first-child {
  padding-top: 0;
}
.development-step:last-child {
  padding-bottom: 0;
}
.development-step + .development-step {
  border-top: 1px solid var(--home-line);
}
.step-heading {
  display: grid;
  grid-template-columns: 26px minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
  min-width: 0;
}
.step-number {
  display: grid;
  place-items: center;
  flex: 0 0 26px;
  height: 26px;
  border-radius: 50%;
  background: var(--home-surface);
  color: var(--home-green);
  font-size: 13px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}
.step-title {
  margin: 0;
  min-width: 0;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.5;
  text-wrap: balance;
}
.step-copy {
  position: relative;
  flex-shrink: 0;
  margin-left: auto;
  padding: 8px 10px;
  min-height: 44px;
  border: 1px solid var(--home-control-line);
  border-radius: 6px;
  color: var(--home-blue);
  font-size: 12px;
  line-height: 1.5;
  cursor: pointer;
}
.step-copy:hover {
  background: var(--home-hover);
}
.step-copy[aria-disabled='true'] {
  cursor: progress;
}
.copy-label-hidden {
  visibility: hidden;
}
.copy-success {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
}
.step-description {
  color: var(--home-muted);
  font-size: 12px;
  line-height: 1.8;
  margin-top: 8px;
}
.step-command {
  margin: 12px 0 0;
  padding: 14px 16px;
  border: 1px solid var(--home-line);
  border-radius: 8px;
  background: var(--home-surface);
  color: var(--home-ink);
  font-family: 'Cascadia Code', Consolas, monospace;
  font-size: 13px;
  line-height: 1.9;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
.step-command code {
  font-family: inherit;
}
.step-prompt {
  margin: 12px 0 0;
  font-size: 14px;
  line-height: 1.9;
  overflow-wrap: anywhere;
}
.step-feedback:not(.is-failed) {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
.step-feedback.is-failed {
  margin-top: 10px;
  color: var(--home-muted);
  font-size: 12px;
}
@media (max-width: 400px) {
  .step-copy {
    padding-inline: 8px;
  }
}
</style>
