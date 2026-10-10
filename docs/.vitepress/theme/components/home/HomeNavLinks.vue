<script setup lang="ts">
import { guideLink, type HomeContent, type HomeLocale } from '../../composables/home';

defineProps<{ copy: HomeContent['nav']; locale: HomeLocale }>();
</script>

<template>
  <nav class="nav-links" :aria-label="copy.label">
    <a href="#workflow">{{ copy.workflow }}</a>
    <a href="#platform">{{ copy.platform }}</a>
    <a v-for="guide in copy.guides" :key="guide.path" :href="guideLink(locale, guide.path)">{{ guide.title }}</a>
    <a href="https://github.com/aihohu/hohu-admin/issues" target="_blank" rel="noopener">{{ copy.feedback }}</a>
  </nav>
</template>

<style scoped>
.nav-links {
  display: flex;
  gap: 24px;
  align-items: center;
  font-size: 14px;
}
.nav-links > a {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
}
.nav-links > a:hover {
  color: var(--home-blue);
}
@media (max-width: 1100px) {
  .nav-links {
    padding-block: 16px 24px;
    gap: 4px;
    align-items: stretch;
    flex-direction: column;
  }
  .nav-links > a {
    padding-inline: 12px;
  }
}
</style>
