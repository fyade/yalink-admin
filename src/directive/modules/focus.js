import { nextTick } from "vue";

/**
 * v-focus 页面挂载后自动聚焦
 */
const focus = {
  beforeMount(el) {
    nextTick(() => {
      el.focus()
    })
  }
}

export default focus
