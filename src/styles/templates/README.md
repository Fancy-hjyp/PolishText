# 模板样式文件说明

本目录包含Markdown转HTML工具的所有模板样式文件，采用模块化设计，每个模板独立成文件。

## 文件结构

```
templates/
├── README.md       # 本说明文件
├── index.css       # 入口文件（可选）
├── default.css     # 默认模板样式
├── github.css      # GitHub风格模板样式
├── clean.css       # 简洁风格模板样式
├── academic.css    # 学术风格模板样式
├── blog.css        # 博客风格模板样式
└── tengxun.css     # 腾讯风格模板样式
```

## 模板样式类

每个模板文件都定义了以下CSS类：

- `.template-default` - 默认样式模板
- `.template-github` - GitHub风格模板
- `.template-clean` - 简洁风格模板
- `.template-academic` - 学术风格模板
- `.template-blog` - 博客风格模板

## 使用方式

### 1. 直接导入单个模板

如果只需要某个特定模板，可以直接导入对应的CSS文件：

```css
@import './templates/default.css';
```

### 2. 导入所有模板

使用主入口文件导入所有模板：

```css
@import '../styles/templates/index.css';
```

## 添加新模板

添加新模板的步骤：

1. 在`templates/`目录下创建新的CSS文件，如`custom.css`
2. 定义`.template-custom`样式类
3. 在`index.css`中添加导入语句：
   ```css
   @import './custom.css';
   ```
4. 在Vue组件的模板配置中添加新选项：
   ```js
   const templates = [
     { id: 'default', name: '默认样式' },
     { id: 'github', name: 'GitHub风格' },
     { id: 'clean', name: '简洁风格' },
     { id: 'academic', name: '学术风格' },
     { id: 'blog', name: '博客风格' },
     { id: 'custom', name: '自定义样式' } // 新增
   ]
   ```

## 样式覆盖

如果需要覆盖某个模板的特定样式，可以在组件的`<style scoped>`部分或全局CSS中进行：

```css
/* 覆盖默认模板的标题颜色 */
.template-default h1,
.template-default h2,
.template-default h3 {
  color: #your-color;
}
```

## 优势

- **模块化**：每个模板独立文件，便于维护和修改
- **可扩展**：添加新模板只需新增文件，无需修改现有代码
- **按需加载**：可以根据需要导入特定模板，减少CSS体积
- **版本控制**：每个模板的修改历史更加清晰
- **团队协作**：不同开发者可以负责不同模板的维护