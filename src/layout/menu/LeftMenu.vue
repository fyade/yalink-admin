<script setup>
import { onMounted, onUpdated, reactive, ref, toRaw, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useMenuStore } from 'store/module/menu.js'

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

const handleOpen = (key, keyPath) => {
}
const handleClose = (key, keyPath) => {
}
const openGiteeIssues = () => {
  window.open('https://gitee.com/fyade/yalink-admin/issues')
}
</script>

<template>
  <el-menu
      class="el-menu-vertical-demo"
      style="display: flex;flex-direction: column;"
      background-color="#304156"
      text-color="#fff"
      active-text-color="#409eff"
      :default-active="defaultActiveRef"
      router
      unique-opened
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
    <div style="display: flex;height: 60px;color: #fff;user-select: none;">
      <span style="margin: auto;">雅链后台管理系统</span>
    </div>
    <el-menu-item class="menuitem-1" index="/">
      <span>首页</span>
    </el-menu-item>

    <!--动态渲染-->
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
          <el-menu-item class="submenu menuitem-2" v-for="(iitem,j) in item.children" :key="j"
                        :index="item.mePath+iitem.mePath">
            {{ iitem.meName }}
          </el-menu-item>
        </el-sub-menu>
      </template>
    </template>
    <!--动态渲染-->

    <div style="flex: 1;"></div>

    <el-menu-item class="menuitem-1" @click="openGiteeIssues">
      <span>问题反馈</span>
    </el-menu-item>
  </el-menu>
</template>

<style scoped lang="scss">
.menuitem-1:hover {
  background-color: #2d3d51;
}

.menuitem-2:hover {
  background-color: #001528;
}

.submenu {
  background-color: #1f2d3d;
}
</style>