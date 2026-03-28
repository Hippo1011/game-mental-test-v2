<template>
  <div class="guide-page">
    <el-card class="guide-card" shadow="hover">
      <!-- 标题 -->
      <h1 class="title">游戏心理健康测评</h1>

      <!-- 统计数据 -->
      <div class="stats-section">
        <el-row :gutter="20" class="stats-row">
          <el-col :xs="24" :sm="8">
            <div class="stats-card">
              <div class="stats-value">40034</div>
              <div class="stats-label">总测评人数</div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="8">
            <div class="stats-card">
              <div class="stats-value">12.0</div>
              <div class="stats-label">平均游戏时长（小时）</div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="8">
            <div class="stats-card">
              <div class="stats-value">25.8</div>
              <div class="stats-label">平均参与年龄</div>
            </div>
          </el-col>
        </el-row>
      </div>

      <!-- 测评须知 -->
      <div class="notice-section">
        <h2 class="section-title">测评须知</h2>
        <el-row :gutter="20">
          <el-col :xs="24" :sm="8">
            <div class="notice-item">
              <div class="notice-icon">📄</div>
              <h3>用途</h3>
              <p>帮助您了解游戏对心理健康的影响，提供个性化建议</p>
            </div>
          </el-col>
          <el-col :xs="24" :sm="8">
            <div class="notice-item">
              <div class="notice-icon">🔒</div>
              <h3>保密</h3>
              <p>所有数据经过脱敏处理，仅用于本次测评分析</p>
            </div>
          </el-col>
          <el-col :xs="24" :sm="8">
            <div class="notice-item">
              <div class="notice-icon">🕐</div>
              <h3>时长</h3>
              <p>测评过程约需5-10分钟，请在安静环境下完成</p>
            </div>
          </el-col>
        </el-row>
      </div>

      <!-- 操作按钮 -->
      <div class="actions">
        <el-button
          type="primary"
          size="large"
          class="start-btn"
          @click="startTest"
        >
          ▶️ 开始测评
        </el-button>
        <el-button
          size="large"
          class="privacy-btn"
          @click="goToPrivacy"
        >
          ℹ️ 隐私说明
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

// 开始测评，跳转到测试页面
const startTest = () => {
  router.push('/test')
}

// 查看隐私说明，跳转到隐私页面
const goToPrivacy = () => {
  router.push('/privacy')
}
</script>

<style scoped>
.guide-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  /* 低饱和度护眼背景色 */
  background: linear-gradient(135deg, #f0f4f8 0%, #e1e8ed 100%);
  padding: 20px;
}

.guide-card {
  max-width: 800px;
  width: 100%;
  text-align: center;
  border-radius: 12px;
  /* 护眼卡片背景 */
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

.title {
  /* 深灰色标题，清晰易读 */
  color: #2c3e50;
  margin-bottom: 40px;
  font-size: 28px;
  font-weight: 600;
}

.notice-section {
  margin-bottom: 40px;
}

.section-title {
  color: #34495e;
  margin-bottom: 30px;
  font-size: 20px;
  font-weight: 500;
}

.notice-item {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  height: 100%;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.notice-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.notice-icon {
  font-size: 32px;
  margin-bottom: 10px;
  display: block;
}

.notice-item h3 {
  color: #2c3e50;
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: 600;
}

.notice-item p {
  color: #7f8c8d;
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
}

.stats-section {
    max-width: 900px;
    margin: 0 auto 30px;
  }

  .stats-row {
    margin-bottom: 24px;
  }

  .stats-card {
    background: linear-gradient(135deg, #37bfff, #5663ff);
    color: white;
    border-radius: 12px;
    padding: 18px;
    text-align: center;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }

  .stats-value {
    font-size: 34px;
    font-weight: 700;
    line-height: 1;
    margin-bottom: 6px;
  }

  .stats-label {
    font-size: 14px;
    opacity: 0.9;
  }

  .actions {
    display: flex;
    gap: 20px;
    justify-content: center;
    flex-wrap: wrap;
  }

.start-btn,
.privacy-btn {
  min-width: 160px;
  height: 48px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.start-btn {
  /* 柔和的蓝色 */
  background-color: #5dade2;
  border-color: #5dade2;
}

.start-btn:hover {
  background-color: #48c9b0;
  border-color: #48c9b0;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(93, 173, 226, 0.3);
}

.privacy-btn {
  /* 浅灰色 */
  background-color: #ecf0f1;
  border-color: #bdc3c7;
  color: #34495e;
}

.privacy-btn:hover {
  background-color: #d5dbdb;
  border-color: #a9a9a9;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .guide-card {
    margin: 10px;
  }

  .title {
    font-size: 24px;
    margin-bottom: 30px;
  }

  .actions {
    flex-direction: column;
    align-items: center;
  }

  .start-btn,
  .privacy-btn {
    width: 100%;
    max-width: 300px;
  }

  .notice-item {
    margin-bottom: 15px;
  }
}

@media (max-width: 480px) {
  .title {
    font-size: 20px;
  }

  .section-title {
    font-size: 18px;
  }

  .notice-item h3 {
    font-size: 15px;
  }

  .notice-item p {
    font-size: 13px;
  }
}
</style>