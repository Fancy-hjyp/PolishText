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
            size="small"
            style="width: 100px; margin-right: 12px;"
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
            size="small"
            style="width: 100px; margin-right: 12px;"
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
            v-model="backgroundColor" 
            placeholder="背景颜色"
            size="small"
            style="width: 100px; margin-right: 12px;"
            @change="handleBackgroundColorChange"
          >
            <el-option
              v-for="color in backgroundColorOptions"
              :key="color.value"
              :label="color.name"
              :value="color.value"
            >
              <div class="dropdown-color-option">
                <div 
                  class="color-preview" 
                  :style="{ backgroundColor: color.value }"
                ></div>
                <span>{{ color.name }}</span>
              </div>
            </el-option>
          </el-select>
          
          <!-- 背景样式选择 -->
          <div class="select-label">背景样式:</div>
          <el-select 
            v-model="selectedBackground" 
            placeholder="背景样式"
            size="small"
            style="width: 100px; margin-right: 12px;"
            @change="handleBackgroundChange"
          >
            <el-option
              v-for="bg in backgroundOptions"
              :key="bg.value"
              :label="bg.name"
              :value="bg.value"
            >
            </el-option>
          </el-select>
          
          <!-- 字体大小选择 -->
          <div class="select-label">字体大小:</div>
          <el-select 
            v-model="fontSize" 
            placeholder="字体大小"
            size="small"
            style="width: 100px; margin-right: 12px;"
            @change="handleFontSizeChange"
          >
            <el-option
              v-for="size in fontSizeOptions"
              :key="size.value"
              :label="size.label"
              :value="size.value"
            />
          </el-select>
          
          <!-- 字体类型选择 -->
          <div class="select-label">字体类型:</div>
          <el-select 
            v-model="fontFamily" 
            placeholder="字体类型"
            size="small"
            style="width: 100px;"
            @change="handleFontFamilyChange"
          >
            <el-option
              v-for="font in fontFamilyOptions"
              :key="font.value"
              :label="font.label"
              :value="font.value"
            />
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
            resize="none"
            @input="handleInputChange"
            style="height: 100%;"
          />
        </div>
      </div>

      <!-- 右侧：预览和代码区域 -->
      <div class="preview-panel">
        <!-- 预览选项卡 -->
        <el-tabs v-model="activeTab" type="border-card" style="height: 100%;">
          <el-tab-pane label="HTML预览" name="preview" style="height: 100%;">
            <div class="preview-content" :class="{ [`template-${selectedTemplate}`]: true, [`background-${selectedBackground}`]: true }" ref="previewContainerRef" v-html="renderedHtml">
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
import { Document, Delete, CopyDocument, Download } from '@element-plus/icons-vue'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import juice from 'juice'
import '../styles/templates/index.css'
import '../styles/background/index.css'
import { toPng, toJpeg, toBlob } from 'html-to-image'

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

const selectedTemplate = ref('tech')
const activeTab = ref('preview')
const previewContainerRef = ref(null)

// 主题配置
const templates = [
  {
    id: 'tech',
    name: '简约风格',
    class: 'template-tech',
    styles: {
      primaryColor: '#1890ff',
      secondaryColor: '#40a9ff',
      backgroundColor: '#ffffff',
      textColor: '#333333',
      linkColor: '#1890ff',
      borderColor: '#d9d9d9'
    }
  },
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
  { name: '无', value: '' },
  { name: '网格', value: 'grid' },
]

// 背景颜色选项配置
const backgroundColorOptions = [
  { name: '白色', value: '#ffffff' },
  { name: '浅灰', value: '#fafafa' },
  { name: '米色', value: '#fdf6e3' },
  { name: '淡蓝', value: '#f0f8ff' },
  { name: '淡绿', value: '#f6ffed' },
  { name: '淡粉', value: '#fff5f5' }
]

// 字体大小选项配置
const fontSizeOptions = [
  { label: '12px', value: '12px' },
  { label: '14px', value: '14px' },
  { label: '16px', value: '16px' },
  { label: '18px', value: '18px' },
  { label: '20px', value: '20px' },
  { label: '22px', value: '22px' },
  { label: '24px', value: '24px' },
]

