<template>
  <div class="test-form-container">
    <!-- 页面头部 -->
    <div class="form-header">
      <h1 class="form-title">游戏心理健康综合测评</h1>
      <p class="form-description">
        本测评将帮助您全面了解自身的心理健康状况，请认真填写各项信息
      </p>
    </div>

    <!-- 进度条 -->
    <div class="progress-section">
      <el-progress
        :percentage="progress"
        :show-text="false"
        :stroke-width="12"
        class="main-progress"
      />
      <div class="progress-info">
        <span class="current-step">步骤 {{ currentStep }} / {{ totalSteps }}</span>
        <span class="progress-text">{{ progress }}% 完成</span>
      </div>

      <!-- 步骤指示器 -->
      <div class="step-indicators">
        <div
          v-for="step in totalSteps"
          :key="step"
          class="step-indicator"
          :class="{
            'active': step === currentStep,
            'completed': step < currentStep,
            'pending': step > currentStep
          }"
          @click="goToStep(step)"
        >
          <div class="step-number">{{ step }}</div>
          <div class="step-label">{{ stepLabels[step - 1] }}</div>
        </div>
      </div>
    </div>

    <!-- 表单内容区域 -->
    <div class="form-content">
      <!-- 步骤1：基础信息 -->
      <Step1
        v-if="currentStep === 1"
        ref="currentStepRef"
        class="step-component"
      />

      <!-- 步骤2：游戏行为数据 -->
      <Step2
        v-else-if="currentStep === 2"
        ref="currentStepRef"
        class="step-component"
      />

      <!-- 步骤3：生活习惯 -->
      <Step3
        v-else-if="currentStep === 3"
        ref="currentStepRef"
        class="step-component"
      />

      <!-- 步骤4：社交学业 -->
      <Step4
        v-else-if="currentStep === 4"
        ref="currentStepRef"
        class="step-component"
      />

      <!-- 步骤5：体感生理 -->
      <Step5
        v-else-if="currentStep === 5"
        ref="currentStepRef"
        class="step-component"
      />
    </div>

    <!-- 操作按钮 -->
    <div class="form-actions">
      <div class="action-buttons">
        <!-- 上一步按钮 -->
        <el-button
          v-if="currentStep > 1"
          @click="handlePrevStep"
          :disabled="loading"
          size="large"
        >
          <el-icon><ArrowLeft /></el-icon>
          上一步
        </el-button>

        <!-- 下一步按钮 -->
        <el-button
          v-if="currentStep < totalSteps"
          type="primary"
          @click="handleNextStep"
          :loading="loading"
          size="large"
        >
          下一步
          <el-icon><ArrowRight /></el-icon>
        </el-button>

        <!-- 提交按钮 -->
        <el-button
          v-else
          type="success"
          @click="handleSubmit"
          :loading="submitting"
          size="large"
        >
          <el-icon><Check /></el-icon>
          提交测评
        </el-button>
      </div>

      <!-- 提示信息 -->
      <div class="action-tips">
        <el-alert
          v-if="validationErrors.length > 0"
          title="请检查以下必填项："
          :description="validationErrors.join('、')"
          type="warning"
          :closable="false"
          show-icon
        />
        <el-alert
          v-else-if="currentStep === totalSteps"
          title="温馨提示"
          description="提交后将生成您的个性化心理健康报告"
          type="info"
          :closable="false"
          show-icon
        />
      </div>
    </div>

    <!-- 数据保存提示 -->
    <div class="save-indicator">
      <el-icon class="save-icon"><Check /></el-icon>
      <span>数据已自动保存</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useTestFormStore } from '@/store/testFormStore'
import Step1 from './Step1.vue'
import Step2 from './Step2.vue'
import Step3 from './Step3.vue'
import Step4 from './Step4.vue'
import Step5 from './Step5.vue'
import {
  ArrowLeft,
  ArrowRight,
  Check
} from '@element-plus/icons-vue'

// Router和Store
const router = useRouter()
const testFormStore = useTestFormStore()

// 响应式数据
const loading = ref(false)
const submitting = ref(false)
const currentStepRef = ref(null)
const validationErrors = ref([])

