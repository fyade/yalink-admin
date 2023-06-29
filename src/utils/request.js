import axios from 'axios'
import { ElMessage } from 'element-plus'
import useStore from 'store'

let ax = axios.create()

ax.defaults.baseURL = import.meta.env.VITE_APP_REQ_PREFIX
ax.defaults.timeout = 3000

ax.interceptors.request.use(config => {
  config.headers['Authorization'] = useStore().user.tokenRef
  return config
});

ax.interceptors.response.use(
    function (res) {
      if (res.status >= 200 && res.status < 300) {
        res = res.data
        if (res.code >= 200 && res.code < 300) {
          return res
        } else {
          ElMessage.warning(res.msg)
          return Promise.reject(res)
        }
      } else {
        ElMessage.warning(res.data.msg)
        return Promise.reject(res)
      }
    },
    function (err) {
      ElMessage.error(err.message)
      return Promise.reject(err)
    }
);

export default ax
