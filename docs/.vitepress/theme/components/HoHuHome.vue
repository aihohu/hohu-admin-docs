<script setup lang="ts">
import { computed, ref } from 'vue';
import { useData } from 'vitepress';
import { homeContent } from '../composables/home';

const { lang } = useData();
const isZh = computed(() => lang.value === 'zh-CN');
const copy = computed(() => homeContent[isZh.value ? 'zh' : 'en']);
const prefix = computed(() => (isZh.value ? '/zh' : ''));
const selected = ref(0);
const scenario = computed(() => copy.value.scenarios[selected.value]);
const guide = (path: string) => `${prefix.value}/guide/${path}${path.endsWith('/') ? '' : '.html'}`;
const commands = 'uv tool install hohu\nhohu create my-project\ncd my-project\nhohu init\nhohu dev';
</script>

<template>
  <div class="hohu-home">
    <div class="hero-stage">
      <div class="hero-aurora" aria-hidden="true"></div>
      <section class="home-hero home-wrap">
        <div class="hero-copy">
          <p class="eyebrow">{{ copy.eyebrow }}</p>
          <h1>
            {{ copy.title }}
            <br />
            <span>{{ copy.accent }}</span>
          </h1>
          <p class="lead">{{ copy.intro }}</p>
          <div class="actions">
            <a class="primary" :href="guide('quick-start')">
              {{ copy.start }}
              <span aria-hidden="true">↗</span>
            </a>
            <a class="secondary" :href="guide('show')">{{ copy.demo }}</a>
          </div>
          <a class="text-link source-link" href="https://github.com/aihohu">
            {{ copy.source }}
            <span aria-hidden="true">↗</span>
          </a>
        </div>
        <div class="hero-proof">
          <span>FastAPI + Vue</span>
          <i></i>
          <span>{{ isZh ? '权限与租户隔离' : 'Permissions & tenant isolation' }}</span>
          <i></i>
          <span>{{ isZh ? '开源 · 自主部署' : 'Open source · Self hosted' }}</span>
        </div>
        <figure class="hero-screen">
          <div class="screen-chrome">
            <span class="window-dots">
              <i></i>
              <i></i>
              <i></i>
            </span>
            <span>HoHu / {{ isZh ? 'AI 业务工作台' : 'AI workspace' }}</span>
          </div>
          <a :href="`/images/product/ai-conversation-${isZh ? 'zh' : 'en'}.png`" target="_blank" rel="noopener">
            <img
              :src="`/images/product/ai-conversation-${isZh ? 'zh' : 'en'}.png`"
              :alt="
                isZh
                  ? 'HoHu 真实 AI 对话：用户分布查询、只读工具执行和统计结果'
                  : 'A real HoHu AI conversation with a user distribution query, read-only tool execution and statistics'
              "
              width="1050"
              height="865"
              fetchpriority="high"
              decoding="async"
            />
          </a>
          <figcaption>
            {{
              isZh
                ? '一句话发起任务，让 AI 连接你的业务。点击查看完整对话。'
                : 'Start with a request. Let AI connect to your business. Open the full conversation.'
            }}
          </figcaption>
        </figure>
      </section>
    </div>

    <section class="product-section home-section home-wrap">
      <div class="section-heading">
        <p class="eyebrow">AI + BUSINESS</p>
        <h2>{{ isZh ? '在业务界面中与 AI 协作' : 'Work with AI inside your application' }}</h2>
        <p>
          {{
            isZh
              ? '从数据洞察、用户管理到文件处理，在同一界面中发起任务、查看结果，并确认需要执行的操作。'
              : 'Start with data insights, user management or files. Ask for help, review results and confirm actions in the same interface.'
          }}
        </p>
        <a class="text-link" :href="guide('user/ai')">
          {{ isZh ? '了解 AI 助手的使用方式' : 'Learn how to use the AI assistant' }} →
        </a>
      </div>
      <div class="interaction" aria-labelledby="interaction-title">
        <div class="interaction-top">
          <span class="wordmark">
            HoHu
            <span>/ AI</span>
          </span>
          <span class="illustration-label">{{ copy.panelLabel }}</span>
        </div>
        <h2 id="interaction-title">{{ copy.panelTitle }}</h2>
        <div class="scenario-controls" role="group" :aria-label="copy.panelTitle">
          <button
            v-for="(item, i) in copy.scenarios"
            :key="item.title"
            type="button"
            :aria-pressed="selected === i"
            @click="selected = i"
          >
            {{ item.title }}
          </button>
        </div>
        <div class="scenario-content" aria-live="polite" aria-atomic="true">
          <p class="prompt">{{ scenario.prompt }}</p>
          <ol class="flow-steps">
            <li v-for="(step, i) in scenario.steps" :key="step">
              <span>{{ String(i + 1).padStart(2, '0') }}</span>
              {{ step }}
            </li>
          </ol>
          <p class="flow-result">{{ scenario.result }}</p>
        </div>
        <p class="panel-note">{{ copy.panelNote }}</p>
      </div>
    </section>

    <section class="foundation home-section">
      <div class="home-wrap">
        <div class="section-heading">
          <p class="eyebrow">{{ copy.foundationLabel }}</p>
          <h2>{{ copy.foundationTitle }}</h2>
          <p>{{ copy.foundationDesc }}</p>
        </div>
        <div class="foundation-grid">
          <a v-for="(item, i) in copy.foundations" :key="item[0]" :href="guide(item[2])">
            <span class="item-number">0{{ i + 1 }}</span>
            <h3>
              {{ item[0] }}
              <span aria-hidden="true">↗</span>
            </h3>
            <p>{{ item[1] }}</p>
          </a>
        </div>
      </div>
    </section>

    <section class="home-section home-wrap build-section">
      <div class="section-heading">
        <p class="eyebrow">{{ copy.buildLabel }}</p>
        <h2>{{ copy.buildTitle }}</h2>
        <p>{{ copy.buildDesc }}</p>
        <a class="text-link" :href="guide('development/module')">{{ copy.buildLink }} →</a>
        <a class="text-link ai-guide-link" :href="guide('development/ai-tools')">
          {{ isZh ? '让 AI 使用你的业务模块' : 'Connect your module to AI' }} →
        </a>
      </div>
      <div class="build-map">
        <div class="module-node">
          <span class="node-orbit" aria-hidden="true">✦</span>
          <strong>{{ isZh ? '你的业务模块' : 'Your business module' }}</strong>
          <span>HoHu</span>
        </div>
        <ol class="build-steps">
          <li v-for="(item, i) in copy.buildSteps" :key="item[0]">
            <span class="step-index">{{ i + 1 }}</span>
            <div>
              <h3>{{ item[0] }}</h3>
              <p>{{ item[1] }}</p>
            </div>
          </li>
        </ol>
        <p class="map-caption">
          {{ isZh ? '共享业务服务 · 统一权限边界' : 'Shared business services · Consistent permissions' }}
        </p>
      </div>
    </section>

    <section class="cli-section home-section">
      <div class="home-wrap cli-inner">
        <div class="section-heading">
          <p class="eyebrow">{{ copy.cliLabel }}</p>
          <h2>{{ copy.cliTitle }}</h2>
          <p>{{ copy.cliDesc }}</p>
          <p class="prerequisites">{{ copy.cliPrereq }}</p>
          <div class="actions">
            <a class="text-link" :href="guide('cli/')">{{ isZh ? '探索 HoHu CLI' : 'Explore HoHu CLI' }} →</a>
            <a class="text-link" :href="guide('deploy')">{{ copy.deployLink }} →</a>
          </div>
        </div>
        <div class="terminal">
          <div class="terminal-header">
            <span>{{ copy.terminalLabel }}</span>
            <span>Terminal</span>
          </div>
          <pre><code>{{ commands }}</code></pre>
        </div>
      </div>
    </section>

    <section class="home-section home-wrap">
      <div class="section-heading">
        <p class="eyebrow">{{ copy.ownLabel }}</p>
        <h2>{{ copy.ownTitle }}</h2>
        <p>{{ copy.ownDesc }}</p>
      </div>
      <div class="ownership-grid">
        <div v-for="item in copy.ownItems" :key="item[0]">
          <h3>{{ item[0] }}</h3>
          <p>{{ item[1] }}</p>
        </div>
      </div>
      <div class="tech-strip" aria-label="Technology stack">
        <span>FastAPI</span>
        <span>Vue</span>
        <span>PostgreSQL</span>
        <span>Redis</span>
        <span>TypeScript</span>
        <span>Docker</span>
      </div>
      <h3 class="ecosystem-heading">{{ copy.ecosystemTitle }}</h3>
      <div class="repo-list">
        <a v-for="repo in copy.repos" :key="repo[0]" :href="`https://github.com/aihohu/${repo[0]}`">
          <strong>{{ repo[0] }} ↗</strong>
          <span>{{ repo[1] }}</span>
        </a>
      </div>
    </section>

    <section class="docs-section home-section">
      <div class="home-wrap">
        <h2>{{ copy.docsTitle }}</h2>
        <div class="docs-grid">
          <a v-for="item in copy.docs" :key="item[0]" :href="guide(item[2])">
            <h3>
              {{ item[0] }}
              <span aria-hidden="true">→</span>
            </h3>
            <p>{{ item[1] }}</p>
          </a>
        </div>
      </div>
    </section>
    <footer class="home-footer home-wrap">
      <div>
        <a class="wordmark" :href="`${prefix}/`">HoHu</a>
        <p>{{ copy.footer }}</p>
      </div>
      <nav :aria-label="isZh ? '页脚导航' : 'Footer navigation'">
        <a :href="guide('src')">{{ copy.license }}</a>
        <a href="https://github.com/aihohu/hohu-admin/blob/main/CONTRIBUTING.md">{{ copy.contribute }}</a>
      </nav>
      <p class="copyright">© 2025–2026 HoHu</p>
    </footer>
  </div>
