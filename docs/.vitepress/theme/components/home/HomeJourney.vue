<script setup lang="ts">
import { guideLink, type HomeContent, type HomeLocale } from '../../composables/home';
defineProps<{ copy: HomeContent['journey']; locale: HomeLocale }>();
</script>

<template>
  <section class="journey home-wrap" aria-labelledby="journey-title">
    <h2 id="journey-title" class="journey-heading">{{ copy.title }}</h2>
    <div class="journey-grid">
      <article v-for="(item, index) in copy.items" :key="item.path" class="journey-item">
        <div class="journey-track" aria-hidden="true">
          <svg
            class="journey-icon"
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <path v-if="index === 0" d="m11 9-7 7 7 7m10-14 7 7-7 7M18 5l-4 22" />
            <path v-else-if="index === 1" d="M5 5h22v9H5zm0 13h22v9H5zM9 9.5h2m-2 13h2m6-13h6m-6 13h6" />
            <path v-else d="M4 7h24v16H17l-6 5v-5H4zM10 15h2m3 0h2m3 0h2" />
          </svg>
          <span class="track-line"></span>
          <span v-if="index < 2" class="track-arrow">›</span>
        </div>
        <h3 class="journey-title">{{ item.title }}</h3>
        <p class="home-description">{{ item.text }}</p>
        <a class="home-link" :href="guideLink(locale, item.path)">{{ item.link }}</a>
      </article>
    </div>
  </section>
</template>

<style scoped>
.journey {
  padding-block: 40px 76px;
  border-top: 1px solid var(--home-line);
}
.journey-heading {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 28px;
  color: var(--home-muted);
}
.journey-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 48px;
}
.journey-track {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 18px;
  color: var(--home-blue);
}
.journey-icon {
  flex-shrink: 0;
}
.track-line {
  height: 1px;
  background: var(--home-line);
  flex: 1;
}
.track-arrow {
  color: var(--home-muted);
  font-size: 25px;
}
.journey-title {
  font-size: 21px;
  font-weight: 600;
  margin-bottom: 12px;
  letter-spacing: -0.02em;
}
.home-description {
  font-size: 14px;
}
.home-link {
  margin-top: 12px;
}
@media (max-width: 760px) {
  .journey {
    padding-block: 32px 56px;
  }
  .journey-grid {
    grid-template-columns: 1fr;
    gap: 28px;
  }
  .journey-track {
    margin-bottom: 12px;
  }
  .track-arrow {
    display: none;
  }
}
</style>
