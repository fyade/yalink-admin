<script setup>
import { nextTick, onMounted, reactive, ref, watch } from "vue"
import { cascaderProps1, final, publicDict } from "utils/base.js"
import Pagination from "comp/pagination/Pagination.vue"
import { funcTablePage } from "@/composition/tablePage/tablePage.js"
import { selList, selOne, insOne, updOne, updOrder, updDisabled, delList } from 'api/admin/adminLink.js'
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
    ico: '',
    url: '',
    docUrl: '',
    siteSearch: '',
    orderNum: 0,
    sortId: final.DEFAULT_PARENT_ID,
    disabled: final.DISABLED_NO
  },
  // 这个是弹出框表单校验
  dFormRules: {
    name: [{ required: true }],
    url: [{ required: true }],
    sortId: [{ required: true }]
  },
  // 字典
  dict: {
    ...publicDict,
    name: '链接名',
    descr: '链接描述',
    url: '链接地址',
    docUrl: '文档链接',
    siteSearch: '站内搜索链接',
    ico: '图标',
    sortId: '父分类'
  },
  // 筛选表单
  filterForm: {
    name: '',
    descr: '',
    url: '',
    docUrl: '',
    siteSearch: ''
  },
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
  selectParam: {
    sortId: ''
  }, // 查询参数（补充
})

let props = defineProps({
  sortId: {
    type: String
  },
  listSort: {
    type: Array
  }
})
watch(() => state.dialogVisible, (newVal) => {
  if (newVal) {
    state.dialogForm.sortId = config.selectParam.sortId
  } else {
    dialogFormRef.value?.resetFields()
  }
})
watch(() => props.sortId, () => {
  state.dialogForm.sortId = props.sortId
  config.selectParam.sortId = props.sortId
  getData()
})
onMounted(() => {
  state.dialogForm.sortId = props.sortId
  config.selectParam.sortId = props.sortId
  getData()
})
const getData = () => {
  // tableLoadingRef.value = true
  // state.list = []
  // let obj = { ...usePageStore().getPage, ...state.filterForm, ...config.selectParam }
  // func.selectList(obj).then(res => {
  //   if (config.pageQuery) {
  //     state.list = res.data.list
  //     state.total = res.data.total
  //   } else {
  //     state.list = res.data
  //   }
  // }).finally(() => {
  //   tableLoadingRef.value = false
  // })
  gRefresh()
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

const handleChange = (value) => {
}

const {
  dCan,
  dCon,
  fCon,
  fCan,
  gRefresh,
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
  tBeforeChangeDisabled,
  handleSelectionChange,
  handlerFocus,
  handleOrderNumChange,
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
        <span>{{ state.dialogForm.id }}</span>
      </el-form-item>
      <!--在此下方添加表单项-->
      <el-form-item :label="state.dict['name']" prop="name">
        <el-input v-model="state.dialogForm.name"/>
      </el-form-item>
      <el-form-item :label="state.dict['descr']" prop="descr">
        <el-input v-model="state.dialogForm.descr" type="textarea"/>
      </el-form-item>
      <el-form-item :label="state.dict['ico']" prop="ico">
        <el-input v-model="state.dialogForm.ico"/>
      </el-form-item>
      <el-form-item :label="state.dict['url']" prop="url">
        <el-input v-model="state.dialogForm.url"/>
      </el-form-item>
      <el-form-item :label="state.dict['docUrl']" prop="docUrl">
        <el-input v-model="state.dialogForm.docUrl"/>
      </el-form-item>
      <el-form-item :label="state.dict['siteSearch']" prop="siteSearch">
        <el-input v-model="state.dialogForm.siteSearch"/>
      </el-form-item>
      <el-form-item :label="state.dict['orderNum']" prop="orderNum">
        <el-input-number v-model="state.dialogForm.orderNum"/>
      </el-form-item>
      <el-form-item :label="state.dict['sortId']" prop="sortId">
        <el-cascader
            v-model="state.dialogForm.sortId"
            :options="props.listSort"
            :props="cascaderProps1"
            @change="handleChange"
        />
      </el-form-item>
      <!--在此上方添加表单项-->
      <el-form-item :label="state.dict['disabled']" prop="disabled">
        <el-switch v-model="state.dialogForm.disabled" :active-value="final.DISABLED_NO"
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
      @keyup.enter="fCon"
  >
    <!--在此下方添加表单项-->
    <el-form-item :label="state.dict['name']" prop="name">
      <el-input v-model="state.filterForm['name']" :placeholder="state.dict['name']"/>
    </el-form-item>
    <el-form-item :label="state.dict['descr']" prop="descr">
      <el-input v-model="state.filterForm['descr']" :placeholder="state.dict['descr']"/>
    </el-form-item>
    <el-form-item :label="state.dict['url']" prop="url">
      <el-input v-model="state.filterForm['url']" :placeholder="state.dict['url']"/>
    </el-form-item>
    <el-form-item :label="state.dict['docUrl']" prop="docUrl">
      <el-input v-model="state.filterForm['docUrl']" :placeholder="state.dict['docUrl']"/>
    </el-form-item>
    <el-form-item :label="state.dict['siteSearch']" prop="siteSearch">
      <el-input v-model="state.filterForm['siteSearch']" :placeholder="state.dict['siteSearch']"/>
    </el-form-item>
    <!--在此上方添加表单项-->
    <el-form-item>
      <el-button v-no-more-click type="primary" @click="fCon">筛选</el-button>
      <el-button v-no-more-click @click="fCan">重置</el-button>
    </el-form-item>
  </el-form>

  <!--操作按钮-->
  <div style="display: flex;flex-wrap: wrap;gap: 1rem;">
    <el-button-group>
      <el-button v-no-more-click plain @click="gRefresh">刷新</el-button>
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
    <el-table-column prop="name" :label="state.dict['name']" width="160"/>
    <el-table-column prop="descr" :label="state.dict['descr']" width="240"/>
    <el-table-column prop="url" :label="state.dict['url']" width="200"/>
    <el-table-column prop="docUrl" :label="state.dict['docUrl']" width="200"/>
    <el-table-column prop="siteSearch" :label="state.dict['siteSearch']" width="240"/>
    <el-table-column prop="ico" :label="state.dict['ico']" width="60">
      <template #default="{row}">
        <el-image :src="row.ico" fit="contain" lazy/>
      </template>
    </el-table-column>
    <!--在此上方添加表格列-->
    <el-table-column prop="orderNum" :label="state.dict['orderNum']" width="180">
      <template #default="{row}">
        <el-input-number
            v-model="row.orderNum"
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
            v-model="row.disabled"
            :loading="switchLoadingRef"
            :active-value="final.DISABLED_NO"
            :inactive-value="final.DISABLED_YES"
            :before-change="tBeforeChangeDisabled.bind(this,row.id)"
        />
      </template>
    </el-table-column>
    <!--<el-table-column prop="createBy" :label="state.dict['createBy']" width="120"/>-->
    <!--<el-table-column prop="updateBy" :label="state.dict['updateBy']" width="120"/>-->
    <el-table-column prop="createTime" :label="state.dict['createTime']" width="180"/>
    <el-table-column prop="updateTime" :label="state.dict['updateTime']" width="180"/>
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