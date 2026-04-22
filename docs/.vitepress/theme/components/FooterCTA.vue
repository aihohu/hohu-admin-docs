<script setup lang="ts">
</script>

<template>
  <section class="footer-section">
    <div class="footer-inner">
      <!-- CTA Card -->
      <div class="cta-card">
        <h2 class="cta-title">开始用 AI 构建你的后台系统</h2>
        <p class="cta-desc">3 分钟部署 · 永久免费 · 完全开源</p>
        <div class="cta-actions">
          <a class="btn btn-primary" href="/guide/quick-start">快速开始</a>
          <a class="btn btn-github" href="https://github.com/aihohu/hohu-admin" target="_blank">Star on GitHub ⭐</a>
        </div>
      </div>

      <!-- Footer -->
      <footer class="footer-columns">
        <div class="footer-col footer-brand">
          <div class="footer-logo">
            <div class="logo-icon"></div>
            <span class="logo-text">HoHu Admin</span>
          </div>
          <p class="footer-about">AI 驱动的开源企业级后台管理平台<br>让开发像对话一样简单</p>
          <div class="social-links">
            <a class="social-icon" href="https://github.com/aihohu/hohu-admin" target="_blank" title="GitHub">GH</a>
            <a class="social-icon" href="#" title="微信">微</a>
            <a class="social-icon" href="#" title="Discord">DC</a>
          </div>
        </div>
        <div class="footer-col">
          <h4 class="col-title">文档</h4>
          <ul class="col-links">
            <li><a href="/guide/quick-start">快速开始</a></li>
            <li><a href="/guide/introduction">使用指南</a></li>
            <li><a href="/guide/backend/introduction">后端架构</a></li>
            <li><a href="https://show.hohu.org/docs" target="_blank">API 参考</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4 class="col-title">社区</h4>
          <ul class="col-links">
            <li><a href="https://github.com/aihohu/hohu-admin" target="_blank">GitHub</a></li>
            <li><a href="#">微信交流群</a></li>
            <li><a href="https://github.com/aihohu/hohu-admin/issues" target="_blank">问题反馈</a></li>
            <li><a href="#">贡献指南</a></li>
          </ul>
        </div>
      </footer>

      <div class="footer-bottom">
        <span>© 2025 HoHu · MIT License</span>
        <div class="lang-switch">
          <span class="lang-active">中文</span>
          <a href="/en/">English</a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.footer-section {
  background: var(--landing-bg-alt);
  padding: 0 24px 24px;
}

.footer-inner {
  max-width: 900px;
  margin: 0 auto;
}

/* CTA Card */
.cta-card {
  text-align: center;
  padding: 40px 24px;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(59, 130, 246, 0.08));
  border: 1px solid rgba(16, 185, 129, 0.12);
  border-radius: 14px;
  margin-bottom: 40px;
}

.cta-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--landing-text);
  margin: 0 0 6px;
}

.cta-desc {
  font-size: 14px;
  color: var(--landing-text-2);
  margin: 0 0 20px;
}

.cta-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
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
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.25);
}

.btn-github {
  background: var(--landing-bg-card);
  border: 1px solid var(--landing-border);
  color: var(--landing-text-2);
}

.btn-github:hover {
  background: var(--landing-bg-alt);
}

/* Footer Columns */
.footer-columns {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr;
  gap: 32px;
  padding: 0 8px;
  margin-bottom: 24px;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.logo-icon {
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, #10b981, #3b82f6);
  border-radius: 6px;
}

.logo-text {
  font-weight: 700;
  font-size: 16px;
  color: var(--landing-text);
}

.footer-about {
  font-size: 13px;
  color: var(--landing-text-3);
  line-height: 1.6;
  margin: 0 0 12px;
}

.social-links {
  display: flex;
  gap: 8px;
}

.social-icon {
  width: 28px;
  height: 28px;
  background: var(--landing-bg-card);
  border: 1px solid var(--landing-border);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  color: var(--landing-text-3);
  text-decoration: none;
  transition: background 0.2s, color 0.2s;
}

.social-icon:hover {
  color: var(--landing-text);
  border-color: #10b981;
}

.col-title {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: #10b981;
  margin: 0 0 12px;
  font-weight: 600;
}

.col-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.col-links li { margin-bottom: 8px; }

.col-links a {
  font-size: 13px;
  color: var(--landing-text-2);
  text-decoration: none;
  transition: color 0.2s;
}

.col-links a:hover { color: #10b981; }

/* Bottom */
.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid var(--landing-border);
  font-size: 12px;
  color: var(--landing-text-3);
}

.lang-switch { display: flex; gap: 8px; }
.lang-active { color: var(--landing-text-2); }

.lang-switch a {
  color: var(--landing-text-3);
  text-decoration: none;
}

.lang-switch a:hover { color: var(--landing-text-2); }

@media (max-width: 768px) {
  .cta-title { font-size: 20px; }
  .footer-columns {
    grid-template-columns: 1fr;
    gap: 24px;
  }
}
</style>
