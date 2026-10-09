<script setup lang="ts">
import { computed } from 'vue';
import { useWorkflowScenario } from '../../composables/useWorkflowScenario';
import { guideLink, type HomeContent, type HomeLocale } from '../../composables/home';
import ProductScreen from './ProductScreen.vue';
const props = defineProps<{ copy: HomeContent['workflow']; locale: HomeLocale }>();
const { selected, select } = useWorkflowScenario(props.copy.scenarios.map(item => item.id));
const scenario = computed(() => props.copy.scenarios.find(item => item.id === selected.value)!);
</script>

<template>
  <section id="workflow" class="workflow home-section" aria-labelledby="workflow-title">
    <div class="home-wrap workflow-grid">
      <div class="workflow-copy">
        <h2 id="workflow-title" class="home-title">{{ copy.title }}</h2>
        <p class="workflow-intro">{{ copy.intro }}</p>
        <div class="workflow-scenarios" role="group" :aria-label="copy.scenarioLabel">
          <button
            v-for="item in copy.scenarios"
            :id="`workflow-${item.id}`"
            :key="item.id"
            class="workflow-scenario"
            type="button"
            :aria-pressed="selected === item.id"
            aria-controls="workflow-detail"
            @click="select(item.id)"
          >
            <strong class="scenario-title">{{ item.title }}</strong>
            <span class="scenario-text">{{ item.text }}</span>
          </button>
        </div>
        <div id="workflow-detail" class="workflow-detail" aria-live="polite" aria-atomic="true">
          <p>{{ scenario.detail }}</p>
        </div>
        <a class="workflow-guide" :href="guideLink(locale, copy.guidePath)">{{ copy.guide }}</a>
      </div>
      <div class="workflow-product">
        <ProductScreen
          :src="copy.image"
          :dark-src="copy.darkImage"
          :alt="copy.alt"
          :caption="copy.caption"
          :image-link="copy.imageLink"
        />
        <p class="workflow-disclosure">{{ copy.disclosure }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.workflow {
  background: var(--home-workflow);
  border-block: 1px solid var(--home-line);
}
.workflow-grid {
  display: grid;
  grid-template-columns: 0.8fr 1.2fr;
  align-items: center;
  gap: 72px;
}
.workflow-intro {
  color: var(--home-muted);
  margin-top: 22px;
  max-width: 40ch;
}
.workflow-scenarios {
  display: grid;
  margin-top: 32px;
  gap: 10px;
}
.workflow-scenario {
  display: block;
  width: 100%;
  text-align: left;
  padding: 16px;
  border: 1px solid transparent;
  border-radius: 10px;
  cursor: pointer;
  color: var(--home-muted);
}
.workflow-scenario[aria-pressed='true'] {
  background: var(--home-bg);
  border-color: var(--home-control-line);
  color: var(--home-ink);
  box-shadow: 0 4px 12px #1d3e8210;
}
.workflow-scenario:hover {
  border-color: var(--home-control-line);
}
.scenario-title {
  display: block;
  font-size: 16px;
  font-weight: 600;
}
.scenario-text {
  display: block;
  font-size: 14px;
  margin-top: 3px;
}
.workflow-guide {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  margin-top: 24px;
  color: var(--home-blue);
  font-size: 14px;
  text-decoration: underline;
  text-underline-offset: 5px;
}
.workflow-product {
  min-width: 0;
}
.workflow-detail {
  padding: 20px 22px;
  margin-top: 20px;
  border-left: 3px solid var(--home-green);
  background: var(--home-bg);
  border-radius: 0 8px 8px 0;
  min-height: 132px;
  font-size: 14px;
}
.workflow-disclosure {
  font-size: 12px;
  line-height: 1.8;
  color: var(--home-muted);
  margin-top: 16px;
}
@media (max-width: 960px) {
  .workflow-grid {
    gap: 32px;
  }
}
@media (max-width: 760px) {
  .workflow-grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  .workflow-intro {
    max-width: none;
  }
  .workflow-scenarios {
    margin-top: 24px;
  }
  .workflow-scenario {
    padding: 13px;
  }
}
</style>