</template>

<style scoped>
.hohu-home {
  --home-accent: #157a62;
  --home-tint: #edf6f1;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}
:global(.dark .hohu-home) {
  --home-accent: #76d5b2;
  --home-tint: #172923;
}
.home-wrap {
  max-width: 1180px;
  margin: 0 auto;
  padding-left: 36px;
  padding-right: 36px;
}
.home-hero {
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  gap: 64px;
  align-items: center;
  padding-top: 88px;
  padding-bottom: 96px;
}
.eyebrow {
  color: var(--home-accent);
  font-size: 12px;
  font-weight: 650;
  letter-spacing: 0.12em;
  margin: 0 0 20px;
}
h1 {
  font-size: clamp(40px, 4.7vw, 64px);
  line-height: 1.12;
  letter-spacing: -0.045em;
  font-weight: 700;
  margin: 0 0 28px;
}
h1 span {
  color: var(--home-accent);
}
.lead {
  color: var(--vp-c-text-2);
  font-size: 18px;
  line-height: 1.8;
  max-width: 500px;
  margin-bottom: 30px;
}
.actions {
  display: flex;
  align-items: center;
  gap: 18px;
  flex-wrap: wrap;
}
.primary,
.secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
  min-height: 46px;
  padding: 10px 22px;
  border-radius: 7px;
  font-size: 15px;
  font-weight: 600;
}
.primary {
  background: var(--home-accent);
  color: white;
}
:global(.dark .hohu-home .primary) {
  color: #10251e;
}
.secondary {
  border: 1px solid var(--vp-c-divider);
}
.text-link {
  color: var(--home-accent);
  font-size: 14px;
  font-weight: 600;
}
.source-link {
  display: inline-block;
  margin-top: 22px;
}
a:hover {
  text-decoration: underline;
  text-underline-offset: 4px;
}
a:focus-visible,
button:focus-visible {
  outline: 2px solid var(--home-accent);
  outline-offset: 5px;
}
.interaction {
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 24px;
  background: var(--vp-c-bg-soft);
  box-shadow: 0 14px 50px #00000008;
}
.interaction-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 24px;
}
.wordmark {
  font-size: 22px;
  letter-spacing: -0.04em;
  font-weight: 750;
}
.wordmark span {
  font-size: 14px;
  color: var(--vp-c-text-2);
  font-weight: 450;
}
.illustration-label {
  font-size: 11px;
  color: var(--vp-c-text-2);
}
.interaction h2 {
  font-size: 19px;
  line-height: 1.4;
  margin-bottom: 16px;
  font-weight: 650;
}
.scenario-controls {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}
.scenario-controls button {
  cursor: pointer;
  padding: 6px 10px;
  border: 1px solid transparent;
  border-radius: 5px;
  font-size: 12px;
  color: var(--vp-c-text-2);
}
.scenario-controls button[aria-pressed='true'] {
  color: var(--home-accent);
  border-color: var(--vp-c-divider);
  background: var(--vp-c-bg);
}
.scenario-content {
  min-height: 246px;
}
.prompt {
  background: var(--home-tint);
  border-left: 2px solid var(--home-accent);
  padding: 13px 16px;
  margin: 18px 0;
  font-size: 14px;
  line-height: 1.6;
}
.flow-steps {
  list-style: none;
  padding: 0;
  margin: 0;
}
.flow-steps li {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  padding: 8px 0;
  color: var(--vp-c-text-2);
}
.flow-steps span {
  color: var(--home-accent);
  font: 11px var(--vp-font-family-mono);
  border: 1px solid var(--vp-c-divider);
  padding: 3px 6px;
  border-radius: 4px;
}
.flow-result {
  font-size: 13px;
  padding-top: 16px;
  color: var(--home-accent);
  line-height: 1.6;
}
.panel-note {
  border-top: 1px solid var(--vp-c-divider);
  padding-top: 14px;
  margin-top: 16px;
  font-size: 11px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}
