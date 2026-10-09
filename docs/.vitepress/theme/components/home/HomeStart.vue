<script setup lang="ts">
import { computed } from 'vue';
import { commands, guideLink, type HomeContent, type HomeLocale } from '../../composables/home';
import { useCommandCopy } from '../../composables/useCommandCopy';
import HomeAiDevelopment from './HomeAiDevelopment.vue';
const props = defineProps<{ copy: HomeContent['start']; locale: HomeLocale }>();
const { status, copying, copy: copyCommands } = useCommandCopy();
const feedback = computed(() =>
  status.value === 'copied' ? props.copy.copied : status.value === 'failed' ? props.copy.failed : ''
);
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
          <div class="terminal">
            <div class="terminal-heading">
              <span>{{ copy.terminal }}</span>
              <button class="copy-button" type="button" :aria-disabled="copying" @click="copyCommands(commands)">
                {{ copy.copy }}
              </button>
            </div>
            <pre
              class="command-code"
              tabindex="0"
              :aria-label="copy.terminal"
              translate="no"
            ><code>{{ commands }}</code></pre>
          </div>
          <p class="copy-feedback" role="status">{{ feedback }}</p>
          <p class="prerequisites">{{ copy.prerequisites }}</p>
          <a class="home-link" :href="guideLink(locale, copy.links[0].path)">{{ copy.links[0].link }}</a>
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
  gap: 56px;
  align-items: start;
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
.terminal {
  min-width: 0;
  background: #182941;
  color: #e9f0ff;
  border-radius: 12px;
  overflow: hidden;
}
.terminal-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 24px;
  border-bottom: 1px solid #ffffff24;
  font-size: 13px;
}
.copy-button {
  cursor: pointer;
  padding: 7px 12px;
  border: 1px solid #8d9db5;
  border-radius: 6px;
  color: #fff;
  min-height: 40px;
  flex-shrink: 0;
}
.copy-button:hover {
  background: #ffffff15;
}
.copy-button[aria-disabled='true'] {
  cursor: progress;
}
.command-code {
  font-family: 'Cascadia Code', Consolas, monospace;
  font-size: 15px;
  line-height: 2.25;
  margin: 0;
  padding: 24px 28px 30px;
  overflow-x: auto;
  tab-size: 2;
}
.command-code code {
  font-family: inherit;
}
.command-code:focus-visible {
  outline: 3px solid #82d7bf;
  outline-offset: -5px;
}
.copy-feedback {
  min-height: 28px;
  font-size: 13px;
  color: var(--home-green);
  padding-top: 6px;
}
.prerequisites {
  font-size: 12px;
  line-height: 1.8;
  color: var(--home-muted);
  margin-top: 4px;
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
    gap: 40px;
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
  .terminal-heading {
    padding: 12px 16px;
  }
  .command-code {
    font-size: 13px;
    padding: 20px 18px;
  }
  .developer-links {
    grid-template-columns: 1fr;
    gap: 24px;
    margin-top: 32px;
  }
}
</style>
