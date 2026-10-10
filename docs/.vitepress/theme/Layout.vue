<script setup lang="ts">
import { computed } from 'vue';
import { useData, Content } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import { useGuideAnalytics } from './composables/useGuideAnalytics';
useGuideAnalytics();
const { Layout } = DefaultTheme;
const { page } = useData();
const isHome = computed(() => ['index.md', 'zh/index.md'].includes(page.value.relativePath));
</script>

<template>
  <Content v-if="isHome" />
  <Layout v-else />
</template>
