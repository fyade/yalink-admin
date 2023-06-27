<script setup>
import { nextTick, onMounted, reactive, ref, watch } from "vue"
import { usePageStore } from "store/page.js"
import { ElMessage, ElMessageBox } from "element-plus"
import { final, Operate, publicDict, shift_yes_no } from "utils/base.js"
import Pagination from "comp/pagination/Pagination.vue"

let state = reactive({
  dialogVisible: false,
  type: {
    value: '',
    label: ''
  },
  // 这个是弹出框表单
  // 格式: {
  //   id: '',
  //   ...
  // }
  dialogForm: {},
  // 这个是弹出框表单校验
  // 格式: {
  //   name: [{ required: true }],
  //   ...
  // }
  dFormRules: {},
  // 字典
  // 格式: {
  //   name: '名字',
  //   ...
  // }
  dict: {
    ...publicDict
  },
  // 筛选表单
  // 格式: {
  //   name: '',
  //   ...
  // }
  filterForm: {},
  list: [],
  multipleSelection: [],
  total: 0
})
let dialogFormRef = ref(null)
let filterFormRef = ref(null)
let tableLoadingRef = ref(false)
let switchLoadingRef = ref(false)

/**
 * 查询
 */
let getData = () => {
  tableLoadingRef.value = true
  state.list = []
  let obj = { ...usePageStore().getPage, ...state.filterForm }
  // func(obj).then(res => {
  //   // 普通查询
  //   state.list = res.data
  //   // 分页查询
  //   state.list = res.data.list
  //   state.total = res.data.total
  // }).finally(() => {
  tableLoadingRef.value = false
  // })
}
/**
 * 新增
 */
let insData = () => {
  let obj = state.dialogForm
  // func(obj).finally(res => {
  //   if (res.code === 200) {
  //     ElMessage.success(Operate.success)
  //     state.dialogVisible = false
  //     getData()
  //   }
  // })
}
/**
 * 修改
 */
let updData = () => {
  let obj = state.dialogForm
  // func(obj).then(res => {
  //   if (res.code === 200) {
  //     ElMessage.success(Operate.success)
  //     state.dialogVisible = false
  //     getData()
  //   }
  // })
}
/**
 * 修改禁用状态
 * @param id
 */
let updDataDisabled = id => {
  let obj = state.list.find(item => item.id === id)
  obj.disabled = shift_yes_no[obj.disabled]
  // return func(obj)
}
/**
 * 修改顺序
 * @param ids
 */
let updDataOrder = (...ids) => {
  // func(...ids).then(res => {
  //   if (res.code === 200) {
  //     ElMessage.success(Operate.success)
  //     getData()
  //   }
  // })
}
/**
 * 删除
 */
let delData = (...ids) => {
  // func(...ids).then(res => {
  //   if (res.code === 200) {
  //     ElMessage.success(Operate.success)
  //     getData()
  //   }
  // })
}

onMounted(() => getData())
watch(() => state.dialogVisible, (newVal) => {
  if (newVal) {
  } else {
    dialogFormRef.value?.resetFields();
  }
})

