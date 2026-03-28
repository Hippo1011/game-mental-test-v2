<template>
  <div class="result-page">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <el-card class="loading-card">
        <div class="loading-content">
          <el-icon class="loading-icon" :size="48"><Loading /></el-icon>
          <h3>正在生成测评报告...</h3>
          <p>请稍候，正在分析您的测评数据</p>
        </div>
      </el-card>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error-container">
      <el-card class="error-card">
        <el-result
          icon="error"
          title="报告生成失败"
          sub-title="抱歉，测评报告生成过程中出现错误"
        >
          <template #extra>
            <el-button type="primary" @click="retryLoad">重试</el-button>
          </template>
        </el-result>
      </el-card>
    </div>

    <!-- 结果内容 -->
    <div v-else class="result-container" ref="resultContainer">
      <el-card class="result-card" shadow="never">
        <!-- 头部信息 -->
        <div class="header-section">
          <h1 class="title">游戏心理健康测评报告</h1>
          <div class="user-info">
            <el-tag type="info" size="large">
              {{ userInfo.name }} · {{ userInfo.age }}岁 · {{ genderText }}
            </el-tag>
            <el-tag :type="levelTagType" size="large">
              {{ testResult.level }}
            </el-tag>
          </div>
        </div>

        <el-divider />

        <!-- 图表区域 -->
        <div class="charts-section">
          <el-row :gutter="20">
            <!-- 雷达图 -->
            <el-col :xs="24" :lg="12">
              <el-card class="chart-card" shadow="hover">
                <template #header>
                  <div class="chart-header">
                    <el-icon><DataAnalysis /></el-icon>
                    <span>心理指标雷达图</span>
                  </div>
                </template>
                <div class="chart-container">
                  <div ref="radarChart" class="chart"></div>
                </div>
              </el-card>
            </el-col>

            <!-- 仪表盘 -->
            <el-col :xs="24" :lg="12">
              <el-card class="chart-card" shadow="hover">
                <template #header>
                  <div class="chart-header">
                    <el-icon><Odometer /></el-icon>
                    <span>压力水平仪表盘</span>
                  </div>
                </template>
                <div class="chart-container">
                  <div ref="gaugeChart" class="chart"></div>
                </div>
                <div class="gauge-legend">
                  <div class="legend-item">
                    <div class="legend-color low"></div>
                    <span>低风险 (&lt;30)</span>
                  </div>
                  <div class="legend-item">
                    <div class="legend-color medium"></div>
                    <span>中风险 (30-60)</span>
                  </div>
                  <div class="legend-item">
                    <div class="legend-color high"></div>
                    <span>高风险 (≥60)</span>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>

          <!-- 归因分析柱状图 -->
          <el-row>
            <el-col :span="24">
              <el-card class="chart-card" shadow="hover">
                <template #header>
                  <div class="chart-header">
                    <el-icon><TrendCharts /></el-icon>
                    <span>影响因素归因分析</span>
                  </div>
                </template>
                <div class="chart-container">
                  <div ref="barChart" class="chart"></div>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>

        <el-divider />

        <!-- 结果解读 -->
        <div class="interpretation-section">
          <h2><el-icon><DocumentCopy /></el-icon> 结果解读</h2>
          <div class="interpretation-content">
            <el-alert
              :title="`您的心理健康评级：${testResult.level}`"
              :type="levelAlertType"
              show-icon
              :closable="false"
              class="level-alert"
            >
              <p>{{ interpretationText }}</p>
            </el-alert>

            <div class="risk-factors" v-if="highRiskFactors.length > 0">
              <h4>主要高危因素：</h4>
              <el-tag
                v-for="factor in highRiskFactors"
                :key="factor"
                type="danger"
                class="factor-tag"
              >
                {{ factor }}
              </el-tag>
            </div>
          </div>
        </div>

        <el-divider />

        <!-- 个性化建议 -->
        <div class="suggestions-section">
          <h2><el-icon><InfoFilled /></el-icon> 个性化建议</h2>
          <el-row :gutter="20">
            <el-col :xs="24" :sm="12" :lg="6" v-for="(category, index) in suggestionCategories" :key="index">
              <el-card class="suggestion-card" :class="`category-${category.key}`">
                <template #header>
                  <div class="category-header">
                    <span class="category-icon">{{ category.icon }}</span>
                    <span class="category-title">{{ category.title }}</span>
                  </div>
                </template>
                <ul class="suggestion-list">
                  <li v-for="suggestion in category.items" :key="suggestion">
                    {{ suggestion }}
                  </li>
                </ul>
              </el-card>
            </el-col>
          </el-row>
        </div>

        <el-divider />

        <!-- 操作按钮 -->
        <div class="actions-section">
          <el-space wrap>
            <el-button type="primary" :loading="exporting" @click="exportAsImage">
              <el-icon><Picture /></el-icon>
              导出图片
            </el-button>
            <el-button type="success" :loading="exporting" @click="exportAsPDF">
              <el-icon><Document /></el-icon>
              导出PDF
            </el-button>
            <el-button @click="retakeTest">
              <el-icon><Refresh /></el-icon>
              重新测评
            </el-button>
          </el-space>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useTestStore } from '@/store/testStore'
