<template>
  <div class="markdown-tool-container">
    <!-- 模板选择区域 -->
    <div class="template-selector">
      <div class="template-header">
        <div class="control-group">
          <!-- 模板选择 -->
          <div class="select-label">模板样式:</div>
          <el-select 
            v-model="selectedTemplate" 
            placeholder="选择模板样式"
            size="large"
            style="width: 200px; margin-right: 12px;"
            @change="handleTemplateChange"
          >
            <el-option
              v-for="template in templates"
              :key="template.id"
              :label="template.name"
              :value="template.id"
            />
          </el-select>
          
          <!-- 主题颜色选择 -->
          <div class="select-label">主题颜色:</div>
          <el-select 
            v-model="selectedThemeColor" 
            placeholder="主题颜色"
            size="large"
            style="width: 150px; margin-right: 12px;"
            :label-in-value="true"
            @change="handleThemeColorChange"
          >
            <el-option
              v-for="color in themeColors"
              :key="color.name"
              :label="color.name"
              :value="color.name"
            >
              <div class="dropdown-color-option">
                <div 
                  class="color-preview" 
                  :style="{ background: `linear-gradient(45deg, ${color.primary}, ${color.secondary})` }"
                ></div>
                <span>{{ color.name }}</span>
              </div>
            </el-option>
          </el-select>
          
          <!-- 背景颜色选择 -->
          <div class="select-label">背景颜色:</div>
          <el-select 
            v-model="selectedBackground" 
            placeholder="背景颜色"
            size="large"
            style="width: 150px;"
            :label-in-value="true"
            @change="handleBackgroundChange"
          >
            <el-option
              v-for="bg in backgroundOptions"
              :key="bg.name"
              :label="bg.name"
              :value="bg.name"
            >
              <div class="dropdown-background-option">
                <div 
                  class="background-preview" 
                  :style="{ backgroundColor: bg.value }"
                ></div>
                <span>{{ bg.name }}</span>
              </div>
            </el-option>
          </el-select>
        </div>
      </div>
    </div>

    <!-- 主要工作区域 -->
    <div class="work-area">
      <!-- 左侧：Markdown输入区域 -->
      <div class="input-panel">
        <div class="panel-header">
          <h3>Markdown 输入</h3>
          <div class="panel-actions">
            <el-button 
              size="small" 
              @click="loadSample"
              :icon="Document"
            >
              加载示例
            </el-button>
            <el-button 
              size="small" 
              @click="clearInput"
              :icon="Delete"
            >
              清空
            </el-button>
          </div>
        </div>
        <div class="input-content">
          <el-input
            v-model="markdownInput"
            type="textarea"
            placeholder="在这里输入您的Markdown文本..."
            :rows="20"
            resize="none"
            @input="handleInputChange"
          />
        </div>
      </div>

      <!-- 右侧：预览和代码区域 -->
      <div class="preview-panel">
        <!-- 预览选项卡 -->
        <el-tabs v-model="activeTab" type="border-card">
          <el-tab-pane label="HTML预览" name="preview">
            <div class="preview-content" :class="`template-${selectedTemplate}`" ref="previewContainerRef" v-html="renderedHtml">
            </div>
          </el-tab-pane>
          
          <el-tab-pane label="HTML代码" name="code">
            <div class="code-panel">
              <div class="code-header">
                <h4>生成的HTML代码</h4>
                <div class="button-group">
                  <el-button 
                    size="small" 
                    type="success"
                    @click="copyWeChatHtmlCode"
                    :icon="CopyDocument"
                  >
                    微信公众号版
                  </el-button>
                </div>
              </div>
              <div class="code-content">
                <el-input
                  v-model="generatedHtml"
                  type="textarea"
                  placeholder="生成的HTML代码将显示在这里..."
                  :rows="20"
                  resize="none"
                  readonly
                />
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { Document, Delete, CopyDocument } from '@element-plus/icons-vue'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import juice from 'juice'
import '../styles/templates/index.css'

// 初始化markdown解析器
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return '<pre class="hljs"><code>' +
               hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
               '</code></pre>';
      } catch (__) {}
    }
    return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
  }
})

