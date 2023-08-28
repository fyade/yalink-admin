<script setup>
import { selAll, insOne, altOne, delOne } from 'api/sec/secMenu.js';
import { onMounted, reactive, ref, unref, watch } from 'vue';
import { ElMessage, ElMessageBox } from "element-plus";
import { deepRecursion, flatObjectArray } from 'utils/data-util.js';

let formRef = ref(null);
onMounted(() => getInfo());

let loadingRef = ref(false);
let dialogVisibleRef = ref(false);
let typeRea = reactive({
  value: '',
  label: ''
});
let infoRea = reactive({
  menuList: [],
  editingVal: {},
  flatMenuList: []
});
let rulesRea = reactive({
  name: [{ required: true }],
  path: [{ required: true }]
});

watch(dialogVisibleRef, (newVal) => {
  if (newVal) {
    if (!!formRef.value) formRef.value.resetFields();
  }
});

let getInfo = () => {
  loadingRef.value = true;
  selAll().then(res => {
    infoRea.menuList = res.data;
    deepRecursion(infoRea.menuList);
    infoRea.flatMenuList = flatObjectArray(infoRea.menuList);
  }).finally(() => {
    loadingRef.value = false;
  });
}

let clear = () => {
  infoRea.editingVal = {
    id: '',
    name: '',
    path: '',
    auth: '',
    icon: '',
    orderNum: 0,
    parentId: ''
  };
}
let diaCan = () => {
  dialogVisibleRef.value = false;
  clear();
}
let diaConfirm = () => {
  if (!!!infoRea.editingVal.name) return ElMessage.warning('请输入菜单名');
  if (!!!infoRea.editingVal.path) return ElMessage.warning('请输入菜单路径');
  loadingRef.value = true;
  if (typeRea.value === 'add') {
    insOne(infoRea.editingVal).then(res => {
      if (res) ElMessage.success('操作成功');
      dialogVisibleRef.value = false;
      clear();
    }).catch(err => {
    }).finally(() => {
      loadingRef.value = false;
      getInfo();
    });
  } else if (typeRea.value === 'edit') {
    altOne(infoRea.editingVal).then(res => {
      if (res) ElMessage.success('操作成功');
      dialogVisibleRef.value = false;
      clear();
    }).catch(err => {
    }).finally(() => {
      loadingRef.value = false;
      getInfo();
    });
  } else {
    loadingRef.value = false;
  }
}
let befAdd = () => {
  typeRea.label = '新增';
  typeRea.value = 'add';
  clear();
  dialogVisibleRef.value = true;
}
let tblAlt = id => {
  let info = infoRea.flatMenuList.find(item => item.id === id);
  infoRea.editingVal = {
    id: info.id,
    name: info.name,
    path: info.path,
    auth: info.auth,
    icon: info.icon,
    orderNum: info.orderNum,
    parentId: info.parentId
  };
  typeRea.value = 'edit';
  typeRea.label = '修改';
  dialogVisibleRef.value = true;
}
let tblDel = id => {
  ElMessageBox.confirm(
      '请确认是否删除',
      '警告',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }
  ).then(() => {
    ElMessage.info('已确认，正在删除');
    delOne(id).then(res => {
      if (res) ElMessage.success('操作成功');
    }).finally(() => {
      getInfo();
    });
  }).catch(() => {
    ElMessage.info('已取消');
  });
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
        :rules="rulesRea"
        label-width="120px"
    >
      <el-form-item v-if="typeRea.value!=='add'" label="主键id">
        {{ infoRea.editingVal.id }}
      </el-form-item>
      <el-form-item label="菜单名" prop="name">
        <el-input v-model="infoRea.editingVal.name"/>
      </el-form-item>
      <el-form-item label="菜单路径" prop="path">
        <el-input v-model="infoRea.editingVal.path"/>
      </el-form-item>
      <el-form-item label="权限">
        <el-input v-model="infoRea.editingVal.auth"/>
      </el-form-item>
      <el-form-item label="图标">
        <el-input v-model="infoRea.editingVal.icon"/>
      </el-form-item>
      <el-form-item label="排序">
        <el-input-number v-model="infoRea.editingVal.orderNum"/>
      </el-form-item>
      <el-form-item label="父级菜单">
        <el-cascader
            v-model="infoRea.editingVal.parentId"
            :options="infoRea.menuList"
            :props="{expandTrigger:'hover',checkStrictly:true,emitPath:false}"
            clearable
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="diaCan">取消</el-button>
        <el-button type="primary" @click="diaConfirm">确认</el-button>
      </span>
    </template>
  </el-dialog>

  <div>
    <el-button type="primary" @click="befAdd">新增</el-button>
  </div>
  <br/>

  <el-table
      v-loading="loadingRef"
      style="width: 100%"
      :data="infoRea.menuList"
      row-key="id"
  >
    <el-table-column prop="id" label="主键id" width="240"/>
    <el-table-column prop="name" label="菜单名" width="120"/>
    <el-table-column label="父级菜单" width="120">
      <template #default="scope">
        {{ infoRea.menuList.find(item => item.id === scope.row.parentId)?.name }}
      </template>
    </el-table-column>
    <el-table-column prop="path" label="菜单路径" width="120"/>
    <el-table-column prop="path" label="菜单完整路径" width="120">
      <template #default="scope">
        {{ infoRea.menuList.find(item => item.id === scope.row.parentId)?.path }}{{ scope.row.path }}
      </template>
    </el-table-column>
    <el-table-column prop="auth" label="权限" width="120"/>
    <el-table-column prop="icon" label="图标" width="120"/>
    <el-table-column prop="orderNum" label="排序" width="120"/>
    <el-table-column prop="createBy" label="create_by" width="120"/>
    <el-table-column prop="updateBy" label="update_by" width="120"/>
    <el-table-column prop="createTime" label="create_time" width="240"/>
    <el-table-column prop="updateTime" label="update_time" width="240"/>
    <el-table-column fixed="right" label="操作" width="120">
      <template #default="scope">
        <el-button link type="primary" size="small" @click="tblAlt(scope.row.id)">修改</el-button>
        <el-button link type="danger" size="small" @click="tblDel(scope.row.id)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<style scoped lang="scss">

</style>