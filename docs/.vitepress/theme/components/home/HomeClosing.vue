<script setup lang="ts">
import type { HomeContent } from '../../composables/home';
import HomeActions from './HomeActions.vue';

defineProps<{ copy: HomeContent['closing']; actions: Pick<HomeContent['hero'], 'demo' | 'develop'> }>();
</script>

<template>
  <section class="home-closing" aria-labelledby="closing-title">
    <div class="home-wrap closing-inner">
      <div class="closing-copy">
        <h2 id="closing-title" class="home-title">{{ copy.title }}</h2>
        <p class="home-description">{{ copy.text }}</p>
      </div>
      <HomeActions :copy="actions" />
    </div>
  </section>
</template>

<style scoped>
.home-closing {
  background: var(--home-section);
  border-top: 1px solid var(--home-line);
}
.closing-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
  padding-block: 64px;
}
.closing-copy {
  max-width: 62ch;
}
.closing-copy .home-title {
  font-size: clamp(28px, 2.6vw, 36px);
}
.closing-copy .home-description {
  margin-top: 16px;
}
.closing-inner > .home-actions {
  flex-shrink: 0;
}
@media (max-width: 960px) {
  .closing-inner {
    align-items: flex-start;
    flex-direction: column;
    gap: 28px;
    padding-block: 48px;
  }
}
</style>
