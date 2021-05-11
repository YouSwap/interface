// import Vue from 'vue';
import axios from 'axios';
axios.defaults.baseURL = process.env.VUE_APP_API_ROOT
axios.defaults.timeout = 5000
axios.defaults.withCredentials = false
axios.defaults.crossDomain = true
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

// http request 拦截器
axios.interceptors.request.use(
  config => {
    return config
  },
  error => {
    return Promise.reject(error);
  }
);
// http response 拦截器
axios.interceptors.response.use(
  response => {
    // let code = response.data.code
    return response.data
  },
  error => {
    // 网络异常提示（处理500/404等服务器异常问题）
    if (error.request.status == 404 || error.request.status == 500) {
      // Vue.prototype.$message({
      //   message: '服务器异常，请稍后重试！',
      //   type: 'warning',
      //   center: true
      // });
    } else {
      // Vue.prototype.$message({
      //   message: '加载失败，请稍后重试！',
      //   type: 'warning',
      //   center: true
      // })
    }
  }
)

/**
 * 封装get
 */

export function get (url, params = {}) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: params
    })
      .then(response => {
        resolve(response)
      })
      .catch(err => {
        reject(err)
      })
  })
}


/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function post (url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.post(url, data)
      .then(response => {
        resolve(response)
      }, err => {
        reject(err)
      })
  })
}
