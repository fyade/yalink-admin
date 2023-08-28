<script setup>
import ItemWrap from "comp/itemWrap/ItemWrap.vue";
import DiskInfo from "views/home/DiskInfo.vue";
import SystemInfo from "views/home/SystemInfo.vue";
import MemoryInfo from "views/home/MemoryInfo.vue";
</script>

<template>
  <el-row :gutter="20">
    <el-col :span="12">
      <ItemWrap title="系统信息">
        <SystemInfo/>
      </ItemWrap>
    </el-col>
    <el-col :span="12">
      <ItemWrap title="磁盘状态">
        <DiskInfo/>
      </ItemWrap>
    </el-col>
  </el-row>
</template>

<style scoped lang="scss">

</style>