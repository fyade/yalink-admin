<script setup>
import { nextTick, reactive, ref, watch } from "vue"
import { cascaderProps2, final, Operate, publicDict, shift_yes_no } from "utils/base.js"
import Pagination from "comp/pagination/Pagination.vue"
import { funcTablePage } from "@/composition/tablePage/tablePage.js"
import { selList, selOne, insOne, updOne, updOrder, updDisabled, delList } from 'api/admin/adminSort.js'
import { flatObjectArray } from "utils/data-util.js";
import { ElMessage } from "element-plus";
import { usePageStore } from "store/module/page.js";

let state = reactive({
  dialogVisible: false,
  type: {
    value: '',
    label: ''
  },
  // 这个是弹出框表单
  dialogForm: {
    id: '',
    name: '',
    descr: '',
    orderNum: 0,
    parentId: final.DEFAULT_PARENT_ID,
    disabled: final.DISABLED_NO
  },
  // 这个是弹出框表单校验
  dFormRules: {
    name: [{ required: true }]
  },
  // 字典
  dict: {
    ...publicDict,
    name: '分类名',
    descr: '分类描述',
    parentId: '父级分类'
  },
  // 筛选表单
  filterForm: {},
  list: [],
  allList: [],
  multipleSelection: [],
  total: -1
})
let state2 = reactive({
  orderNum: 0
})
let dialogFormRef = ref(null)
let filterFormRef = ref(null)
let tableLoadingRef = ref(false)
let switchLoadingRef = ref(false)
let config = {
  pageQuery: false, // 分页，默认true
}

const func = {
  /**
   * 查询列表
   * @param params
   */
  selectList: params => {
    return selList(params)
  },
  /**
   * 查询单个
   * @param id
   */
  selectById: id => {
    return selOne(id)
  },
  /**
   * 新增
   * @param obj
   */
  insertOne: obj => {
    return insOne(obj)
  },
  /**
   * 修改
   * @param obj
   */
  updateOne: obj => {
    return updOne(obj)
  },
  /**
   * 修改顺序
   * @param ids
   */
  updateOrder: (...ids) => {
    return updOrder(...ids)
  },
  /**
   * 启用禁用
   * @param objs
   */
  updateDisabled: (...objs) => {
    return updDisabled(...objs)
  },
  /**
   * 删除
   * @param ids
   */
  deleteList: (...ids) => {
    return delList(...ids)
  }
}

watch(() => state.list, () => {
      state.allList = flatObjectArray(state.list)
    }
)

const gIns2 = () => {
  state.dialogForm.parentId = ''
  gIns()
}
const tAdd = id => {
  state.type.value = 'ins'
  state.type.label = '新增'
  state.dialogVisible = true
  state.dialogForm.parentId = id
}
const tUpd = id => {
  state.type.value = 'upd'
  state.type.label = '修改'
  state.dialogVisible = true
  nextTick(() => {
    let obj = state.allList.find(item => item.id === id)
    Object.keys(state.dialogForm).forEach(item => {
      state.dialogForm[item] = obj[item]
    })
  })
}
const tBeforeChangeDisabled = id => {
  switchLoadingRef.value = true
  return new Promise((resolve, reject) => {
    let obj = state.allList.find(item => item.id === id)
    obj.disabled = shift_yes_no[obj.disabled]
    func.updateOne(obj).then(res => {
      if (res.code === 200) {
        ElMessage.success(Operate.success)
        resolve(true)
      } else {
        reject(false)
      }
    }).catch(err => {
      reject(false)
    }).finally(() => {
      state.allList.find(item => item.id === id).disabled = shift_yes_no[state.allList.find(item => item.id === id).disabled]
      switchLoadingRef.value = false
    })
  })
}
const handleOrderNumChange = id => {
  func.updateOne(state.allList.find(item => item.id === id)).then(res => {
    if (res.code === 200) {
      ElMessage.success(Operate.success)
      state.dialogVisible = false
      getData()
    }
  })
}
const getData = () => {
  tableLoadingRef.value = true
  state.list = []
  let obj = { ...usePageStore().getPage, ...state.filterForm, ...config.selectParam }
  func.selectList(obj).then(res => {
    if (config.pageQuery) {
      state.list = res.data.list
      state.total = res.data.total
    } else {
      state.list = res.data
    }
  }).finally(() => {
    tableLoadingRef.value = false
  })
}

const {
  dCan,
  dCon,
  fEnter,
  fCon,
  fCan,
  gRefresh,
  gIns,
  tDel,
  handleSelectionChange,
  handlerFocus,
  pageChange
} = funcTablePage({
  config,
  state,
  state2,
  dialogFormRef,
  filterFormRef,
  tableLoadingRef,
  switchLoadingRef,
  func
})
</script>

