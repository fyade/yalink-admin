<script setup>
import { reactive, ref } from "vue"
import { final, publicDict } from "utils/base.js"
import Pagination from "comp/pagination/Pagination.vue"
import { funcTablePage } from "@/composition/template/tablePage/index.js"

let state = reactive({
  dialogVisible: false,
  type: {
    value: '',
    label: ''
  },
  // 这个是弹出框表单
  // 格式: {
  //   id: '',
  //   disabled: final.DISABLED_NO,
  //   parentId: final.DEFAULT_PARENT_ID,
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
  //   ...publicDict,
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
  total: -1
})
let state2 = reactive({
  orderNum: 0
})
let dialogFormRef = ref(null)
let filterFormRef = ref(null)
let tableLoadingRef = ref(false)
let switchLoadingRef = ref(false)
let config = reactive({
  selectParam: {}, // 查询参数（补充
  notGetDataOnMounted: false, // 页面加载时不获取数据，默认false
  pageQuery: false, // 是否分页，默认false
  watchDialogVisible: true // 监听dialogVisible变化，默认true
})

const func = {
  /**
   * 查询列表
   * @param params
   */
  selectList: params => {
    // return func(params)
  },
  /**
   * 查询单个
   * @param id
   */
  selectById: id => {
    // return func(id)
  },
  /**
   * 新增
   * @param obj
   */
  insertOne: obj => {
    // return func(obj)
  },
  /**
   * 修改
   * @param obj
   */
  updateOne: obj => {
    // return func(obj)
  },
  /**
   * 修改顺序
   * @param ids
   */
  updateOrder: (...ids) => {
    // return func(...ids)
  },
  /**
   * 启用禁用
   * @param objs
   */
  updateDisabled: (...objs) => {
    // return func(...objs)
  },
  /**
   * 删除
   * @param ids
   */
  deleteList: (...ids) => {
    // return func(...ids)
  }
}

const {
  dCan,
  dCon,
  fEnter,
  fCon,
  fCan,
  gIns,
  gUpd,
  gDel,
  gMoveUp,
  gMoveDown,
  gDisabledToNo,
  gDisabledToYes,
  gDisabledShift,
  tUpd,
  tDel,
  tBeforeChange,
  handleSelectionChange,
  handlerFocus,
  handleOrderNumChange,
  pageChange
} = funcTablePage(
    config,
    state,
    state2,
    dialogFormRef,
    filterFormRef,
    tableLoadingRef,
    switchLoadingRef,
    func
)
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
      <!--<el-form-item :label="state.dict['']" prop="">-->
      <!--  <el-input v-model="state.dialogForm['']" :placeholder="state.dict['']"/>-->
      <!--</el-form-item>-->
      <!--在此上方添加表单项-->
      <!--<el-form-item :label="state.dict['disabled']" prop="disabled">-->
      <!--  <el-switch v-model="state.dialogForm['disabled']" :active-value="final.DISABLED_NO"-->
      <!--             :inactive-value="final.DISABLED_YES"/>-->
      <!--</el-form-item>-->
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
    <!--在此下方添加表单项-->
    <!--<el-form-item :label="state.dict['']" prop="">-->
    <!--  <el-input v-model="state.filterForm['']" :placeholder="state.dict['']"/>-->
    <!--</el-form-item>-->
    <!--在此上方添加表单项-->
    <el-form-item>
      <el-button v-no-more-click type="primary" @click="fCon">筛选</el-button>
      <el-button v-no-more-click @click="fCan">重置</el-button>
    </el-form-item>
  </el-form>

  <!--操作按钮-->
  <div style="display: flex;flex-wrap: wrap;gap: 1rem;">
    <el-button-group>
      <el-button v-no-more-click type="primary" plain @click="gIns">新增</el-button>
      <el-button v-no-more-click type="success" plain :disabled="state.multipleSelection.length!==1" @click="gUpd">修改
      </el-button>
      <el-button v-no-more-click type="danger" plain :disabled="state.multipleSelection.length===0" @click="gDel">删除
      </el-button>
    </el-button-group>
    <el-button-group>
      <el-button v-no-more-click plain :disabled="state.multipleSelection.length===0" @click="gMoveUp">上移</el-button>
      <el-button v-no-more-click plain :disabled="state.multipleSelection.length===0" @click="gMoveDown">下移
      </el-button>
    </el-button-group>
    <el-button-group>
      <el-button v-no-more-click plain :disabled="state.multipleSelection.length===0" @click="gDisabledToNo">启用
      </el-button>
      <el-button v-no-more-click plain :disabled="state.multipleSelection.length===0" @click="gDisabledToYes">禁用
      </el-button>
      <el-button v-no-more-click plain :disabled="state.multipleSelection.length===0" @click="gDisabledShift">切换
      </el-button>
    </el-button-group>
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
    <!--<el-table-column prop="orderNum" :label="state.dict['orderNum']" width="180">-->
    <!--  <template #default="{row}">-->
    <!--    <el-input-number-->
    <!--        v-model="row.orderNum"-->
    <!--        step-strictly-->
    <!--        :value-on-clear="state2.orderNum"-->
    <!--        @focus="handlerFocus(row.orderNum)"-->
    <!--        @change="handleOrderNumChange(row.id)"-->
    <!--    />-->
    <!--  </template>-->
    <!--</el-table-column>-->
    <!--<el-table-column :label="state.dict['disabled']" width="80">-->
    <!--  <template #default="{row}">-->
    <!--    <el-switch-->
    <!--        v-model="row.disabled"-->
    <!--        :loading="switchLoadingRef"-->
    <!--        :active-value="final.DISABLED_NO"-->
    <!--        :inactive-value="final.DISABLED_YES"-->
    <!--        :before-change="tBeforeChange.bind(this,row.id)"-->
    <!--    />-->
    <!--  </template>-->
    <!--</el-table-column>-->
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
      v-if="state.total!==-1"
      :total="Number(state.total)"
      @page-change="pageChange"
  />
</template>

<style scoped lang="scss">
</style>