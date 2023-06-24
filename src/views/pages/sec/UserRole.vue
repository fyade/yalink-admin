<script setup>
import { selAllNest, insOne, altOne, delOne, updByList } from 'api/sec/secUserRole.js';
import { onMounted, reactive, ref, watch } from 'vue';
import useStore from 'store';
import Pagination from 'comp/pagination/Pagination.vue';
import { selRole } from 'api/sec/secRole.js';
import { ElMessage, ElMessageBox } from 'element-plus';

const store = useStore();
onMounted(() => getInfo());

let loadingRef = ref(false);
let loadingRoleRef = ref(false);
let dialogVisibleRef = ref(false);
let formRef = ref(null);
let infoRea = reactive({
  userRoleList: [],
  total: 0,
  editingVal: {},
  editingValRole: [],
  roleList: []
});
let typRea = reactive({
  value: '',
  label: ''
});

watch(dialogVisibleRef, newVal => {
  if (newVal) {
    if (!!formRef.value) formRef.value.resetFields();
    loadingRoleRef.value = true;
    selRole().then(res => {
      infoRea.roleList = res.data;
    }).finally(() => {
      loadingRoleRef.value = false;
    });
  }
});

let getInfo = () => {
  loadingRef.value = true;
  selAllNest(store.page.getPage).then(res => {
    infoRea.userRoleList = res.data.list;
    infoRea.total = Number(res.data.total);
  }).finally(() => {
    loadingRef.value = false;
  });
}
let pageChange = () => {
  getInfo();
}
let clear = () => {
  infoRea.editingVal = {
    usId: '',
    usUsername: '',
    usNickname: '',
    usRealname: '',
    roles: []
  };
}

let diaCan = () => {
  dialogVisibleRef.value = false;
}
let diaCon = () => {
  if (typRea.value === 'upd' || typRea.value === 'ins') {
    infoRea.editingVal.roles = [];
    infoRea.editingValRole.forEach(item => {
      infoRea.editingVal.roles.push(infoRea.roleList.find(iitem => iitem.id === item));
    });
    updByList(infoRea.editingVal.usId, infoRea.editingVal.roles).then(res => {
      if (res) ElMessage.success('操作成功');
      getInfo();
    }).finally(() => {
      dialogVisibleRef.value = false;
    });
  }
}
let topIns = () => {
  typRea.value = 'ins';
  typRea.label = '新增';
  clear();
  dialogVisibleRef.value = true;
}
let tblUpd = id => {
  typRea.value = 'upd';
  typRea.label = '修改';
  infoRea.editingVal = infoRea.userRoleList.find(item => item.usId === id);
  infoRea.editingValRole = [];
  infoRea.editingVal.roles.forEach(item => {
    infoRea.editingValRole.push(item.roId);
  });
  dialogVisibleRef.value = true;
}
let tblDel = id => {
  ElMessageBox.confirm(
      '请确认是否删除',
      '警告',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
  ).then(() => {
    delOne(id).then(res => {
      if (res) ElMessage.success('操作成功');
      getInfo();
    });
  }).catch();
}
</script>

<template>
  <el-dialog
      v-model="dialogVisibleRef"
      :title="typRea.label"
  >
    <el-form
        ref="formRef"
        :model="infoRea.editingVal"
        label-width="120px"
    >
      <el-form-item label="用户id">
        <template v-if="infoRea.editingVal.usId">{{ infoRea.editingVal.usId }}</template>
        <template v-else>
          <el-input v-model="infoRea.editingVal.usId" placeholder="请输入用户id"/>
        </template>
      </el-form-item>
      <el-form-item label="用户名">{{ infoRea.editingVal.usUsername }}</el-form-item>
      <el-form-item label="用户昵称">{{ infoRea.editingVal.usNickname }}</el-form-item>
      <el-form-item label="用户真实姓名">{{ infoRea.editingVal.usRealname }}</el-form-item>
      <el-form-item label="用户角色">
        <el-select
            v-loading="loadingRoleRef"
            v-model="infoRea.editingValRole"
            multiple
            placeholder="Select"
            style="width: 240px"
        >
          <el-option
              v-for="item in infoRea.roleList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
          />
        </el-select>
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
      v-loading="loadingRef"
      style="width: 100%"
      :data="infoRea.userRoleList"
  >
    <el-table-column prop="usId" label="用户id" width="120"/>
    <el-table-column prop="usUsername" label="用户名" width="120"/>
    <el-table-column prop="usNickname" label="昵称" width="120"/>
    <el-table-column prop="usRealname" label="真实姓名" width="120"/>
    <el-table-column label="角色" width="300">
      <template #default="scope">
        <div style="display: flex;flex-wrap: wrap;gap: 10px;">
          <el-tag
              class="ml-2"
              v-for="item in scope.row.roles"
              :key="item.urId"
              type="info"
          >
            {{ item.roName }}
          </el-tag>
        </div>
      </template>
    </el-table-column>
    <el-table-column fixed="right" label="Operations" min-width="120">
      <template #default="{row}">
        <el-button link type="primary" size="small" @click="tblUpd(row.usId)">修改</el-button>
        <el-button link type="danger" size="small" @click="tblDel(row.usId)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>

  <Pagination :total="infoRea.total" @page-change="pageChange"/>
</template>

<style scoped lang="scss">

</style>