import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:4000/api',
  timeout: 8000,
})

api.interceptors.request.use(
  (req) => {
    console.log('[API Request]', req.method?.toUpperCase(), req.url, 'data:', req.data)
    return req
  },
  (err) => {
    console.error('[API Request Error]', err)
    return Promise.reject(err)
  }
)

api.interceptors.response.use(
  (res) => {
    console.log('[API Response]', res.status, res.config.url, res.data)
    return res
  },
  (err) => {
    console.error('[API Response Error]', err.response?.status, err.response?.data || err.message)
    return Promise.reject(err)
  }
)

export default api