<template>
  <!--弹框-->
  <el-dialog
      v-model="state.dialogVisible"
      :title="state.type.label"
      draggable
      append-to-body
  >
    <el-form
        ref="dialogFormRef"
        :model="state.dialogForm"
        label-width="120px"
        :rules="state.dFormRules"
    >
      <el-form-item v-if="state.type.value!=='ins'" :label="state.dict['id']" prop="id">
        <span>{{ state.dialogForm['id'] }}</span>
      </el-form-item>
      <!--在此下方添加表单项-->
      <el-form-item :label="state.dict['name']" prop="name">
        <el-input v-model="state.dialogForm.name"/>
      </el-form-item>
      <el-form-item :label="state.dict['descr']" prop="descr">
        <el-input v-model="state.dialogForm.descr"/>
      </el-form-item>
      <el-form-item :label="state.dict['orderNum']" prop="orderNum">
        <el-input-number v-model="state.dialogForm.orderNum"/>
      </el-form-item>
      <el-form-item :label="state.dict['parentId']" prop="parentId">
        <el-cascader
            v-model="state.dialogForm.parentId"
            clearable
            :options="state.list"
            :props="cascaderProps2"
        />
      </el-form-item>
      <!--在此上方添加表单项-->
      <el-form-item :label="state.dict['disabled']" prop="disabled">
        <el-switch v-model="state.dialogForm['disabled']" :active-value="final.DISABLED_NO"
                   :inactive-value="final.DISABLED_YES"/>
      </el-form-item>
      <!--上方几个酌情使用-->
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
      @keyup.enter="fEnter"
  >
    <el-form-item>
      <el-button v-no-more-click type="primary" @click="fCon">筛选</el-button>
      <el-button v-no-more-click @click="fCan">重置</el-button>
    </el-form-item>
  </el-form>

  <!--操作按钮-->
  <div style="display: flex;flex-wrap: wrap;gap: 1rem;">
    <el-button-group>
      <el-button v-no-more-click plain @click="gRefresh">刷新</el-button>
      <el-button v-no-more-click type="primary" plain @click="gIns2">新增</el-button>
    </el-button-group>
  </div>

  <!--数据表格-->
  <el-table
      style="width: 100%"
      v-loading="tableLoadingRef"
      :data="state.list"
      row-key="id"
      default-expand-all
      @selection-change="handleSelectionChange"
  >
    <!--<el-table-column fixed type="selection" width="55"/>-->
    <el-table-column fixed prop="id" :label="state.dict['id']" width="240"/>
    <!--上面id列的宽度改一下-->
    <!--在此下方添加表格列-->
    <el-table-column prop="name" :label="state.dict['name']" width="200"/>
    <el-table-column prop="descr" :label="state.dict['descr']" width="200"/>
    <!--在此上方添加表格列-->
    <el-table-column prop="orderNum" :label="state.dict['orderNum']" width="180">
      <template #default="{row}">
        <el-input-number
            v-model="state.allList.find(i=>i.id===row.id).orderNum"
            step-strictly
            :value-on-clear="state2.orderNum"
            @focus="handlerFocus(row.orderNum)"
            @change="handleOrderNumChange(row.id)"
        />
      </template>
    </el-table-column>
    <el-table-column :label="state.dict['disabled']" width="80">
      <template #default="{row}">
        <el-switch
            v-model="state.allList.find(itm=>itm.id===row.id).disabled"
            :loading="switchLoadingRef"
            :active-value="final.DISABLED_NO"
            :inactive-value="final.DISABLED_YES"
            :before-change="tBeforeChangeDisabled.bind(this,row.id)"
        />
      </template>
    </el-table-column>
    <el-table-column prop="createBy" :label="state.dict['createBy']" width="120"/>
    <el-table-column prop="updateBy" :label="state.dict['updateBy']" width="120"/>
    <el-table-column prop="createTime" :label="state.dict['createTime']" width="180"/>
    <el-table-column prop="updateTime" :label="state.dict['updateTime']" width="180"/>
    <!--上方几个酌情使用-->
    <el-table-column fixed="right" label="操作" min-width="120">
      <template #default="{row}">
        <el-button v-no-more-click link type="primary" size="small" @click="tAdd(row.id)">新增</el-button>
        <el-button v-no-more-click link type="primary" size="small" @click="tUpd(row.id)">修改</el-button>
        <el-button v-no-more-click link type="danger" size="small" @click="tDel(row.id)">删除</el-button>
      </template>
    </el-table-column>
    <!--<template #append>-->
    <!--  <span>{{ `已选 ${state.multipleSelection.length} 条数据` }}</span>-->
    <!--</template>-->
  </el-table>

  <!--分页-->
  <Pagination
      v-if="state.total!==-1"
      :total="Number(state.total)"
      @page-change="pageChange"
  />
</template>

<style scoped lang="scss">
</style>