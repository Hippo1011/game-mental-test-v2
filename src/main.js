import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import './style.css'
import router from './router' // 导入路由配置

const app = createApp(App)

// 注册Element Plus
app.use(ElementPlus)

// 注册所有Element Plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 创建并注册Pinia状态管理
const pinia = createPinia()
app.use(pinia)

// 注册Vue Router
app.use(router)

app.mount('#app')
