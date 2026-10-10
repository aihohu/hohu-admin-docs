<script setup lang="ts">
import { computed } from 'vue';
import { guideLink, type HomeContent, type HomeLocale } from '../../composables/home';
import HomeAiDevelopment from './HomeAiDevelopment.vue';
import HomeDevelopmentStep from './HomeDevelopmentStep.vue';
const props = defineProps<{ copy: HomeContent['start']; locale: HomeLocale }>();
const resources = computed(() => props.copy.links.slice(1));
</script>

<template>
  <section id="start" class="start home-section" aria-labelledby="start-title">
    <div class="home-wrap">
      <div class="start-heading">
        <h2 id="start-title" class="home-title">{{ copy.title }}</h2>
        <p class="home-description start-intro">{{ copy.intro }}</p>
      </div>
      <div class="start-grid">
        <HomeAiDevelopment :copy="copy.ai" :locale="locale" />
        <article class="cli-development" aria-labelledby="cli-development-title">
          <h3 id="cli-development-title" class="development-title">{{ copy.cliTitle }}</h3>
          <p class="development-intro">{{ copy.cliIntro }}</p>
          <ol class="cli-steps" role="list">
            <HomeDevelopmentStep
              v-for="(step, index) in copy.cliSteps"
              :key="step.title"
              :step="index + 1"
              :title="step.title"
              :text="step.text"
              kind="command"
              :analytics-action="index === 0 ? 'cli_install' : index === 1 ? 'cli_project' : 'cli_start'"
              :copy-label="copy.copy"
              :copied="copy.copied"
              :failed="copy.failed"
            />
          </ol>
          <p class="prerequisites">{{ copy.prerequisites }}</p>
          <div class="cli-actions">
            <a class="home-link" :href="guideLink(locale, copy.links[0].path)">{{ copy.links[0].link }}</a>
          </div>
        </article>
      </div>
      <div class="developer-links">
        <a v-for="item in resources" :key="item.path" class="developer-link" :href="guideLink(locale, item.path)">
          <strong>{{ item.title }}</strong>
          <span>{{ item.text }}</span>
          <span class="resource-action">{{ item.link }}</span>
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.start {
  background: var(--home-section);
  border-block: 1px solid var(--home-line);
}
.start-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 56px;
}
.start-intro {
  margin-block: 20px 44px;
}
.cli-development {
  min-width: 0;
}
.development-title {
  font-size: 22px;
  line-height: 1.4;
  font-weight: 600;
}
.development-intro {
  color: var(--home-muted);
  font-size: 14px;
  margin-block: 12px 24px;
}
.cli-steps {
  margin: 0;
  padding: 24px;
  list-style: none;
  background: var(--home-bg);
  border: 1px solid var(--home-line);
  border-radius: 12px;
}
.prerequisites {
  font-size: 12px;
  line-height: 1.8;
  color: var(--home-muted);
  margin-top: 16px;
}
.cli-actions {
  margin-top: 8px;
}
.developer-links {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-top: 56px;
}
.developer-link {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-top: 24px;
  border-top: 1px solid var(--home-control-line);
}
.developer-link strong {
  font-size: 19px;
  font-weight: 600;
}
.developer-link > span {
  font-size: 14px;
  color: var(--home-muted);
}
.developer-link .resource-action {
  color: var(--home-blue);
  text-decoration: underline;
  text-underline-offset: 5px;
  margin-top: 4px;
}
.developer-link:hover .resource-action {
  text-decoration-thickness: 2px;
}
@media (max-width: 960px) {
  .start-grid {
    column-gap: 40px;
  }
}
@media (min-width: 761px) {
  .cli-development {
    display: grid;
    grid-template-rows: subgrid;
    grid-row: span 5;
    row-gap: 0;
  }
}
@media (max-width: 760px) {
  .start-grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  .start-grid > div {
    min-width: 0;
  }
  .cli-steps {
    padding: 20px;
  }
  .developer-links {
    grid-template-columns: 1fr;
    gap: 24px;
    margin-top: 32px;
  }
}
</style>
