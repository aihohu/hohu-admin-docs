<script setup lang="ts">
import type { HomeContent } from '../../composables/home';
defineProps<{ copy: HomeContent['footer'] }>();
</script>

<template>
  <section class="faq home-section home-wrap" aria-labelledby="faq-title">
    <h2 id="faq-title" class="home-title">{{ copy.title }}</h2>
    <div class="faq-list">
      <details v-for="item in copy.questions" :key="item.title" class="faq-item">
        <summary class="faq-question">{{ item.title }}</summary>
        <p class="faq-answer">{{ item.answer }}</p>
      </details>
      <p class="limitations">{{ copy.limitations }}</p>
    </div>
  </section>
</template>

<style scoped>
.faq {
  display: grid;
  grid-template-columns: 0.85fr 1.15fr;
  gap: 88px;
}
.faq .home-title {
  font-size: 29px;
}
.faq-list {
  min-width: 0;
}
.faq-item {
  border-bottom: 1px solid var(--home-line);
}
.faq-item:first-child {
  border-top: 1px solid var(--home-line);
}
.faq-question {
  padding: 20px 2px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
}
.faq-question::marker {
  color: var(--home-blue);
}
.faq-answer {
  padding: 0 2px 24px;
  color: var(--home-muted);
  font-size: 14px;
  line-height: 1.85;
}
.limitations {
  padding-top: 20px;
  font-size: 12px;
  color: var(--home-muted);
}
@media (max-width: 760px) {
  .faq {
    grid-template-columns: 1fr;
    gap: 32px;
  }
}
</style>
