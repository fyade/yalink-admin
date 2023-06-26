<script setup>
import { selRole, insRole, altRole, delRole } from 'api/sec/secRole.js';
import { onMounted, reactive, ref, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { deepClone } from 'utils/ObjectUtils.js';

let formRef = ref(null);
onMounted(() => getInfo());

let loadingRef = ref(false);
let dialogVisibleRef = ref(false);
let typeRea = reactive({
  label: '',
  value: ''
});
let infoRea = reactive({
  roleList: [],
  editingVal: {}
});
let rulesRea = reactive({
  name: [{ required: true }]
});

watch(dialogVisibleRef, (newVal) => {
  if (newVal) {
    if (!!formRef.value) formRef.value.resetFields();
  }
})

let getInfo = () => {
  loadingRef.value = true;
  selRole().then(res => {
    infoRea.roleList = res.data;
  }).finally(() => {
    loadingRef.value = false;
  });
}

let clear = () => {
  infoRea.editingVal = {
    id: '',
    code: '',
    name: ''
  };
}
let befAdd = () => {
  typeRea.label = '新增';
  typeRea.value = 'add';
  dialogVisibleRef.value = true;
}
let befAlt = id => {
  typeRea.value = 'edit';
  typeRea.label = '编辑';
  infoRea.editingVal = deepClone(infoRea.roleList.find(item => item.id === id));
  dialogVisibleRef.value = true;
}
let del = id => {
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
    loadingRef.value = true;
    delRole(id).then(res => {
      if (res) ElMessage.success("操作成功");
    }).finally(() => {
      loadingRef.value = false;
      getInfo();
    });
  }).catch(() => {
    ElMessage.info('已取消');
  });
}
let add = () => {
  if (!!!infoRea.editingVal.code) return ElMessage.warning('请输入角色编码');
  if (!!!infoRea.editingVal.name) return ElMessage.warning('请输入角色名称');
  loadingRef.value = true;
  dialogVisibleRef.value = false;
  if (typeRea.value === 'add') {
    insRole(infoRea.editingVal).then(res => {
      if (res) ElMessage.success('操作成功');
      clear();
    }).finally(() => {
      loadingRef.value = false;
      getInfo();
    });
  } else if (typeRea.value === 'edit') {
    altRole(infoRea.editingVal).then(res => {
      if (res) ElMessage.success('操作成功');
      clear();
    }).finally(() => {
      loadingRef.value = false;
      getInfo();
    });
  } else {
    loadingRef.value = false;
  }
}
let can = () => {
  dialogVisibleRef.value = false;
  clear();
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
      <el-form-item label="角色编码">
        <el-input v-model="infoRea.editingVal.code"/>
      </el-form-item>
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="infoRea.editingVal.name"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="can">取消</el-button>
        <el-button type="primary" @click="add">确认</el-button>
      </span>
    </template>
  </el-dialog>

  <div>
    <el-button type="primary" plain @click="befAdd">新增</el-button>
  </div>
  <br/>

  <el-table
      v-loading="loadingRef"
      style="width: 100%"
      :data="infoRea.roleList"
  >
    <el-table-column prop="id" label="主键id" width="240"/>
    <el-table-column prop="code" label="角色编码" width="120"/>
    <el-table-column prop="name" label="角色名称" width="120"/>
    <el-table-column prop="createBy" label="createBy" width="120"/>
    <el-table-column prop="updateBy" label="updateBy" width="120"/>
    <el-table-column prop="createTime" label="createTime" width="240"/>
    <el-table-column prop="updateTime" label="updateTime" width="240"/>
    <el-table-column fixed="right" label="操作" min-width="120">
      <template #default="scope">
        <el-button link type="primary" size="small" @click="befAlt(scope.row.id)">修改</el-button>
        <el-button link type="danger" size="small" @click="del(scope.row.id)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<style scoped lang="scss">

</style>