/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/api.ts
import axios from 'axios'

const api = axios.create({
  baseURL: 'https://dummyjson.com',
})

// Prevent multiple simultaneous refresh requests
let isRefreshing = false
let failedQueue: any[] = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

// REQUEST interceptor: attach access token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// RESPONSE interceptor: handle 401 and refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Only trigger refresh if we get a 401 and haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return api(originalRequest)
          })
          .catch(Promise.reject)
      }

      isRefreshing = true

      try {
        const refreshToken = localStorage.getItem('refreshToken')
        if (!refreshToken) throw new Error('No refresh token')

        const res = await axios.post('https://dummyjson.com/auth/refresh', {
          refreshToken,
        })

        const newAccessToken = res.data.accessToken
        localStorage.setItem('authToken', newAccessToken)

        processQueue(null, newAccessToken)

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return api(originalRequest)
      } catch (err) {
        processQueue(err, null)

        // 🚨 Clear tokens and redirect
        localStorage.removeItem('authToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')

        window.location.href = '/login'

        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  },
)

export default api
