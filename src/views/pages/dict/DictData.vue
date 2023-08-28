<script setup>
import { reactive, ref, watch } from "vue"
import { final, publicDict, shift_yes_no } from "utils/base.js"
import Pagination from "comp/pagination/Pagination.vue"
import { funcTablePage } from "@/composition/tablePage/tablePage.js"
import {
  delDictDataList,
  getDictDataById,
  getDictDataList,
  insDictData,
  updDicData,
  updDictDataDisabled, updDictDataOrderNum
} from "api/admin/adminDict.js";

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
    label: '',
    value: '',
    remark: '',
    isDefault: null,
    disabled: final.DISABLED_NO,
    orderNum: 0,
    type: props.dictType
  },
  // 这个是弹出框表单校验
  // 格式: {
  //   name: [{ required: true, trigger: 'blur' }],
  //   ...
  // }
  dFormRules: {
    label: [{ required: true, trigger: 'blur' }],
    value: [{ required: true, trigger: 'blur' }]
  },
  // 字典
  // 格式: {
  //   ...publicDict,
  //   name: '名字',
  //   ...
  // }
  dict: {
    ...publicDict,
    label: '标签',
    value: '值',
    remark: '备注'
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
let dialogFormInput1Ref = ref(null)
let filterFormRef = ref(null)
let tableLoadingRef = ref(false)
let switchLoadingRef = ref(false)
let config = reactive({
  selectParam: {
    type: props.dictType
  }, // 查询参数（补充
  pageQuery: false, // 分页，默认true
  tableInlineOperate: false // 允许表格行内操作，默认true
})

const props = defineProps({
  dictType: {
    type: String,
    required: true
  }
})

const func = {
  /**
   * 查询列表
   * @param params
   */
  selectList: params => {
    return getDictDataList(params)
  },
  /**
   * 查询单个
   * @param id
   */
  selectById: id => {
    return getDictDataById(id)
  },
  /**
   * 新增
   * @param obj
   */
  insertOne: obj => {
    return insDictData(obj)
  },
  /**
   * 修改
   * @param obj
   */
  updateOne: obj => {
    return updDicData(obj)
  },
  /**
   * 修改顺序
   * @param ids
   */
  updateOrder: (...ids) => {
    return updDictDataOrderNum(...ids)
  },
  /**
   * 启用禁用
   * @param objs
   */
  updateDisabled: (...objs) => {
    return updDictDataDisabled(...objs)
  },
  /**
   * 删除
   * @param ids
   */
  deleteList: (...ids) => {
    return delDictDataList(...ids)
  }
}

watch(() => props.dictType, (newVal) => {
  state.dialogForm.type = newVal
  config.selectParam.type = newVal
  refresh()
})


const {
  refresh,
  dCan,
  dCon,
  fEnter,
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
  tBeforeChangeIsDefault,
  handleSelectionChange,
  handlerFocus,
  handleOrderNumChange,
  pageChange
} = funcTablePage({
  config,
  state,
  state2,
  dialogFormRef,
  dialogFormInput1Ref,
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
      <!--
      第一个input添加如下属性
      ref="dialogFormInput1Ref"
      -->
      <!--在此下方添加表单项-->
      <el-form-item :label="state.dict['label']" prop="label">
        <el-input v-model="state.dialogForm['label']" :placeholder="state.dict['label']"/>
      </el-form-item>
      <el-form-item :label="state.dict['value']" prop="value">
        <el-input v-model="state.dialogForm['value']" :placeholder="state.dict['value']"/>
      </el-form-item>
      <el-form-item :label="state.dict['remark']" prop="remark">
        <el-input type="textarea" v-model="state.dialogForm['remark']" :placeholder="state.dict['remark']"/>
      </el-form-item>
      <!--在此上方添加表单项-->
      <el-form-item :label="state.dict['orderNum']" prop="orderNum">
        <el-input-number v-model="state.dialogForm['orderNum']"/>
      </el-form-item>
      <el-form-item :label="state.dict['isDefault']" prop="isDefault">
        <el-switch v-model="state.dialogForm['isDefault']" :active-value="final.IS_DEFAULT_YES"
                   :inactive-value="final.IS_DEFAULT_NO"/>
      </el-form-item>
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
      <el-button v-no-more-click plain @click="gRefresh">刷新</el-button>
      <el-button v-no-more-click type="primary" plain @click="gIns">新增</el-button>
      <el-button v-no-more-click v-dangerous-operation="{resolve:()=>gUpd()}" type="success" plain
                 :disabled="state.multipleSelection.length!==1">修改
      </el-button>
      <el-button v-no-more-click v-dangerous-operation="{resolve:()=>gDel()}" type="danger" plain
                 :disabled="state.multipleSelection.length===0">删除
      </el-button>
    </el-button-group>
    <!--<el-button-group>-->
    <!--  <el-button v-no-more-click plain :disabled="state.multipleSelection.length===0" @click="gMoveUp">上移</el-button>-->
    <!--  <el-button v-no-more-click plain :disabled="state.multipleSelection.length===0" @click="gMoveDown">下移-->
    <!--  </el-button>-->
    <!--</el-button-group>-->
    <el-button-group>
      <el-button v-no-more-click v-dangerous-operation="{resolve:()=>gDisabledToNo()}" plain
                 :disabled="state.multipleSelection.length===0">启用
      </el-button>
      <el-button v-no-more-click v-dangerous-operation="{resolve:()=>gDisabledToYes()}" plain
                 :disabled="state.multipleSelection.length===0">禁用
      </el-button>
      <el-button v-no-more-click v-dangerous-operation="{resolve:()=>gDisabledShift()}" plain
                 :disabled="state.multipleSelection.length===0">切换
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
    <el-table-column prop="label" :label="state.dict['label']" width="120"/>
    <el-table-column prop="value" :label="state.dict['value']" width="120"/>
    <el-table-column prop="remark" :label="state.dict['remark']" width="120"/>
    <!--在此上方添加表格列-->
    <el-table-column prop="orderNum" :label="state.dict['orderNum']" width="180">
      <template #default="{row}">
        <el-input-number
            v-if="config.tableInlineOperate"
            v-model="row.orderNum"
            step-strictly
            :value-on-clear="state2.orderNum"
            @focus="handlerFocus(row.orderNum)"
            @change="handleOrderNumChange(row.id)"
        />
        <template v-else>{{ row['orderNum'] }}</template>
      </template>
    </el-table-column>
    <el-table-column :label="state.dict['isDefault']" width="80">
      <template #default="{row}">
        <el-switch
            v-if="config.tableInlineOperate"
            v-model="row.isDefault"
            :loading="switchLoadingRef"
            :active-value="final.IS_DEFAULT_YES"
            :inactive-value="final.IS_DEFAULT_NO"
            :before-change="tBeforeChangeIsDefault.bind(this,row.id)"
        />
        <template v-else>{{ row['isDefault'] }}</template>
      </template>
    </el-table-column>
    <el-table-column :label="state.dict['disabled']" width="80">
      <template #default="{row}">
        <el-switch
            v-if="config.tableInlineOperate"
            v-model="row.disabled"
            :loading="switchLoadingRef"
            :active-value="final.DISABLED_NO"
            :inactive-value="final.DISABLED_YES"
            :before-change="tBeforeChangeDisabled.bind(this,row.id)"
        />
        <template v-else>{{ shift_yes_no[row['disabled']] }}</template>
      </template>
    </el-table-column>
    <el-table-column prop="createBy" :label="state.dict['createBy']" width="120"/>
    <el-table-column prop="updateBy" :label="state.dict['updateBy']" width="120"/>
    <el-table-column prop="createTime" :label="state.dict['createTime']" width="180"/>
    <el-table-column prop="updateTime" :label="state.dict['updateTime']" width="180"/>
    <el-table-column prop="deleted" :label="state.dict['deleted']" width="60"/>
    <!--上方几个酌情使用-->
    <el-table-column fixed="right" label="操作" min-width="120">
      <template #default="{row}">
        <el-button v-no-more-click v-dangerous-operation="{resolve:()=>tUpd(row.id)}" link type="primary" size="small">
          修改
        </el-button>
        <el-button v-no-more-click v-dangerous-operation="{resolve:()=>tDel(row.id)}" link type="danger" size="small">
          删除
        </el-button>
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