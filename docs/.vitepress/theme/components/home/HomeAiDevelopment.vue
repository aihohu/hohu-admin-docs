<script setup lang="ts">
import { guideLink, type HomeContent, type HomeLocale } from '../../composables/home';
defineProps<{ copy: HomeContent['start']['ai']; locale: HomeLocale }>();
</script>

<template>
  <article class="ai-development" aria-labelledby="ai-development-title">
    <h3 id="ai-development-title" class="development-title">{{ copy.title }}</h3>
    <p class="development-intro">{{ copy.intro }}</p>
    <div class="ai-prompts">
      <div v-for="prompt in copy.prompts" :key="prompt.title" class="ai-prompt">
        <h4>{{ prompt.title }}</h4>
        <blockquote>{{ prompt.text }}</blockquote>
      </div>
    </div>
    <p class="ai-note">{{ copy.note }}</p>
    <div class="ai-actions">
      <a class="home-link" :href="guideLink(locale, copy.skillsPath)">{{ copy.skills }}</a>
      <a class="home-link" :href="guideLink(locale, copy.guidePath)">{{ copy.guide }}</a>
    </div>
  </article>
</template>

<style scoped>
.ai-development {
  min-width: 0;
}
.development-title {
  font-size: 22px;
  line-height: 1.4;
  font-weight: 600;
}
.development-intro {
  margin-top: 12px;
  color: var(--home-muted);
  font-size: 14px;
}
.ai-prompts {
  margin-top: 24px;
  padding: 24px;
  background: var(--home-bg);
  border: 1px solid var(--home-line);
  border-radius: 12px;
}
.ai-prompt + .ai-prompt {
  border-top: 1px solid var(--home-line);
  padding-top: 20px;
  margin-top: 20px;
}
.ai-prompt h4 {
  margin: 0 0 10px;
  font-size: 14px;
  font-weight: 600;
  color: var(--home-green);
}
.ai-prompt blockquote {
  margin: 0;
  font-size: 14px;
  line-height: 1.9;
  overflow-wrap: anywhere;
}
.ai-note {
  margin-top: 16px;
  font-size: 12px;
  color: var(--home-muted);
}
.ai-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 24px;
  margin-top: 8px;
}
@media (max-width: 760px) {
  .ai-prompts {
    padding: 20px;
  }
}
</style>