// 响应式数据 - 简化默认内容
const markdownInput = ref(`# 欢迎使用 Markdown 转 HTML 工具

这是一个功能强大的 Markdown 转换器，支持：

## 主要功能
- ✨ 实时预览转换结果
- 🎨 多种样式模板选择
- 💻 代码语法高亮
- 📋 一键复制HTML代码

### 代码示例
\`\`\`javascript
function helloWorld() {
  console.log("Hello, World!");
}
\`\`\`

### 表格示例
| 功能 | 状态 | 描述 |
|------|------|------|
| 实时预览 | ✅ | 支持 |
| 模板切换 | ✅ | 支持 |
| 代码高亮 | ✅ | 支持 |

### 引用
> 这是一个重要的引用文本，展示了引用样式的效果。

开始编写您的 Markdown 文本吧！`)

const selectedTemplate = ref('tengxun')
const activeTab = ref('preview')
const previewContainerRef = ref(null)

// 模板配置
const templates = [
  {
    id: 'tengxun',
    name: '腾讯风格',
    class: 'template-tengxun',
    styles: {
      primaryColor: '#1890ff',
      secondaryColor: '#40a9ff',
      backgroundColor: '#ffffff',
      textColor: '#333333',
      linkColor: '#1890ff',
      borderColor: '#d9d9d9'
    }
  },
  {
    id: 'default',
    name: '默认模板',
    class: 'template-default',
    styles: {
      primaryColor: '#409eff',
      secondaryColor: '#66b1ff',
      backgroundColor: '#ffffff',
      textColor: '#303133',
      linkColor: '#409eff',
      borderColor: '#dcdfe6'
    }
  },
  {
    id: 'github',
    name: 'GitHub风格',
    class: 'template-github',
    styles: {
      primaryColor: '#0366d6',
      secondaryColor: '#0256cc',
      backgroundColor: '#ffffff',
      textColor: '#24292e',
      linkColor: '#0366d6',
      borderColor: '#e1e4e8'
    }
  }
]

// 主题颜色配置
const themeColors = [
  { name: '浅蓝', primary: '#1890ff', secondary: '#0052ff' },
  { name: '深蓝', primary: '#096dd9', secondary: '#0050b3' },
  { name: '绿色', primary: '#52c41a', secondary: '#389e0d' },
  { name: '橙色', primary: '#fa8c16', secondary: '#d46b08' },
  { name: '紫色', primary: '#722ed1', secondary: '#531dab' },
  { name: '粉色', primary: '#eb2f96', secondary: '#c41d7f' },
]

// 背景选项配置
const backgroundOptions = [
  { name: '白色', value: '#ffffff' },
  { name: '浅灰', value: '#fafafa' },
  { name: '米色', value: '#fdf6e3' },
  { name: '深色', value: '#1f1f1f' },
  { name: '淡蓝', value: '#f0f8ff' },
  { name: '淡绿', value: '#f6ffed' }
]

// 响应式数据 - 添加主题状态
const selectedThemeColor = ref(themeColors[0].name)
const selectedBackground = ref(backgroundOptions[0].name)

// 计算属性
const renderedHtml = computed(() => {
  if (!markdownInput.value.trim()) {
    return '<div class="placeholder">请输入 Markdown 文本...</div>'
  }
  return md.render(markdownInput.value)
})

const generatedHtml = computed(() => {
  if (!markdownInput.value.trim()) {
    return ''
  }
  return md.render(markdownInput.value)
})

// 方法
const handleInputChange = () => {
  // 实时转换处理
}

const handleTemplateChange = (templateId) => {
  console.log('切换到模板:', templateId)
}

const handleThemeColorChange = (value) => {
  const colorObj = themeColors.find(color => color.name === value);
  if (colorObj) {
    selectedThemeColor.value = colorObj.name;
  }
}

const handleBackgroundChange = (value) => {
  const bgObj = backgroundOptions.find(bg => bg.name === value);
  if (bgObj) {
    selectedBackground.value = bgObj.name;
  }
}

const loadSample = () => {
  markdownInput.value = `# 高级 Markdown 示例

## 代码示例
\`\`\`python
import numpy as np

def process_data(data):
    return pd.DataFrame(data)
\`\`\`

## 任务列表
- [x] 已完成的任务
- [ ] 待完成的任务

## 表格示例
| 功能 | 状态 | 描述 |
|------|------|------|
| 实时预览 | ✅ | 支持 |

> 感谢使用我们的工具！`
  
  ElMessage.success('已加载示例内容')
}

const clearInput = () => {
  markdownInput.value = ''
  ElMessage.info('已清空输入内容')
}

// CSS样式内联化函数 - 使用juice库自动处理已加载的CSS
const mergeCss = (html) => {
  return juice(html, {
    inlinePseudoElements: true,
    preserveImportant: true,
    resolveCSSVariables: true,  // 启用CSS变量解析，让juice自动处理变量
  })
};