.home-section {
  padding-top: 76px;
  padding-bottom: 76px;
  border-top: 1px solid var(--vp-c-divider);
}
.product-section {
  display: grid;
  grid-template-columns: 0.7fr 1.3fr;
  gap: 48px;
  align-items: center;
}
.product-section figure {
  margin: 0;
  min-width: 0;
}
.product-section img {
  width: 100%;
  height: auto;
  border: 1px solid var(--vp-c-divider);
  border-radius: 9px;
}
.product-section figcaption {
  font-size: 11px;
  color: var(--vp-c-text-2);
  margin-top: 12px;
  line-height: 1.6;
}
.section-heading {
  max-width: 620px;
  margin-bottom: 36px;
}
.section-heading h2,
.docs-section h2 {
  text-wrap: balance;
  font-size: clamp(26px, 3vw, 36px);
  font-weight: 650;
  letter-spacing: -0.025em;
  line-height: 1.35;
  margin: 0 0 16px;
}
.section-heading p:not(.eyebrow) {
  color: var(--vp-c-text-2);
  line-height: 1.8;
  font-size: 16px;
  margin-bottom: 18px;
}
h3 {
  font-size: 18px;
  font-weight: 600;
  line-height: 1.5;
  margin: 0 0 12px;
}
.foundation {
  background: var(--vp-c-bg-soft);
}
.foundation-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 28px;
}
.foundation-grid a {
  display: block;
  text-decoration: none;
}
.foundation-grid a:hover h3 {
  color: var(--home-accent);
}
.item-number {
  display: block;
  color: var(--home-accent);
  font: 12px var(--vp-font-family-mono);
  margin-bottom: 20px;
}
.foundation-grid h3 span {
  float: right;
  color: var(--vp-c-text-2);
}
.foundation-grid p,
.ownership-grid p,
.docs-grid p,
.build-steps p {
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 1.8;
  margin: 0;
}
.build-section,
.cli-inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: start;
}
.build-section .section-heading,
.cli-inner .section-heading {
  margin-bottom: 0;
}
.build-steps {
  list-style: none;
  padding: 0;
  margin: 0;
}
.build-steps li {
  display: flex;
  gap: 20px;
  padding: 0 0 26px;
}
.step-index {
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border: 1px solid var(--vp-c-divider);
  border-radius: 50%;
  width: 30px;
  height: 30px;
  color: var(--home-accent);
  font-size: 12px;
}
.cli-section {
  background: var(--vp-c-bg-soft);
}
.section-heading .prerequisites {
  font-size: 13px !important;
}
.terminal {
  min-width: 0;
  background: #12201d;
  color: #d8e7df;
  border: 1px solid #30483f;
  border-radius: 10px;
  overflow: hidden;
}
.terminal-header {
  display: flex;
  justify-content: space-between;
  padding: 16px 22px;
  font-size: 11px;
  color: #a9bdb4;
  border-bottom: 1px solid #30483f;
  gap: 12px;
}
.terminal pre {
  overflow-x: auto;
  margin: 0;
  padding: 28px;
  font: 14px/2.3 var(--vp-font-family-mono);
}
.ownership-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
}
.tech-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 18px 30px;
  padding: 28px 0;
  margin: 32px 0;
  border-top: 1px solid var(--vp-c-divider);
  border-bottom: 1px solid var(--vp-c-divider);
  font-size: 14px;
  color: var(--vp-c-text-2);
}
.ecosystem-heading {
  font-size: 15px;
  margin-bottom: 20px;
}
.repo-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
}
.repo-list a {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.repo-list strong {
  font-family: var(--vp-font-family-mono);
  font-size: 14px;
  font-weight: 500;
  color: var(--home-accent);
}
.repo-list span {
  font-size: 13px;
  color: var(--vp-c-text-2);
}
.docs-section {
  background: var(--home-tint);
}
.docs-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
  margin-top: 36px;
}
.docs-grid a {
  text-decoration: none;
}
.docs-grid a:hover h3 {
  color: var(--home-accent);
}
.docs-grid h3 {
  font-size: 17px;
}
.docs-grid h3 span {
  padding-left: 6px;
}
.home-footer {
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
  justify-content: space-between;
  padding-top: 44px;
  padding-bottom: 28px;
}
.home-footer p {
  color: var(--vp-c-text-2);
  font-size: 12px;
  margin-top: 10px;
}
.home-footer nav {
  display: flex;
  gap: 24px;
  font-size: 13px;
  align-items: start;
  padding-top: 8px;
  flex-wrap: wrap;
}
.copyright {
  width: 100%;
}
@media (max-width: 960px) {
  .home-hero {
    gap: 32px;
  }
  .foundation-grid,
  .docs-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .build-section,
  .cli-inner {
    gap: 36px;
  }
}
@media (max-width: 700px) {
  .home-wrap {
    padding-left: 24px;
    padding-right: 24px;
  }
  .home-hero {
    grid-template-columns: 1fr;
    padding-top: 48px;
    padding-bottom: 52px;
    gap: 36px;
  }
  h1 {
    font-size: 44px;
  }
  .lead {
    font-size: 16px;
  }
  .interaction {
    padding: 20px;
  }
  .home-section {
    padding-top: 48px;
    padding-bottom: 48px;
  }
  .build-section,
  .cli-inner,
  .ownership-grid,
  .repo-list,
  .product-section {
    grid-template-columns: 1fr;
    gap: 28px;
  }
  .foundation-grid,
  .docs-grid {
    gap: 26px;
  }
  .scenario-content {
    min-height: 230px;
  }
}
@media (prefers-reduced-motion: reduce) {
  * {
    scroll-behavior: auto;
  }
}

