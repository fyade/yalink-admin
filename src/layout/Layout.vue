<script setup>
import LeftMenu from '@/layout/menu/LeftMenu.vue';
import Index from "@/layout/header/Index.vue";
import { useTagsViewStore } from "store/module/tagsView.js";
</script>

<template>
  <div class="layout-container common-layout">
    <el-container>
      <el-aside class="left" width="200px">
        <LeftMenu/>
      </el-aside>
      <el-container>
        <el-header :style="{
          borderBottom: '1px solid #eee',
          boxShadow: '0 2px 12px 3px #eee'
        }">
          <Index/>
        </el-header>
        <el-main>
          <!--<KeepAlive :include="useTagsViewStore().state.list">-->
          <router-view/>
          <!--</KeepAlive>-->
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