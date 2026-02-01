<template>
  <div class="landing-container">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">
          <span class="title-icon">📝</span>
          PolishText
        </h1>
        <p class="hero-subtitle">
          优雅的 Markdown 到 HTML 转换工具
        </p>
        <p class="hero-description">
          将 Markdown 文档转换为精美的 HTML 格式，支持多种模板样式、代码高亮、微信公众号导出以及小红书图片生成。
        </p>
        <div class="hero-actions">
          <router-link to="/editor" class="btn btn-primary">
            开始使用
          </router-link>
          <a href="https://github.com" target="_blank" class="btn btn-secondary">
            GitHub
          </a>
        </div>
      </div>
      <div class="hero-preview">
        <div class="preview-window">
          <div class="preview-header">
            <div class="window-controls">
              <span class="control red"></span>
              <span class="control yellow"></span>
              <span class="control green"></span>
            </div>
            <span class="window-title">Markdown Preview</span>
          </div>
          <div class="preview-body">
            <pre class="code-preview"><code><span class="keyword">#</span> 欢迎使用 PolishText

<span class="keyword">##</span> 主要功能
- ✨ 实时预览转换结果
- 🎨 多种样式模板选择
- 💻 代码语法高亮
- 📋 一键复制 HTML 代码

<span class="code-comment">```javascript</span>
<span class="function">function</span> <span class="method">helloWorld</span>() {
  <span class="function">console</span>.<span class="method">log</span>(<span class="string">"Hello, World!"</span>);
}
<span class="code-comment">```</span></code></pre>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section">
      <h2 class="section-title">核心功能</h2>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">🎨</div>
          <h3 class="feature-title">多模板支持</h3>
          <p class="feature-description">
            提供多种预设模板样式，满足不同场景需求，轻松切换文档风格。
          </p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">💻</div>
          <h3 class="feature-title">代码高亮</h3>
          <p class="feature-description">
            集成 highlight.js，支持180+编程语言，代码显示更加清晰美观。
          </p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">📱</div>
          <h3 class="feature-title">多平台导出</h3>
          <p class="feature-description">
            支持导出为微信公众号格式、小红书图片等多种输出形式。
          </p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">⚡</div>
          <h3 class="feature-title">实时预览</h3>
          <p class="feature-description">
            编辑 Markdown 时即可实时查看渲染效果，所见即所得。
          </p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">🎯</div>
          <h3 class="feature-title">主题定制</h3>
          <p class="feature-description">
            自定义主题颜色、字体大小、背景样式，打造专属文档风格。
          </p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">📦</div>
          <h3 class="feature-title">HTML 导出</h3>
          <p class="feature-description">
            一键生成微信公众号兼容的 HTML 代码，直接粘贴使用。
          </p>
        </div>
      </div>
    </section>

    <!-- Usage Section -->
    <section class="usage-section">
      <h2 class="section-title">简单易用</h2>
      <div class="usage-steps">
        <div class="step">
          <div class="step-number">1</div>
          <div class="step-content">
            <h3>输入 Markdown</h3>
            <p>在左侧编辑器中输入或粘贴您的 Markdown 内容</p>
          </div>
        </div>
        <div class="step-arrow">→</div>
        <div class="step">
          <div class="step-number">2</div>
          <div class="step-content">
            <h3>选择样式</h3>
            <p>从多种模板和主题中选择适合的样式</p>
          </div>
        </div>
        <div class="step-arrow">→</div>
        <div class="step">
          <div class="step-number">3</div>
          <div class="step-content">
            <h3>导出使用</h3>
            <p>复制 HTML 代码或导出为图片，用于不同平台</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Examples Section -->
    <section class="examples-section">
      <h2 class="section-title">示例效果</h2>
      <div class="examples-preview">
        <div class="example-card">
          <div class="example-preview markdown-sample">
            <h1>技术文档示例</h1>
            <h2>简介</h2>
            <p>这是一个使用 PolishText 生成的技术文档示例。</p>
            <h2>代码示例</h2>
            <pre><code>const greeting = 'Hello';
console.log(greeting);</code></pre>
            <h2>特性列表</h2>
            <ul>
              <li>简洁的语法</li>
              <li>丰富的功能</li>
              <li>优秀的可读性</li>
            </ul>
          </div>
        </div>
        <div class="example-card">
          <div class="example-preview markdown-sample">
            <blockquote>
              这是一个引用示例，展示了优雅的引用样式。
            </blockquote>
            <table>
              <thead>
                <tr>
                  <th>功能</th>
                  <th>状态</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>实时预览</td>
                  <td>✅ 已完成</td>
                </tr>
                <tr>
                  <td>模板切换</td>
                  <td>✅ 已完成</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="cta-content">
        <h2>开始使用 PolishText</h2>
        <p>立即体验优雅的 Markdown 转换工具</p>
        <router-link to="/editor" class="btn btn-primary btn-large">
          立即开始
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped>
/* 导入字体 */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

.landing-container {
  min-height: 100vh;
  background: #fcf7f0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
}

/* Hero Section */
.hero-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 60px;
  padding: 80px 40px;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 80vh;
}

.hero-content {
  flex: 1;
  max-width: 540px;
}

