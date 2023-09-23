<script setup>
import ItemWrap from "comp/itemWrap/ItemWrap.vue";
import DiskInfo from "views/home/module/DiskInfo.vue";
import SystemInfo from "views/home/module/SystemInfo.vue";
import MemoryInfo from "views/home/module/MemoryInfo.vue";
import CPUInfo from "views/home/module/CPUInfo.vue";
import NumsInfo from "views/home/module/NumsInfo.vue";
import SortOverview7 from "views/home/module/SortOverview7.vue";
import LinkOverview7 from "views/home/module/LinkOverview7.vue";

const gutter = 20
</script>

<template>
  <div class="home-container">
    <el-row :gutter="gutter">
      <el-col :span="6">
        <ItemWrap title="系统信息">
          <SystemInfo/>
        </ItemWrap>
      </el-col>
      <el-col :span="12">
        <ItemWrap title="磁盘状态">
          <DiskInfo/>
        </ItemWrap>
      </el-col>
      <el-col :span="6">
        <ItemWrap title="CPU状态">
          <CPUInfo/>
        </ItemWrap>
      </el-col>
    </el-row>
    <el-row :gutter="gutter">
      <el-col :span="18">
        <ItemWrap title="基本信息">
          <NumsInfo/>
        </ItemWrap>
      </el-col>
      <el-col :span="6">
        <ItemWrap title="内存状态">
          <MemoryInfo/>
        </ItemWrap>
      </el-col>
    </el-row>
    <el-row :gutter="gutter">
      <el-col :span="12">
        <ItemWrap title="新增分类数（周）">
          <SortOverview7/>
        </ItemWrap>
      </el-col>
      <el-col :span="12">
        <ItemWrap title="新增链接数（周）">
          <LinkOverview7/>
        </ItemWrap>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">
.home-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>