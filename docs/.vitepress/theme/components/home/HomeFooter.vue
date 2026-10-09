<script setup lang="ts">
import { guideLink, type HomeContent, type HomeLocale } from '../../composables/home';
defineProps<{ copy: HomeContent['footer']; locale: HomeLocale }>();
</script>

<template>
  <footer class="site-footer">
    <div class="home-wrap footer-inner">
      <div>
        <a class="home-brand" :href="locale === 'zh' ? '/zh/' : '/'" translate="no">
          <img src="/logo.png" alt="" width="32" height="36" />
          HoHu
        </a>
        <p class="footer-description">{{ copy.description }}</p>
      </div>
      <nav class="footer-links" :aria-label="locale === 'zh' ? '页脚导航' : 'Footer navigation'">
        <a v-for="item in copy.links" :key="item.path" :href="guideLink(locale, item.path)">{{ item.title }}</a>
        <a href="https://github.com/aihohu">GitHub</a>
        <a href="https://github.com/aihohu/hohu-admin/issues">{{ locale === 'zh' ? '问题反馈' : 'Report an issue' }}</a>
      </nav>
      <div class="footer-bottom">
        <span>© 2025–2026 HoHu</span>
        <span>{{ copy.license }}</span>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  border-top: 1px solid var(--home-line);
  background: var(--home-surface);
}
.footer-inner {
  padding-block: 48px 24px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 36px;
}
.footer-description {
  font-size: 14px;
  color: var(--home-muted);
  margin-top: 12px;
  max-width: 35ch;
}
.footer-links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px 24px;
  align-content: start;
  font-size: 13px;
}
.footer-links a {
  display: flex;
  align-items: center;
  min-height: 44px;
}
.footer-links a:hover {
  color: var(--home-blue);
  text-decoration: underline;
  text-underline-offset: 4px;
}
.footer-bottom {
  grid-column: 1 / -1;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  padding-top: 24px;
  border-top: 1px solid var(--home-line);
  color: var(--home-muted);
  font-size: 12px;
}
@media (max-width: 760px) {
  .footer-inner {
    grid-template-columns: 1fr;
  }
  .footer-links {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