// 获取当前模板的完整CSS样式
const getCurrentTemplateStyles = () => {
  // 获取所有样式表
  const styleSheets = Array.from(document.styleSheets);
  let templateCss = '';
  
  // 查找包含模板样式的样式表
  for (const sheet of styleSheets) {
    try {
      // 尝试访问样式表规则
      const rules = sheet.cssRules || sheet.rules;
      if (!rules) continue;
      
      for (const rule of rules) {
        // 收集与当前模板相关的CSS规则
        if (rule.selectorText && 
            (rule.selectorText.includes(`.template-${selectedTemplate.value}`) ||
             rule.selectorText.includes(':root'))) {
          templateCss += rule.cssText + '\n';
        }
      }
    } catch (e) {
      // 跨域样式表无法访问，跳过
      console.warn('无法访问样式表:', sheet.href, e);
    }
  }
  
  return templateCss;
};

// 生成微信公众号兼容的HTML代码
const generateWeChatCompatibleHtml = async () => {
  if (!markdownInput.value.trim()) {
    return '<div style="padding: 20px; text-align: center; color: #666;">请输入 Markdown 文本...</div>';
  }
  
  const previewContainer = previewContainerRef.value;
  if (!previewContainer) return '';

  // 步骤1：获取外部的 template-xxx 样式
  let templateCss = '';
  templateCss = await getCurrentTemplateStyles();
  console.log('提取的模板CSS:', templateCss);
  
  // 获取变量列表
  const variables = getCurrentTemplateVariables();

  Object.entries(variables).forEach(([key, value]) => {
    // 使用变量名进行替换
    const regex = new RegExp(`var\\(\\s*--${key}\\s*(?:,\\s*[^)]+)?\\s*\\)`, 'g');
    templateCss = templateCss.replace(regex, value);
  });
  console.log('替换变量后的CSS:', templateCss);

  // 步骤2：构建包含实际样式的完整HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = previewContainer.innerHTML;
  let fullHtml = `
    <style>
      ${templateCss}
    </style>
    <div class="template-${selectedTemplate.value}">
      ${tempDiv.innerHTML}
    </div>
  `;

  // 步骤3：使用Juice内联样式
  const inlinedHtml = mergeCss(fullHtml, {
    // Juice 配置：确保内联所有样式
    preserveImportant: true,   // 保留 !important 样式
    removeStyleTags: false,    // 保留style标签，让mergeCss函数处理
    webResources: {
      relativeTo: window.location.href // 处理相对路径（如果有）
    }
  });

  return inlinedHtml;
};

// 复制微信公众号兼容代码
const copyWeChatHtmlCode = async () => {
  try {
    const weChatHtml = await generateWeChatCompatibleHtml();
    
    // 创建剪贴板数据
    const clipboardData = new ClipboardItem({
      'text/html': new Blob([weChatHtml], { type: 'text/html' }),
      'text/plain': new Blob([weChatHtml], { type: 'text/plain' })
    });
    
    // 写入剪贴板
    await navigator.clipboard.write([clipboardData]);
    ElMessage.success('微信公众号兼容代码已复制到剪贴板');
  } catch (err) {
    console.error('使用Clipboard API复制失败:', err);
    // 降级方案：直接复制文本
    try {
      const weChatHtml = await generateWeChatCompatibleHtml();
      await navigator.clipboard.writeText(weChatHtml);
      ElMessage.success('已使用备用方案复制到剪贴板');
    } catch (fallbackErr) {
      ElMessage.error('复制失败，请手动复制');
    }
  }
};

// 获取当前模板的CSS变量
const getCurrentTemplateVariables = () => {
  const currentTemplate = templates.find(t => t.id === selectedTemplate.value) || templates[0];
  
  // 获取主题颜色和背景对象
  const themeColorObj = themeColors.find(color => color.name === selectedThemeColor.value) || themeColors[0];
  const backgroundObj = backgroundOptions.find(bg => bg.name === selectedBackground.value) || backgroundOptions[0];
  
  // 合并默认模板样式和用户选择的主题
  return {
    ...currentTemplate.styles,
    primaryColor: themeColorObj.primary,
    secondaryColor: themeColorObj.secondary,
    backgroundColor: backgroundObj.value
  };
};

