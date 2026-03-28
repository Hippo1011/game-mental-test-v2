<template>
  <div class="step3-container">
    <div class="step-header">
      <h3>生活习惯</h3>
      <p class="step-description">请描述您的日常生活习惯，这些信息将帮助我们全面评估您的心理健康状况</p>
    </div>

    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="120px"
      class="step-form"
    >
      <!-- 睡眠习惯 -->
      <div class="form-section">
        <h4 class="section-title">睡眠习惯</h4>

        <FormItem
          label="平均睡眠时长"
          prop="averageSleepHours"
          type="slider"
          v-model="formData.averageSleepHours"
          :min="4"
          :max="12"
          :step="0.5"
          unit="小时"
          :required="true"
          tooltip="每天平均睡眠时间"
        />

        <FormItem
          label="睡眠质量"
          prop="sleepQuality"
          type="rating"
          v-model="formData.sleepQuality"
          :required="true"
          tooltip="整体睡眠质量评分"
        />

        <FormItem
          label="入睡困难程度"
          prop="sleepDifficulty"
          type="rating"
          v-model="formData.sleepDifficulty"
          :required="true"
          tooltip="入睡所需时间和困难程度"
        />
      </div>

      <!-- 饮食习惯 -->
      <div class="form-section">
        <h4 class="section-title">饮食习惯</h4>

        <FormItem
          label="规律饮食程度"
          prop="regularMeals"
          type="rating"
          v-model="formData.regularMeals"
          :required="true"
          tooltip="是否按时吃饭，饮食是否规律"
        />

        <FormItem
          label="健康饮食习惯"
          prop="healthyEating"
          type="rating"
          v-model="formData.healthyEating"
          :required="true"
          tooltip="饮食是否均衡健康"
        />
      </div>

      <!-- 运动习惯 -->
      <div class="form-section">
        <h4 class="section-title">运动习惯</h4>

        <FormItem
          label="每周运动时长"
          prop="weeklyExerciseHours"
          type="slider"
          v-model="formData.weeklyExerciseHours"
          :min="0"
          :max="20"
          :step="0.5"
          unit="小时"
          :required="true"
          tooltip="每周进行体育锻炼的总时长"
        />

        <FormItem
          label="运动频率"
          prop="exerciseFrequency"
          type="slider"
          v-model="formData.exerciseFrequency"
          :min="0"
          :max="7"
          :step="1"
          unit="次/周"
          :required="true"
          tooltip="每周进行体育锻炼的次数"
        />
      </div>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useTestFormStore } from '@/store/testFormStore'
import FormItem from './FormItem.vue'

// Store
const testFormStore = useTestFormStore()

// 表单引用
const formRef = ref(null)

// 表单数据
const formData = computed({
  get: () => testFormStore.formData.step3,
  set: (value) => testFormStore.updateStepData('step3', value)
})

// 验证规则
const rules = {
  averageSleepHours: [
    { required: true, message: '请选择平均睡眠时长', trigger: 'change' }
  ],
  sleepQuality: [
    { required: true, message: '请评分睡眠质量', trigger: 'change' }
  ],
  sleepDifficulty: [
    { required: true, message: '请评分入睡困难程度', trigger: 'change' }
  ],
  regularMeals: [
    { required: true, message: '请评分规律饮食程度', trigger: 'change' }
  ],
  healthyEating: [
    { required: true, message: '请评分健康饮食习惯', trigger: 'change' }
  ],
  weeklyExerciseHours: [
    { required: true, message: '请选择每周运动时长', trigger: 'change' }
  ],
  exerciseFrequency: [
    { required: true, message: '请选择运动频率', trigger: 'change' }
  ]
}

// 暴露验证方法给父组件
defineExpose({
  validate: () => {
    return formRef.value?.validate()
  },
  resetFields: () => {
    formRef.value?.resetFields()
  }
})

// 组件挂载时从localStorage恢复数据
onMounted(() => {
  testFormStore.loadFromStorage()
})
</script>

<style scoped>
.step3-container {
  max-width: 600px;
  margin: 0 auto;
}

.step-header {
  text-align: center;
  margin-bottom: 30px;
}

.step-header h3 {
  font-size: 24px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 10px;
}

.step-description {
  color: #666;
  font-size: 14px;
  line-height: 1.6;
}

.step-form {
  background: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.form-section {
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.form-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #67c23a;
  margin-bottom: 20px;
  padding-left: 10px;
  border-left: 4px solid #67c23a;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .step3-container {
    padding: 0 15px;
  }

  .step-form {
    padding: 20px;
  }

  .step-header h3 {
    font-size: 20px;
  }

  .section-title {
    font-size: 16px;
  }
}
</style>