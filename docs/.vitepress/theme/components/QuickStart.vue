<script setup lang="ts">
</script>

<template>
  <section class="quickstart">
    <div class="quickstart-inner">
      <div class="quickstart-text">
        <h2 class="section-title">3 分钟启动项目</h2>
        <p class="section-desc">从零到完整后台管理系统，只需几条命令</p>
        <a class="learn-more" href="/guide/quick-start">了解更多 →</a>
      </div>
      <div class="code-block">
        <div class="code-header">
          <div class="code-dots">
            <span class="dot red"></span>
            <span class="dot yellow"></span>
            <span class="dot green"></span>
          </div>
          <span class="code-lang">bash</span>
        </div>
        <pre class="code-body"><code><span class="comment"># 安装 CLI</span>
<span class="cmd">uv tool install hohu</span>

<span class="comment"># 创建项目 & 启动</span>
<span class="cmd">hohu create my-project</span>
<span class="cmd">cd my-project && hohu dev</span>

<span class="success">✓ Backend:  http://localhost:8000</span>
<span class="success">✓ Frontend: http://localhost:9527</span></code></pre>
      </div>
    </div>
  </section>
</template>

<style scoped>
.quickstart {
  padding: 60px 24px;
  background: var(--landing-bg);
}

.quickstart-inner {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  gap: 40px;
  align-items: center;
}

.quickstart-text { flex: 1; }

.section-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--landing-text);
  margin: 0 0 10px;
}

.section-desc {
  font-size: 15px;
  color: var(--landing-text-2);
  line-height: 1.6;
  margin: 0 0 16px;
}

.learn-more {
  color: #10b981;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s;
}

.learn-more:hover { color: #34d399; }

.code-block {
  flex: 1;
  background: var(--landing-preview-bg);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  overflow: hidden;
  font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
  font-size: 13px;
}

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.code-dots { display: flex; gap: 6px; }
.dot { width: 10px; height: 10px; border-radius: 50%; }
.dot.red { background: #ef4444; }
.dot.yellow { background: #f59e0b; }
.dot.green { background: #10b981; }

.code-lang {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.25);
  text-transform: uppercase;
}

.code-body {
  padding: 16px;
  margin: 0;
  line-height: 1.7;
  overflow-x: auto;
  color: rgba(255, 255, 255, 0.75);
}

.comment { color: #6b7280; }
.cmd { color: #10b981; }
.success { color: #3b82f6; }

@media (max-width: 768px) {
  .quickstart-inner { flex-direction: column; gap: 24px; }
  .quickstart-text { text-align: center; }
  .section-title { font-size: 22px; }
}
</style>
