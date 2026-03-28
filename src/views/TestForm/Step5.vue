<template>
  <div class="step5-container">
    <div class="step-header">
      <h3>体感与生理</h3>
      <p class="step-description">请描述您的身体感觉和生理状况，这些信息将帮助我们全面评估您的身心健康</p>
      <div class="optional-notice">
        <el-alert
          title="可选填写"
          description="此步骤为可选填写，如果您不希望透露相关信息可以跳过"
          type="info"
          :closable="false"
          show-icon
        />
      </div>
    </div>

    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="140px"
      class="step-form"
    >
      <!-- 身体感觉 -->
      <div class="form-section">
        <h4 class="section-title">身体感觉</h4>

        <FormItem
          label="身体疲劳程度"
          prop="physicalFatigue"
          type="rating"
          v-model="formData.physicalFatigue"
          tooltip="身体上的疲劳感和乏力程度"
        />

        <FormItem
          label="头痛频率"
          prop="headacheFrequency"
          type="rating"
          v-model="formData.headacheFrequency"
          tooltip="头痛发生的频率和严重程度"
        />

        <FormItem
          label="睡眠障碍"
          prop="sleepDisorder"
          type="rating"
          v-model="formData.sleepDisorder"
          tooltip="失眠、多梦、早醒等睡眠问题的严重程度"
        />

        <FormItem
          label="食欲变化"
          prop="appetiteChange"
          type="rating"
          v-model="formData.appetiteChange"
          tooltip="食欲异常（过少或过多）的程度"
        />
      </div>

      <!-- 生理健康 -->
      <div class="form-section">
        <h4 class="section-title">生理健康</h4>

        <FormItem
          label="整体健康状况"
          prop="overallHealth"
          type="rating"
          v-model="formData.overallHealth"
          tooltip="对自身整体健康状况的主观评价"
        />

        <FormItem
          label="慢性疾病影响"
          prop="chronicDiseaseImpact"
          type="rating"
          v-model="formData.chronicDiseaseImpact"
          tooltip="慢性疾病对日常生活的影响程度"
        />

        <FormItem
          label="药物使用情况"
          prop="medicationUse"
          type="rating"
          v-model="formData.medicationUse"
          tooltip="正在使用的药物对生活的影响程度"
        />
      </div>

      <!-- 心理生理反应 -->
      <div class="form-section">
        <h4 class="section-title">心理生理反应</h4>

        <FormItem
          label="心跳加速频率"
          prop="rapidHeartbeat"
          type="rating"
          v-model="formData.rapidHeartbeat"
          tooltip="心跳加速或心悸的发生频率"
        />

        <FormItem
          label="出汗异常"
          prop="abnormalSweating"
          type="rating"
          v-model="formData.abnormalSweating"
          tooltip="异常出汗（尤其是手心出汗）的频率"
        />

        <FormItem
          label="肌肉紧张"
          prop="muscleTension"
          type="rating"
          v-model="formData.muscleTension"
          tooltip="肌肉紧张或痉挛的感觉"
        />

        <FormItem
          label="胃肠不适"
          prop="gastrointestinalDiscomfort"
          type="rating"
          v-model="formData.gastrointestinalDiscomfort"
          tooltip="胃痛、腹泻、便秘等胃肠道不适的频率"
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
  get: () => testFormStore.formData.step5,
  set: (value) => testFormStore.updateStepData('step5', value)
})

// 验证规则（此步骤为可选，所有字段都非必填）
const rules = {
  // 所有字段都是可选的，不需要验证规则
}

// 暴露验证方法给父组件（由于是可选步骤，始终返回true）
defineExpose({
  validate: () => {
    // 可选步骤，始终返回true（验证通过）
    return Promise.resolve(true)
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
.step5-container {
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
  margin-bottom: 20px;
}

.optional-notice {
  margin-top: 15px;
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
  color: #f56c6c;
  margin-bottom: 20px;
  padding-left: 10px;
  border-left: 4px solid #f56c6c;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .step5-container {
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

  .optional-notice {
    margin-top: 10px;
  }
}
</style>