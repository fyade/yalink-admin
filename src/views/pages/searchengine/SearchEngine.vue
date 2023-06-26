<script setup>
import { delList, insOne, selAll, updOne } from 'api/searchEngine.js';
import { nextTick, reactive, ref, watch } from "vue";
import { usePageStore } from "store/page.js";
import { ElMessage, ElMessageBox } from "element-plus";
import { Operate, publicDict } from "utils/base.js";

let state = reactive({
  dialogVisible: false,
  type: {
    value: '',
    label: ''
  },
  form: {
    id: '',
    name: '',
    descr: '',
    url: '',
    secondLevelUrl: '',
    paramKey: '',
    orderNum: 0
  },
  rules: {
    name: [{ required: true }],
    descr: [{ required: true }],
    url: [{ required: true }],
    secondLevelUrl: [{ required: true }],
    paramKey: [{ required: true }],
    orderNum: [{ required: true }]
  },
  dict: {
    ...publicDict,
    name: '搜索引擎名',
    descr: '搜索引擎描述',
    url: '搜索引擎链接',
    secondLevelUrl: '搜索二级url',
    paramKey: '搜索参数主键'
  },
  filterForm: {
    name: '',
    descr: '',
    url: '',
    secondLevelUrl: '',
    paramKey: '',
  },
  list: [],
  multipleSelection: [],
  total: 0
})
let formRef = ref(null)
let loadingRef = ref(false)

watch(() => state.dialogVisible, (newVal) => {
  if (newVal) {
  } else {
    formRef.value?.resetFields()
  }
})

// 获取数据接口
let getData = () => {
  loadingRef.value = true
  // 调接口
  selAll({ ...usePageStore().getPage, ...state.filterForm }).then(res => {
    state.list = res.data.list
    state.total = res.data.total
  }).finally(() => {
    loadingRef.value = false
  })
}
// 新增
let insData = () => {
  insOne(state.form).then(res => {
    if (res.code === 200) {
      ElMessage.success(Operate.success)
      getData()
      state.dialogVisible = false
    }
  })
}
// 修改
let updData = () => {
  updOne(state.form).then(res => {
    if (res.code === 200) {
      ElMessage.success(Operate.success)
      getData()
      state.dialogVisible = false
    }
  })
}
// 删除数据接口
let delData = (...ids) => {
  delList(...ids).then(res => {
    if (res.code === 200) {
      ElMessage.success(Operate.success)
      getData()
    }
  })
}
getData()

// 弹窗取消
const dCan = () => {
  state.dialogVisible = false
}
// 弹窗确定
const dCon = () => {
  formRef.value.validate((valid, fields) => {
    if (valid) {
      const obj = {
        ins: () => insData(),
        upd: () => updData()
      }
      obj[state.type.value]()
    } else {
      let arr = []
      Object.keys(fields).forEach(item => arr.push(state.dict[item]))
      ElMessage.warning(`${arr.join('、')}不能为空`)
    }
  })
}
// 筛选
const fCon = () => {
  getData()
}
// 重置
const fCan = () => {
  Object.keys(state.filterForm).forEach(item => {
    state.filterForm[item] = ''
  })
  getData()
}
// 新增
const gIns = () => {
  state.type.value = 'ins'
  state.type.label = '新增'
  state.dialogVisible = true
}
// 修改
const gUpd = () => {
  if (state.multipleSelection.length !== 1) return ElMessage.warning('请选择 1 条数据')
  tUpd(state.multipleSelection[0])
}
// 删除
const gDel = () => {
  if (state.multipleSelection.length === 0) return ElMessage.warning('请至少选择 1 条数据')
  ElMessageBox.confirm(
      `此操作将删除选中的 ${state.multipleSelection.length} 条数据，且无法撤销，请确认是否继续？`,
      '警告',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
  ).then(() => {
    delData(...state.multipleSelection)
  }).catch(err => {
  })
}
// 修改
const tUpd = id => {
  state.type.value = 'upd'
  state.type.label = '修改'
  state.dialogVisible = true
  nextTick(() => {
    let obj = state.list.find(item => item.id === id)
    Object.keys(state.form).forEach(item => {
      state.form[item] = obj[item]
    })
  })
}
// 删除
const tDel = id => {
  ElMessageBox.confirm(
      `此操作将删除id为 ${id} 的一条数据，且无法撤销，请确认是否继续？`,
      '警告',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
  ).then(() => {
    delData(id)
  }).catch(err => {
  })
}
let handleSelectionChange = val => {
  let arr = [];
  val.forEach(item => arr.push(item.id));
  state.multipleSelection = arr;
}
let pageChange = () => {
  getData()
}
</script>

