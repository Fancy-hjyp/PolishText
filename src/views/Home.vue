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
          <el-tab-pane label="预览" name="preview" style="height: 100%;">
            <div class="preview-content" :class="{ [`template-${selectedTemplate}`]: true, [`background-${selectedBackground}`]: true }" ref="previewContainerRef" v-html="renderedHtml">
            </div>
          </el-tab-pane>
          
          <el-tab-pane label="微信公众号" name="code">
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
                    复制微信公众号内容
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
          
          <!-- 新增图片分割tab -->
          <el-tab-pane label="小红书图片" name="image" style="height: 100%;">
            <div class="image-panel">
              <div class="image-header">
                <h4>图片分割预览</h4>
                <div class="button-group">
                  <!-- 卡片尺寸选择 -->
                  <div class="card-size-control">
                    <span class="select-label" style="margin-right: 8px;">卡片尺寸:</span>
                    <el-select 
                      v-model="cardSize" 
                      placeholder="卡片尺寸"
                      size="small"
                      style="width: 140px; margin-right: 12px;"
                      @change="handleCardSizeChange"
                    >
                      <el-option
                        v-for="size in cardSizeOptions"
                        :key="size.value"
                        :label="size.name"
                        :value="size.value"
                      />
                    </el-select>
                  </div>
                  
                  <el-button 
                    size="small" 
                    type="primary"
                    @click="downloadAllImages"
                    :icon="Download"
                  >
                    下载全部图片
                  </el-button>
                </div>
              </div>
              
              <div class="image-content">
                <div 
                  v-for="(imageDiv, index) in imageDivs" 
                  :key="index"
                  class="image-section"
                  :style="{ width: cardWidth + 'px', height: cardHeight + 'px' }"
                  :ref="el => { if (el) imageDivRefs[index] = el }"
                >
                  <div 
                    :class="{ [`template-${selectedTemplate}`]: true, [`background-${selectedBackground}`]: true }"
                    :style="{ width: cardWidth + 'px', height: cardHeight + 'px' }"
                    v-html="imageDiv"
                  ></div>
                </div>
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
import { toPng, toJpeg, toBlob } from 'html-to-image/lib/index.js'
import JSZip from 'jszip'

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
  { name: '默认', value: 'default' },
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
const selectedBackground = ref('default')
const backgroundColor = ref('#ffffff')  // 默认白色背景
const fontSize = ref('12px')  // 默认字体大小
const fontFamily = ref('-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif')  // 默认字体类型

// 图片分割相关状态
const imageDivs = ref([])
const imageDivRefs = ref([])

// 卡片尺寸相关状态
const cardSize = ref('3_4') // 默认3:4比例（适合小红书帖子）
const cardSizeOptions = [
  { name: '3:4 (小红书帖子)', value: '3_4', width: 400, height: 586 },
  { name: '3:5 (小红书封面)', value: '3_5', width: 400, height: 733 },
  { name: '9:16 (手机海报)', value: '9_16', width: 400, height: 782 },
  { name: '4:3 (横屏)', value: '4_3', width: 533, height: 400 },
]

// 计算卡片宽度和高度
const cardWidth = computed(() => {
  const sizeOption = cardSizeOptions.find(option => option.value === cardSize.value)
  return sizeOption ? sizeOption.width : 600
})

const cardHeight = computed(() => {
  const sizeOption = cardSizeOptions.find(option => option.value === cardSize.value)
  return sizeOption ? sizeOption.height : 800
})

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
  if (activeTab.value === 'image') {
    splitContentForImages()
  }
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

