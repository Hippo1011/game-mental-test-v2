<template>
  <div class="not-found-page">
    <el-card class="not-found-card">
      <div class="content">
        <el-result
          icon="error"
          title="404"
          sub-title="抱歉，您访问的页面不存在"
        >
          <template #extra>
            <el-button type="primary" @click="goHome">
              返回首页
            </el-button>
          </template>
        </el-result>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/guide')
}
</script>

<style scoped>
.not-found-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20px;
}

.not-found-card {
  max-width: 600px;
  width: 100%;
  text-align: center;
}

.content {
  padding: 40px 20px;
}
</style>