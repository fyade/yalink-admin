<script setup>
import { selAll, insOne, delOne, delRole, updByList } from 'api/sec/secRoleMenu.js';
import { selAll as selAllMenu } from 'api/sec/secMenu.js';
import { selRole } from 'api/sec/secRole.js';
import { onMounted, reactive, ref, watch } from 'vue';
import useStore from 'store';
import { ElMessage, ElMessageBox } from 'element-plus';
import { deepRecursion, flatObjectArray } from 'utils/dataUtils.js';
import Pagination from 'comp/pagination/Pagination.vue';

const store = useStore();
onMounted(() => {
  getInfo();
});

let formRef = ref(null);
let loadingRef = ref(false);
let loadingRef2 = ref(false);
let loadingRef3 = ref(false);
let dialogVisibleRef = ref(false);
let infoRea = reactive({
  infoList: [],
  total: 0,
  editingVal: {},
  roleList: [],
  menuList: [],
  menuList_f: []
});
let typeRea = reactive({
  value: '',
  label: ''
});

watch(dialogVisibleRef, newVal => {
  if (newVal) {
    if (!!formRef.value) formRef.value.resetFields();
    getRoleInfo();
    getMenuInfo();
  } else {
    clear();
  }
});

let getInfo = () => {
  loadingRef.value = true;
  selAll(store.page.getPage).then(res => {
    infoRea.infoList = res.data.list;
    infoRea.total = Number(res.data.total);
  }).finally(() => {
    loadingRef.value = false;
  });
}
let getRoleInfo = () => {
  loadingRef2.value = true;
  selRole().then(res => {
    infoRea.roleList = res.data;
    infoRea.roleList.forEach(item => {
      item.label = item.name;
      item.value = item.id;
    });
  }).finally(() => {
    loadingRef2.value = false;
  });
}
let getMenuInfo = () => {
  loadingRef3.value = true;
  selAllMenu().then(res => {
    infoRea.menuList = res.data;
    deepRecursion(infoRea.menuList);
    infoRea.menuList_f = flatObjectArray(infoRea.menuList);
  }).finally(() => {
    loadingRef3.value = false;
  });
}
let clear = () => {
  infoRea.editingVal = {
    roleId: '',
    menuId: ''
  };
}

let diaCan = () => {
  dialogVisibleRef.value = false;
}
let diaCon_ = (arr, item, arr2) => {
  let me = infoRea.menuList_f.find(iitem => iitem.id === item);
  if (!!me && me.parentId !== '0') {
    arr2.push(me.parentId);
    diaCon_(arr, me.parentId, arr2);
  }
}
let diaCon = () => {
  if (!!!infoRea.editingVal.roleId) return ElMessage.warning('请选择角色id');
  if (!!!infoRea.editingVal.menuId) return ElMessage.warning('请选择权限id');
  let menuList = [];
  infoRea.editingVal.menuId.forEach(item => {
    menuList.push(item);
  });
  let arr2 = [];
  for (let i = 0; i < menuList.length; i++) {
    diaCon_(menuList, menuList[i], arr2);
  }
  menuList = Array.from(new Set([...menuList, ...arr2]));
  menuList = menuList.map(item => ({ menuId: item }));
  if (typeRea.value === 'ins') {
    updByList(infoRea.editingVal.roleId, menuList, 'add').then(res => {
      if (res) ElMessage.success('操作成功');
      getInfo();
      clear();
    }).finally(() => {
      dialogVisibleRef.value = false;
    });
  } else if (typeRea.value === 'upd') {
    updByList(infoRea.editingVal.roleId, menuList, 'edit').then(res => {
      if (res) ElMessage.success('操作成功');
      getInfo();
      clear();
    }).finally(() => {
      dialogVisibleRef.value = false;
    });
  } else {
    dialogVisibleRef.value = false;
  }
}
let topIns = () => {
  typeRea.label = '新增';
  typeRea.value = 'ins';
  dialogVisibleRef.value = true;
}
let tagClose = (roId, rmId) => {
  ElMessageBox.confirm(
      '请确认是否删除',
      '警告',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
  ).then(() => {
    delOne(roId, rmId).then(res => {
      if (res) ElMessage.success('操作成功');
      getInfo();
    })
  }).catch();
}
let rowUpd = id => {
  let obj = infoRea.infoList.find(item => item.roId === id);
  let arr = [];
  obj.menus.forEach(item => arr.push(item.meId));
  infoRea.editingVal = {
    roleId: obj.roId,
    menuId: arr
  };
  typeRea.label = '修改';
  typeRea.value = 'upd';
  dialogVisibleRef.value = true;
}
let rowDel = id => {
  ElMessageBox.confirm(
      '请确认是否删除',
      '警告',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
  ).then(() => {
    delRole(id).then(res => {
      if (res) ElMessage.success('操作成功');
      getInfo();
    })
  }).catch();
}

let pageChange = () => {
  getInfo();
}
</script>

<template>
  <el-dialog
      v-model="dialogVisibleRef"
      :title="typeRea.label"
  >
    <el-form
        ref="formRef"
        :model="infoRea.editingVal"
        label-width="120px"
    >
      <el-form-item label="角色id">
        <el-cascader
            v-model="infoRea.editingVal.roleId"
            :options="infoRea.roleList"
            :props="{expandTrigger:'hover',checkStrictly:true,emitPath:false}"
        />
      </el-form-item>
      <el-form-item label="权限id">
        <el-cascader
            v-model="infoRea.editingVal.menuId"
            :options="infoRea.menuList"
            :props="{expandTrigger:'hover',checkStrictly:false,emitPath:false,multiple:true}"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="diaCan">取消</el-button>
        <el-button type="primary" @click="diaCon">确认</el-button>
      </span>
    </template>
  </el-dialog>

  <el-button-group>
    <el-button type="primary" @click="topIns">新增</el-button>
  </el-button-group>

  <el-table
      style="width: 100%"
      v-loading="loadingRef"
      :data="infoRea.infoList"
  >
    <el-table-column prop="roId" label="角色id" width="240"/>
    <!--<el-table-column prop="roParentId" label="父级角色" width="120"/>-->
    <el-table-column prop="roCode" label="角色编码" width="120"/>
    <el-table-column prop="roName" label="角色名称" width="120"/>
    <el-table-column prop="menus" label="角色权限" min-width="300">
      <template #default="{row}">
        <el-tag
            v-for="item in row.menus"
            :key="item.rmId"
            closable
            @close="tagClose(row.roId, item.meId)"
        >
          菜单名：{{ item.meName }}，菜单路径：{{ item.mePath }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column fixed="right" label="操作" min-width="120">
      <template #default="{row}">
        <el-button link type="primary" size="small" @click="rowUpd(row.roId)">修改</el-button>
        <el-button link type="danger" size="small" @click="rowDel(row.roId)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>

  <Pagination :total="infoRea.total" @pageChange="pageChange"/>
</template>

<style scoped lang="scss">

</style>