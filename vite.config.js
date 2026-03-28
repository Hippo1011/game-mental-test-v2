import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // 自动导入Element Plus组件和图标
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  // 依赖优化配置
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia', 'element-plus', 'echarts'],
    exclude: ['@element-plus/icons-vue']
  },
  // 路径别名配置
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@api': resolve(__dirname, 'src/api'),
      '@components': resolve(__dirname, 'src/components'),
      '@views': resolve(__dirname, 'src/views'),
      '@store': resolve(__dirname, 'src/store'),
      '@utils': resolve(__dirname, 'src/utils'),
    },
  },
  // 构建优化
  build: {
    // 启用代码分割
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // 将Element Plus单独打包
          if (id.includes('element-plus')) {
            return 'element-plus'
          }
          // 将Vue相关库单独打包
          if (id.includes('vue') || id.includes('vue-router') || id.includes('pinia')) {
            return 'vue-vendor'
          }
        },
      },
    },
    // 压缩代码
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // 移除console.log
        drop_debugger: true, // 移除debugger
      },
    },
    // 启用gzip压缩
    reportCompressedSize: false, // 关闭报告压缩大小以提升构建速度
  },
  // 开发服务器配置
  server: {
    host: '0.0.0.0',
    port: 3000,
    open: true,
    // 允许 cpolar 公网域名访问
    allowedHosts: ['7239f37.r32.cpolar.top', '0.0.0.0', 'localhost'],
    fs: {
      strict: false
    },
    // 热重载配置
    hmr: {
      overlay: false // 禁用错误覆盖层
    }
  },
})
