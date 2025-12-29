# 说明
本项目是将markdown转为微信和小红书图片的工具，致力于将文字动起来。

# 快速开始
下载文件
git clone xxx

安装依赖
npm install

启动项目
npm run server

# 项目详细介绍
项目使用vite作为项目管理工具，vue-router作为路由工具，element-ui作为UI组件库。

* App.vue是整个页面的入口文件，包含顶部的导航栏，中间的router-view，底部的footer。

* 所有的页面都放在src/views目录下，页面之间通过router-view进行跳转。

* 所有的组件都放在src/components目录下，组件之间通过props进行数据传递。

* router.js是路由配置文件，包含所有的路由配置。

* store.js是状态管理文件，包含所有的状态管理。

* src/api 包下是所有的接口请求文件，包含所有的接口请求。

# 核心技术点
1. 复制为微信格式时，先使用juice合并内连样式，然后使用ClipboardItem将富文本文本复制到剪切板，以便方便粘贴。