<template>
  <div class="step2-container">
    <div class="step-header">
      <h3>游戏行为数据</h3>
      <p class="step-description">请描述您最近一个月的游戏行为模式，这些数据将帮助我们分析您的游戏习惯</p>
    </div>

    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="120px"
      class="step-form"
    >
      <!-- 游戏时长相关 -->
      <div class="form-section">
        <h4 class="section-title">游戏时长</h4>

        <FormItem
          label="日均游戏时长"
          prop="dailyGameHours"
          type="slider"
          v-model="formData.dailyGameHours"
          :min="0"
          :max="24"
          :step="0.5"
          unit="小时"
          :required="true"
          tooltip="每天平均玩游戏的时间"
        />

        <FormItem
          label="周末游戏时长"
          prop="weekendGameHours"
          type="slider"
          v-model="formData.weekendGameHours"
          :min="0"
          :max="24"
          :step="0.5"
          unit="小时"
          :required="true"
          tooltip="周末每天平均玩游戏的时间"
        />

        <FormItem
          label="最长连续游戏时长"
          prop="maxContinuousHours"
          type="slider"
          v-model="formData.maxContinuousHours"
          :min="0"
          :max="24"
          :step="0.5"
          unit="小时"
          :required="true"
          tooltip="单次最长连续游戏时间"
        />
      </div>

      <!-- 游戏频率 -->
      <div class="form-section">
        <h4 class="section-title">游戏频率</h4>

        <FormItem
          label="每周游戏天数"
          prop="weeklyGameDays"
          type="slider"
          v-model="formData.weeklyGameDays"
          :min="0"
          :max="7"
          :step="1"
          unit="天"
          :required="true"
          tooltip="每周玩游戏的天数"
        />

        <FormItem
          label="游戏频率"
          prop="gameFrequency"
          type="select"
          v-model="formData.gameFrequency"
          placeholder="请选择游戏频率"
          :options="frequencyOptions"
          :required="true"
        />
      </div>

      <!-- 游戏类型偏好 -->
      <div class="form-section">
        <h4 class="section-title">游戏偏好</h4>

        <FormItem
          label="主要游戏类型"
          prop="mainGameType"
          type="select"
          v-model="formData.mainGameType"
          placeholder="请选择主要游戏类型"
          :options="gameTypeOptions"
          :required="true"
        />

        <FormItem
          label="游戏平台"
          prop="gamePlatform"
          type="select"
          v-model="formData.gamePlatform"
          placeholder="请选择主要游戏平台"
          :options="platformOptions"
          :required="true"
        />
      </div>

      <!-- 消费行为 -->
      <div class="form-section">
        <h4 class="section-title">消费行为</h4>

        <FormItem
          label="月均游戏消费"
          prop="monthlyGameSpend"
          type="select"
          v-model="formData.monthlyGameSpend"
          placeholder="请选择月均游戏消费"
          :options="spendOptions"
          :required="true"
        />

        <FormItem
          label="冲动消费频率"
          prop="impulsePurchaseFreq"
          type="slider"
          v-model="formData.impulsePurchaseFreq"
          :min="0"
          :max="10"
          :step="1"
          unit="次/月"
          :required="true"
          tooltip="每月冲动购买游戏道具/皮肤的次数"
        />
      </div>

      <!-- 社交行为 -->
      <div class="form-section">
        <h4 class="section-title">游戏社交</h4>

        <FormItem
          label="游戏内社交频率"
          prop="inGameSocialFreq"
          type="slider"
          v-model="formData.inGameSocialFreq"
          :min="0"
          :max="10"
          :step="1"
          unit="次/周"
          :required="true"
          tooltip="每周在游戏中与他人交流的次数"
        />

        <FormItem
          label="语音聊天时长"
          prop="voiceChatHours"
          type="slider"
          v-model="formData.voiceChatHours"
          :min="0"
          :max="20"
          :step="0.5"
          unit="小时/周"
          :required="true"
          tooltip="每周使用语音聊天的时长"
        />
      </div>

      <!-- 游戏时间分布 -->
      <div class="form-section">
        <h4 class="section-title">时间分布</h4>

        <FormItem
          label="主要游戏时间段"
          prop="mainGameTimeSlot"
          type="select"
          v-model="formData.mainGameTimeSlot"
          placeholder="请选择主要游戏时间段"
          :options="timeSlotOptions"
          :required="true"
        />

        <FormItem
          label="熬夜游戏频率"
          prop="lateNightGamingFreq"
          type="slider"
          v-model="formData.lateNightGamingFreq"
          :min="0"
          :max="7"
          :step="1"
          unit="次/周"
          :required="true"
          tooltip="每周凌晨后仍玩游戏的天数"
        />
      </div>

      <!-- 游戏强度 -->
      <div class="form-section">
        <h4 class="section-title">游戏强度</h4>

        <FormItem
          label="游戏沉浸度"
          prop="gameImmersion"
          type="slider"
          v-model="formData.gameImmersion"
          :min="1"
          :max="10"
          :step="1"
          :marks="{1: '低', 5: '中', 10: '高'}"
          :required="true"
          tooltip="游戏时对周围环境的关注程度"
        />

        <FormItem
          label="游戏成瘾倾向"
          prop="addictionTendency"
          type="slider"
          v-model="formData.addictionTendency"
          :min="1"
          :max="10"
          :step="1"
          :marks="{1: '无', 5: '轻度', 10: '严重'}"
          :required="true"
          tooltip="对游戏的依赖程度"
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
  get: () => testFormStore.formData.step2,
  set: (value) => testFormStore.updateStepData('step2', value)
})