// 应用CSS变量到预览容器
const applyCSSVariables = () => {
  const previewContainer = document.querySelector('.preview-content');
  if (!previewContainer) return;
  
  const variables = getCurrentTemplateVariables();
  
  // 清除之前的主题类
  previewContainer.className = previewContainer.className.replace(/theme-\w+/g, '');
  
  // 应用新的CSS变量
  Object.entries(variables).forEach(([key, value]) => {
    previewContainer.style.setProperty(`--${key}`, value);
  });
  
  // 添加主题标识类
  previewContainer.classList.add(`theme-${selectedThemeColor.value.name}`);
};

// 监听主题变化
watch([selectedTemplate, selectedThemeColor, selectedBackground], () => {
  nextTick(() => {
    const previewContainer = document.querySelector('.preview-content');
    if (!previewContainer) return;
    
    // 清除所有模板类
    previewContainer.className = previewContainer.className.replace(/template-\w+/g, '');
    // 添加新模板类
    previewContainer.classList.add(`template-${selectedTemplate.value}`);
    
    // 应用CSS变量
    applyCSSVariables();
  });
}, { deep: true });
</script>

<style scoped>
.markdown-tool-container {
  height: calc(100vh - 120px);
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
}

/* 模板选择区域 */
.template-selector {
  background: white;
  padding: 16px 24px;
  border-bottom: 1px solid #e4e7ed;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.template-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.template-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

/* 主要工作区域 */
.work-area {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  overflow: hidden;
}

/* 左侧输入面板 */
.input-panel {
  background: white;
  border-right: 1px solid #e4e7ed;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-header {
  padding: 16px 20px;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fafbfc;
}

.panel-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.panel-actions {
  display: flex;
  gap: 8px;
}

.input-content {
  flex: 1;
  padding: 16px;
}

.input-content :deep(.el-textarea) {
  height: 100%;
}

.input-content :deep(.el-textarea__inner) {
  height: 100% !important;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.6;
}

.code-content {
  flex: 1;
  padding: 16px;
}

/* .code-content :deep(.el-textarea) {
  height: calc(100vh - 270px);
} */

.code-content :deep(.el-textarea__inner) {
  height: calc(100vh - 270px) !important;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.6;
  background: #f8f9fa;
  color: #333;
}

/* 右侧预览面板 */
.preview-panel {
  background: white;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
}

.preview-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  height: calc(100vh - 270px);
  min-height: 0;
}

/* 代码面板 */
.code-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.code-header {
  padding: 12px 16px;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fafbfc;
  flex-shrink: 0;
}

.code-header h4 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.button-group {
  display: flex;
  gap: 8px;
}

/* 占位符样式 */
.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #909399;
  font-style: italic;
  border: 2px dashed #e4e7ed;
  border-radius: 6px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .work-area {
    grid-template-columns: 1fr;
  }
  
  .input-panel {
    border-right: none;
    border-bottom: 1px solid #e4e7ed;
  }
  
  .template-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .control-group {
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
  }
  
  .control-group .el-select {
    width: 100% !important;
    margin-right: 0 !important;
    margin-bottom: 8px;
  }
  
  .theme-options {
    flex-direction: column;
    gap: 12px;
  }
  
  .color-picker-group,
  .background-picker-group {
    justify-content: flex-start;
  }
}

/* 控制组样式 */
.control-group {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

/* 下拉框颜色选项样式 */
.dropdown-color-option,
.dropdown-background-option {
  display: flex;
  align-items: center;
  gap: 8px;
}

.dropdown-color-option .color-preview,
.dropdown-background-option .background-preview {
  width: 20px;
  height: 20px;
  border-radius: 3px;
  border: 1px solid #dcdfe6;
  flex-shrink: 0;
}

/* 主题选项样式 */
.theme-options {
  margin-top: 16px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
  display: flex;
  gap: 20px;
}

.theme-group {
  flex: 1;
}

.theme-group label {
  display: block;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
  font-size: 14px;
}

.color-picker-group,
.background-picker-group {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.color-option,
.background-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
  border: 2px solid transparent;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: white;
  min-width: 60px;
}

.color-option:hover,
.background-option:hover {
  border-color: #409eff;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.color-option.active,
.background-option.active {
  border-color: #409eff;
  background: #f0f9ff;
}

.color-preview,
.background-preview {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  margin-bottom: 4px;
}

.color-name,
.background-name {
  font-size: 11px;
  color: #606266;
  text-align: center;
  line-height: 1.2;
}

.color-option.active .color-name,
.background-option.active .background-name {
  color: #409eff;
  font-weight: 500;
}
</style>