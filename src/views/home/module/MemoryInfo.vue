<script setup>
import { onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { breakCyclicRequest, cyclicRequest } from "utils/request.js";
import { getMemoryInfo } from "api/admin/System.js";
import Doughnut from "comp/chart/Doughnut.vue";
import { strToNum } from "utils/rate-util.js";

let state = reactive({
  info: {
    maxMemory: '-',
    totalMemory: '-',
    usedMemory: '-',
    freeMemory: '-',
    usageRate: '-'
  },
  dict: {
    maxMemory: '最大可用内存',
    totalMemory: '已申请内存',
    usedMemory: '已用内存',
    freeMemory: '空余内存',
    usageRate: '使用率'
  }
})
let loadingRef = ref(false)
let eventId = ''

onMounted(() => {
  loadingRef.value = true
  eventId = cyclicRequest({
    func: getMemoryInfo,
    interval: 1000,
    resolve: res => {
      const data = res.data
      Object.keys(state.info).forEach(item => {
        state.info[item] = data[item]
      })
    },
    final: () => {
      loadingRef.value = false
    }
  })
})
onBeforeUnmount(() => {
  breakCyclicRequest(eventId)
})
</script>

<template>
  <Doughnut
      title="内存状态"
      :percent="strToNum(state.info.usageRate)"
      doughnut-color="#982eb6"
      doughnut-bg-color="#f4f2f4"
  />
</template>

<style scoped lang="scss">

</style>