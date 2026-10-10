<script setup lang="ts">
import { guideLink, skillsInstallCommand, type HomeContent, type HomeLocale } from '../../composables/home';
import HomeDevelopmentStep from './HomeDevelopmentStep.vue';
defineProps<{ copy: HomeContent['start']['ai']; locale: HomeLocale }>();
</script>

<template>
  <article class="ai-development" aria-labelledby="ai-development-title">
    <h3 id="ai-development-title" class="development-title">{{ copy.title }}</h3>
    <p class="development-intro">{{ copy.intro }}</p>
    <ol class="ai-steps" role="list">
      <HomeDevelopmentStep
        :step="1"
        :title="copy.installTitle"
        :text="skillsInstallCommand"
        kind="command"
        analytics-action="skills_install"
        :description="copy.installNote"
        :copy-label="copy.copyCommand"
        :copied="copy.copied"
        :failed="copy.failed"
      />
      <HomeDevelopmentStep
        v-for="(prompt, index) in copy.prompts"
        :key="prompt.title"
        :step="index + 2"
        :title="prompt.title"
        :text="prompt.text"
        kind="prompt"
        :analytics-action="index === 0 ? 'ai_project' : 'ai_module'"
        :description="index === 0 ? copy.promptNote : undefined"
        :copy-label="copy.copyPrompt"
        :copied="copy.copied"
        :failed="copy.failed"
      />
    </ol>
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
  margin-block: 12px 24px;
  color: var(--home-muted);
  font-size: 14px;
}
.ai-steps {
  margin: 0;
  padding: 24px;
  list-style: none;
  background: var(--home-bg);
  border: 1px solid var(--home-line);
  border-radius: 12px;
}
.ai-note {
  margin-top: 16px;
  font-size: 12px;
  line-height: 1.8;
  color: var(--home-muted);
}
.ai-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 24px;
  margin-top: 8px;
}
@media (min-width: 761px) {
  .ai-development {
    display: grid;
    grid-template-rows: subgrid;
    grid-row: span 5;
    row-gap: 0;
  }
}
@media (max-width: 760px) {
  .ai-steps {
    padding: 20px;
  }
}
</style>
