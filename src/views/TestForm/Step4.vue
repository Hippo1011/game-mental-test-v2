<template>
  <div class="step4-container">
    <div class="step-header">
      <h3>社交与学业</h3>
      <p class="step-description">请描述您的社交关系和学业情况，这些因素对心理健康有重要影响</p>
    </div>

    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="140px"
      class="step-form"
    >
      <!-- 社交关系 -->
      <div class="form-section">
        <h4 class="section-title">社交关系</h4>

        <FormItem
          label="社交活跃度"
          prop="socialActivity"
          type="rating"
          v-model="formData.socialActivity"
          :required="true"
          tooltip="与朋友、家人等社交活动的频率和主动性"
        />

        <FormItem
          label="人际关系满意度"
          prop="relationshipSatisfaction"
          type="rating"
          v-model="formData.relationshipSatisfaction"
          :required="true"
          tooltip="对当前人际关系的整体满意程度"
        />

        <FormItem
          label="孤独感程度"
          prop="lonelinessLevel"
          type="rating"
          v-model="formData.lonelinessLevel"
          :required="true"
          tooltip="感到孤独和孤单的频率和程度"
        />
      </div>

      <!-- 学业表现 -->
      <div class="form-section">
        <h4 class="section-title">学业表现</h4>

        <FormItem
          label="学习动力"
          prop="studyMotivation"
          type="rating"
          v-model="formData.studyMotivation"
          :required="true"
          tooltip="对学习的积极性和主动性"
        />

        <FormItem
          label="学习效率"
          prop="studyEfficiency"
          type="rating"
          v-model="formData.studyEfficiency"
          :required="true"
          tooltip="学习时的专注度和效率水平"
        />

        <FormItem
          label="学业压力"
          prop="academicPressure"
          type="rating"
          v-model="formData.academicPressure"
          :required="true"
          tooltip="来自学业的压力和焦虑程度"
        />
      </div>

      <!-- 校园生活 -->
      <div class="form-section">
        <h4 class="section-title">校园生活</h4>

        <FormItem
          label="校园归属感"
          prop="schoolBelonging"
          type="rating"
          v-model="formData.schoolBelonging"
          :required="true"
          tooltip="对学校环境的认同感和归属感"
        />

        <FormItem
          label="校园活动参与度"
          prop="schoolActivityParticipation"
          type="rating"
          v-model="formData.schoolActivityParticipation"
          :required="true"
          tooltip="参与学校社团、活动等的积极程度"
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
  get: () => testFormStore.formData.step4,
  set: (value) => testFormStore.updateStepData('step4', value)
})

// 验证规则
const rules = {
  socialActivity: [
    { required: true, message: '请评分社交活跃度', trigger: 'change' }
  ],
  relationshipSatisfaction: [
    { required: true, message: '请评分人际关系满意度', trigger: 'change' }
  ],
  lonelinessLevel: [
    { required: true, message: '请评分孤独感程度', trigger: 'change' }
  ],
  studyMotivation: [
    { required: true, message: '请评分学习动力', trigger: 'change' }
  ],
  studyEfficiency: [
    { required: true, message: '请评分学习效率', trigger: 'change' }
  ],
  academicPressure: [
    { required: true, message: '请评分学业压力', trigger: 'change' }
  ],
  schoolBelonging: [
    { required: true, message: '请评分校园归属感', trigger: 'change' }
  ],
  schoolActivityParticipation: [
    { required: true, message: '请评分校园活动参与度', trigger: 'change' }
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
.step4-container {
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
  color: #e6a23c;
  margin-bottom: 20px;
  padding-left: 10px;
  border-left: 4px solid #e6a23c;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .step4-container {
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