import { ElMessage, ElLoading } from 'element-plus'
import * as echarts from 'echarts'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import {
  Loading,
  DataAnalysis,
  Odometer,
  TrendCharts,
  DocumentCopy,
  InfoFilled,
  Picture,
  Document,
  Refresh
} from '@element-plus/icons-vue'

const router = useRouter()
const testStore = useTestStore()

// 响应式数据
const loading = ref(true)
const error = ref(false)
const exporting = ref(false)
const resultContainer = ref(null)

// 图表实例
let radarChart = null
let gaugeChart = null
let barChart = null

// 图表容器引用
const radarChartRef = ref(null)
const gaugeChartRef = ref(null)
const barChartRef = ref(null)

// 计算属性
const userInfo = computed(() => testStore.formData.userInfo)
const testResult = computed(() => testStore.testResult)

const genderText = computed(() => {
  const gender = userInfo.value.gender
  switch (gender) {
    case 'male': return '男'
    case 'female': return '女'
    case 'other': return '其他'
    default: return ''
  }
})

const levelTagType = computed(() => {
  const level = testResult.value.level
  switch (level) {
    case '低风险': return 'success'
    case '中风险': return 'warning'
    case '高风险': return 'danger'
    default: return 'info'
  }
})

const levelAlertType = computed(() => {
  const level = testResult.value.level
  switch (level) {
    case '低风险': return 'success'
    case '中风险': return 'warning'
    case '高风险': return 'error'
    default: return 'info'
  }
})

// 模拟数据 - 实际应该从store或API获取
const mockData = {
  indicators: {
    压力: 65,
    焦虑: 45,
    抑郁: 35,
    成瘾: 55,
    孤独: 40,
    攻击性: 30,
    幸福感: 60
  },
  stressLevel: 65,
  factors: {
    '夜间游戏时长': 85,
    '不良对局接触度': 70,
    '社交时间减少': 60,
    '睡眠质量下降': 75,
    '现实压力转移': 50
  }
}

// 解读文本
const interpretationText = computed(() => {
  const level = testResult.value.level
  const stressLevel = mockData.stressLevel

  if (level === '低风险') {
    return '您的游戏行为较为健康，各项心理指标都在正常范围内。游戏对您的生活影响有限，建议继续保持良好的游戏习惯。'
  } else if (level === '中风险') {
    return `您的游戏行为存在一定风险，压力水平为${stressLevel}分。建议适当控制游戏时间，关注心理健康状况。`
  } else {
    return `您的游戏行为存在较高风险，压力水平为${stressLevel}分，已达到高危区间。建议立即减少游戏时间，并寻求专业心理咨询师的帮助。`
  }
})

// 高危因素
const highRiskFactors = computed(() => {
  const factors = []
  Object.entries(mockData.factors).forEach(([key, value]) => {
    if (value >= 70) {
      factors.push(key)
    }
  })
  return factors
})

// 建议分类
const suggestionCategories = computed(() => {
  const level = testResult.value.level
  const baseSuggestions = {
    low: {
      game: ['保持适度的游戏时间', '选择积极向上的游戏内容'],
      sleep: ['维持规律的作息时间', '保证充足的睡眠'],
      social: ['保持良好的社交关系', '参与线下活动'],
      exercise: ['坚持适量运动', '培养健康的生活习惯']
    },
    medium: {
      game: ['控制每日游戏时间不超过2小时', '避免熬夜游戏', '选择益智类游戏'],
      sleep: ['调整作息时间', '睡前避免使用电子设备'],
      social: ['增加与朋友的交流', '参加社交活动'],
      exercise: ['每周进行3-4次运动', '培养运动习惯']
    },
    high: {
      game: ['立即停止过度游戏', '寻求专业帮助', '参加游戏成瘾干预'],
      sleep: ['建立规律的睡眠 schedule', '咨询睡眠专家'],
      social: ['重建社交网络', '参加支持小组'],
      exercise: ['开始规律的体育锻炼', '寻求运动教练指导']
    }
  }

  const key = level === '低风险' ? 'low' : level === '中风险' ? 'medium' : 'high'
  const suggestions = baseSuggestions[key]

  return [
    { key: 'game', title: '游戏调整', icon: '🎮', items: suggestions.game },
    { key: 'sleep', title: '作息调整', icon: '😴', items: suggestions.sleep },
    { key: 'social', title: '社交调整', icon: '👥', items: suggestions.social },
    { key: 'exercise', title: '运动调整', icon: '🏃', items: suggestions.exercise }
  ]
})