// 弹窗取消
const dCan = () => {
  state.dialogVisible = false
}
// 弹窗确定
const dCon = () => {
  Object.keys(state.dialogForm).forEach(item => {
    if (typeof state.dialogForm[item] === 'string') {
      state.dialogForm[item] = state.dialogForm[item].trim()
    }
  })
  dialogFormRef.value.validate((valid, fields) => {
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
  Object.keys(state.filterForm).forEach(item => {
    if (typeof state.filterForm[item] === 'string') {
      state.filterForm[item] = state.filterForm[item].trim()
    }
  })
  getData()
}
// 重置
const fCan = () => {
  filterFormRef.value.resetFields()
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
  tUpd(state.multipleSelection[0].id)
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
        draggable: true
      }
  ).then(() => {
    let arr = []
    state.multipleSelection.forEach(item => arr.push(item.id))
    delData(...arr)
  }).catch(err => {
  })
}
// 上移
const gMoveUp = () => {
  if (state.multipleSelection.length === 0) return ElMessage.warning('请至少选择 1 条数据')
  if (state.list[0].id === state.multipleSelection[0].id) return ElMessage.warning('已到达顶部，无法上移')
  let arr = []
  state.multipleSelection.forEach(item => arr.push(item.id))
  arr.push(state.list[state.list.findIndex(item => item.id === state.multipleSelection[0].id) - 1].id)
  updDataOrder(...arr)
}
// 下移
const gMoveDown = () => {
  if (state.multipleSelection.length === 0) return ElMessage.warning('请至少选择 1 条数据')
  if (state.list[state.list.length - 1].id === state.multipleSelection[state.multipleSelection.length - 1].id) return ElMessage.warning('已到达底部，无法下移')
  let arr = []
  state.multipleSelection.forEach(item => arr.push(item.id))
  arr.unshift(state.list[state.list.findIndex(item => item.id === state.multipleSelection[state.multipleSelection.length - 1].id) + 1].id)
  updDataOrder(...arr)
}
// 修改
const tUpd = id => {
  state.type.value = 'upd'
  state.type.label = '修改'
  state.dialogVisible = true
  nextTick(() => {
    let obj = state.list.find(item => item.id === id)
    Object.keys(state.dialogForm).forEach(item => {
      state.dialogForm[item] = obj[item]
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
        draggable: true
      }
  ).then(() => {
    delData(id)
  }).catch(err => {
  })
}
// 启用/禁用
const tBeforeChange = id => {
  switchLoadingRef.value = true
  return new Promise((resolve, reject) => {
    updDataDisabled(id).then(res => {
      if (res.code === 200) {
        state.list.find(item => item.id === id).disabled = shift_yes_no[state.list.find(item => item.id === id).disabled]
        resolve(true)
      } else {
        reject(false)
      }
    }).catch(err => {
      reject(false)
    }).finally(() => {
      switchLoadingRef.value = false
    })
  })
}
const handleSelectionChange = val => {
  let arr = []
  val.forEach(item => {
    arr[state.list.findIndex(i => i.id === item.id)] = item
  })
  state.multipleSelection = arr.filter(Boolean)
}
const pageChange = () => {
  getData()
}
</script>

<template>
  <!--弹框-->
  <el-dialog
      v-model="state.dialogVisible"
      :title="state.type.label"
      draggable
  >
    <el-form
        ref="dialogFormRef"
        :model="state.dialogForm"
        label-width="120px"
        :rules="state.dFormRules"
    >
      <el-form-item v-if="state.type.value!=='ins'" :label="state.dict['id']" prop="id">
        <span>{{ state.dialogForm.id }}</span>
      </el-form-item>
      <!--在此下方添加表单项-->
      <!--<el-form-item :label="state.dict['']" prop="">-->
      <!--  <el-input v-model="state.dialogForm."/>-->
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
  <el-form
      class="demo-form-inline"
      v-if="Object.keys(state.filterForm).length>0"
      ref="filterFormRef"
      :model="state.filterForm"
      :inline="true"
  >
    <!--在此下方添加表单项-->
    <!--<el-form-item :label="state.dict['']">-->
    <!--  <el-input v-model="state.filterForm['']" :placeholder="state.dict['']"/>-->
    <!--</el-form-item>-->
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
    <el-button v-no-more-click plain :disabled="state.multipleSelection.length===0" @click="gMoveUp">上移</el-button>
    <el-button v-no-more-click plain :disabled="state.multipleSelection.length===0" @click="gMoveDown">下移</el-button>
  </div>

  <!--数据表格-->
  <el-table
      style="width: 100%"
      v-loading="tableLoadingRef"
      :data="state.list"
      @selection-change="handleSelectionChange"
  >
    <el-table-column fixed type="selection" width="55"/>
    <el-table-column fixed prop="id" :label="state.dict['id']" width="180"/>
    <!--上面id列的宽度改一下-->
    <!--在此下方添加表格列-->
    <!--<el-table-column prop="" :label="state.dict['']" width="120"/>-->
    <!--在此上方添加表格列-->
    <!--<el-table-column prop="orderNum" :label="state.dict['orderNum']" width="60"/>-->
    <el-table-column :label="state.dict['disabled']" width="80">
      <template #default="{row}">
        <el-switch
            v-model="row.disabled"
            :loading="switchLoadingRef"
            :active-value="final.DISABLED_NO"
            :inactive-value="final.DISABLED_YES"
            :before-change="tBeforeChange.bind(this,row.id)"
        />
      </template>
    </el-table-column>
    <!--<el-table-column prop="createBy" :label="state.dict['createBy']" width="120"/>-->
    <!--<el-table-column prop="updateBy" :label="state.dict['updateBy']" width="120"/>-->
    <!--<el-table-column prop="createTime" :label="state.dict['createTime']" width="180"/>-->
    <!--<el-table-column prop="updateTime" :label="state.dict['updateTime']" width="180"/>-->
    <!--<el-table-column prop="deleted" :label="state.dict['deleted']" width="60"/>-->
    <!--上方几个酌情使用-->
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
  <Pagination
      :total="Number(state.total)"
      @page-change="pageChange"
  />
</template>

<style scoped lang="scss">
</style>