<script setup>
import { onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { breakCyclicRequest, cyclicRequest } from "utils/request.js";
import { getSystemInfo } from "api/admin/System.js";

let state = reactive({
  info: {
    hostName: '-',
    osName: '-',
    osArch: '-',
    osVersion: '-',
    jarStartTime: '-',
    jarRunTime: '-'
  },
  dict: {
    hostName: '主机名称',
    osName: '系统名称',
    osArch: '系统类型',
    osVersion: '内核版本',
    jarStartTime: '后端启动时间',
    jarRunTime: '后端运行时间'
  }
})
let loadingRef = ref(false)
let eventId = ''

onMounted(() => {
  loadingRef.value = true
  eventId = cyclicRequest({
    func: getSystemInfo,
    interval: 10000,
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
  <div class="system-info-container">
    <div class="left">
      <div v-for="(item,i) in Object.keys(state.info)" :key="i">{{ state.dict[item] }}</div>
    </div>
    <div class="right">
      <div v-for="(item,i) in Object.values(state.info)" :key="i">{{ item }}</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.system-info-container {
  display: flex;
  gap: 16px;

  > * {
    line-height: 30px;
  }

  > .left {
    width: 100px;
    font-weight: 600;
    text-align: right;
  }

  > .right {
  }
}
</style>