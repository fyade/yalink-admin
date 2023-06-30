import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import 'element-plus/dist/index.css'
import 'ant-design-vue/dist/antd.css';
import './assets/css/index.scss'
import lazyPlugin from "vue3-lazy"

import imgLoading from '@/assets/images/default.png'
import imgError from '@/assets/images/default.png'

const pinia = createPinia()
const app = createApp(App)

app.directive('noMoreClick', el => {
  // let func = e => {
  //   el.disabled = true
  //   console.log(el.classList.contains('is-disabled'))
  //   el.classList.add('is-disabled')
  //   let timer = setTimeout(() => {
  //     console.log('aaa')
  //     el.disabled = false
  //     el.classList.remove('is-disabled')
  //     clearTimeout(timer)
  //   }, 2000)
  // }
  // el.addEventListener('click', func)
})

app.use(pinia);
app.use(router);
app.use(lazyPlugin, {
  loading: imgLoading, // loading时显示
  error: imgError // 加载失败时显示
})
app.mount('#app')
