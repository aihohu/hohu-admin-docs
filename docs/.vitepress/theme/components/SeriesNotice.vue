<script setup lang="ts">
import { computed } from 'vue';
import { useData } from 'vitepress';
import { seriesContext } from '../../series.mjs';

const { page } = useData();
const context = computed(() => seriesContext(page.value.relativePath));
const label = computed(() => {
  const value = context.value;
  if (!value) return '';
  if (value.status === 'unreleased') return value.zh ? '0.2 文档 · 尚未发布' : '0.2 documentation · Unreleased';
  if (value.status === 'maintained') return value.zh ? '0.1 文档 · 正常维护' : '0.1 documentation · Maintained';
  return value.zh ? '产品系列与支持状态' : 'Product series and support';
});
</script>

<template>
  <aside v-if="context" class="series-notice" :aria-label="label">
    <strong class="series-label">{{ label }}</strong>
    <nav class="series-links" :aria-label="context.zh ? '选择文档系列' : 'Choose documentation series'">
      <a :href="context.indexUrl">{{ context.zh ? '系列目录' : 'All series' }}</a>
      <a :href="context.stableUrl">{{ context.zh ? '0.1 · 正常维护' : '0.1 · Maintained' }}</a>
      <a :href="context.candidateUrl">{{ context.zh ? '0.2 · 未发布' : '0.2 · Unreleased' }}</a>
    </nav>
  </aside>
</template>

<style scoped>
.series-notice {
  margin-bottom: 24px;
  padding: 12px 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  font-size: 14px;
  line-height: 1.7;
}
.series-label {
  display: block;
}
.series-links {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 16px;
}
.series-links a {
  color: var(--vp-c-brand-1);
  text-decoration: underline;
  text-underline-offset: 3px;
}
.series-links a:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 3px;
}
</style>
