import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import 'element-plus/dist/index.css'
import 'ant-design-vue/dist/antd.css';
import './assets/css/index.scss'

const pinia = createPinia()
const app = createApp(App)

app.directive('noMoreClick', el => {
  el.addEventListener('click', e => {
    el.disabled = true
    el.classList.add('is-disabled')
    let timer = setTimeout(() => {
      el.disabled = false
      el.classList.remove('is-disabled')
      clearTimeout(timer)
    }, 2000)
  })
})

app.use(pinia);
app.use(router);
app.mount('#app')