/* Product landing: luminous hero, real interface, restrained reading sections. */
.hero-stage {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  background: #090e1b;
  color: #f1f5ff;
}
.hero-stage::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  background: linear-gradient(90deg, #819cd40b 1px, transparent 1px), linear-gradient(#819cd40b 1px, transparent 1px);
  background-size: 72px 72px;
  mask-image: linear-gradient(#000, transparent 90%);
}
.hero-aurora {
  position: absolute;
  inset: -25% -10% 0;
  z-index: -2;
  background:
    radial-gradient(ellipse at 24% 38%, #11b9ae32, transparent 38%),
    radial-gradient(ellipse at 80% 25%, #715aff42, transparent 38%),
    radial-gradient(ellipse at 50% 70%, #2259dd40, transparent 45%);
}
.home-hero {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding-top: 54px;
  padding-bottom: 0;
  text-align: center;
}
.hero-copy {
  position: relative;
  max-width: 1000px;
}
.hero-copy .eyebrow {
  display: inline-flex;
  border: 1px solid #ffffff24;
  border-radius: 99px;
  padding: 9px 18px;
  color: #8ce9d3;
  background: #ffffff05;
  letter-spacing: 0.16em;
}
.hero-copy h1 {
  font-size: clamp(44px, 6vw, 74px);
  line-height: 1.13;
  letter-spacing: -0.055em;
  margin: 10px 0 26px;
  color: #f4f7ff;
}
.hero-copy h1 span {
  background: linear-gradient(105deg, #79f1d4 10%, #7cd6ff 55%, #b9a0ff 95%);
  color: transparent;
  background-clip: text;
}
.hero-copy .lead {
  max-width: 640px;
  margin: 0 auto 30px;
  color: #a9b5cd;
  font-size: 18px;
}
.hero-copy .actions {
  justify-content: center;
  gap: 14px;
}
.hero-copy .primary {
  background: #9befd7;
  color: #09261e;
  box-shadow: 0 0 32px #56e3bc20;
  padding: 14px 27px;
}
.hero-copy .secondary {
  color: #edf1fc;
  background: #ffffff08;
  border-color: #ffffff29;
  padding: 14px 27px;
}
.hero-copy .source-link {
  display: inline-block;
  color: #a9b5cd;
  margin: 22px 0 0;
}
.hero-proof {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
  color: #8393b1;
  font-size: 12px;
  margin: 24px 0 28px;
}
.hero-proof i {
  width: 3px;
  height: 3px;
  background: #6f80a2;
  border-radius: 50%;
}
.hero-screen {
  margin: 0;
  width: 100%;
  border: 1px solid #a2b4ff40;
  border-radius: 14px 14px 0 0;
  background: #131b2d;
  box-shadow:
    0 -10px 100px #6085ff1c,
    0 0 0 8px #ffffff03;
  overflow: hidden;
}
.screen-chrome {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 15px 20px;
  color: #adbad2;
  font-size: 12px;
}
.window-dots {
  display: flex;
  gap: 6px;
}
.window-dots i {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #526079;
}
.window-dots i:first-child {
  background: #f18080;
}
.window-dots i:nth-child(2) {
  background: #e6be70;
}
.window-dots i:last-child {
  background: #6ccbb2;
}
.hero-screen a {
  display: block;
  background: #f7faff;
}
.hero-screen img {
  display: block;
  width: 100%;
  height: auto;
  max-height: 580px;
  object-fit: cover;
  object-position: top;
}
.hero-screen figcaption {
  padding: 16px;
  color: #9baac5;
  font-size: 12px;
}
.product-section {
  gap: 70px;
  align-items: center;
  padding-top: 112px;
  padding-bottom: 112px;
}
.product-section .section-heading {
  max-width: 460px;
}
.interaction {
  background: var(--vp-c-bg-soft);
  border-radius: 18px;
  box-shadow: 0 18px 60px #182b4610;
}
.foundation {
  background: var(--vp-c-bg);
}
.foundation-grid {
  gap: 0;
  border-top: 1px solid var(--vp-c-divider);
  border-bottom: 1px solid var(--vp-c-divider);
}
.foundation-grid a {
  border: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  padding: 32px 24px;
}
.foundation-grid a + a {
  border-left: 1px solid var(--vp-c-divider);
}
.ai-guide-link {
  display: block;
  margin-top: 18px;
}
.cli-section {
  background: #0d1424;
  color: #eef3ff;
}
.cli-section h2 {
  color: #eef3ff;
}
.cli-section p {
  color: #a6b4ce;
}
.cli-section .eyebrow,
.cli-section .text-link {
  color: #80dfc4;
}
.terminal {
  background: #090e1b;
  border-color: #ffffff20;
  box-shadow: 0 24px 80px #0004;
}
.docs-grid {
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}
@media (prefers-reduced-motion: no-preference) {
  .hero-aurora {
    animation: aurora-shift 18s ease-in-out infinite alternate;
  }
  .hero-screen {
    animation: screen-enter 0.8s ease-out both;
  }
  @keyframes aurora-shift {
    to {
      transform: translate3d(3%, 2%, 0) scale(1.08);
    }
  }
  @keyframes screen-enter {
    from {
      opacity: 0.3;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: none;
    }
  }
}
@media (max-width: 700px) {
  .home-hero {
    padding-top: 54px;
  }
  .hero-copy h1 {
    font-size: clamp(38px, 9vw, 54px);
  }
  .hero-copy .lead {
    font-size: 16px;
  }
  .hero-proof {
    gap: 10px;
    font-size: 10px;
    margin-top: 30px;
  }
  .screen-chrome {
    padding: 12px;
    font-size: 10px;
  }
  .hero-screen figcaption {
    font-size: 11px;
    padding: 12px;
  }
  .product-section {
    padding-top: 64px;
    padding-bottom: 64px;
    gap: 30px;
  }
  .foundation-grid a + a {
    border-left: 0;
    border-top: 1px solid var(--vp-c-divider);
  }
}
/* The landing page has its own palette, independent of the reading theme. */
.hohu-home,
:global(.dark .hohu-home) {
  --home-accent: #8ce9d3;
  --home-tint: #102b32;
  --vp-c-bg: #090e1b;
  --vp-c-bg-soft: #101a2d;
  --vp-c-text-1: #edf3ff;
  --vp-c-text-2: #a5b3cd;
  --vp-c-divider: #a3b9ee21;
  background: #090e1b;
  color: #edf3ff;
}
.home-section {
  padding-top: 96px;
  padding-bottom: 96px;
  border-top: 0;
}
.hero-screen {
  border-radius: 16px;
}
.product-section {
  display: block;
  position: relative;
  padding-top: 88px;
}
.product-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 15%;
  right: 15%;
  height: 1px;
  background: linear-gradient(90deg, transparent, #8ce9d350, transparent);
}
.product-section .section-heading {
  max-width: 680px;
  text-align: center;
  margin: 0 auto 40px;
}
.interaction {
  position: relative;
  background: radial-gradient(ellipse at 100% 0, #655de51a, transparent 60%), #0e1728;
  border: 1px solid #9dafdc26;
  box-shadow: 0 24px 80px #0002;
  padding: 32px;
}
.interaction-top {
  margin-bottom: 18px;
}
.interaction h2 {
  display: inline-block;
  margin-right: 24px;
}
.scenario-controls {
  display: inline-flex;
}
.scenario-controls button {
  padding: 8px 14px;
  border-radius: 8px;
}
.scenario-content {
  min-height: 0;
}
.prompt {
  display: inline-block;
  padding: 14px 20px;
  border: 1px solid #7ce2c82e;
  border-radius: 12px 12px 12px 0;
  background: #8ce9d30a;
  margin: 10px 0 26px;
}
.flow-steps {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
}
.flow-steps li {
  position: relative;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  border: 1px solid #9dafdc20;
  border-radius: 12px;
  background: #090e1b70;
  font-size: 15px;
  color: #d6e1f5;
}
.flow-steps li:not(:last-child)::after {
  content: '→';
  position: absolute;
  right: -22px;
  top: 50%;
  color: #8ce9d380;
}
.flow-steps span {
  border: 0;
  padding: 0;
  color: #8ce9d3;
}
.flow-result {
  padding-top: 22px;
}
.panel-note {
  margin-top: 22px;
  color: #8192af;
}
.foundation {
  background: radial-gradient(ellipse at 10% 50%, #146c7715, transparent 60%);
}
.foundation-grid {
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;
  border: 0;
}
.foundation-grid a,
.foundation-grid a + a {
  position: relative;
  border: 1px solid #9dafdc26;
  border-radius: 18px;
  padding: 32px;
  background: linear-gradient(135deg, #14233a, #0c1424);
  overflow: hidden;
}
.foundation-grid a:nth-child(2) {
  background: linear-gradient(135deg, #24203f, #101827);
}
.item-number {
  font-size: 14px;
  margin-bottom: 30px;
  color: #8ce9d3;
}
.foundation-grid h3 {
  font-size: 22px;
}
.foundation-grid p {
  max-width: 420px;
}
.build-section {
  align-items: center;
}
.build-map {
  position: relative;
  min-width: 0;
  padding: 28px;
  border: 1px solid #9dafdc26;
  border-radius: 20px;
  background: radial-gradient(ellipse at 50% 0, #7968f524, transparent 65%), #0d1525;
}
.module-node {
  display: flex;
  align-items: center;
  gap: 14px;
  padding-bottom: 28px;
}
.module-node strong {
  font-size: 18px;
}
.module-node > span:last-child {
  margin-left: auto;
  font: 12px var(--vp-font-family-mono);
  color: #8999b9;
}
.node-orbit {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border: 1px solid #afa0ff70;
  border-radius: 12px;
  color: #c2b8ff;
  background: #9581ff15;
  box-shadow: 0 0 28px #9581ff15;
}
.build-steps {
  position: relative;
}
.build-steps::before {
  content: '';
  position: absolute;
  top: 14px;
  bottom: 45px;
  left: 15px;
  width: 1px;
  background: linear-gradient(#8ce9d380, #9581ff50);
}
.build-steps li {
  position: relative;
  padding-bottom: 24px;
}
.build-steps li:last-child {
  padding-bottom: 0;
}
.step-index {
  background: #122236;
  border-color: #8ce9d345;
}
.build-steps h3 {
  margin-bottom: 4px;
  font-size: 16px;
}
.map-caption {
  margin: 26px 0 0;
  padding-top: 18px;
  border-top: 1px solid #9dafdc21;
  font-size: 12px;
  color: #91a3c3;
}
.cli-section {
  background: radial-gradient(ellipse at 85% 50%, #526af51c, transparent 60%);
}
.cli-inner {
  align-items: center;
}
.terminal {
  border-radius: 18px;
  border-color: #9dafdc35;
  background: #0c1424;
}
.terminal-header {
  border-color: #9dafdc21;
  background: #ffffff03;
  color: #a5b3cd;
}
.terminal pre {
  color: #a9f0db;
}
.ownership-grid {
  gap: 24px;
}
.ownership-grid > div {
  border-top: 1px solid #8ce9d340;
  padding-top: 24px;
}
.repo-list {
  gap: 16px;
}
.repo-list a {
  padding: 20px;
  border: 1px solid #9dafdc26;
  border-radius: 12px;
  background: #101a2d70;
  text-decoration: none;
}
.docs-section {
  padding-top: 64px;
  padding-bottom: 64px;
  background: linear-gradient(180deg, #101b2d80, #090e1b);
}
.docs-grid {
  gap: 12px;
}
.docs-grid a {
  padding: 22px 18px;
  border: 1px solid #9dafdc26;
  border-radius: 12px;
  background: #0d1627;
}
.home-footer {
  border-top: 1px solid #9dafdc21;
}

/* Hover adds feedback only: all content remains available without a pointer. */
.foundation-grid a,
.repo-list a,
.docs-grid a,
.flow-steps li,
.terminal,
.build-map,
.primary,
.secondary,
.scenario-controls button {
  transition:
    transform 220ms ease,
    border-color 220ms ease,
    box-shadow 220ms ease,
    background-color 220ms ease;
}
.foundation-grid a::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0;
  background: radial-gradient(ellipse at 85% 0, #8ce9d31c, transparent 65%);
  transition: opacity 260ms ease;
}
.foundation-grid h3 span,
.docs-grid h3 span {
  display: inline-block;
  transition: transform 220ms ease;
}
@media (hover: hover) and (pointer: fine) {
  .foundation-grid a:hover,
  .repo-list a:hover,
  .docs-grid a:hover {
    transform: translateY(-5px);
    border-color: #8ce9d380;
    box-shadow:
      0 16px 38px #0004,
      0 0 24px #8ce9d30a;
  }
  .foundation-grid a:hover::before {
    opacity: 1;
  }
  .foundation-grid a:hover h3 span,
  .docs-grid a:hover h3 span {
    transform: translate(3px, -2px);
  }
  .flow-steps li:hover,
  .terminal:hover,
  .build-map:hover {
    border-color: #a59aff80;
    box-shadow: 0 0 36px #8d78ff12;
  }
  .primary:hover,
  .secondary:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 30px #8ce9d328;
    text-decoration: none;
  }
  .scenario-controls button:hover {
    background: #8ce9d312;
    color: #b6f5e5;
  }
}
@media (max-width: 700px) {
  .home-section {
    padding-top: 56px;
    padding-bottom: 56px;
  }
  .interaction {
    padding: 22px;
  }
  .interaction h2 {
    display: block;
  }
  .flow-steps {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  .flow-steps li {
    flex-direction: row;
    align-items: center;
    padding: 16px;
  }
  .flow-steps li:not(:last-child)::after {
    content: '↓';
    right: auto;
    left: 20px;
    top: auto;
    bottom: -19px;
  }
  .foundation-grid {
    grid-template-columns: 1fr;
  }
  .foundation-grid a,
  .foundation-grid a + a {
    padding: 26px;
    border: 1px solid #9dafdc26;
  }
  .build-map {
    padding: 22px;
  }
  .docs-grid {
    grid-template-columns: 1fr;
  }
  .docs-grid a {
    padding: 20px;
  }
  .docs-grid h3 {
    margin-bottom: 6px;
  }
  .home-footer {
    margin: 0 24px;
    padding-left: 0;
    padding-right: 0;
  }
}
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation: none !important;
    transition: none !important;
  }
  a:hover,
  a:hover h3 span {
    transform: none !important;
  }
}
</style>
