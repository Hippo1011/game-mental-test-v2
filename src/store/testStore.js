import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 定义测试状态管理Store
export const useTestStore = defineStore('testStore', () => {
  // 表单数据暂存
  const formData = ref({
    // 用户基本信息
    userInfo: {
      name: '',
      age: '',
      gender: '',
    },
    // 测评答案
    answers: {},
    // 当前步骤
    currentStep: 1,
  })

  // 步骤管理
  const totalSteps = ref(10) // 总共10个步骤：1个用户信息 + 9个问题
  const currentStep = computed(() => formData.value.currentStep)

  // 结果存储
  const testResult = ref({
    score: 0,
    level: '', // 例如：'低风险', '中风险', '高风险'
    suggestions: [], // 建议列表
    completed: false, // 是否完成测评
  })

  // 更新表单数据
  const updateFormData = (key, value) => {
    if (key in formData.value) {
      formData.value[key] = value
    }
  }

  // 更新用户基本信息
  const updateUserInfo = (info) => {
    formData.value.userInfo = { ...formData.value.userInfo, ...info }
  }

  // 更新答案
  const updateAnswer = (questionId, answer) => {
    formData.value.answers[questionId] = answer
  }

  // 下一步骤
  const nextStep = () => {
    if (formData.value.currentStep < totalSteps.value) {
      formData.value.currentStep++
    }
  }

  // 上一步骤
  const prevStep = () => {
    if (formData.value.currentStep > 1) {
      formData.value.currentStep--
    }
  }

  // 设置当前步骤
  const setCurrentStep = (step) => {
    if (step >= 1 && step <= totalSteps.value) {
      formData.value.currentStep = step
    }
  }

  // 计算并存储结果
  const calculateResult = () => {
    // 这里可以实现具体的评分逻辑
    // 例如：根据answers计算总分
    const answers = formData.value.answers
    let score = 0

    // 简单示例：假设每个问题答案是数字
    Object.values(answers).forEach((answer) => {
      if (typeof answer === 'number') {
        score += answer
      }
    })

    // 根据分数判断等级
    let level = ''
    if (score < 20) {
      level = '低风险'
    } else if (score < 40) {
      level = '中风险'
    } else {
      level = '高风险'
    }

    // 生成建议
    const suggestions = []
    if (level === '高风险') {
      suggestions.push('建议寻求专业心理咨询师的帮助')
      suggestions.push('适当减少游戏时间，培养其他兴趣爱好')
    } else if (level === '中风险') {
      suggestions.push('注意控制游戏时间，避免影响日常生活')
      suggestions.push('尝试多样化娱乐方式')
    } else {
      suggestions.push('保持良好的游戏习惯，继续享受游戏乐趣')
    }

    testResult.value = {
      score,
      level,
      suggestions,
      completed: true,
    }
  }

  // 重置测评
  const resetTest = () => {
    formData.value = {
      userInfo: {
        name: '',
        age: '',
        gender: '',
      },
      answers: {},
      currentStep: 1,
    }
    testResult.value = {
      score: 0,
      level: '',
      suggestions: [],
      completed: false,
    }
  }

  // 获取进度百分比
  const progress = computed(() => {
    return Math.round((currentStep.value / totalSteps.value) * 100)
  })

  return {
    // 状态
    formData,
    totalSteps,
    testResult,
    // 计算属性
    currentStep,
    progress,
    // 方法
    updateFormData,
    updateUserInfo,
    updateAnswer,
    nextStep,
    prevStep,
    setCurrentStep,
    calculateResult,
    resetTest,
  }
})