// 选项数据
const frequencyOptions = [
  { value: 'daily', label: '每天' },
  { value: 'almost_daily', label: '几乎每天' },
  { value: '4_6_days', label: '每周4-6天' },
  { value: '2_3_days', label: '每周2-3天' },
  { value: '1_day', label: '每周1天' },
  { value: 'few_times', label: '每月几次' },
  { value: 'rarely', label: '很少' }
]

const gameTypeOptions = [
  { value: 'moba', label: 'MOBA游戏' },
  { value: 'fps', label: 'FPS游戏' },
  { value: 'rpg', label: 'RPG游戏' },
  { value: 'strategy', label: '策略游戏' },
  { value: 'simulation', label: '模拟经营游戏' },
  { value: 'puzzle', label: '益智游戏' },
  { value: 'sports', label: '体育游戏' },
  { value: 'racing', label: '竞速游戏' },
  { value: 'other', label: '其他' }
]

const platformOptions = [
  { value: 'pc', label: 'PC电脑' },
  { value: 'mobile', label: '手机' },
  { value: 'console', label: '游戏主机' },
  { value: 'handheld', label: '掌机' },
  { value: 'other', label: '其他' }
]

const spendOptions = [
  { value: '0', label: '0元' },
  { value: '1_50', label: '1-50元' },
  { value: '51_200', label: '51-200元' },
  { value: '201_500', label: '201-500元' },
  { value: '501_1000', label: '501-1000元' },
  { value: 'over_1000', label: '1000元以上' }
]

const timeSlotOptions = [
  { value: 'morning', label: '上午（6:00-12:00）' },
  { value: 'afternoon', label: '下午（12:00-18:00）' },
  { value: 'evening', label: '晚上（18:00-24:00）' },
  { value: 'midnight', label: '深夜（24:00-6:00）' }
]

// 验证规则
const rules = {
  dailyGameHours: [
    { required: true, message: '请选择日均游戏时长', trigger: 'change' }
  ],
  weekendGameHours: [
    { required: true, message: '请选择周末游戏时长', trigger: 'change' }
  ],
  maxContinuousHours: [
    { required: true, message: '请选择最长连续游戏时长', trigger: 'change' }
  ],
  weeklyGameDays: [
    { required: true, message: '请选择每周游戏天数', trigger: 'change' }
  ],
  gameFrequency: [
    { required: true, message: '请选择游戏频率', trigger: 'change' }
  ],
  mainGameType: [
    { required: true, message: '请选择主要游戏类型', trigger: 'change' }
  ],
  gamePlatform: [
    { required: true, message: '请选择游戏平台', trigger: 'change' }
  ],
  monthlyGameSpend: [
    { required: true, message: '请选择月均游戏消费', trigger: 'change' }
  ],
  impulsePurchaseFreq: [
    { required: true, message: '请选择冲动消费频率', trigger: 'change' }
  ],
  inGameSocialFreq: [
    { required: true, message: '请选择游戏内社交频率', trigger: 'change' }
  ],
  voiceChatHours: [
    { required: true, message: '请选择语音聊天时长', trigger: 'change' }
  ],
  mainGameTimeSlot: [
    { required: true, message: '请选择主要游戏时间段', trigger: 'change' }
  ],
  lateNightGamingFreq: [
    { required: true, message: '请选择熬夜游戏频率', trigger: 'change' }
  ],
  gameImmersion: [
    { required: true, message: '请选择游戏沉浸度', trigger: 'change' }
  ],
  addictionTendency: [
    { required: true, message: '请选择游戏成瘾倾向', trigger: 'change' }
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
.step2-container {
  max-width: 700px;
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
  color: #409eff;
  margin-bottom: 20px;
  padding-left: 10px;
  border-left: 4px solid #409eff;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .step2-container {
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