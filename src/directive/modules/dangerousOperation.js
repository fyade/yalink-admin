import { ElMessage, ElMessageBox } from "element-plus";

/**
 * v-dangerous-operation 危险操作前确认
 * 参数：
 * resolve：确认回调函数
 */
const dangerousOperation = {
  beforeMount(el, binding) {
    el.addEventListener('click', () => {
      ElMessageBox.confirm(
          '此操作为危险操作，可能导致严重的事故，请确认是否继续？',
          '警告',
          {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
          }
      )
          .then(() => {
            binding.value.resolve()
          })
          .catch(() => {
            ElMessage.info('已取消')
          })
    })
  }
}

export default dangerousOperation