// 处理卡片尺寸变化
const handleCardSizeChange = (value) => {
  cardSize.value = value
  console.log('切换到卡片尺寸:', value)
  
  // 当卡片尺寸改变时，重新拆分内容
  if (activeTab.value === 'image') {
    splitContentForImages()
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

// 将内容拆分为适合图片的片段
const splitContentForImages = async () => {
  if (!markdownInput.value.trim()) {
    imageDivs.value = []
    return
  }

  // 渲染完整的HTML内容
  const fullHtml = md.render(markdownInput.value)
  
  // 创建临时容器来处理内容
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = fullHtml
  tempDiv.style.position = 'absolute'
  tempDiv.style.left = '-9999px'
  tempDiv.style.width = `${cardWidth.value}px` // 使用动态卡片宽度
  tempDiv.style.overflow = 'hidden'
  document.body.appendChild(tempDiv)
  
  // 等待DOM渲染完成
  await nextTick()
  
  // 创建一个测试容器，用于测量高度
  const testContainer = document.createElement('div')
  testContainer.style.width = `${cardWidth.value}px`
  testContainer.style.height = `${cardHeight.value}px`
  // testContainer.style.padding = '24px' // 与预览区域的padding一致
  testContainer.style.boxSizing = 'border-box'
  testContainer.style.fontFamily = fontFamily.value  // 添加字体族设置
  testContainer.style.fontSize = fontSize.value  // 添加字体大小设置
  testContainer.style.lineHeight = '1.75'
  testContainer.className = `template-${selectedTemplate.value} background-${selectedBackground.value}`
  console.log('测试容器类名:', testContainer.className)
  document.body.appendChild(testContainer)
  
  // 获取应用了CSS变量的样式
  const variables = getCurrentTemplateVariables()

  // 应用新的CSS变量
  Object.entries(variables).forEach(([key, value]) => {
    testContainer.style.setProperty(`--${key}`, value);
    console.log(`设置CSS变量 --${key}: ${value}`)
  });
  
  // 直接设置背景颜色和字体大小样式，确保生效
  testContainer.style.backgroundColor = backgroundColor.value;
  // testContainer.style.fontSize = fontSize.value;  // 这行已经设置了，上面
  // testContainer.style.fontFamily = fontFamily.value;  // 这行已经设置了，上面
  
  // 拆分内容的逻辑
  const parts = []
  const children = Array.from(tempDiv.children)
  
  // 如果没有子元素，直接处理完整HTML
  if (children.length === 0) {
    testContainer.innerHTML = fullHtml
    if (testContainer.scrollHeight <= cardHeight.value - 10) {
      parts.push(createStyledContent(fullHtml, testContainer))  // 使用测试容器的样式创建内容
    } else {
      // 如果完整内容超出高度，尝试拆分文本
      const textContent = tempDiv.textContent || tempDiv.innerText || fullHtml
      const textParts = splitTextIntoParts(textContent, fullHtml, testContainer)
      // 对所有文本部分应用测试容器的样式
      parts.push(...textParts.map(part => createStyledContent(part, testContainer)))
    }
  } else {
    // 有多个子元素，逐个处理
    let currentPartContent = ''
    
    for (const child of children) {
      // 先添加当前子元素到当前部分
      const testContent = currentPartContent ? currentPartContent + child.outerHTML : child.outerHTML
      testContainer.innerHTML = testContent
      
      if (testContainer.scrollHeight > cardHeight.value) {
        // 如果超出高度，先保存当前部分（如果有的话）
        if (currentPartContent) {
          parts.push(createStyledContent(currentPartContent, testContainer))  // 使用测试容器的样式
        }
        
        // 测试单个元素是否超出高度
        const elementContent = child.outerHTML
        testContainer.innerHTML = elementContent
        
        if (testContainer.scrollHeight > cardHeight.value) {
          // 拆分这个单独的元素
          const elementParts = splitElementContent(child, testContainer)
          // 对所有元素部分应用测试容器的样式
          parts.push(...elementParts.map(part => createStyledContent(part, testContainer)))
          currentPartContent = ''
        } else {
          // 单个元素未超出高度，作为新部分的开始
          currentPartContent = elementContent
        }
      } else {
        // 没有超出高度，更新当前部分
        currentPartContent = testContent
      }
    }
    
    // 添加最后剩余的内容（如果有的话）
    if (currentPartContent) {
      parts.push(createStyledContent(currentPartContent, testContainer))  // 使用测试容器的样式
    }
  }
  
  // 清理临时元素
  document.body.removeChild(tempDiv)
  document.body.removeChild(testContainer)
  
  imageDivs.value = parts
}

// 创建带样式的HTML内容
const createStyledContent = (htmlContent, referenceContainer) => {
  // 创建一个临时div来处理HTML内容
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;
  
  // 将参考容器的CSS变量应用到tempDiv
  const computedStyle = getComputedStyle(referenceContainer);
  const cssVars = {};
  
  // 获取参考容器的所有CSS变量
  for (let prop of computedStyle) {
    if (prop.startsWith('--')) {
      cssVars[prop] = computedStyle.getPropertyValue(prop);
    }
  }
  
  // 将CSS变量应用到tempDiv的所有子元素
  const allElements = tempDiv.querySelectorAll('*');
  allElements.forEach(element => {
    // 应用CSS变量到每个元素
    Object.entries(cssVars).forEach(([key, value]) => {
      element.style.setProperty(key, value);
    });
    
    // 确保字体和颜色样式被应用
    if (!element.style.fontFamily && referenceContainer.style.fontFamily) {
      element.style.fontFamily = referenceContainer.style.fontFamily;
    }
    if (!element.style.fontSize && referenceContainer.style.fontSize) {
      element.style.fontSize = referenceContainer.style.fontSize;
    }
    if (!element.style.lineHeight && referenceContainer.style.lineHeight) {
      element.style.lineHeight = referenceContainer.style.lineHeight;
    }
  });
  
  // 返回修改后的内容，而不是外层div
  return tempDiv.innerHTML;
}

// 拆分单个元素的内容
const splitElementContent = (element, testContainer) => {
  const parts = []
  
  // 如果元素是文本节点或简单文本，直接处理
  if (element.children.length === 0) {
    const elementContent = element.outerHTML
    testContainer.innerHTML = elementContent
    
    if (testContainer.scrollHeight <= cardHeight.value) {
      return [elementContent]
    }
    
    // 拆分文本内容
    const textContent = element.textContent || element.innerText
    return splitTextIntoParts(textContent, elementContent, testContainer)
  }
  
  // 如果元素有子元素，尝试按子元素拆分
  const childElements = Array.from(element.children)
  if (childElements.length === 0) {
    return [element.outerHTML]
  }
  
  let currentPartElement = element.cloneNode(false) // 不复制子节点
  
  for (const child of childElements) {
    const testElement = currentPartElement.cloneNode(false)
    if (currentPartElement.children.length > 0) {
      for (const childNode of currentPartElement.children) {
        testElement.appendChild(childNode.cloneNode(true))
      }
    }
    testElement.appendChild(child.cloneNode(true))
    
    // 测试高度
    testContainer.innerHTML = testElement.outerHTML
    
    if (testContainer.scrollHeight > cardHeight.value) {
      // 如果当前部分有内容，先保存
      if (currentPartElement.children.length > 0) {
        parts.push(currentPartElement.outerHTML)
      }
      
      // 重置当前部分
      currentPartElement = element.cloneNode(false)
      currentPartElement.appendChild(child.cloneNode(true))
      
      // 再次测试，如果单个子元素就超出高度
      testContainer.innerHTML = currentPartElement.outerHTML
      if (testContainer.scrollHeight > cardHeight.value) {
        // 递归拆分这个子元素
        const nodeParts = splitElementContent(child, testContainer)
        parts.push(...nodeParts)
        currentPartElement = element.cloneNode(false) // 重置
      }
    } else {
      // 没有超出高度，更新当前部分
      currentPartElement.appendChild(child.cloneNode(true))
    }
  }
  
  // 添加最后剩余的内容
  if (currentPartElement.children.length > 0) {
    parts.push(currentPartElement.outerHTML)
  }
  
  return parts
}

// 拆分文本内容到多个部分
const splitTextIntoParts = (textContent, originalHtml, testContainer) => {
  const parts = []
  
  // 尝试按段落拆分
  const paragraphs = textContent.split('\n').filter(p => p.trim() !== '')
  
  if (paragraphs.length <= 1) {
    // 如果只有一段文本，按句子拆分
    const sentences = textContent.replace(/([。！？.!?])/g, '$1|').split('|').filter(s => s.trim() !== '')
    let currentPart = ''
    
    for (const sentence of sentences) {
      const testPart = currentPart + sentence
      testContainer.innerHTML = `<div class="template-${selectedTemplate.value} background-${selectedBackground.value}" style="padding:24px;font-family:${fontFamily.value};font-size:${fontSize.value};line-height:1.75;">${testPart}</div>`
      
      if (testContainer.scrollHeight > cardHeight.value && currentPart) {
        parts.push(currentPart)
        currentPart = sentence
      } else {
        currentPart = testPart
      }
    }
    
    if (currentPart.trim()) {
      parts.push(currentPart)
    }
  } else {
    // 按段落拆分
    let currentPart = ''
    
    for (const paragraph of paragraphs) {
      const testPart = currentPart + '<p>' + paragraph + '</p>'
      testContainer.innerHTML = `<div class="template-${selectedTemplate.value} background-${selectedBackground.value}" style="padding:24px;font-family:${fontFamily.value};font-size:${fontSize.value};line-height:1.75;">${testPart}</div>`
      
      if (testContainer.scrollHeight > cardHeight.value && currentPart) {
        parts.push(currentPart)
        currentPart = '<p>' + paragraph + '</p>'
      } else {
        currentPart = testPart
      }
    }
    
    if (currentPart.trim()) {
      parts.push(currentPart)
    }
  }
  
  return parts
}

splitContentForImages()

// 下载所有图片
const downloadAllImages = async () => {
  if (imageDivs.value.length === 0) {
    ElMessage.warning('没有可下载的图片')
    return
  }
  
  // 创建一个JSZip实例
  const zip = new JSZip();
  
  // 显示处理进度
  ElMessage.info(`正在生成 ${imageDivs.value.length} 张图片...`)
  
  // 逐个将div转换为图片并添加到zip中
  for (let i = 0; i < imageDivRefs.value.length; i++) {
    const divRef = imageDivRefs.value[i]
    if (divRef) {
      try {
        // 使用toPng生成图片
        const dataUrl = await toPng(divRef, { cacheBust: true })
        
        // 将data URL转换为blob
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        
        // 将图片添加到zip中，按顺序命名
        zip.file(`markdown-section-${String(i+1).padStart(2, '0')}.png`, blob);
      } catch (error) {
        console.error('生成图片失败:', error)
        ElMessage.error(`第${i+1}张图片生成失败`)
      }
    }
  }
  
  // 生成zip文件并下载
  try {
    const zipBlob = await zip.generateAsync({ type: "blob" });
    
    // 创建下载链接
    const link = document.createElement('a');
    link.download = `markdown-images-${new Date().getTime()}.zip`;
    link.href = URL.createObjectURL(zipBlob);
    link.click();
    
    ElMessage.success(`图片打包下载完成，共${imageDivs.value.length}张图片`)
  } catch (error) {
    console.error('生成zip文件失败:', error)
    ElMessage.error('生成zip文件失败')
  }
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

    if (activeTab.value === 'image') {
      splitContentForImages()
    }
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

/* 图片分割面板样式 */
.image-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
}

.image-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #eee;
}

.image-header h4 {
  margin: 0;
  color: #303133;
  font-size: 14px;
  font-weight: 600;
}

.button-group {
  display: flex;
  gap: 8px;
  align-items: center;
}

.card-size-control {
  display: flex;
  align-items: center;
}

.image-content {
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.image-section {
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.image-preview {
  padding: 24px;
  background-color: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 14px;
  line-height: 1.75;
  box-sizing: border-box;
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