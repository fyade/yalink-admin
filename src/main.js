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
import directives from "@/directive/index.js";

const pinia = createPinia()
const app = createApp(App)

app.use(pinia);
app.use(router);
app.use(lazyPlugin, {
  loading: imgLoading, // loading时显示
  error: imgError // 加载失败时显示
})
app.use(directives)
app.mount('#app')