// 初始化图表
const initCharts = async () => {
  await nextTick()

  // 雷达图
  if (radarChartRef.value) {
    radarChart = echarts.init(radarChartRef.value)
    const radarOption = {
      radar: {
        indicator: [
          { name: '压力', max: 100 },
          { name: '焦虑', max: 100 },
          { name: '抑郁', max: 100 },
          { name: '成瘾', max: 100 },
          { name: '孤独', max: 100 },
          { name: '攻击性', max: 100 },
          { name: '幸福感', max: 100 }
        ],
        radius: '60%'
      },
      series: [{
        type: 'radar',
        data: [{
          value: Object.values(mockData.indicators),
          name: '心理指标',
          areaStyle: {
            color: 'rgba(103, 194, 58, 0.3)'
          },
          lineStyle: {
            color: '#67c23a'
          }
        }]
      }]
    }
    radarChart.setOption(radarOption)
  }

  // 仪表盘
  if (gaugeChartRef.value) {
    gaugeChart = echarts.init(gaugeChartRef.value)
    const gaugeOption = {
      series: [{
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max: 100,
        splitNumber: 10,
        axisLine: {
          lineStyle: {
            width: 20,
            color: [
              [0.3, '#67c23a'],
              [0.6, '#e6a23c'],
              [1, '#f56c6c']
            ]
          }
        },
        pointer: {
          icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
          length: '12%',
          width: 20,
          offsetCenter: [0, '-60%'],
          itemStyle: {
            color: 'auto'
          }
        },
        axisTick: {
          length: 12,
          lineStyle: {
            color: 'auto',
            width: 2
          }
        },
        splitLine: {
          length: 20,
          lineStyle: {
            color: 'auto',
            width: 5
          }
        },
        axisLabel: {
          color: '#464646',
          fontSize: 12,
          distance: -60,
          formatter: function (value) {
            if (value === 0) {
              return '0'
            } else if (value === 30) {
              return '30'
            } else if (value === 60) {
              return '60'
            } else if (value === 100) {
              return '100'
            }
            return ''
          }
        },
        title: {
          offsetCenter: [0, '-20%'],
          fontSize: 16
        },
        detail: {
          fontSize: 30,
          offsetCenter: [0, '0%'],
          valueAnimation: true,
          formatter: function (value) {
            return value + ''
          },
          color: 'auto'
        },
        data: [{
          value: mockData.stressLevel,
          name: '压力水平'
        }]
      }]
    }
    gaugeChart.setOption(gaugeOption)
  }

  // 柱状图
  if (barChartRef.value) {
    barChart = echarts.init(barChartRef.value)
    const barOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: Object.keys(mockData.factors),
        axisLabel: {
          rotate: 45,
          interval: 0
        }
      },
      yAxis: {
        type: 'value',
        max: 100
      },
      series: [{
        name: '影响权重',
        type: 'bar',
        data: Object.values(mockData.factors),
        itemStyle: {
          color: function(params) {
            const value = params.data
            if (value >= 70) return '#f56c6c'
            if (value >= 50) return '#e6a23c'
            return '#67c23a'
          }
        }
      }]
    }
    barChart.setOption(barOption)
  }

  // 响应式调整
  window.addEventListener('resize', resizeCharts)
}

// 调整图表大小
const resizeCharts = () => {
  if (radarChart) radarChart.resize()
  if (gaugeChart) gaugeChart.resize()
  if (barChart) barChart.resize()
}

// 导出为图片
const exportAsImage = async () => {
  if (!resultContainer.value) return

  exporting.value = true
  const loading = ElLoading.service({
    lock: true,
    text: '正在生成图片...',
    background: 'rgba(0, 0, 0, 0.7)'
  })

  try {
    const canvas = await html2canvas(resultContainer.value, {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff'
    })

    const link = document.createElement('a')
    link.download = `游戏心理测评报告_${userInfo.value.name}_${new Date().toLocaleDateString()}.png`
    link.href = canvas.toDataURL()
    link.click()

    ElMessage.success('图片导出成功！')
  } catch (error) {
    console.error('图片导出失败:', error)
    ElMessage.error('图片导出失败，请重试')
  } finally {
    exporting.value = false
    loading.close()
  }
}

