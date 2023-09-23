import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import useStore from 'store'
import { generate10StringWithTimestamp } from "utils/random-util.js";
import { useRoute, useRouter } from "vue-router";
import router from "@/router/index.js";
import { useUserStore } from "store/module/user.js";

let request = axios.create()
request.defaults.baseURL = import.meta.env.VITE_APP_REQ_PREFIX
request.defaults.timeout = 3000

request.interceptors.request.use(config => {
  config.headers['Authorization'] = useStore().user.tokenRef
  return config
});

let isExpired = false
request.interceptors.response.use(
    function (res) {
      if (res.status >= 200 && res.status < 300) {
        res = res.data
        if (res.code >= 200 && res.code < 300) {
          return res
        } else if (res.code === 401) {
          if (!isExpired) {
            isExpired = true
            ElMessageBox.confirm(
                '登录状态已过期，是否重新登录？',
                '警告',
                {
                  confirmButtonText: '确认',
                  cancelButtonText: '取消',
                  type: 'warning',
                }
            )
                .then(() => {
                  useUserStore().clearInfo()
                  isExpired = false
                  router.push('/login')
                })
                .catch(() => {
                  isExpired = false
                })
          }
        } else {
          ElMessage.error(res.msg)
          return Promise.reject(res)
        }
      } else {
        ElMessage.error(res.data.msg)
        return Promise.reject(res)
      }
    },
    function (err) {
      ElMessage.error(err.message)
      return Promise.reject(err)
    }
);
export default request

let timers = {}

export function cyclicRequest({
                                func,
                                interval = 3000,
                                resolve,
                                reject,
                                final,
                                callback
                              }) {
  let id
  do {
    id = generate10StringWithTimestamp()
  } while (!!timers[id])

  const f = () => {
    func()
        .then(res => resolve && resolve(res))
        .catch(err => reject && reject(err))
        .finally(() => final && final())
  }
  f()
  timers[id] = setInterval(f, interval)
  callback && callback()
  return id
}

export function breakCyclicRequest(...ids) {
  for (let id of ids) {
    clearInterval(timers[id])
  }
}