import axios from 'axios'

// 创建axios实例
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api', 
  timeout: 2000, // 超时时间2秒
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器：数据脱敏处理
api.interceptors.request.use(
  (config) => {
    // 在请求发送前进行数据脱敏处理
    if (config.data) {
      // 脱敏敏感信息，例如手机号、身份证等
      config.data = desensitizeData(config.data)
    }

    // 添加请求时间戳，防止缓存
    config.params = {
      ...config.params,
      _t: Date.now(),
    }

    return config
  },
  (error) => {
    // 请求错误处理
    console.error('请求拦截器错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    // 响应成功处理
    const { data } = response

    // 假设后端返回格式为 { code: 200, data: {...}, message: '...' }
    if (data.code === 200) {
      return data.data // 只返回数据部分
    } else {
      // 处理业务错误
      const error = new Error(data.message || '请求失败')
      error.code = data.code
      return Promise.reject(error)
    }
  },
  (error) => {
    // 响应错误处理
    if (error.response) {
      // 服务器返回错误状态码
      const { status, data } = error.response
      switch (status) {
        case 401:
          // 未授权，跳转登录页
          console.error('未授权，请重新登录')
          // 这里可以触发登录逻辑
          break
        case 403:
          console.error('拒绝访问')
          break
        case 404:
          console.error('请求地址不存在')
          break
        case 500:
          console.error('服务器内部错误')
          break
        default:
          console.error(`请求失败: ${status}`)
      }
    } else if (error.code === 'ECONNABORTED') {
      // 超时错误
      console.error('请求超时，请检查网络连接')
    } else {
      // 网络错误或其他错误
      console.error('网络错误:', error.message)
    }

    return Promise.reject(error)
  }
)

// 数据脱敏函数
function desensitizeData(data) {
  if (typeof data !== 'object' || data === null) {
    return data
  }

  const desensitized = Array.isArray(data) ? [...data] : { ...data }

  // 递归处理嵌套对象
  for (const key in desensitized) {
    if (desensitized.hasOwnProperty(key)) {
      const value = desensitized[key]

      // 手机号脱敏：保留前3后4位
      if (key.toLowerCase().includes('phone') && typeof value === 'string') {
        desensitized[key] = value.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
      }
      // 身份证号脱敏：保留前6后4位
      else if (key.toLowerCase().includes('idcard') && typeof value === 'string') {
        desensitized[key] = value.replace(/(\d{6})\d{8}(\d{4})/, '$1********$2')
      }
      // 邮箱脱敏：保留前2位和@后域名
      else if (key.toLowerCase().includes('email') && typeof value === 'string') {
        const [prefix, domain] = value.split('@')
        if (prefix && domain) {
          desensitized[key] = `${prefix.substring(0, 2)}***@${domain}`
        }
      }
      // 递归处理嵌套对象或数组 
      else if (typeof value === 'object') {
        desensitized[key] = desensitizeData(value)
      }
    }
  }

  return desensitized
}

// 导出axios实例
export default api

// 导出常用请求方法
export const get = (url, params) => api.get(url, { params })
export const post = (url, data) => api.post(url, data)
export const put = (url, data) => api.put(url, data)
export const del = (url, data) => api.delete(url, { data })