// 字体类型选项配置
const fontFamilyOptions = [
  { label: '系统默认', value: '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif' },
  { label: '宋体', value: '"Songti SC", "SimSun", "STSong", serif' },
  { label: '黑体', value: '"Heiti SC", "SimHei", "STHei", sans-serif' },
  { label: '微软雅黑', value: '"Microsoft YaHei", "PingFang SC", sans-serif' },
  { label: '苹方', value: '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif' },
  { label: '楷体', value: '"Kaiti SC", "STKaiti", "KaiTi", serif' },
]

// 响应式数据 - 添加主题状态
const selectedThemeColor = ref(themeColors[0].name)
const selectedBackground = ref()
const backgroundColor = ref('#ffffff')  // 默认白色背景
const fontSize = ref('12px')  // 默认字体大小
const fontFamily = ref('-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif')  // 默认字体类型

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
  console.log('切换到主题颜色:', value)
  const colorObj = themeColors.find(color => color.name === value);
  if (colorObj) {
    selectedThemeColor.value = colorObj.name;
  }
}

const handleBackgroundColorChange = (value) => {
  console.log('切换到背景颜色:', value)
  backgroundColor.value = value
}

const handleBackgroundChange = (value) => {
  console.log('切换到背景:', value)
  const bgObj = backgroundOptions.find(bg => bg.value === value);
  if (bgObj) {
    selectedBackground.value = bgObj.value;
  }
}

// 处理字体大小变化
const handleFontSizeChange = (value) => {
  fontSize.value = value
  console.log('切换到字体大小:', value)
}

// 处理字体类型变化
const handleFontFamilyChange = (value) => {
  fontFamily.value = value
  console.log('切换到字体类型:', value)
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
    applyAttributesTableElements: true,  // 确保样式应用到表格元素
    applyWidthAttributes: true,
    applyHeightAttributes: true,
    applyTableAttributes: true,
    preserveMediaQueries: true
  })
};

// 获取指定模板的完整CSS样式
const getCurrentTemplateStyles = (className) => {
  console.log("className:", className);
  if (className == '')  return '';

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
            (rule.selectorText.includes(className) ||
             rule.selectorText.includes(':root'))) {
          templateCss += rule.cssText + '\n';
        }
      }
    } catch (e) {
      // 跨域样式结构无法访问，跳过
      console.warn('无法访问样式表:', sheet.href, e);
    }
  }
  
  return templateCss;
};

// 获取当前模板的CSS变量
const getCurrentTemplateVariables = () => {
  const currentTemplate = templates.find(t => t.id === selectedTemplate.value) || templates[0];
  
  // 获取主题颜色和背景对象
  const themeColorObj = themeColors.find(color => color.name === selectedThemeColor.value) || themeColors[0];
  console.log('当前主题颜色:', themeColorObj);
  
  // 合并默认模板样式和用户选择的主题
  return {
    ...currentTemplate.styles,
    primaryColor: themeColorObj.primary,
    secondaryColor: themeColorObj.secondary,
    backgroundColor: backgroundColor.value,  // 添加背景颜色变量
    fontSize: fontSize.value,  // 添加字体大小变量
    fontFamily: fontFamily.value  // 添加字体类型变量
  };
};


// 动态计算字体大小
const calculateDynamicFontSize = (elementTag, baseFontSize) => {
  // 从字符串中提取数值部分，例如从 '16px' 提取 16
  const baseSize = parseInt(baseFontSize.replace('px', ''));
  
  // 根据元素标签返回不同的字体大小
  switch(elementTag) {
    case 'h1':
      return (baseSize + 10) + 'px'; // h1 比基础字体大10px
    case 'h2':
      return (baseSize + 8) + 'px';  // h2 比基础字体大8px
    case 'h3':
      return (baseSize + 6) + 'px';  // h3 比基础字体大6px
    case 'h4':
      return (baseSize + 4) + 'px';  // h4 比基础字体大4px
    case 'h5':
      return (baseSize + 2) + 'px';  // h5 比基础字体大2px
    case 'h6':
      return (baseSize + 1) + 'px';  // h6 比基础字体大1px
    default:
      return baseFontSize; // 普通元素使用基础字体大小
  }
};

