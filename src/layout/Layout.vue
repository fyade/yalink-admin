<script setup>
import LeftMenu from '@/layout/menu/LeftMenu.vue';
</script>

<template>
  <div class="layout-container common-layout">
    <el-container>
      <el-aside class="left" width="200px">
        <LeftMenu/>
      </el-aside>
      <el-container>
        <el-main>
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped lang="scss">
.layout-container {
  width: 100%;
  height: 100%;

  > * {
    width: 100%;
    height: 100%;

    > .left {
      height: 100%;

      > * {
        min-height: 100%;
      }
    }
  }
}
</style>