// 计算属性
const currentStep = computed(() => testFormStore.currentStep)
const totalSteps = computed(() => testFormStore.totalSteps)
const progress = computed(() => testFormStore.progress)

// 步骤标签
const stepLabels = [
  '基础信息',
  '游戏行为',
  '生活习惯',
  '社交学业',
  '体感生理'
]

// 监听步骤变化，清除验证错误
watch(currentStep, () => {
  validationErrors.value = []
})

// 处理下一步
const handleNextStep = async () => {
  loading.value = true
  validationErrors.value = []

  try {
    // 验证当前步骤
    const isValid = await validateCurrentStep()

    if (!isValid) {
      // 显示验证错误
      const validationStatus = testFormStore.getValidationStatus()
      const currentStepKey = `step${currentStep.value}`
      const requiredFields = getRequiredFields(currentStepKey)

      const errors = []
      requiredFields.forEach(field => {
        if (!isFieldValid(currentStepKey, field)) {
          errors.push(getFieldLabel(field))
        }
      })

      validationErrors.value = errors

      ElMessage.warning('请填写所有必填项')
      return
    }

    // 进入下一步
    testFormStore.nextStep()
    await nextTick()

    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' })

  } catch (error) {
    console.error('下一步操作失败:', error)
    ElMessage.error('操作失败，请重试')
  } finally {
    loading.value = false
  }
}

// 处理上一步
const handlePrevStep = () => {
  testFormStore.prevStep()
  validationErrors.value = []

  // 滚动到顶部
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 跳转到指定步骤
const goToStep = async (step) => {
  // 检查是否可以跳转（前面的步骤必须已完成）
  const validationStatus = testFormStore.getValidationStatus()

  for (let i = 1; i < step; i++) {
    const stepKey = `step${i}`
    if (!validationStatus[stepKey]) {
      ElMessage.warning(`请先完成第${i}步`)
      return
    }
  }

  testFormStore.goToStep(step)
  validationErrors.value = []

  // 滚动到顶部
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 处理表单提交
const handleSubmit = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要提交测评吗？提交后将生成心理健康报告。',
      '提交确认',
      {
        confirmButtonText: '确定提交',
        cancelButtonText: '再检查一下',
        type: 'info',
      }
    )

    submitting.value = true

    // 最后验证一次
    const isValid = await validateCurrentStep()
    if (!isValid) {
      ElMessage.error('请填写所有必填项')
      return
    }

    // 提交表单
    const result = await testFormStore.submitForm()

    if (result.success) {
      ElMessage.success(result.message)

      // 跳转到结果页面
      setTimeout(() => {
        router.push('/result')
      }, 1500)
    } else {
      ElMessage.error(result.message)
    }

  } catch (error) {
    if (error !== 'cancel') {
      console.error('提交失败:', error)
      ElMessage.error('提交失败，请重试')
    }
  } finally {
    submitting.value = false
  }
}

// 验证当前步骤
const validateCurrentStep = async () => {
  if (currentStepRef.value && currentStepRef.value.validate) {
    try {
      await currentStepRef.value.validate()
      return true
    } catch (error) {
      return false
    }
  }
  return true
}

// 获取必填字段
const getRequiredFields = (stepKey) => {
  const requiredFieldsMap = {
    step1: ['age', 'gender', 'income', 'bmi'],
    step2: [
      'dailyGameHours', 'weekendGameHours', 'maxContinuousHours',
      'weeklyGameDays', 'gameFrequency', 'mainGameType', 'gamePlatform',
      'monthlyGameSpend', 'impulsePurchaseFreq', 'inGameSocialFreq',
      'voiceChatHours', 'mainGameTimeSlot', 'lateNightGamingFreq',
      'gameImmersion', 'addictionTendency'
    ],
    step3: [
      'averageSleepHours', 'sleepQuality', 'sleepDifficulty',
      'regularMeals', 'healthyEating', 'weeklyExerciseHours', 'exerciseFrequency'
    ],
    step4: [
      'socialActivity', 'relationshipSatisfaction', 'lonelinessLevel',
      'studyMotivation', 'studyEfficiency', 'academicPressure',
      'schoolBelonging', 'schoolActivityParticipation'
    ],
    step5: [] // 可选步骤
  }

  return requiredFieldsMap[stepKey] || []
}