// 生成微信公众号兼容的HTML代码
const generateWeChatCompatibleHtml = async () => {
  if (!markdownInput.value.trim()) {
    return '<div style="padding: 20px; text-align: center; color: #666;">请输入 Markdown 文本...</div>';
  }
  
  const previewContainer = previewContainerRef.value;
  if (!previewContainer) return '';

  // 1. 获取外部的 template-xxx 样式
  let templateCss = '';
  templateCss = getCurrentTemplateStyles(`.template-${selectedTemplate.value}`);
  
  // 2. 变量替换
  const variables = getCurrentTemplateVariables();
  Object.entries(variables).forEach(([key, value]) => {
    // 转义特殊字符，特别是字体栈中的逗号和引号
    const regex = new RegExp(`var\\(\\s*--${key}\\s*(?:,\\s*([^)]+))?\\s*\\)`, 'g');
    templateCss = templateCss.replace(regex, (match, defaultValue) => {
      return value;
    });
  });
  console.log('替换变量后的CSS:', templateCss);

  // 3. 获取外部的 background-xxx 样式
  let backgroundCss = '';
  // 检查selectedBackground是否有值，如果没有则使用默认值
  const backgroundClass = selectedBackground.value ? `.background-${selectedBackground.value}` : '';
  backgroundCss = getCurrentTemplateStyles(`${backgroundClass}`);
  console.log('提取的背景CSS:', backgroundCss);

  // 4. 构建包含实际样式的完整HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = previewContainer.innerHTML;
  
  // 确保只有当selectedBackground有值时才添加background类
  const backgroundClassForHtml = selectedBackground.value ? `background-${selectedBackground.value}` : '';
  
  let fullHtml = `
    <meta charset="utf-8">
    <style>
      ${templateCss}
      ${backgroundCss}
    </style>
    <div class="template-${selectedTemplate.value} ${backgroundClassForHtml}">
      ${tempDiv.innerHTML}
    </div>
  `;
  console.log('完整HTML:', fullHtml);

  // 5. 使用Juice内联样式
  let inlinedHtml = mergeCss(fullHtml);
  console.log('内联后的HTML:', inlinedHtml);

  // 6. 直接为所有元素添加字体相关设置
  const parser = new DOMParser();
  const doc = parser.parseFromString(inlinedHtml, 'text/html');
  
  const container = doc.querySelector(`.template-${selectedTemplate.value}`);
  if (container) {
    // 获取基础字体大小和字体族
    const baseFontSize = fontSize.value;
    const baseFontFamily = fontFamily.value;
    
    // 为容器内的所有元素添加字体相关样式
    const allElements = container.querySelectorAll('*');
    allElements.forEach(element => {
      const tagName = element.tagName.toLowerCase();
      const currentStyle = element.getAttribute('style') || '';
      
      // 确定元素的字体大小
      const elementFontSize = calculateDynamicFontSize(tagName, baseFontSize);
      
      // 为所有元素添加字体样式
      let newStyle = currentStyle;
      
      // 添加字体大小（如果元素还没有font-size样式）
      if (!newStyle.includes('font-size:')) {
        newStyle += ` font-size: ${elementFontSize};`;
      } else {
        // 如果已有font-size，替换为计算后的值
        newStyle = newStyle.replace(/font-size:\s*[^;]+;/g, `font-size: ${elementFontSize}; `);
      }
      
      // 添加字体族（如果元素还没有font-family样式）
      if (!newStyle.includes('font-family:')) {
        newStyle += ` font-family: ${baseFontFamily};`;
      } else {
        // 如果已有font-family，替换为当前值
        newStyle = newStyle.replace(/font-family:\s*[^;]+;/g, `font-family: ${baseFontFamily}; `);
      }
      
      // 应用新的样式
      element.setAttribute('style', newStyle);
    });
    
    // 同时为容器本身设置字体样式
    container.setAttribute('style', `font-family: ${baseFontFamily}; font-size: ${baseFontSize};`);
  }

  console.log('最终的HTML:', doc.documentElement.innerHTML);

  // 7. 重新生成HTML
  inlinedHtml = '<!DOCTYPE html><html>' + doc.documentElement.innerHTML + '</html>';

  // 提取body内容部分（移除html和body标签）
  const bodyMatch = inlinedHtml.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  if (bodyMatch) {
    inlinedHtml = bodyMatch[1];
  }

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
    ElMessage.success('微信公众号兼容代码已复制到剪贴板，可直接粘贴到公众号文章编辑处');
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

// 应用CSS变量到预览容器
const applyCSSVariables = () => {
  // 更新所有匹配的预览容器
  const previewContainers = document.querySelectorAll('.preview-content');
  if (previewContainers.length === 0) return;
  
  const variables = getCurrentTemplateVariables();
  
  previewContainers.forEach(previewContainer => {
    // 应用新的CSS变量
    Object.entries(variables).forEach(([key, value]) => {
      previewContainer.style.setProperty(`--${key}`, value);
    });
    
    // 直接设置背景颜色和字体大小样式，确保生效
    previewContainer.style.backgroundColor = backgroundColor.value;
    previewContainer.style.fontSize = fontSize.value;
    previewContainer.style.fontFamily = fontFamily.value;
  });
};

// 监听主题变化
watch([selectedTemplate, selectedThemeColor, selectedBackground, backgroundColor, fontSize, fontFamily], async () => {
  nextTick(() => {
    const previewContainers = document.querySelectorAll('.preview-content');
    if (previewContainers.length === 0) return;
    
    previewContainers.forEach(previewContainer => {
      // 清除所有模板类
      previewContainer.className = previewContainer.className.replace(/template-\w+/g, '');
      previewContainer.classList.add(`template-${selectedTemplate.value}`);

      // 添加背景样式类
      previewContainer.className = previewContainer.className.replace(/background-\w+/g, '');
      previewContainer.classList.add(`background-${selectedBackground.value}`);
    });
    
    // 应用CSS变量
    applyCSSVariables();
  });
}, { deep: true });
</script>

<style scoped>
.markdown-tool-container {
  height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
}

/* 模板选择区域 */
.template-selector {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin: 8px 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.template-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
}

.control-group {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 4px;
}

.select-label {
  font-weight: 400;
  color: #3f83f8;
  white-space: nowrap;
  font-size: 13px;
}

.dropdown-color-option {
  display: flex;
  align-items: center;
  gap: 8px;
}

.color-preview {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid #dcdfe6;
}

/* 主工作区域 */
.work-area {
  display: flex;
  flex: 1;
  gap: 16px;
  padding: 0 16px 16px;
  overflow: hidden;
} 

.input-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: rgb(255, 255, 255);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height : 100%;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #eee;
}

.panel-header h3 {
  margin: 0;
  color: #303133;
  font-size: 16px;
  font-weight: 600;
}

.panel-actions {
  display: flex;
  gap: 8px;
}

.input-content {
  height: 100%;
  padding: 16px;
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

.preview-panel {
  width: 60%;
  min-width: 500px;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: 100%;
}

.code-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #eee;
}

.code-header h4 {
  margin: 0;
  color: #303133;
  font-size: 14px;
  font-weight: 600;
}

.button-group {
  display: flex;
  gap: 8px;
}

.code-content {
  flex: 1;
  padding: 16px;
}

.preview-content {
  padding: 24px;
  height: 100%;
  overflow-y: auto;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 14px;
  line-height: 1.75;
  background-color: #ffffff;
  transition: all 0.3s ease;
}

.placeholder {
  color: #909399;
  text-align: center;
  padding: 40px 0;
}

/* 响应式调整 */
@media (max-width: 1200px) {
  .work-area {
    flex-direction: column;
  }
  
  .preview-panel {
    width: 100%;
    min-width: auto;
  }
}
</style>