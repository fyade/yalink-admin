<script setup>
import { reactive, ref } from "vue"
import { final, Operate, publicDict, shift_yes_no } from "utils/base.js"
import Pagination from "comp/pagination/Pagination.vue"
import { funcTablePage } from "@/composition/template/tablePage/index.js"
import { delList, selOne, updDisabled, insOne, selAll, updOne, updOrder } from 'api/searchEngine.js'

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
  dialogForm: {
    id: '',
    name: '',
    descr: '',
    url: '',
    secondLevelUrl: '',
    paramKey: '',
    orderNum: 0,
    disabled: final.DISABLED_NO
  },
  // 这个是弹出框表单校验
  // 格式: {
  //   name: [{ required: true }],
  //   ...
  // }
  dFormRules: {
    name: [{ required: true }],
    descr: [{ required: true }],
    url: [{ required: true }],
    secondLevelUrl: [{ required: true }],
    paramKey: [{ required: true }],
    orderNum: [{ required: true }]
  },
  // 字典
  // 格式: {
  //   ...publicDict,
  //   name: '名字',
  //   ...
  // }
  dict: {
    ...publicDict,
    name: '搜索引擎名',
    descr: '搜索引擎描述',
    url: '搜索引擎链接',
    secondLevelUrl: '搜索二级url',
    paramKey: '搜索参数主键'
  },
  // 筛选表单
  // 格式: {
  //   name: '',
  //   ...
  // }
  filterForm: {
    name: '',
    descr: '',
    url: '',
    secondLevelUrl: '',
    paramKey: '',
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
let config = {
  pageQuery: true // 是否分页
}

const func = {
  /**
   * 查询列表
   * @param params
   */
  selectList: params => {
    return selAll(params)
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
        <span>{{ state.dialogForm.id }}</span>
      </el-form-item>
      <!--在此下方添加表单项-->
      <el-form-item :label="state.dict['name']" prop="name">
        <el-input v-model="state.dialogForm.name" :placeholder="state.dict['name']"/>
      </el-form-item>
      <el-form-item :label="state.dict['descr']" prop="descr">
        <el-input type="textarea" v-model="state.dialogForm.descr" :placeholder="state.dict['descr']"/>
      </el-form-item>
      <el-form-item :label="state.dict['url']" prop="url">
        <el-input v-model="state.dialogForm.url" :placeholder="state.dict['url']"/>
      </el-form-item>
      <el-form-item :label="state.dict['secondLevelUrl']" prop="secondLevelUrl">
        <el-input v-model="state.dialogForm.secondLevelUrl" :placeholder="state.dict['secondLevelUrl']"/>
      </el-form-item>
      <el-form-item :label="state.dict['paramKey']" prop="paramKey">
        <el-input v-model="state.dialogForm.paramKey" :placeholder="state.dict['paramKey']"/>
      </el-form-item>
      <el-form-item :label="state.dict['orderNum']" prop="orderNum">
        <el-input-number v-model="state.dialogForm.orderNum"/>
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
      @keyup.enter="fEnter"
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
    <el-form-item :label="state.dict['secondLevelUrl']" prop="secondLevelUrl">
      <el-input v-model="state.filterForm['secondLevelUrl']" :placeholder="state.dict['secondLevelUrl']"/>
    </el-form-item>
    <el-form-item :label="state.dict['paramKey']" prop="paramKey">
      <el-input v-model="state.filterForm['paramKey']" :placeholder="state.dict['paramKey']"/>
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
    <el-table-column prop="name" :label="state.dict['name']" width="120"/>
    <el-table-column prop="descr" :label="state.dict['descr']" width="120"/>
    <el-table-column prop="url" :label="state.dict['url']" width="240"/>
    <el-table-column prop="secondLevelUrl" :label="state.dict['secondLevelUrl']" width="120"/>
    <el-table-column prop="paramKey" :label="state.dict['paramKey']" width="120"/>
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
            :before-change="tBeforeChange.bind(this,row.id)"
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