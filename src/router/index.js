import { createRouter, createWebHistory } from 'vue-router'

// 路由配置
const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Guide.vue'), // 临时直接显示引导页
    meta: { title: '游戏心理测评 - 引导页' },
  },
  {
    path: '/guide',
    redirect: '/', // 重定向到根路径
  },
  {
    path: '/test',
    name: 'Test',
    component: () => import('@/views/TestForm/index.vue'), // 新的多步骤表单
    meta: { title: '游戏心理测评 - 综合测评' },
  },
  {
    path: '/result',
    name: 'Result',
    component: () => import('@/views/Result.vue'), // 懒加载结果页组件
    meta: { title: '游戏心理测评 - 结果页' },
  },
  {
    path: '/privacy',
    name: 'Privacy',
    component: () => import('@/views/Privacy.vue'), // 懒加载隐私页组件
    meta: { title: '游戏心理测评 - 隐私政策' },
  },
  // 404页面（可选）
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: { title: '页面未找到' },
  },
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(), // 使用HTML5历史模式
  routes,
})

// 路由守卫：设置页面标题
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

export default router