<script setup lang="ts">
import { guideLink, type HomeContent, type HomeLocale } from '../../composables/home';
defineProps<{ copy: HomeContent['platform']; locale: HomeLocale }>();
</script>

<template>
  <section id="platform" class="home-section home-wrap platform" aria-labelledby="platform-title">
    <div class="platform-heading">
      <h2 id="platform-title" class="home-title">{{ copy.title }}</h2>
      <p class="home-description">{{ copy.intro }}</p>
      <div class="platform-clients">
        <h3 class="feature-title">{{ copy.clients.title }}</h3>
        <p class="home-description">{{ copy.clients.text }}</p>
      </div>
      <div class="foundation-mark" aria-hidden="true">
        <img src="/logo.png" alt="" width="92" height="104" />
        <span>Python</span>
        <span>Vue</span>
        <span>PostgreSQL</span>
      </div>
    </div>
    <div class="platform-features">
      <article v-for="item in copy.items" :key="item.path" class="platform-feature">
        <h3 class="feature-title">{{ item.title }}</h3>
        <p class="home-description">{{ item.text }}</p>
        <a class="home-link" :href="guideLink(locale, item.path)">{{ item.link }}</a>
      </article>
    </div>
  </section>
</template>

<style scoped>
.platform {
  display: grid;
  grid-template-columns: 0.8fr 1.2fr;
  gap: 88px;
}
.platform-heading > .home-description {
  margin-top: 24px;
}
.platform-clients {
  margin-top: 28px;
  padding-top: 24px;
  border-top: 1px solid var(--home-line);
}
.platform-clients .home-description {
  font-size: 14px;
}
.platform-features {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 40px;
}
.platform-feature {
  border-top: 2px solid var(--home-line);
  padding-top: 22px;
}
.feature-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 12px;
}
.platform-feature .home-description {
  font-size: 14px;
}
.platform-feature .home-link {
  margin-top: 12px;
}
.foundation-mark {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  max-width: 310px;
  margin-top: 36px;
}
.foundation-mark img {
  width: 58px;
  height: 66px;
  object-fit: contain;
  margin-right: 6px;
}
.foundation-mark span {
  font-size: 12px;
  color: var(--home-muted);
  padding: 4px 9px;
  border: 1px solid var(--home-line);
  border-radius: 5px;
}
@media (max-width: 960px) {
  .platform {
    gap: 40px;
  }
  .platform-features {
    gap: 24px;
  }
}
@media (max-width: 760px) {
  .platform {
    grid-template-columns: 1fr;
  }
  .foundation-mark {
    display: none;
  }
}
@media (max-width: 420px) {
  .platform-features {
    grid-template-columns: 1fr;
  }
}
</style>
