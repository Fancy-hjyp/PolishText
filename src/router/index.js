import { createRouter, createWebHistory } from 'vue-router'
import HomeLanding from '../views/landing/HomeLanding.vue'
import Home from '../views/Home.vue'

// Create router instance
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeLanding,
      meta: {
        title: 'PolishText - 优雅的Markdown转换工具'
      }
    },
    {
      path: '/editor',
      name: 'editor',
      component: Home,
      meta: {
        title: '编辑器 - PolishText'
      }
    },
    {
      // Catch all unmatched routes and redirect to home
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ],
  // Scroll behavior configuration
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      // 如果有保存的滚动位置，恢复到该位置
      return savedPosition
    } else {
      // 否则滚动到顶部
      return { top: 0 }
    }
  }
})

// Router navigation guard for setting page titles
router.beforeEach((to, from, next) => {
  // Set page title
  document.title = to.meta.title || ''
  next()
})

export default router