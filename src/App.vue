<script setup>
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

const zh = () => {
  return zhCn
}
</script>

<template>
  <el-config-provider :locale="zh()">
    <router-view/>
  </el-config-provider>
</template>

<style lang="scss" scoped>
</style>
