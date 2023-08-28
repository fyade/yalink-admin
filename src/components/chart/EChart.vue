<script setup>
import { onMounted, ref, watchEffect } from "vue";
import * as echarts from "echarts";

const props = defineProps({
  option: {
    type: Object,
    required: true
  }
})
const el = ref(null)
let chart = null

onMounted(() => {
  watchEffect(() => {
    init()
  })
})

const init = () => {
  if (Object.keys(props.option).length === 0) {
    return
  }
  echarts.dispose(el.value)
  chart = echarts.init(el.value);
  chart.setOption(props.option);
}
</script>

<template>
  <div class="el" ref="el"></div>
</template>

<style scoped lang="scss">
.el {
  width: 100%;
  height: 100%;
}
</style>