// 导出为PDF
const exportAsPDF = async () => {
  if (!resultContainer.value) return

  exporting.value = true
  const loading = ElLoading.service({
    lock: true,
    text: '正在生成PDF...',
    background: 'rgba(0, 0, 0, 0.7)'
  })

  try {
    const canvas = await html2canvas(resultContainer.value, {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff'
    })

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')

    const imgWidth = 210
    const pageHeight = 295
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight

    let position = 0

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    pdf.save(`游戏心理测评报告_${userInfo.value.name}_${new Date().toLocaleDateString()}.pdf`)

    ElMessage.success('PDF导出成功！')
  } catch (error) {
    console.error('PDF导出失败:', error)
    ElMessage.error('PDF导出失败，请重试')
  } finally {
    exporting.value = false
    loading.close()
  }
}

// 重新测评
const retakeTest = () => {
  testStore.resetTest()
  router.push('/guide')
}

// 重试加载
const retryLoad = () => {
  loading.value = true
  error.value = false
  // 模拟重新加载数据
  setTimeout(() => {
    loading.value = false
  }, 2000)
}

// 生命周期
onMounted(async () => {
  console.log('=== Result页面onMounted开始 ===')

  // 暂时注释掉检查逻辑，直接显示结果页面
  /*
  // 等待一小段时间确保store状态已更新
  await nextTick()

  console.log('Result页面加载，检查测评状态...')
  console.log('testResult:', testStore.testResult)
  console.log('completed:', testStore.testResult.completed)
  console.log('userInfo:', testStore.formData.userInfo)
  console.log('answers:', testStore.formData.answers)

  // 检查是否已完成测评
  if (!testStore.testResult.completed) {
    console.log('测评未完成，重定向到表单页面')
    ElMessage.warning('请先完成测评')
    await router.push('/test')
    return
  }
  */

  console.log('测评已完成，开始加载结果页面...')

  try {
    // 模拟数据加载
    await new Promise(resolve => setTimeout(resolve, 2000))
    loading.value = false
    await initCharts()
  } catch (err) {
    console.error('加载失败:', err)
    loading.value = false
    error.value = true
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeCharts)
  if (radarChart) radarChart.dispose()
  if (gaugeChart) gaugeChart.dispose()
  if (barChart) barChart.dispose()
})
</script>

<style scoped>
.result-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20px;
}

.loading-container,
.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.loading-card,
.error-card {
  max-width: 500px;
  text-align: center;
}

.loading-content {
  padding: 40px;
}

.loading-icon {
  color: #409eff;
  margin-bottom: 20px;
}

.result-container {
  max-width: 1200px;
  margin: 0 auto;
}

.result-card {
  background: #ffffff;
}

.header-section {
  text-align: center;
  margin-bottom: 20px;
}

.title {
  font-size: 28px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 20px;
}

.user-info {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

.charts-section {
  margin-bottom: 30px;
}

.chart-card {
  height: 100%;
}

.chart-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #2c3e50;
}

.chart-container {
  height: 350px;
  width: 100%;
}

.gauge-legend {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 15px;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 50%;
}

.legend-color.low {
  background-color: #67c23a;
}

.legend-color.medium {
  background-color: #e6a23c;
}

.legend-color.high {
  background-color: #f56c6c;
}

.interpretation-section,
.suggestions-section {
  margin-bottom: 30px;
}

.interpretation-section h2,
.suggestions-section h2 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 20px;
}

.level-alert {
  margin-bottom: 20px;
}

.risk-factors {
  margin-top: 15px;
}

.risk-factors h4 {
  color: #e74c3c;
  margin-bottom: 10px;
  font-size: 16px;
}

.factor-tag {
  margin-right: 8px;
  margin-bottom: 8px;
}

.suggestion-card {
  height: 100%;
}

.category-game {
  border-left: 4px solid #409eff;
}

.category-sleep {
  border-left: 4px solid #67c23a;
}

.category-social {
  border-left: 4px solid #e6a23c;
}

.category-exercise {
  border-left: 4px solid #f56c6c;
}

.category-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.category-icon {
  font-size: 18px;
}

.category-title {
  font-weight: 600;
  color: #2c3e50;
}

.suggestion-list {
  padding-left: 20px;
  margin: 0;
}

.suggestion-list li {
  margin-bottom: 8px;
  color: #666;
  line-height: 1.5;
}

.actions-section {
  text-align: center;
  padding-top: 20px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .result-page {
    padding: 10px;
  }

  .title {
    font-size: 24px;
  }

  .chart-container {
    height: 280px;
  }

  .gauge-legend {
    gap: 15px;
  }

  .user-info {
    flex-direction: column;
    align-items: center;
  }

  .suggestion-list {
    padding-left: 15px;
  }
}

@media (max-width: 480px) {
  .title {
    font-size: 20px;
  }

  .chart-container {
    height: 250px;
  }

  .interpretation-section h2,
  .suggestions-section h2 {
    font-size: 18px;
  }
}
</style>