import { defineStore } from 'pinia'
import { ref, computed, reactive } from 'vue'

// 测试表单状态管理
export const useTestFormStore = defineStore('testFormStore', () => {
  // 表单数据结构
  const formData = reactive({
    step1: {
      age: null,
      gender: '',
      income: '',
      bmi: null
    },
    step2: {
      // 游戏时长相关
      dailyGameHours: 2,
      weekendGameHours: 4,
      maxContinuousHours: 6,
      // 游戏频率
      weeklyGameDays: 5,
      gameFrequency: '',
      // 游戏偏好
      mainGameType: '',
      gamePlatform: '',
      // 消费行为
      monthlyGameSpend: '',
      impulsePurchaseFreq: 2,
      // 社交行为
      inGameSocialFreq: 3,
      voiceChatHours: 2,
      // 时间分布
      mainGameTimeSlot: '',
      lateNightGamingFreq: 1,
      // 游戏强度
      gameImmersion: 5,
      addictionTendency: 3
    },
    step3: {
      // 睡眠习惯
      averageSleepHours: 7,
      sleepQuality: 3,
      sleepDifficulty: 2,
      // 饮食习惯
      regularMeals: 4,
      healthyEating: 3,
      // 运动习惯
      weeklyExerciseHours: 3,
      exerciseFrequency: 3
    },
    step4: {
      // 社交关系
      socialActivity: 3,
      relationshipSatisfaction: 4,
      lonelinessLevel: 2,
      // 学业表现
      studyMotivation: 4,
      studyEfficiency: 3,
      academicPressure: 3,
      // 校园生活
      schoolBelonging: 4,
      schoolActivityParticipation: 2
    },
    step5: {
      // 身体感觉
      physicalFatigue: null,
      headacheFrequency: null,
      sleepDisorder: null,
      appetiteChange: null,
      // 生理健康
      overallHealth: null,
      chronicDiseaseImpact: null,
      medicationUse: null,
      // 心理生理反应
      rapidHeartbeat: null,
      abnormalSweating: null,
      muscleTension: null,
      gastrointestinalDiscomfort: null
    }
  })

  // 当前步骤
  const currentStep = ref(1)

  // 总步骤数
  const totalSteps = ref(5)

  // 表单完成状态
  const isCompleted = ref(false)

  // 进度百分比
  const progress = computed(() => {
    return Math.round((currentStep.value / totalSteps.value) * 100)
  })

  // localStorage键名
  const STORAGE_KEY = 'gameMentalTestForm'

  // 更新步骤数据
  const updateStepData = (step, data) => {
    if (formData[step]) {
      Object.assign(formData[step], data)
      saveToStorage()
    }
  }

  // 设置当前步骤
  const setCurrentStep = (step) => {
    if (step >= 1 && step <= totalSteps.value) {
      currentStep.value = step
      saveToStorage()
    }
  }

  // 下一步
  const nextStep = () => {
    if (currentStep.value < totalSteps.value) {
      currentStep.value++
      saveToStorage()
    }
  }

  // 上一步
  const prevStep = () => {
    if (currentStep.value > 1) {
      currentStep.value--
      saveToStorage()
    }
  }

  // 跳转到指定步骤
  const goToStep = (step) => {
    if (step >= 1 && step <= totalSteps.value) {
      currentStep.value = step
      saveToStorage()
    }
  }

  // 保存到localStorage
  const saveToStorage = () => {
    try {
      const dataToSave = {
        formData: { ...formData },
        currentStep: currentStep.value,
        isCompleted: isCompleted.value,
        timestamp: Date.now()
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))
    } catch (error) {
      console.error('保存表单数据失败:', error)
    }
  }

  // 从localStorage加载
  const loadFromStorage = () => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY)
      if (savedData) {
        const parsedData = JSON.parse(savedData)

        // 检查数据是否过期（24小时）
        const now = Date.now()
        const dataAge = now - (parsedData.timestamp || 0)
        const maxAge = 24 * 60 * 60 * 1000 // 24小时

        if (dataAge < maxAge) {
          // 更新表单数据
          Object.keys(parsedData.formData).forEach(step => {
            if (formData[step]) {
              Object.assign(formData[step], parsedData.formData[step])
            }
          })

          // 更新步骤和状态
          currentStep.value = parsedData.currentStep || 1
          isCompleted.value = parsedData.isCompleted || false
        } else {
          // 数据过期，清除
          clearStorage()
        }
      }
    } catch (error) {
      console.error('加载表单数据失败:', error)
    }
  }

  // 清除localStorage数据
  const clearStorage = () => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.error('清除表单数据失败:', error)
    }
  }

  // 提交表单
  const submitForm = async () => {
    try {
      // 这里可以添加表单提交逻辑
      // 例如：发送数据到服务器

      isCompleted.value = true
      saveToStorage()

      return {
        success: true,
        message: '表单提交成功'
      }
    } catch (error) {
      console.error('表单提交失败:', error)
      return {
        success: false,
        message: '表单提交失败，请重试'
      }
    }
  }

  // 重置表单
  const resetForm = () => {
    // 重置所有步骤数据为初始值
    Object.keys(formData).forEach(step => {
      if (step === 'step1') {
        formData[step] = {
          age: null,
          gender: '',
          income: '',
          bmi: null
        }
      } else if (step === 'step2') {
        formData[step] = {
          dailyGameHours: 2,
          weekendGameHours: 4,
          maxContinuousHours: 6,
          weeklyGameDays: 5,
          gameFrequency: '',
          mainGameType: '',
          gamePlatform: '',
          monthlyGameSpend: '',
          impulsePurchaseFreq: 2,
          inGameSocialFreq: 3,
          voiceChatHours: 2,
          mainGameTimeSlot: '',
          lateNightGamingFreq: 1,
          gameImmersion: 5,
          addictionTendency: 3
        }
      } else if (step === 'step3') {
        formData[step] = {
          averageSleepHours: 7,
          sleepQuality: 3,
          sleepDifficulty: 2,
          regularMeals: 4,
          healthyEating: 3,
          weeklyExerciseHours: 3,
          exerciseFrequency: 3
        }
      } else if (step === 'step4') {
        formData[step] = {
          socialActivity: 3,
          relationshipSatisfaction: 4,
          lonelinessLevel: 2,
          studyMotivation: 4,
          studyEfficiency: 3,
          academicPressure: 3,
          schoolBelonging: 4,
          schoolActivityParticipation: 2
        }
      } else if (step === 'step5') {
        formData[step] = {
          physicalFatigue: null,
          headacheFrequency: null,
          sleepDisorder: null,
          appetiteChange: null,
          overallHealth: null,
          chronicDiseaseImpact: null,
          medicationUse: null,
          rapidHeartbeat: null,
          abnormalSweating: null,
          muscleTension: null,
          gastrointestinalDiscomfort: null
        }
      }
    })

    currentStep.value = 1
    isCompleted.value = false
    clearStorage()
  }

  // 获取表单验证状态
  const getValidationStatus = () => {
    const requiredFields = {
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
      step5: [] // 可选步骤，无必填字段
    }

    const status = {}

    Object.keys(requiredFields).forEach(step => {
      const fields = requiredFields[step]
      status[step] = fields.every(field => {
        const value = formData[step][field]
        return value !== null && value !== undefined && value !== ''
      })
    })

    return status
  }

  // 初始化时加载数据
  loadFromStorage()

  return {
    // 状态
    formData,
    currentStep,
    totalSteps,
    isCompleted,

    // 计算属性
    progress,

    // 方法
    updateStepData,
    setCurrentStep,
    nextStep,
    prevStep,
    goToStep,
    saveToStorage,
    loadFromStorage,
    clearStorage,
    submitForm,
    resetForm,
    getValidationStatus
  }
})