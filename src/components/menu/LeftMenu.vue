<script setup>
import { onMounted, onUpdated, reactive, ref, toRaw, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useMenuStore } from 'store/menu.js'

const route = useRoute()
const router = useRouter()

let defaultActiveRef = ref('');
let menuRea = reactive({
  list: []
});

onMounted(function () {
  defaultActiveRef.value = toRaw(route).path.value;
  getMenuList()
})
watch(() => router.currentRoute.value.path, () => {
  getMenuList()
})
const getMenuList = () => {
  menuRea.list = useMenuStore().getMenus();
}

let handleOpen = (key, keyPath) => {
  // console.log(key, keyPath)
}
let handleClose = (key, keyPath) => {
  // console.log(key, keyPath)
}
</script>

<template>
  <el-menu
      class="el-menu-vertical-demo"
      :default-active="defaultActiveRef"
      router
      @open="handleOpen"
      @close="handleClose"
  >
    <!--<el-menu-item :index="``">
      &lt;!&ndash;<el-icon>&ndash;&gt;
      &lt;!&ndash;  <icon-menu/>&ndash;&gt;
      &lt;!&ndash;</el-icon>&ndash;&gt;
      <span>home</span>
    </el-menu-item>
    <el-sub-menu :index="`/user`">
      <template #title>
        &lt;!&ndash;<el-icon>&ndash;&gt;
        &lt;!&ndash;  <location/>&ndash;&gt;
        &lt;!&ndash;</el-icon>&ndash;&gt;
        <span>用户管理</span>
      </template>
      <el-menu-item :index="`/user/user`">用户管理</el-menu-item>
      <el-menu-item :index="`/user/loginlog`">登录日志</el-menu-item>
    </el-sub-menu>
    <el-sub-menu :index="`/sec`">
      <template #title>
        <span>权限管理</span>
      </template>
      <el-menu-item :index="`/sec/role`">角色管理</el-menu-item>
      <el-menu-item :index="`/sec/user-role`">用户角色管理</el-menu-item>
      <el-menu-item :index="`/sec/menu`">菜单管理</el-menu-item>
      <el-menu-item :index="`/sec/role-menu`">角色权限管理</el-menu-item>
    </el-sub-menu>
    <el-sub-menu :index="`/file`">
      <template #title>
        <span>文件管理</span>
      </template>
      <el-menu-item :index="`/file/upload`">上传日志</el-menu-item>
    </el-sub-menu>
    <el-menu-item :index="`/sort`">
      <span>分类管理</span>
    </el-menu-item>
    <el-sub-menu :index="`/link`">
      <template #title>
        <span>链接管理</span>
      </template>
      <el-menu-item :index="`/link/tableview`">表格视图1</el-menu-item>
    </el-sub-menu>
    <el-sub-menu :index="`/t1`">
      <template #title>
        <span>t1</span>
      </template>
      <el-menu-item :index="`/t1/t11`">t11</el-menu-item>
      <el-menu-item :index="`/t1/t12`">t12</el-menu-item>
      <el-menu-item :index="`/t1/t13`">t13</el-menu-item>
    </el-sub-menu>
    <el-sub-menu :index="`/t2`">
      <template #title>
        <span>t2</span>
      </template>
      <el-menu-item :index="`/t2/t21`">t21</el-menu-item>
      <el-menu-item :index="`/t2/t22`">t22</el-menu-item>
      <el-menu-item :index="`/t2/t23`">t23</el-menu-item>
    </el-sub-menu>
    <el-sub-menu :index="`/t3`">
      <template #title>
        <span>t3</span>
      </template>
      <el-menu-item :index="`/t3/t31`">t31</el-menu-item>
      <el-menu-item :index="`/t3/t32`">t32</el-menu-item>
      <el-menu-item :index="`/t3/t33`">t33</el-menu-item>
    </el-sub-menu>-->
    <template v-for="(item,i) in menuRea.list" :key="i">
      <template v-if="item.children.length===0">
        <el-menu-item :index="item.mePath">
          <span>{{ item.meName }}</span>
        </el-menu-item>
      </template>
      <template v-else>
        <el-sub-menu :index="item.mePath">
          <template #title>
            <span>{{ item.meName }}</span>
          </template>
          <el-menu-item v-for="(iitem,j) in item.children" :key="j" :index="item.mePath+iitem.mePath">
            {{ iitem.meName }}
          </el-menu-item>
        </el-sub-menu>
      </template>
    </template>
  </el-menu>
</template>

<style scoped lang="scss">

</style>