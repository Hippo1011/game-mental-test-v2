<template>
  <div class="privacy-page">
    <el-card class="privacy-card" shadow="never">
      <h1 class="title">隐私说明</h1>

      <div class="content">
        <el-alert
          title="数据处理说明"
          description="本测评系统严格保护用户隐私，所有数据处理均符合相关法律法规要求。"
          type="info"
          show-icon
          :closable="false"
          class="privacy-alert"
        />

        <section class="privacy-section">
          <h2>🔒 数据存储政策</h2>
          <p class="highlight-text">
            我们<strong>不存储</strong>任何用户原始数据。所有测评数据仅在本次会话期间临时处理，关闭页面后自动清除。
          </p>
        </section>

        <section class="privacy-section">
          <h2><el-icon class="section-icon"><Link /></el-icon> 数据使用目的</h2>
          <p>
            收集的测评数据<strong>仅用于对接后端AI模型</strong>进行心理健康分析，生成个性化测评结果和建议。
            数据不会用于其他商业用途或分享给第三方。
          </p>
        </section>

        <section class="privacy-section">
          <h2><el-icon class="section-icon"><Key /></el-icon> 脱敏处理方式</h2>
          <div class="desensitize-details">
            <p>为确保数据安全，我们采用以下脱敏处理方式：</p>
            <el-descriptions :column="1" border>
              <el-descriptions-item label="手机号">
                保留前3位和后4位，其余用*替代
              </el-descriptions-item>
              <el-descriptions-item label="身份证号">
                保留前6位和后4位，其余用*替代
              </el-descriptions-item>
              <el-descriptions-item label="邮箱地址">
                保留前2位和@后域名，其余用***替代
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </section>

        <section class="privacy-section">
          <h2><el-icon class="section-icon"><InfoFilled /></el-icon> 重要提醒</h2>
          <el-alert
            description="测评结果仅供参考，不能替代专业心理咨询。如有严重心理问题，请及时寻求专业医疗帮助。"
            type="warning"
            show-icon
            :closable="false"
          />
        </section>
      </div>

      <div class="actions">
        <el-button size="large" @click="goHome" class="home-btn">
          <el-icon><HomeFilled /></el-icon>
          返回首页
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { Link, Key, InfoFilled, HomeFilled } from '@element-plus/icons-vue'

const router = useRouter()

// 返回首页
const goHome = () => {
  router.push('/guide')
}
</script>

<style scoped>
.privacy-page {
  min-height: 100vh;
  background: #fafbfc;
  padding: 20px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.privacy-card {
  max-width: 900px;
  width: 100%;
  border-radius: 8px;
  background: #ffffff;
}

.title {
  text-align: center;
  margin-bottom: 30px;
  color: #1a1a1a;
  font-size: 24px;
  font-weight: 600;
}

.content {
  margin-bottom: 40px;
}

.privacy-alert {
  margin-bottom: 30px;
}

.privacy-section {
  margin-bottom: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 6px;
  border-left: 4px solid #5dade2;
}

.privacy-section h2 {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  color: #2c3e50;
  font-size: 18px;
  font-weight: 600;
}

.section-icon {
  margin-right: 8px;
  color: #5dade2;
}

.highlight-text {
  font-size: 16px;
  line-height: 1.6;
  color: #e74c3c;
  font-weight: 500;
}

.desensitize-details {
  margin-top: 10px;
}

.desensitize-details p {
  margin-bottom: 15px;
  color: #34495e;
  font-size: 14px;
}

.actions {
  display: flex;
  justify-content: center;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
}

.home-btn {
  min-width: 140px;
  height: 44px;
  font-size: 16px;
  background-color: #5dade2;
  border-color: #5dade2;
  transition: all 0.3s ease;
}

.home-btn:hover {
  background-color: #48c9b0;
  border-color: #48c9b0;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(93, 173, 226, 0.3);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .privacy-page {
    padding: 10px;
  }

  .privacy-card {
    margin: 0;
  }

  .title {
    font-size: 20px;
    margin-bottom: 20px;
  }

  .privacy-section {
    padding: 15px;
    margin-bottom: 20px;
  }

  .privacy-section h2 {
    font-size: 16px;
  }

  .highlight-text {
    font-size: 15px;
  }

  .home-btn {
    width: 100%;
    max-width: 300px;
  }
}

@media (max-width: 480px) {
  .privacy-section {
    padding: 12px;
  }

  .privacy-section h2 {
    font-size: 15px;
    flex-direction: column;
    align-items: flex-start;
  }

  .section-icon {
    margin-right: 0;
    margin-bottom: 5px;
  }
}
</style>