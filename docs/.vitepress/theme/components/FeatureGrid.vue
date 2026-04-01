<script setup lang="ts">
const features = [
  { icon: '🤖', title: 'AI 优先架构', desc: '自然语言操作后台<br>AI 辅助代码生成', color: 'green' },
  { icon: '⚡', title: '极速开发', desc: '开箱即用的业务模块<br>分钟级部署上线', color: 'blue' },
  { icon: '🔐', title: '权限体系', desc: 'RBAC + 数据级权限<br>多租户隔离', color: 'purple' },
  { icon: '📦', title: '多模块业务', desc: 'ERP · CRM · OA · 电商<br>按需组合使用', color: 'yellow' },
  { icon: '📱', title: '全端覆盖', desc: 'Web · H5 · 微信小程序<br>原生 App', color: 'pink' },
  { icon: '🔓', title: '完全开源', desc: 'MIT 协议<br>自主可控 · 可商用', color: 'teal' }
]
</script>

<template>
  <section class="features">
    <div class="features-inner">
      <h2 class="section-title">为什么选择 HoHu Admin？</h2>
      <p class="section-subtitle">六大核心能力，覆盖企业后台管理全场景</p>
      <div class="feature-grid">
        <div
          v-for="f in features"
          :key="f.title"
          :class="['feature-card', `card-${f.color}`]"
        >
          <div class="feature-icon">{{ f.icon }}</div>
          <h3 class="feature-title">{{ f.title }}</h3>
          <p class="feature-desc" v-html="f.desc"></p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.features {
  padding: 60px 24px;
  background: var(--landing-bg-alt);
}

.features-inner {
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
}

.section-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--landing-text);
  margin: 0 0 8px;
}

.section-subtitle {
  font-size: 15px;
  color: var(--landing-text-2);
  margin: 0 0 36px;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.feature-card {
  padding: 24px 16px;
  border-radius: 12px;
  text-align: center;
  transition: transform 0.25s, box-shadow 0.25s;
}

.feature-card:hover {
  transform: translateY(-4px);
}

.feature-icon { font-size: 32px; margin-bottom: 10px; }
.feature-title { font-size: 16px; font-weight: 600; color: var(--landing-text); margin: 0 0 8px; }
.feature-desc { font-size: 13px; color: var(--landing-text-2); line-height: 1.6; margin: 0; }

/* Color variants — adapt to light/dark */
.card-green { background: rgba(16, 185, 129, 0.06); border: 1px solid rgba(16, 185, 129, 0.12); }
.card-green:hover { box-shadow: 0 8px 24px rgba(16, 185, 129, 0.1); }
.card-blue { background: rgba(59, 130, 246, 0.06); border: 1px solid rgba(59, 130, 246, 0.12); }
.card-blue:hover { box-shadow: 0 8px 24px rgba(59, 130, 246, 0.1); }
.card-purple { background: rgba(168, 85, 247, 0.06); border: 1px solid rgba(168, 85, 247, 0.12); }
.card-purple:hover { box-shadow: 0 8px 24px rgba(168, 85, 247, 0.1); }
.card-yellow { background: rgba(245, 158, 11, 0.06); border: 1px solid rgba(245, 158, 11, 0.12); }
.card-yellow:hover { box-shadow: 0 8px 24px rgba(245, 158, 11, 0.1); }
.card-pink { background: rgba(236, 72, 153, 0.06); border: 1px solid rgba(236, 72, 153, 0.12); }
.card-pink:hover { box-shadow: 0 8px 24px rgba(236, 72, 153, 0.1); }
.card-teal { background: rgba(20, 184, 166, 0.06); border: 1px solid rgba(20, 184, 166, 0.12); }
.card-teal:hover { box-shadow: 0 8px 24px rgba(20, 184, 166, 0.1); }

@media (max-width: 768px) {
  .feature-grid { grid-template-columns: repeat(2, 1fr); }
  .section-title { font-size: 22px; }
}

@media (max-width: 480px) {
  .feature-grid { grid-template-columns: 1fr; }
}
</style>
