<template>
  <div class="form-page">
    <el-card class="form-card">
      <div class="header">
        <h2>心理测评表单</h2>
        <el-progress :percentage="progress" :show-text="false" class="progress-bar" />
        <span class="step-info">步骤 {{ currentStep }} / {{ totalSteps }}</span>
      </div>

      <!-- 用户基本信息步骤 -->
      <div v-if="currentStep === 1" class="step-content">
        <h3>基本信息</h3>
        <el-form :model="userInfo" label-width="80px">
          <el-form-item label="姓名">
            <el-input v-model="userInfo.name" placeholder="请输入您的姓名" />
          </el-form-item>
          <el-form-item label="年龄">
            <el-input-number
              v-model="userInfo.age"
              :min="1"
              :max="120"
              placeholder="请输入您的年龄"
            />
          </el-form-item>
          <el-form-item label="性别">
            <el-radio-group v-model="userInfo.gender">
              <el-radio label="male">男</el-radio>
              <el-radio label="female">女</el-radio>
              <el-radio label="other">其他</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>

      <!-- 测评问题步骤 -->
      <div v-else class="step-content">
        <h3>问题 {{ currentStep - 1 }}</h3>
        <p class="question-text">{{ currentQuestion }}</p>
        <el-radio-group v-model="currentAnswer" class="answer-options">
          <el-radio
            v-for="option in answerOptions"
            :key="option.value"
            :label="option.value"
            class="answer-option"
          >
            {{ option.label }}
          </el-radio>
        </el-radio-group>
      </div>

      <div class="actions">
        <el-button
          v-if="currentStep > 1"
          @click="prevStep"
          :disabled="loading"
        >
          上一步
        </el-button>
        <el-button
          type="primary"
          @click="nextStep"
          :loading="loading"
          :disabled="!canProceed"
        >
          {{ currentStep === totalSteps ? '完成测评' : '下一步' }}
        </el-button>
        <!-- 测试按钮：仅开发环境显示 -->
        <el-button
          v-if="isDev"
          type="warning"
          size="small"
          @click="testJumpToResult"
          style="margin-left: 10px;"
        >
          测试跳转结果页
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useTestStore } from '@/store/testStore'
import { ElMessage } from 'element-plus'

const router = useRouter()
const testStore = useTestStore()

const loading = ref(false)
const currentAnswer = ref(null)

// 问题列表（示例）
const questions = [
  '您平均每天玩游戏的时间是多少？',
  '您是否经常因为游戏而影响工作或学习？',
  '当无法玩游戏时，您是否感到焦虑或烦躁？',
  '您是否尝试过减少游戏时间但失败了？',
  '游戏是否影响了您的社交生活？',
  '您是否因为游戏而忽略了个人卫生或饮食？',
  '当现实生活不如意时，您是否更倾向于通过游戏逃避？',
  '您是否曾经因为游戏而产生经济问题？',
  '游戏是否让您感到快乐和满足？',
]

// 答案选项
const answerOptions = [
  { value: 1, label: '完全不符合' },
  { value: 2, label: '不太符合' },
  { value: 3, label: '一般' },
  { value: 4, label: '比较符合' },
  { value: 5, label: '完全符合' },
]

// 计算属性
const currentStep = computed(() => testStore.currentStep)
const totalSteps = computed(() => testStore.totalSteps)
const progress = computed(() => testStore.progress)
const userInfo = computed(() => testStore.formData.userInfo)
const currentQuestion = computed(() => questions[currentStep.value - 2] || '')

// 是否可以继续
const canProceed = computed(() => {
  if (currentStep.value === 1) {
    return userInfo.value.name && userInfo.value.age && userInfo.value.gender
  } else {
    return currentAnswer.value !== null
  }
})

// 是否是开发环境
const isDev = computed(() => import.meta.env.DEV)

// 监听步骤变化，更新当前答案
watch(currentStep, (newStep) => {
  if (newStep > 1) {
    const questionId = `q${newStep - 1}`
    currentAnswer.value = testStore.formData.answers[questionId] || null
  }
}, { immediate: true })

// 上一步
const prevStep = () => {
  testStore.prevStep()
}

// 下一步
const nextStep = async () => {
  loading.value = true

  try {
    if (currentStep.value === 1) {
      // 保存用户信息
      testStore.updateUserInfo(userInfo.value)
    } else {
      // 保存答案
      const questionId = `q${currentStep.value - 1}`
      testStore.updateAnswer(questionId, currentAnswer.value)
    }

    if (currentStep.value === totalSteps.value) {
      console.log('=== 测评完成检查 ===')
      console.log('currentStep:', currentStep.value)
      console.log('totalSteps:', totalSteps.value)
      console.log('是否相等:', currentStep.value === totalSteps.value)

      // 完成测评
      console.log('完成测评，开始计算结果...')
      testStore.calculateResult()
      console.log('结果计算完成:', testStore.testResult)

      // 等待状态更新
      await nextTick()

      ElMessage.success('测评完成！')

      // 使用nextTick确保DOM更新后再跳转
      await nextTick()
      console.log('准备跳转到结果页面...')
      console.log('当前路由:', router.currentRoute.value.path)
      console.log('跳转前testResult:', testStore.testResult)

      try {
        const result = await router.push('/result')
        console.log('跳转成功，当前路由:', router.currentRoute.value.path)
        console.log('router.push结果:', result)
      } catch (error) {
        console.error('路由跳转失败:', error)
        ElMessage.error('跳转失败，请手动刷新页面')
      }
    } else {
      // 进入下一步
      testStore.nextStep()
      currentAnswer.value = null
    }
  } catch (error) {
    ElMessage.error('保存失败，请重试')
    console.error('保存数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 测试跳转到结果页面
const testJumpToResult = async () => {
  console.log('=== 测试跳转开始 ===')
  console.log('设置测试数据...')

  // 设置一些测试数据
  testStore.updateUserInfo({
    name: '测试用户',
    age: 25,
    gender: 'male'
  })

  // 设置一些测试答案
  for (let i = 1; i <= 9; i++) {
    testStore.updateAnswer(`q${i}`, 3) // 中等分数
  }

  // 计算结果
  testStore.calculateResult()
  console.log('测试数据设置完成，testResult:', testStore.testResult)

  // 等待状态更新
  await nextTick()

  console.log('开始跳转...')
  console.log('当前路由:', router.currentRoute.value.path)

  try {
    const result = await router.push('/result')
    console.log('跳转成功！')
    console.log('新路由:', router.currentRoute.value.path)
    console.log('router.push结果:', result)
  } catch (error) {
    console.error('测试跳转失败:', error)
    ElMessage.error('测试跳转失败')
  }
}
</script>

<style scoped>
.form-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20px;
}

.form-card {
  max-width: 800px;
  margin: 0 auto;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.header h2 {
  margin-bottom: 20px;
  color: #333;
}

.progress-bar {
  margin-bottom: 10px;
}

.step-info {
  font-size: 14px;
  color: #666;
}

.step-content {
  margin-bottom: 30px;
}

.step-content h3 {
  margin-bottom: 20px;
  color: #333;
}

.question-text {
  font-size: 18px;
  line-height: 1.6;
  margin-bottom: 20px;
  color: #333;
}

.answer-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.answer-option {
  margin: 0;
}

.actions {
  display: flex;
  justify-content: space-between;
}

@media (max-width: 768px) {
  .actions {
    flex-direction: column;
    gap: 10px;
  }

  .actions .el-button {
    width: 100%;
  }
}
</style>