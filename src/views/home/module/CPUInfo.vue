<script setup>
import { getCPUInfo } from "api/admin/System.js";
import { onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { breakCyclicRequest, cyclicRequest } from "utils/request.js";
import Doughnut from "comp/chart/Doughnut.vue";
import { strToNum } from "utils/rate-util.js";

const state = reactive({
  info: {
    coreCount: '-',
    threadCount: '-',
    cpuUsage: '-'
  },
  dict: {}
})
const loadingRef = ref(false)
let eventId = ''

onMounted(() => {
  loadingRef.value = true
  eventId = cyclicRequest({
    func: getCPUInfo,
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
      title="CPU状态"
      :percent="strToNum(state.info.cpuUsage)"
      doughnut-color="#3e93c5"
      doughnut-bg-color="#d9e7f1"
  />
</template>

<style scoped lang="scss">
</style>