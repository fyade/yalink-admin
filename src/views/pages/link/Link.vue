<script setup>
import { nextTick, reactive } from "vue"
import { deepRecursion } from "utils/dataUtils.js"
import { selList as selSortList } from 'api/admin/adminSort.js'
import LinkOfSort from "views/pages/link/LinkOfSort.vue";

let state = reactive({
  sort_current: {},
  list_sort: []
})

selSortList().then(res => {
  let data = res.data
  deepRecursion(data)
  state.list_sort = data
})
const handleNodeClick = (data) => {
  if (data.children.length === 0) {
    state.sort_current = data
  }
}
</script>

<template>
  <el-container>
    <el-aside width="200px">
      <el-tree
          :data="state.list_sort"
          highlight-current
          @node-click="handleNodeClick"
      />
    </el-aside>

    <el-main>
      <!--<div v-loading="Object.keys(state.sort_current).length===0" element-loading-text="请先在左侧选择所属分类">-->
      <!--  <LinkOfSort :sort-id="state.sort_current.id"/>-->
      <!--</div>-->
      <template v-if="Object.keys(state.sort_current).length===0">
        <div>请先在左侧选择所属分类</div>
      </template>
      <template v-else>
        <LinkOfSort :sort-id="state.sort_current.id" :list-sort="state.list_sort"/>
      </template>
    </el-main>
  </el-container>
</template>

<style scoped lang="scss">
</style>