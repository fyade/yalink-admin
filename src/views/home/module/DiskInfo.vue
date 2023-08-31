<script setup>
import { getDiskInfo } from "api/admin/System.js";
import { onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { breakCyclicRequest, cyclicRequest } from "utils/request.js";

let state = reactive({
  list: []
})
let loadingRef = ref(false)
let eventId = ''

onMounted(() => {
  loadingRef.value = true
  eventId = cyclicRequest({
    func: getDiskInfo,
    resolve: res => {
      state.list = res.data
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
  <div class="disk-info-container" v-loading="loadingRef">
    <div v-for="(item,i) in state.list" :key="i">
      <div class="left">
        <p>{{ item.drive }}</p>
        <div :style="{
        backgroundImage: `linear-gradient(90deg, ${Number(item.usageRate.replace('%',''))<90?'#26a0da':'#da2626'} ${item.usageRate}, #e6e6e6 ${item.usageRate})`
      }"/>
      </div>
      <div class="right">
        <p><span>{{ item.freeCapacity.replace('GB', ' GB') }}</span>可用,
          共<span>{{ item.totalCapacity.replace('GB', ' GB') }}</span></p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.disk-info-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow: auto;

  > div {
    display: flex;
    align-items: flex-end;
    gap: 8px;

    > .left {
      flex: auto;

      > p {
      }

      > div {
        width: 100%;
        height: 16px;
        border: 1px solid #bdbdbd;
      }
    }

    > .right {
      flex: none;
      width: 200px;

      > p {
        > span {
          margin: 0 4px;
        }
      }
    }
  }
}
</style>