<template>
  <!--弹框-->
  <el-dialog
      v-model="state.dialogVisible"
      :title="state.type.label"
  >
    <el-form ref="formRef" :model="state.form" label-width="150px" :rules="state.rules">
      <!--在此下方添加表单项-->
      <el-form-item v-if="state.type.value!=='ins'" :label="state.dict['id']" prop="id">
        <span>{{ state.form.id }}</span>
      </el-form-item>
      <el-form-item :label="state.dict['name']" prop="name">
        <el-input v-model.trim="state.form.name"/>
      </el-form-item>
      <el-form-item :label="state.dict['descr']" prop="descr">
        <el-input type="textarea" v-model.trim="state.form.descr"/>
      </el-form-item>
      <el-form-item :label="state.dict['url']" prop="url">
        <el-input v-model.trim="state.form.url"/>
      </el-form-item>
      <el-form-item :label="state.dict['secondLevelUrl']" prop="secondLevelUrl">
        <el-input v-model.trim="state.form.secondLevelUrl"/>
      </el-form-item>
      <el-form-item :label="state.dict['paramKey']" prop="paramKey">
        <el-input v-model.trim="state.form.paramKey"/>
      </el-form-item>
      <el-form-item :label="state.dict['orderNum']" prop="orderNum">
        <el-input-number v-model="state.form.orderNum"/>
      </el-form-item>
      <!--<el-form-item :label="state.dict['']" prop="">-->
      <!--  <el-input v-model="state.form."/>-->
      <!--</el-form-item>-->
      <!--在此上方添加表单项-->
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button v-no-more-click @click="dCan">取消</el-button>
        <el-button v-no-more-click type="primary" @click="dCon">确认</el-button>
      </span>
    </template>
  </el-dialog>

  <!--顶部筛选表单-->
  <el-form :inline="true" :model="state.filterForm" class="demo-form-inline">
    <!--在此下方添加表单项-->
    <el-form-item :label="state.dict['name']">
      <el-input v-model.trim="state.filterForm['name']" :placeholder="state.dict['name']"/>
    </el-form-item>
    <el-form-item :label="state.dict['descr']">
      <el-input v-model.trim="state.filterForm['descr']" :placeholder="state.dict['descr']"/>
    </el-form-item>
    <el-form-item :label="state.dict['url']">
      <el-input v-model.trim="state.filterForm['url']" :placeholder="state.dict['url']"/>
    </el-form-item>
    <el-form-item :label="state.dict['secondLevelUrl']">
      <el-input v-model.trim="state.filterForm['secondLevelUrl']" :placeholder="state.dict['secondLevelUrl']"/>
    </el-form-item>
    <el-form-item :label="state.dict['paramKey']">
      <el-input v-model.trim="state.filterForm['paramKey']" :placeholder="state.dict['paramKey']"/>
    </el-form-item>
    <!--在此上方添加表单项-->
    <el-form-item>
      <el-button v-no-more-click type="primary" @click="fCon">筛选</el-button>
      <el-button v-no-more-click @click="fCan">重置</el-button>
    </el-form-item>
  </el-form>

  <!--操作按钮-->
  <div>
    <el-button v-no-more-click type="primary" plain @click="gIns">新增</el-button>
    <el-button v-no-more-click type="success" plain :disabled="state.multipleSelection.length!==1" @click="gUpd">修改
    </el-button>
    <el-button v-no-more-click type="danger" plain :disabled="state.multipleSelection.length===0" @click="gDel">删除
    </el-button>
  </div>

  <!--数据表格-->
  <el-table style="width: 100%" :data="state.list" v-loading="loadingRef" @selection-change="handleSelectionChange">
    <el-table-column fixed type="selection" width="55"/>
    <el-table-column fixed prop="id" :label="state.dict['id']" width="180"/>
    <!--上面id列的宽度改一下-->
    <!--在此下方添加表格列-->
    <el-table-column prop="name" :label="state.dict['name']" width="120"/>
    <el-table-column prop="descr" :label="state.dict['descr']" width="120"/>
    <el-table-column prop="url" :label="state.dict['url']" width="240"/>
    <el-table-column prop="secondLevelUrl" :label="state.dict['secondLevelUrl']" width="120"/>
    <el-table-column prop="paramKey" :label="state.dict['paramKey']" width="120"/>
    <el-table-column prop="orderNum" :label="state.dict['orderNum']" width="60"/>
    <el-table-column prop="disabled" :label="state.dict['disabled']" width="80"/>
    <el-table-column prop="createTime" :label="state.dict['createTime']" width="180"/>
    <el-table-column prop="updateTime" :label="state.dict['updateTime']" width="180"/>
    <!--在此上方添加表格列-->
    <el-table-column fixed="right" label="操作" min-width="120">
      <template #default="{row}">
        <el-button v-no-more-click link type="primary" size="small" @click="tUpd(row.id)">修改</el-button>
        <el-button v-no-more-click link type="danger" size="small" @click="tDel(row.id)">删除</el-button>
      </template>
    </el-table-column>
    <template #append>
      <span>{{ `已选 ${state.multipleSelection.length} 条数据` }}</span>
    </template>
  </el-table>

  <!--分页-->
  <Pagination :total="Number(state.total)" @page-change="pageChange"/>
</template>

<style scoped lang="scss">

</style>