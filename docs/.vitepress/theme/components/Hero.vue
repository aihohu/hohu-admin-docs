<script setup lang="ts">
</script>

<template>
  <section class="hero">
    <div class="hero-inner">
      <p class="hero-label">AI-FIRST ENTERPRISE ADMIN</p>
      <h1 class="hero-title">
        AI 驱动的企业级<br>
        <span class="gradient-text">后台管理平台</span>
      </h1>
      <p class="hero-desc">对话式操作 · 自然语言管理业务 · 一个平台覆盖 ERP · CRM · OA · 电商 · IoT</p>
      <div class="hero-actions">
        <a class="btn btn-primary" href="/guide/quick-start">快速开始 →</a>
        <!-- <a class="btn btn-outline" href="https://show.hohu.org" target="_blank">在线演示</a> -->
        <a class="btn btn-outline" href="https://github.com/aihohu/hohu-admin" target="_blank">查看源码</a>
      </div>

      <!-- Product screenshot mockup (always dark) -->
      <div class="product-preview">
        <div class="browser-bar">
          <div class="browser-dots">
            <span class="dot dot-red"></span>
            <span class="dot dot-yellow"></span>
            <span class="dot dot-green"></span>
          </div>
          <span class="browser-url">show.hohu.org — 管理后台预览</span>
          <span class="live-badge">● Live Demo</span>
        </div>
        <div class="preview-body">
          <div class="preview-sidebar">
            <div class="sidebar-item active">📊 仪表盘</div>
            <div class="sidebar-item">👥 用户管理</div>
            <div class="sidebar-item">🔐 权限控制</div>
            <div class="sidebar-item">📦 订单管理</div>
            <div class="sidebar-item">⚙️ 系统设置</div>
          </div>
          <div class="preview-main">
            <div class="stat-cards">
              <div class="stat-card stat-green">
                <span class="stat-value">1,284</span>
                <span class="stat-label">总用户</span>
              </div>
              <div class="stat-card stat-blue">
                <span class="stat-value">328</span>
                <span class="stat-label">今日订单</span>
              </div>
              <div class="stat-card stat-purple">
                <span class="stat-value">99.9%</span>
                <span class="stat-label">系统在线</span>
              </div>
              <div class="stat-card stat-yellow">
                <span class="stat-value">42ms</span>
                <span class="stat-label">平均响应</span>
              </div>
            </div>
            <div class="preview-bottom">
              <div class="chart-placeholder">
                <span>📈 用户增长趋势</span>
              </div>
              <div class="ai-chat">
                <div class="ai-header">
                  <span class="ai-icon">🤖</span>
                  <span class="ai-label">AI 助手</span>
                </div>
                <div class="ai-bubble">"帮我查看本月新增用户统计"</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="tech-tags">
        <span>Vue3</span>
        <span>FastAPI</span>
        <span>PostgreSQL</span>
        <span>Redis</span>
        <span>UniApp</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  padding: 80px 24px 60px;
  overflow: hidden;
  background: var(--landing-bg);
}

.hero-inner {
  position: relative;
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
  color: var(--landing-text);
}

.hero-label {
  font-size: 12px;
  letter-spacing: 3px;
  color: #10b981;
  margin-bottom: 16px;
  font-weight: 500;
}

.hero-title {
  font-size: 42px;
  font-weight: 800;
  line-height: 1.2;
  margin: 0 0 12px;
  color: var(--landing-text);
}

.gradient-text {
  background: linear-gradient(90deg, #10b981, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-desc {
  font-size: 16px;
  color: var(--landing-text-2);
  margin: 0 0 28px;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.btn {
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.15s, box-shadow 0.15s;
  display: inline-block;
}

.btn:hover { transform: translateY(-2px); }
.btn:active { transform: translateY(0); }

.btn-primary {
  background: linear-gradient(90deg, #10b981, #3b82f6);
  color: #fff;
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.3);
}

.btn-primary:hover {
  box-shadow: 0 6px 24px rgba(16, 185, 129, 0.4);
}

.btn-outline {
  border: 1px solid var(--landing-border);
  color: var(--landing-text-2);
}

.btn-outline:hover {
  border-color: #10b981;
  color: #10b981;
}

/* Product Preview — always dark */
.product-preview {
  background: var(--landing-preview-bg);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  overflow: hidden;
  text-align: left;
  margin-bottom: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.browser-bar {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  font-size: 12px;
  gap: 12px;
  color: #fff;
}

.browser-dots { display: flex; gap: 6px; }
.dot { width: 10px; height: 10px; border-radius: 50%; }
.dot-red { background: #ef4444; }
.dot-yellow { background: #f59e0b; }
.dot-green { background: #10b981; }

.browser-url {
  flex: 1;
  color: rgba(255, 255, 255, 0.3);
  font-size: 12px;
}

.live-badge {
  color: #10b981;
  font-size: 11px;
  font-weight: 500;
}

.preview-body {
  display: flex;
  min-height: 200px;
}

.preview-sidebar {
  width: 140px;
  padding: 12px;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  background: rgba(255, 255, 255, 0.02);
}

.sidebar-item {
  padding: 8px 10px;
  border-radius: 6px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 2px;
}

.sidebar-item.active {
  background: rgba(16, 185, 129, 0.12);
  color: #10b981;
}

.preview-main {
  flex: 1;
  padding: 16px;
}

.stat-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 12px;
}

.stat-card {
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  color: #fff;
}

.stat-value {
  display: block;
  font-size: 20px;
  font-weight: 700;
}

.stat-label {
  display: block;
  font-size: 11px;
  opacity: 0.5;
  margin-top: 2px;
}

.stat-green { background: rgba(16, 185, 129, 0.1); }
.stat-green .stat-value { color: #10b981; }
.stat-blue { background: rgba(59, 130, 246, 0.1); }
.stat-blue .stat-value { color: #3b82f6; }
.stat-purple { background: rgba(168, 85, 247, 0.1); }
.stat-purple .stat-value { color: #8b5cf6; }
.stat-yellow { background: rgba(245, 158, 11, 0.1); }
.stat-yellow .stat-value { color: #f59e0b; }

.preview-bottom {
  display: flex;
  gap: 12px;
}

.chart-placeholder {
  flex: 1;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.25);
}

.ai-chat {
  width: 45%;
  background: rgba(16, 185, 129, 0.04);
  border: 1px solid rgba(16, 185, 129, 0.15);
  border-radius: 8px;
  padding: 10px;
}

.ai-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}

.ai-icon { font-size: 16px; }
.ai-label { font-size: 12px; color: #10b981; font-weight: 600; }

.ai-bubble {
  background: rgba(16, 185, 129, 0.1);
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  display: inline-block;
}

.tech-tags {
  display: flex;
  gap: 20px;
  justify-content: center;
  font-size: 13px;
  color: var(--landing-text-3);
}

@media (max-width: 768px) {
  .hero { padding: 60px 16px 40px; }
  .hero-title { font-size: 28px; }
  .hero-desc { font-size: 14px; }
  .hero-actions { flex-direction: column; align-items: center; }
  .preview-sidebar { display: none; }
  .stat-cards { grid-template-columns: repeat(2, 1fr); }
  .preview-bottom { flex-direction: column; }
  .ai-chat { width: 100%; }
}
</style>
