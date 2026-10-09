<script setup lang="ts">
import { shallowRef, useTemplateRef } from 'vue';
import { VPNavBarTranslations, VPSwitchAppearance, VPNavBarSocialLinks } from './native-theme.mjs';
import { guideLink, type HomeContent, type HomeLocale } from '../../composables/home';

defineProps<{ copy: HomeContent['nav']; locale: HomeLocale }>();
const open = shallowRef(false);
const toggle = useTemplateRef<HTMLButtonElement>('toggle');
const tools = useTemplateRef<HTMLElement>('nav-tools');
function keepLanguageOpen(event: MouseEvent) {
  const button = (event.target as HTMLElement).closest<HTMLButtonElement>('.VPNavBarTranslations .button');
  // The native flyout opens on hover; a pointer click should keep its ARIA state open.
  if (event.detail > 0 && button?.getAttribute('aria-expanded') === 'true') {
    event.stopPropagation();
  }
}
function closeLanguageMenu() {
  const button = tools.value?.querySelector<HTMLButtonElement>('.VPNavBarTranslations .button[aria-expanded="true"]');
  if (button) {
    button.click();
    button.focus();
  } else {
    escapeMenu();
  }
}
function closeMenu() {
  open.value = false;
}
function escapeMenu() {
  if (open.value) {
    closeMenu();
    toggle.value?.focus();
  }
}
</script>

<template>
  <header class="site-header" @keydown.esc="escapeMenu">
    <div class="home-wrap nav-inner">
      <a class="home-brand" :href="locale === 'zh' ? '/zh/' : '/'" aria-label="HoHu" translate="no">
        <img src="/logo.png" alt="" width="32" height="36" />
        HoHu
      </a>
      <div ref="nav-tools" class="nav-tools" @click.capture="keepLanguageOpen" @keydown.esc.stop="closeLanguageMenu">
        <VPNavBarTranslations />
        <div class="theme-control">
          <ClientOnly>
            <VPSwitchAppearance />
          </ClientOnly>
        </div>
        <VPNavBarSocialLinks />
      </div>
      <button
        ref="toggle"
        class="menu-toggle"
        type="button"
        :aria-label="open ? copy.close : copy.menu"
        :aria-expanded="open"
        aria-controls="home-navigation"
        @click="open = !open"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          aria-hidden="true"
        >
          <path v-if="open" d="m6 6 12 12M6 18 18 6" />
          <path v-else d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>
      <nav
        id="home-navigation"
        class="nav-links"
        :class="{ 'is-open': open }"
        :aria-label="copy.label"
        @click="closeMenu"
      >
        <a href="#workflow">{{ copy.workflow }}</a>
        <a href="#platform">{{ copy.platform }}</a>
        <a v-for="guide in copy.guides" :key="guide.path" :href="guideLink(locale, guide.path)">{{ guide.title }}</a>
        <a href="https://github.com/aihohu/hohu-admin/issues" target="_blank" rel="noopener">{{ copy.feedback }}</a>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 30;
  background: var(--home-header);
  border-bottom: 1px solid var(--home-line);
}
.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 80px;
  gap: 24px;
}
.nav-links {
  display: flex;
  gap: 24px;
  align-items: center;
  font-size: 14px;
  order: 1;
  margin-left: auto;
}
.nav-links > a {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
}
.nav-links > a:hover {
  color: var(--home-blue);
}
.nav-tools {
  display: flex;
  align-items: center;
  gap: 12px;
  order: 2;
}
.nav-tools :deep(.VPNavBarTranslations) {
  display: flex;
}
.nav-tools :deep(.VPNavBarSocialLinks) {
  display: flex;
  align-items: center;
}
.nav-tools :deep(.VPSocialLink) {
  min-height: 44px;
  color: var(--home-muted);
}
.nav-tools :deep(.VPSocialLink:hover) {
  color: var(--home-ink);
}
.nav-tools :deep(.VPFlyout .button) {
  height: 44px;
  padding-inline: 8px;
}
.nav-tools :deep(.VPFlyout .button[aria-expanded='false'] + .menu) {
  opacity: 0;
  visibility: hidden;
}
.theme-control {
  display: flex;
  align-items: center;
  width: 40px;
  min-height: 44px;
}
.theme-control :deep(.VPSwitchAppearance)::after {
  content: '';
  position: absolute;
  inset: -11px -4px;
}
.menu-toggle {
  display: none;
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--home-line);
  border-radius: 8px;
  cursor: pointer;
  order: 3;
}
@media (max-width: 960px) {
  .nav-links {
    gap: 18px;
  }
}
@media (max-width: 1100px) {
  .nav-inner {
    min-height: 68px;
    flex-wrap: wrap;
    gap: 12px;
  }
  .nav-tools {
    margin-left: auto;
  }
  .menu-toggle {
    display: flex;
  }
  .nav-links {
    display: none;
    width: 100%;
    padding: 16px 0 24px;
    gap: 4px;
    align-items: stretch;
    flex-direction: column;
    order: 4;
    margin-left: 0;
  }
  .nav-links.is-open {
    display: flex;
  }
  .nav-links > a {
    padding-inline: 12px;
  }
}
@media (max-width: 380px) {
  .site-header .nav-inner {
    width: calc(100% - 24px);
  }
  .nav-inner,
  .nav-tools {
    gap: 6px;
  }
  .nav-tools :deep(.VPFlyout .button) {
    padding-inline: 4px;
  }
  .site-header .home-brand {
    font-size: 20px;
    gap: 6px;
  }
}
</style>
