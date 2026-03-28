<template>
  <div class="step1-container">
    <div class="step-header">
      <h3>基础信息</h3>
      <p class="step-description">请填写您的基本信息，这些信息将帮助我们更好地分析您的心理健康状况</p>
    </div>

    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="100px"
      class="step-form"
    >
      <!-- 年龄 -->
      <FormItem
        label="年龄"
        prop="age"
        type="number"
        v-model="formData.age"
        placeholder="请输入年龄"
        :min="1"
        :max="120"
        :required="true"
        tooltip="年龄范围：1-120岁"
      />

      <!-- 性别 -->
      <FormItem
        label="性别"
        prop="gender"
        type="radio"
        v-model="formData.gender"
        :options="genderOptions"
        :required="true"
      />

      <!-- 月收入 -->
      <FormItem
        label="月收入"
        prop="income"
        type="select"
        v-model="formData.income"
        placeholder="请选择月收入范围"
        :options="incomeOptions"
        :required="true"
        tooltip="请选择最接近您的月收入范围"
      />

      <!-- BMI指数 -->
      <FormItem
        label="BMI指数"
        prop="bmi"
        type="number"
        v-model="formData.bmi"
        placeholder="请输入BMI值"
        :min="10"
        :max="50"
        :precision="1"
        :step="0.1"
        :required="true"
        tooltip="BMI = 体重(kg) / 身高(m)²，正常范围：18.5-24.9"
      />
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
  get: () => testFormStore.formData.step1,
  set: (value) => testFormStore.updateStepData('step1', value)
})

// 性别选项
const genderOptions = [
  { value: 'male', label: '男' },
  { value: 'female', label: '女' },
  { value: 'other', label: '其他' }
]

// 月收入选项
const incomeOptions = [
  { value: 'under_3000', label: '3000元以下' },
  { value: '3000_5000', label: '3000-5000元' },
  { value: '5000_8000', label: '5000-8000元' },
  { value: '8000_12000', label: '8000-12000元' },
  { value: '12000_20000', label: '12000-20000元' },
  { value: '20000_50000', label: '20000-50000元' },
  { value: 'over_50000', label: '50000元以上' }
]

// 验证规则
const rules = {
  age: [
    { required: true, message: '请输入年龄', trigger: 'blur' },
    { type: 'number', min: 1, max: 120, message: '年龄必须在1-120岁之间', trigger: 'blur' }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  income: [
    { required: true, message: '请选择月收入范围', trigger: 'change' }
  ],
  bmi: [
    { required: true, message: '请输入BMI指数', trigger: 'blur' },
    { type: 'number', min: 10, max: 50, message: 'BMI指数必须在10-50之间', trigger: 'blur' }
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
.step1-container {
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

/* 响应式设计 */
@media (max-width: 768px) {
  .step1-container {
    padding: 0 15px;
  }

  .step-form {
    padding: 20px;
  }

  .step-header h3 {
    font-size: 20px;
  }
}
</style>