// 检查字段是否有效
const isFieldValid = (stepKey, field) => {
  const value = testFormStore.formData[stepKey][field]
  return value !== null && value !== undefined && value !== ''
}

// 获取字段标签
const getFieldLabel = (field) => {
  const fieldLabels = {
    // step1
    age: '年龄',
    gender: '性别',
    income: '月收入',
    bmi: 'BMI指数',

    // step2
    dailyGameHours: '日均游戏时长',
    weekendGameHours: '周末游戏时长',
    maxContinuousHours: '最长连续游戏时长',
    weeklyGameDays: '每周游戏天数',
    gameFrequency: '游戏频率',
    mainGameType: '主要游戏类型',
    gamePlatform: '游戏平台',
    monthlyGameSpend: '月均游戏消费',
    impulsePurchaseFreq: '冲动消费频率',
    inGameSocialFreq: '游戏内社交频率',
    voiceChatHours: '语音聊天时长',
    mainGameTimeSlot: '主要游戏时间段',
    lateNightGamingFreq: '熬夜游戏频率',
    gameImmersion: '游戏沉浸度',
    addictionTendency: '游戏成瘾倾向',

    // step3
    averageSleepHours: '平均睡眠时长',
    sleepQuality: '睡眠质量',
    sleepDifficulty: '入睡困难程度',
    regularMeals: '规律饮食程度',
    healthyEating: '健康饮食习惯',
    weeklyExerciseHours: '每周运动时长',
    exerciseFrequency: '运动频率',

    // step4
    socialActivity: '社交活跃度',
    relationshipSatisfaction: '人际关系满意度',
    lonelinessLevel: '孤独感程度',
    studyMotivation: '学习动力',
    studyEfficiency: '学习效率',
    academicPressure: '学业压力',
    schoolBelonging: '校园归属感',
    schoolActivityParticipation: '校园活动参与度'
  }

  return fieldLabels[field] || field
}

// 组件挂载
onMounted(() => {
  // 页面加载时的初始化逻辑
  console.log('TestForm页面已加载')
})
</script>

<style scoped>
.test-form-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.form-header {
  text-align: center;
  margin-bottom: 40px;
  color: white;
}

.form-title {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 10px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.form-description {
  font-size: 16px;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.progress-section {
  background: white;
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.main-progress {
  margin-bottom: 20px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  font-size: 14px;
  color: #666;
}

.current-step {
  font-weight: 600;
  color: #409eff;
}

.step-indicators {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.step-indicator {
  flex: 1;
  text-align: center;
  padding: 15px 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid #e4e7ed;
}

.step-indicator:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.step-indicator.active {
  background: #409eff;
  color: white;
  border-color: #409eff;
}

.step-indicator.completed {
  background: #67c23a;
  color: white;
  border-color: #67c23a;
}

.step-indicator.pending {
  background: #f5f7fa;
  color: #909399;
}

.step-number {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 5px;
}

.step-label {
  font-size: 12px;
}

.form-content {
  margin-bottom: 30px;
}

.step-component {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.form-actions {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.action-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.action-tips {
  margin-top: 20px;
}

.save-indicator {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #67c23a;
  color: white;
  padding: 10px 15px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.save-icon {
  font-size: 16px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .test-form-container {
    padding: 10px;
  }

  .form-title {
    font-size: 24px;
  }

  .progress-section {
    padding: 20px;
  }

  .step-indicators {
    flex-wrap: wrap;
  }

  .step-indicator {
    min-width: 80px;
  }

  .action-buttons {
    flex-direction: column;
    gap: 15px;
  }

  .action-buttons .el-button {
    width: 100%;
  }

  .save-indicator {
    bottom: 10px;
    right: 10px;
    padding: 8px 12px;
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .form-title {
    font-size: 20px;
  }

  .step-indicators {
    gap: 5px;
  }

  .step-indicator {
    padding: 10px 5px;
    min-width: 60px;
  }

  .step-number {
    font-size: 16px;
  }

  .step-label {
    font-size: 10px;
  }
}
</style>