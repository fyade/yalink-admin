<script setup>
import { getNumsInfo } from "api/admin/System.js";
import { onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { breakCyclicRequest, cyclicRequest } from "utils/request.js";

const state = reactive({
  nums: {}
})
const loadingRef = ref(false)
let eventId = null

onMounted(() => {
  loadingRef.value = true
  eventId = cyclicRequest({
    func: getNumsInfo,
    resolve: res => {
      state.nums = res.data
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
  <div class="nums-info-container">
    <div>
      <p>搜索引擎数</p>
      <p>{{ state.nums.searchEngineNum }}</p>
    </div>
    <div>
      <p>分类数</p>
      <p>{{ state.nums.sortNum }}</p>
    </div>
    <div>
      <p>链接数</p>
      <p>{{ state.nums.linkNum }}</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.nums-info-container {
  display: flex;

  > div {
    width: 120px;
    aspect-ratio: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;

    > p {
      &:nth-child(1) {
        color: #999;
        font-size: 16px;
      }

      &:nth-child(2) {
        font-size: 20px;
      }
    }
  }
}
</style>