.hero-title {
  font-size: 48px;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-icon {
  font-size: 40px;
}

.hero-subtitle {
  font-size: 24px;
  font-weight: 500;
  color: #4a5568;
  margin: 0 0 20px 0;
}

.hero-description {
  font-size: 16px;
  line-height: 1.8;
  color: #718096;
  margin: 0 0 32px 0;
}

.hero-actions {
  display: flex;
  gap: 16px;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px 28px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
}

.btn-primary {
  background: #c4a77d;
  color: #ffffff;
}

.btn-primary:hover {
  background: #b8956e;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(196, 167, 125, 0.4);
}

.btn-secondary {
  background: #ffffff;
  color: #4a5568;
  border: 1px solid #e2e8f0;
}

.btn-secondary:hover {
  background: #f7fafc;
  border-color: #cbd5e0;
}

.btn-large {
  padding: 18px 36px;
  font-size: 18px;
}

/* Preview Window */
.hero-preview {
  flex: 1;
  max-width: 500px;
}

.preview-window {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.preview-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #f7fafc;
  border-bottom: 1px solid #e2e8f0;
}

.window-controls {
  display: flex;
  gap: 8px;
}

.control {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.control.red {
  background: #fc5c56;
}

.control.yellow {
  background: #ffbd4f;
}

.control.green {
  background: #3dc550;
}

.window-title {
  font-size: 13px;
  color: #718096;
}

.preview-body {
  padding: 20px;
}

.code-preview {
  font-family: 'JetBrains Mono', 'SF Mono', Monaco, Consolas, monospace;
  font-size: 13px;
  line-height: 1.6;
  color: #2d3748;
  margin: 0;
  background: transparent;
  border: none;
  padding: 0;
}

.code-preview code {
  background: transparent;
  color: inherit;
  padding: 0;
}

.keyword {
  color: #3182ce;
}

.function {
  color: #d69e2e;
}

.method {
  color: #3182ce;
}

.string {
  color: #38a169;
}

.code-comment {
  color: #a0aec0;
}

/* Features Section */
.features-section {
  padding: 80px 40px;
  background: #faf6f0;
}

.section-title {
  text-align: center;
  font-size: 32px;
  font-weight: 600;
  color: #1a202c;
  margin: 0 0 48px 0;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card {
  background: #ffffff;
  padding: 32px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
}

.feature-icon {
  font-size: 36px;
  margin-bottom: 16px;
}

.feature-title {
  font-size: 18px;
  font-weight: 600;
  color: #1a202c;
  margin: 0 0 12px 0;
}

.feature-description {
  font-size: 14px;
  line-height: 1.7;
  color: #718096;
  margin: 0;
}

/* Usage Section */
.usage-section {
  padding: 80px 40px;
  max-width: 1200px;
  margin: 0 auto;
}

.usage-steps {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
}

.step {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 24px;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  width: 280px;
}

.step-number {
  width: 40px;
  height: 40px;
  background: #c4a77d;
  color: #ffffff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 600;
  flex-shrink: 0;
}

.step-content h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1a202c;
  margin: 0 0 8px 0;
}

.step-content p {
  font-size: 14px;
  color: #718096;
  margin: 0;
  line-height: 1.6;
}

.step-arrow {
  font-size: 24px;
  color: #cbd5e0;
}

/* Examples Section */
.examples-section {
  padding: 80px 40px;
  background: #faf6f0;
}

.examples-preview {
  display: flex;
  gap: 32px;
  max-width: 1000px;
  margin: 0 auto;
  justify-content: center;
}

.example-card {
  flex: 1;
  max-width: 450px;
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.example-preview {
  padding: 32px;
}

/* Markdown Sample Styles */
.markdown-sample {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 14px;
  line-height: 1.8;
  color: #2d3748;
}

.markdown-sample h1 {
  font-size: 24px;
  font-weight: 600;
  color: #1a202c;
  margin: 0 0 20px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #3182ce;
}

.markdown-sample h2 {
  font-size: 18px;
  font-weight: 600;
  color: #2d3748;
  margin: 28px 0 16px 0;
}

.markdown-sample p {
  margin: 16px 0;
}

.markdown-sample pre {
  background: #f7fafc;
  border-radius: 8px;
  padding: 16px;
  overflow-x: auto;
  margin: 20px 0;
  border: 1px solid #e2e8f0;
}

.markdown-sample pre code {
  font-family: 'JetBrains Mono', 'SF Mono', Monaco, Consolas, monospace;
  font-size: 13px;
  background: transparent;
  padding: 0;
  color: #2d3748;
}

.markdown-sample ul {
  padding-left: 24px;
  margin: 16px 0;
}

.markdown-sample li {
  margin: 8px 0;
}

.markdown-sample blockquote {
  background: #fff9f0;
  border-left: 4px solid #c4a77d;
  margin: 20px 0;
  padding: 16px 20px;
  border-radius: 0 8px 8px 0;
  color: #8b7355;
}

.markdown-sample table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
}

.markdown-sample th,
.markdown-sample td {
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  text-align: left;
}

.markdown-sample th {
  background: #f7fafc;
  font-weight: 600;
  color: #4a5568;
}

/* CTA Section */
.cta-section {
  padding: 80px 40px;
  background: #1a202c;
  text-align: center;
}

.cta-content h2 {
  font-size: 32px;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 16px 0;
}

.cta-content p {
  font-size: 18px;
  color: #a0aec0;
  margin: 0 0 32px 0;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .hero-section {
    flex-direction: column;
    text-align: center;
    padding: 60px 24px;
  }
  
  .hero-content {
    max-width: 100%;
  }
  
  .hero-title {
    justify-content: center;
  }
  
  .hero-actions {
    justify-content: center;
  }
  
  .hero-preview {
    max-width: 100%;
    width: 100%;
  }
  
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .usage-steps {
    flex-direction: column;
  }
  
  .step-arrow {
    transform: rotate(90deg);
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 36px;
  }
  
  .hero-subtitle {
    font-size: 20px;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .step {
    width: 100%;
  }
  
  .examples-preview {
    flex-direction: column;
    align-items: center;
  }
  
  .example-card {
    width: 100%;
  }
  
  .section-title {
    font-size: 28px;
  }
}
</style>