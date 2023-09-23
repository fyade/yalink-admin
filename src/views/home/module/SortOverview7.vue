<script setup>
import { onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { breakCyclicRequest, cyclicRequest } from "utils/request.js";
import { getSortOfWeek } from "api/admin/System.js";
import EChart from "comp/chart/EChart.vue";

const state = reactive({
  info: {},
  option: {}
})
const loadingRef = ref(false)
let eventId = null

onMounted(() => {
  loadingRef.value = true
  eventId = cyclicRequest({
    func: getSortOfWeek,
    interval: 10000,
    resolve: res => {
      state.info = res.data
      state.option = {
        xAxis: {
          type: 'category',
          name: '日期',
          data: state.info.xlist
        },
        yAxis: {
          type: 'value',
          name: '数量',
          minInterval: 1
        },
        grid: {
          top: '50px',
          right: '50px',
          bottom: '30px',
          left: '30px'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        series: [
          {
            type: 'line',
            smooth: true,
            markPoint: {
              data: [
                { type: 'max', name: 'Max' },
                { type: 'min', name: 'Min' }
              ]
            },
            data: state.info.ylist
          }
        ]
      }
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
  <EChart :option="state.option"/>
</template>

<style scoped lang="scss">

</style>