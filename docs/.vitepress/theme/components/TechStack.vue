<script setup lang="ts">
const techs = [
  { name: 'FastAPI', label: '后端框架', color: 'green' },
  { name: 'Vue3', label: '前端框架', color: 'blue' },
  { name: 'PostgreSQL', label: '数据库', color: 'purple' },
  { name: 'Redis', label: '缓存', color: 'yellow' },
  { name: 'UniApp', label: '移动端', color: 'teal' },
  { name: 'NaiveUI', label: 'UI 组件库', color: 'pink' }
]
</script>

<template>
  <section class="techstack">
    <div class="techstack-inner">
      <h2 class="section-title">现代化技术栈</h2>
      <p class="section-subtitle">前后端分离 · 异步优先 · 类型安全</p>
      <div class="tech-grid">
        <div
          v-for="t in techs"
          :key="t.name"
          :class="['tech-card', `tech-${t.color}`]"
        >
          <div class="tech-name">{{ t.name }}</div>
          <div class="tech-label">{{ t.label }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.techstack {
  padding: 60px 24px;
  background: var(--landing-bg-alt);
}

.techstack-inner {
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
  margin: 0 0 32px;
}

.tech-grid {
  display: flex;
  gap: 14px;
  justify-content: center;
  flex-wrap: wrap;
}

.tech-card {
  padding: 10px 20px;
  border-radius: 10px;
  text-align: center;
  transition: transform 0.2s;
}

.tech-card:hover { transform: translateY(-2px); }
.tech-name { font-size: 14px; font-weight: 700; }
.tech-label { font-size: 11px; color: var(--landing-text-3); margin-top: 2px; }

.tech-green { background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2); }
.tech-green .tech-name { color: #10b981; }
.tech-blue { background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.2); }
.tech-blue .tech-name { color: #3b82f6; }
.tech-purple { background: rgba(168, 85, 247, 0.1); border: 1px solid rgba(168, 85, 247, 0.2); }
.tech-purple .tech-name { color: #8b5cf6; }
.tech-yellow { background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.2); }
.tech-yellow .tech-name { color: #f59e0b; }
.tech-teal { background: rgba(20, 184, 166, 0.1); border: 1px solid rgba(20, 184, 166, 0.2); }
.tech-teal .tech-name { color: #14b8a6; }
.tech-pink { background: rgba(236, 72, 153, 0.1); border: 1px solid rgba(236, 72, 153, 0.2); }
.tech-pink .tech-name { color: #ec4899; }

@media (max-width: 768px) {
  .section-title { font-size: 22px; }
  .tech-grid { gap: 10px; }
  .tech-card { padding: 8px 14px; }
}
</style>
