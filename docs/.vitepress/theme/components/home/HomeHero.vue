<script setup lang="ts">
import { type HomeContent } from '../../composables/home';
import ProductScreen from './ProductScreen.vue';
import HomeActions from './HomeActions.vue';
defineProps<{ copy: HomeContent['hero'] }>();
</script>

<template>
  <section class="hero home-wrap" aria-labelledby="hero-title">
    <div class="hero-copy">
      <p class="category">
        <span class="category-mark" aria-hidden="true"></span>
        {{ copy.category }}
      </p>
      <h1 id="hero-title" class="hero-title">{{ copy.title }}</h1>
      <p class="hero-intro">{{ copy.intro }}</p>
      <HomeActions :copy="copy" />
      <ul class="hero-proof">
        <li v-for="item in copy.proof" :key="item">
          <span aria-hidden="true">✓</span>
          {{ item }}
        </li>
      </ul>
    </div>
    <div class="workspace-frame">
      <div class="workspace-heading">
        <img src="/logo.png" alt="" width="20" height="23" />
        <span>{{ copy.screenTitle }}</span>
        <span class="workspace-symbol" aria-hidden="true">⌘</span>
      </div>
      <ProductScreen
        :src="copy.image"
        :dark-src="copy.darkImage"
        :alt="copy.alt"
        :caption="copy.caption"
        :image-link="copy.imageLink"
        eager
      />
    </div>
  </section>
</template>

<style scoped>
.hero {
  display: grid;
  grid-template-columns: 0.95fr 1.15fr;
  gap: 52px;
  align-items: center;
  padding-block: 44px 56px;
}
.hero-copy {
  min-width: 0;
}
.category {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: var(--home-green);
  font-weight: 600;
  margin-bottom: 22px;
}
.category-mark {
  width: 10px;
  height: 10px;
  flex-shrink: 0;
  border: 2px solid currentColor;
  border-radius: 3px;
}
.hero-title {
  font-size: clamp(38px, 3.85vw, 55px);
  line-height: 1.24;
  letter-spacing: -0.055em;
  font-weight: 650;
  white-space: pre-line;
  text-wrap: balance;
}
.hero-intro {
  margin: 24px 0 30px;
  color: var(--home-muted);
  font-size: 17px;
  line-height: 1.85;
  max-width: 48ch;
}
.hero-proof {
  list-style: none;
  padding: 0;
  margin: 26px 0 0;
  display: flex;
  flex-wrap: wrap;
  gap: 10px 22px;
  font-size: 12px;
  color: var(--home-muted);
}
.hero-proof li {
  display: flex;
  gap: 7px;
  align-items: center;
}
.hero-proof span {
  color: var(--home-green);
}
.workspace-frame {
  min-width: 0;
  position: relative;
  background: var(--home-frame);
  border: 1px solid var(--home-line);
  border-radius: 16px;
  padding: 0 14px 18px;
  color: var(--home-frame-ink);
  box-shadow: 14px 18px 0 var(--home-shadow);
}
.workspace-heading {
  min-height: 52px;
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 13px;
  font-weight: 600;
}
.workspace-heading img {
  object-fit: contain;
}
.workspace-symbol {
  margin-left: auto;
  color: var(--home-muted);
  font-size: 20px;
}
@media (min-width: 761px) and (max-width: 1100px) {
  .hero {
    gap: 32px;
  }
  .hero-title {
    font-size: 39px;
  }
}
@media (max-width: 760px) {
  .hero {
    grid-template-columns: 1fr;
    gap: 40px;
    padding-block: 48px 56px;
  }
  .hero-title {
    font-size: clamp(32px, 7.7vw, 46px);
  }
  .hero-intro {
    font-size: 16px;
    margin-block: 20px 24px;
  }
  .category {
    font-size: 12px;
    margin-bottom: 18px;
  }
  .workspace-frame {
    box-shadow: 7px 9px 0 var(--home-shadow);
    padding-inline: 10px;
  }
  .hero-proof {
    gap: 10px 16px;
  }
}
@media (max-width: 380px) {
  .hero-title {
    font-size: 28px;
  }
}
</style>
