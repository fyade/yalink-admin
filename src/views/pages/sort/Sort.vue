<script setup>
import { getAllSorts, setSort, delSortById, addSort } from 'api/admin/adminSort.js';
import { onBeforeMount, onMounted, reactive, ref, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';

onBeforeMount(() => getInfo());

let dialogVisibleRef = ref(false);
let loadingRef = ref(false);
let cascaderValueRef = ref('');
let typeRef = ref('');
let infoRea = reactive({
  sortInfo: [],
  allSortInfo: [],
  altInfo: {}
});
let cascaderProps = {
  expandTrigger: 'hover',
  emitPath: false,
  checkStrictly: true
};

let getInfo = () => {
  loadingRef.value = true;
  infoRea.sortInfo = [];
  infoRea.allSortInfo = [];
  getAllSorts().then(res => {
    infoRea.sortInfo = res.data;
    if (infoRea.sortInfo.length > 0) {
      for (let i = 0; i < infoRea.sortInfo.length; i++) {
        infoRea.sortInfo[i].label = infoRea.sortInfo[i].name;
        infoRea.sortInfo[i].value = infoRea.sortInfo[i].id;
        initAllSortInfo(infoRea.sortInfo[i]);
      }
    }
  }).finally(() => {
    loadingRef.value = false;
  });
}
let initAllSortInfo = info => {
  infoRea.allSortInfo.push({
    id: info.id,
    name: info.name,
    descr: info.descr,
    orderNum: info.orderNum,
    parentId: info.parentId
  });
  if (info.children.length > 0) {
    for (let i = 0; i < info.children.length; i++) {
      info.children[i].label = info.children[i].name;
      info.children[i].value = info.children[i].id;
      initAllSortInfo(info.children[i]);
    }
  }
}

let handlerAlter = id => {
  typeRef.value = 'edit';
  infoRea.altInfo = infoRea.allSortInfo.find(item => item.id === id);
  cascaderValueRef.value = infoRea.altInfo.parentId;
  dialogVisibleRef.value = true;
}
let handlerDelete = id => {
  if (!!infoRea.allSortInfo.find(item => item.parentId === id)) {
    return ElMessage.warning('请先移除子分类');
  }
  ElMessageBox.confirm(
      '请确认是否删除',
      '警告',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
  ).then(() => {
    loadingRef.value = true;
    delSortById(id).then(res => {
      if (res) ElMessage.success('操作成功');
    }).finally(() => {
      loadingRef.value = false;
      getInfo();
    });
  }).catch(err => {
  });
}
let cascaderValueChange = val => {
  // console.log(val);
}
let diaOk = () => {
  if (!!!infoRea.altInfo.name) return ElMessage.warning("请输入分类名");
  loadingRef.value = true;
  dialogVisibleRef.value = false;
  infoRea.altInfo.parentId = cascaderValueRef.value;
  if (typeRef.value === 'edit') {
    setSort(infoRea.altInfo).then(res => {
      if (res) ElMessage.success('操作成功');
    }).finally(() => {
      loadingRef.value = false;
      getInfo();
    });
  } else if (typeRef.value === 'add') {
    addSort(infoRea.altInfo).then(res => {
      if (res) ElMessage.success('操作成功');
    }).finally(() => {
      loadingRef.value = false;
      getInfo();
    });
  }
}
let diaCan = () => {
  dialogVisibleRef.value = false;
}
let clear = () => {
  infoRea.altInfo = {
    name: '',
    descr: '',
    orderNum: 0,
    parentId: ''
  };
  cascaderValueRef.value = '';
}
let add = () => {
  typeRef.value = 'add';
  clear();
  dialogVisibleRef.value = true;
}
</script>

<template>
  <el-dialog
      v-model="dialogVisibleRef"
      :title="[{value:'edit',label:'修改'},{value:'add',label:'新增'}].find(item=>item.value===typeRef)?.label"
      draggable
  >
    <el-form
        :model="infoRea.altInfo"
        label-width="120px"
    >
      <template v-if="typeRef !== 'add'">
        <el-form-item label="主键id">
          <div>{{ infoRea.altInfo.id }}</div>
        </el-form-item>
      </template>
      <el-form-item label="分类名" required>
        <el-input v-model.trim="infoRea.altInfo.name"/>
      </el-form-item>
      <el-form-item label="分类描述">
        <el-input v-model.trim="infoRea.altInfo.descr"/>
      </el-form-item>
      <el-form-item label="分类排序">
        <el-input-number v-model="infoRea.altInfo.orderNum"/>
      </el-form-item>
      <el-form-item label="父级分类">
        <el-cascader
            v-model="cascaderValueRef"
            clearable
            :options="infoRea.sortInfo"
            :props="cascaderProps"
            @change="cascaderValueChange"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="diaCan">取消</el-button>
        <el-button type="primary" @click="diaOk">确认</el-button>
      </span>
    </template>
  </el-dialog>

  <div>
    <el-button type="primary" @click="add">新增</el-button>
  </div>
  <br/>

  <el-table
      style="width: 100%;"
      v-loading="loadingRef"
      :data="infoRea.sortInfo"
      row-key="id"
      default-expand-all
  >
    <el-table-column prop="id" label="主键id" width="240"/>
    <el-table-column prop="name" label="分类名" width="200"/>
    <el-table-column prop="descr" label="分类描述" width="200"/>
    <el-table-column prop="orderNum" label="排序" width="120"/>
    <el-table-column fixed="right" label="操作" min-width="200">
      <template #default="scope">
        <el-button plain type="primary" size="small" @click="handlerAlter(scope.row.id)">修改</el-button>
        <el-button plain type="danger" size="small" @click="handlerDelete(scope.row.id)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<style scoped lang="scss">

</style>