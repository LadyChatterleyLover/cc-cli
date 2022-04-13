module.exports = (message, ui) => {
  return `
  import axios, { AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios'
  import nProgress from 'nprogress'
  import 'nprogress/nprogress.css'
  import {${message}} from '${ui}'

  const isPro = process.env.NODE_ENV === 'production'

  const http = axios.create({
    baseURL: isPro ? '' : '/api',
    timeout: 10000
  })


  http.interceptors.request.use((config: AxiosRequestConfig) => {
    nProgress.start()
    let token = localStorage.getItem('token')
    if (token) {
      config.headers!['Authorization'] = token
    }
    return config
  }, (err: AxiosError) => {
    nProgress.done()
    return Promise.reject(err)
  })


  http.interceptors.response.use((res: AxiosResponse) => {
    nProgress.done()
    return res.data
  }, (err: AxiosError) => {
    nProgress.done()
    let status = err.response && err.response.status
    if (status === 400) {
      ${message}.error('参数错误')
    }
    if (status === 401) {
      ${message}.error('登录过期')
    }
    if (status === 403) {
      ${message}.error('没有权限')
    }
    if (status === 404) {
      ${message}.error('路径错误')
    }
    if (status === 500) {
      ${message}.error('服务器错误')
    }
    if (status === 503) {
      ${message}.error('服务器在维护')
    }
    return Promise.reject(err)
  })

  export default http
  `
}