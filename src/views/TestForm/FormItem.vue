<template>
  <div class="form-item-wrapper">
    <el-form-item
      :label="label"
      :prop="prop"
      :rules="rules"
      :required="required"
    >
      <template #label>
        <span class="form-label">
          {{ label }}
          <el-tooltip v-if="tooltip" :content="tooltip" placement="top">
            <el-icon class="info-icon"><InfoFilled /></el-icon>
          </el-tooltip>
        </span>
      </template>

      <!-- 输入框类型 -->
      <el-input
        v-if="type === 'input'"
        v-model="localValue"
        :placeholder="placeholder"
        :type="inputType || 'text'"
        :min="min"
        :max="max"
        :step="step"
        @input="handleInput"
        @blur="handleBlur"
      />

      <!-- 数字输入框 -->
      <el-input-number
        v-else-if="type === 'number'"
        v-model="localValue"
        :min="min"
        :max="max"
        :step="step"
        :precision="precision"
        :placeholder="placeholder"
        :controls="controls"
        @change="handleInput"
      />

      <!-- 滑块 -->
      <div v-else-if="type === 'slider'" class="slider-wrapper">
        <el-slider
          v-model="localValue"
          :min="min"
          :max="max"
          :step="step"
          :marks="marks"
          :show-stops="showStops"
          :range="range"
          @change="handleInput"
        />
        <div class="slider-value">
          <span v-if="!range">{{ localValue }}</span>
          <span v-else>{{ localValue[0] }} - {{ localValue[1] }}</span>
          <span class="unit">{{ unit }}</span>
        </div>
      </div>

      <!-- 下拉选择 -->
      <el-select
        v-else-if="type === 'select'"
        v-model="localValue"
        :placeholder="placeholder"
        :multiple="multiple"
        @change="handleInput"
      >
        <el-option
          v-for="option in options"
          :key="option.value"
          :label="option.label"
          :value="option.value"
        />
      </el-select>

      <!-- 单选框组 -->
      <el-radio-group
        v-else-if="type === 'radio'"
        v-model="localValue"
        @change="handleInput"
      >
        <el-radio
          v-for="option in options"
          :key="option.value"
          :label="option.value"
        >
          {{ option.label }}
        </el-radio>
      </el-radio-group>

      <!-- 评分滑块 -->
      <div v-else-if="type === 'rating'" class="rating-wrapper">
        <el-slider
          v-model="localValue"
          :min="1"
          :max="5"
          :step="1"
          :marks="{1: '1', 2: '2', 3: '3', 4: '4', 5: '5'}"
          @change="handleInput"
        />
        <div class="rating-labels">
          <span>非常不符合</span>
          <span>非常符合</span>
        </div>
      </div>

      <!-- 自定义插槽 -->
      <slot v-else />
    </el-form-item>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { InfoFilled } from '@element-plus/icons-vue'

// Props定义
const props = defineProps({
  // 表单项标签
  label: {
    type: String,
    required: true
  },
  // 表单项属性名
  prop: {
    type: String,
    required: true
  },
  // 表单项类型
  type: {
    type: String,
    default: 'input',
    validator: (value) => ['input', 'number', 'slider', 'select', 'radio', 'rating'].includes(value)
  },
  // 绑定值
  modelValue: {
    type: [String, Number, Array, Boolean],
    default: ''
  },
  // 占位符
  placeholder: {
    type: String,
    default: ''
  },
  // 是否必填
  required: {
    type: Boolean,
    default: false
  },
  // 验证规则
  rules: {
    type: Array,
    default: () => []
  },
  // 提示信息
  tooltip: {
    type: String,
    default: ''
  },
  // 输入框类型
  inputType: {
    type: String,
    default: 'text'
  },
  // 最小值
  min: {
    type: Number,
    default: undefined
  },
  // 最大值
  max: {
    type: Number,
    default: undefined
  },
  // 步长
  step: {
    type: Number,
    default: 1
  },
  // 精度
  precision: {
    type: Number,
    default: undefined
  },
  // 数字输入框是否显示控制按钮
  controls: {
    type: Boolean,
    default: true
  },
  // 选项列表（用于select和radio）
  options: {
    type: Array,
    default: () => []
  },
  // 是否多选
  multiple: {
    type: Boolean,
    default: false
  },
  // 滑块标记
  marks: {
    type: Object,
    default: () => ({})
  },
  // 是否显示滑块停止点
  showStops: {
    type: Boolean,
    default: false
  },
  // 是否范围选择
  range: {
    type: Boolean,
    default: false
  },
  // 单位
  unit: {
    type: String,
    default: ''
  }
})

// Emits定义
const emit = defineEmits(['update:modelValue', 'change', 'blur'])

// 本地值
const localValue = ref(props.modelValue)

// 监听外部值变化
watch(() => props.modelValue, (newValue) => {
  localValue.value = newValue
}, { immediate: true })

// 处理输入变化
const handleInput = (value) => {
  localValue.value = value
  emit('update:modelValue', value)
  emit('change', value)
}

// 处理失焦
const handleBlur = () => {
  emit('blur')
}
</script>

<style scoped>
.form-item-wrapper {
  margin-bottom: 20px;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 6px;
}

.info-icon {
  color: #909399;
  font-size: 14px;
  cursor: help;
}

.slider-wrapper {
  padding: 20px 0;
  position: relative;
}

.slider-wrapper :deep(.el-slider) {
  width: 100%;
  min-width: 300px;
  max-width: 500px;
}

.slider-wrapper :deep(.el-slider__runway) {
  height: 6px;
  border-radius: 3px;
  background: linear-gradient(90deg, #e4e7ed 0%, #f5f7fa 100%);
}

.slider-wrapper :deep(.el-slider__bar) {
  height: 6px;
  border-radius: 3px;
  background: linear-gradient(90deg, #409eff 0%, #66b1ff 100%);
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
}

.slider-wrapper :deep(.el-slider__button) {
  width: 20px;
  height: 20px;
  border: 3px solid #409eff;
  background: white;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.4);
  transition: all 0.3s ease;
}

.slider-wrapper :deep(.el-slider__button:hover) {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.6);
}

.slider-wrapper :deep(.el-slider__button-wrapper) {
  top: -8px;
}

.slider-value {
  text-align: center;
  margin-top: 15px;
  font-weight: 600;
  color: #409eff;
  font-size: 16px;
}

.unit {
  margin-left: 4px;
  font-size: 14px;
  color: #666;
  font-weight: 400;
}

.rating-wrapper {
  padding: 20px 0;
}

.rating-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  font-size: 12px;
  color: #666;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .form-item-wrapper {
    margin-bottom: 15px;
  }

  .slider-wrapper,
  .rating-wrapper {
    padding: 15px 0;
  }

  .rating-labels {
    font-size: 11px;
  }
}
</style>