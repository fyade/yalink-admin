<script setup>
import { nextTick, reactive, ref, watch } from "vue"
import { cascaderProps1, cascaderProps3, final, publicDict } from "utils/base.js"
import Pagination from "comp/pagination/Pagination.vue"
import { funcTablePage } from "@/composition/tablePage/tablePage.js"
import { delList, getList, updateStatusToReject, updateStatusToResolve } from "api/admin/adminLinkApply.js";
import { getDictData } from "api/common.js";
import { selList as selSortList } from "api/admin/adminSort.js";
import { ElMessage } from "element-plus";

let state = reactive({
  createTime: '',
  updateTime: '',
  sortList: [],
  dicStatusData: [],
  dicStatus: {
    '1': '',
    '2': 'danger',
    '3': 'success'
  },
  dialogVisible: false,
  type: {
    value: '',
    label: ''
  },
  // 这个是弹出框表单
  // 格式: {
  //   id: '',
  //   isDefault: final.IS_DEFAULT_YES,
  //   disabled: final.DISABLED_NO,
  //   parentId: final.DEFAULT_PARENT_ID,
  //   ...
  // }
  dialogForm: {
    id: '',
    name: '',
    descr: '',
    url: '',
    docUrl: '',
    siteSearch: '',
    ico: '',
    sortId: '',
    sortName: '',
    orderNum: 0,
    disabled: final.DISABLED_NO,
    applyBy: '',
    checkBy: '',
    status: '',
    msg: '',
    createTime: ''
  },
  // 这个是弹出框表单校验
  // 格式: {
  //   name: [{ required: true, trigger: 'blur' }],
  //   ...
  // }
  dFormRules: {
    name: [{ required: true, trigger: 'blur' }],
    url: [{ required: true, trigger: 'blur' }],
    ico: [{ required: true, trigger: 'blur' }],
    sortId: [{ required: true, trigger: 'blur' }],
    orderNum: [{ required: true, trigger: 'blur' }],
    disabled: [{ required: true, trigger: 'blur' }],
  },
  // 字典
  // 格式: {
  //   ...publicDict,
  //   name: '名字',
  //   ...
  // }
  dict: {
    ...publicDict,
    name: '网站名',
    descr: '网站描述',
    url: '网站链接',
    docUrl: '文档地址',
    siteSearch: '站内搜索链接',
    ico: '网站图标',
    sortId: '所属分类',
    sortName: '所属分类',
    applyBy: '申请人',
    checkBy: '审核人',
    status: '审核状态',
    msg: '通过/驳回原因',
    createTime: '申请时间',
    updateTime: '审核时间'
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
    sortId: '',
    status: '',
    createTimeStart: 0,
    createTimeEnd: 0,
    updateTimeStart: 0,
    updateTimeEnd: 0,
    applyBy: '',
    checkBy: ''
  },
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
  // selectParam: {}, // 查询参数（补充
  // getDataOnMounted: true, // 页面加载时获取数据，默认true
  // pageQuery: true, // 分页，默认true
  // watchDialogVisible: true, // 监听dialogVisible变化，默认true
  // tableInlineOperate: true // 允许表格行内操作，默认true
})
const shortcuts = [
  {
    text: '近1日',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 1000 * 60 * 60 * 24)
      return [start, end]
    }
  },
  {
    text: '近3日',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 1000 * 60 * 60 * 24 * 3)
      return [start, end]
    }
  },
  {
    text: '近7日',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 1000 * 60 * 60 * 24 * 7)
      return [start, end]
    }
  },
  {
    text: '近30日',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 1000 * 60 * 60 * 24 * 30)
      return [start, end]
    }
  }
]

const func = {
  /**
   * 查询列表
   * @param params
   */
  selectList: params => {
    return getList(params)
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
    return delList(...ids)
  }
}

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

watch(() => state.createTime, val => {
  if (val) {
    state.filterForm.createTimeStart = Date.parse(val[0]).toString()
    state.filterForm.createTimeEnd = Date.parse(val[1]).toString()
  } else {
    state.filterForm.createTimeStart = 0
    state.filterForm.createTimeEnd = 0
  }
})
watch(() => state.updateTime, val => {
  if (val) {
    state.filterForm.updateTimeStart = Date.parse(val[0]).toString()
    state.filterForm.updateTimeEnd = Date.parse(val[1]).toString()
  } else {
    state.filterForm.updateTimeStart = 0
    state.filterForm.updateTimeEnd = 0
  }
})

getDictData({ type: 'sys_link_apply_status' }).then(res => {
  state.dicStatusData = res.data
})
selSortList().then(res => {
  state.sortList = res.data
})

const fCan2 = () => {
  state.createTime = null
  state.updateTime = null
  state.filterForm.createTimeStart = 0
  state.filterForm.createTimeEnd = 0
  state.filterForm.updateTimeStart = 0
  state.filterForm.updateTimeEnd = 0
  fCan()
}
const tUpd2 = id => {
  state.type.value = 'upd'
  state.type.label = '修改'
  state.dialogVisible = true
  const a1 = state.dialogForm.orderNum
  const a2 = state.dialogForm.disabled
  nextTick(() => {
    let obj = state.list.find(item => item.id === id)
    Object.keys(state.dialogForm).forEach(item => {
      state.dialogForm[item] = obj[item]
    })
    state.dialogForm.orderNum = a1
    state.dialogForm.disabled = a2
  })
}
const dConResolve = () => {
  dialogFormRef.value.validate((valid, fields) => {
    if (valid) {
      updateStatusToResolve(state.dialogForm).then(res => {
        state.dialogVisible = false
        refresh()
      })
    } else {
      let arr = []
      Object.keys(fields).forEach(item => arr.push(state.dict[item]))
      ElMessage.warning(`${arr.join('、')}不能为空`)
    }
  })
}
const dConReject = () => {
  if (!!!state.dialogForm.msg) return ElMessage.warning("请输入驳回原因")
  dialogFormRef.value.validate((valid, fields) => {
    if (valid) {
      updateStatusToReject(state.dialogForm).then(res => {
        state.dialogVisible = false
        refresh()
      })
    } else {
      let arr = []
      Object.keys(fields).forEach(item => arr.push(state.dict[item]))
      ElMessage.warning(`${arr.join('、')}不能为空`)
    }
  })
}
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
      <el-form-item :label="state.dict['name']" prop="name">
        <el-input :disabled="state.dialogForm['status'].toString()!=='1'" v-model="state.dialogForm['name']"
                  :placeholder="state.dict['name']"/>
      </el-form-item>
      <el-form-item :label="state.dict['descr']" prop="descr">
        <el-input :disabled="state.dialogForm['status'].toString()!=='1'" v-model="state.dialogForm['descr']"
                  :placeholder="state.dict['descr']"/>
      </el-form-item>
      <el-form-item :label="state.dict['url']" prop="url">
        <el-input :disabled="state.dialogForm['status'].toString()!=='1'" v-model="state.dialogForm['url']"
                  :placeholder="state.dict['url']"/>
      </el-form-item>
      <el-form-item :label="state.dict['docUrl']" prop="docUrl">
        <el-input :disabled="state.dialogForm['status'].toString()!=='1'" v-model="state.dialogForm['docUrl']"
                  :placeholder="state.dict['docUrl']"/>
      </el-form-item>
      <el-form-item :label="state.dict['siteSearch']" prop="siteSearch">
        <el-input :disabled="state.dialogForm['status'].toString()!=='1'" v-model="state.dialogForm['siteSearch']"
                  :placeholder="state.dict['siteSearch']"/>
      </el-form-item>
      <el-form-item :label="state.dict['ico']" prop="ico">
        <el-input :disabled="state.dialogForm['status'].toString()!=='1'" v-model="state.dialogForm['ico']"
                  :placeholder="state.dict['ico']"/>
        <el-image style="width: 120px;height: 120px;" :src="state.dialogForm.ico" fit="contain" lazy/>
      </el-form-item>
      <!--<el-form-item :label="state.dict['sortId']" prop="sortId">-->
      <!--  <el-input disabled v-model="state.dialogForm['sortId']" :placeholder="state.dict['sortId']"/>-->
      <!--</el-form-item>-->
      <el-form-item :label="state.dict['sortName']" prop="sortName">
        {{ state.dialogForm['sortName'] }}
      </el-form-item>
      <el-form-item :label="state.dict['orderNum']" prop="orderNum">
        <el-input-number :disabled="state.dialogForm['status'].toString()!=='1'"
                         v-model="state.dialogForm['orderNum']"/>
      </el-form-item>
      <el-form-item :label="state.dict['disabled']" prop="disabled">
        <el-switch :disabled="state.dialogForm['status'].toString()!=='1'" v-model="state.dialogForm['disabled']"
                   :active-value="final.DISABLED_NO"
                   :inactive-value="final.DISABLED_YES"/>
      </el-form-item>
      <el-form-item :label="state.dict['applyBy']" prop="applyBy">
        <div>
          <p>用户id：{{ state.dialogForm['applyBy'].id }}</p>
          <p>用户名：{{ state.dialogForm['applyBy'].username }}</p>
        </div>
      </el-form-item>
      <el-form-item :label="state.dict['checkBy']" prop="checkBy">
        <div>
          <p>用户id：{{ state.dialogForm['checkBy']?.id }}</p>
          <p>用户名：{{ state.dialogForm['checkBy']?.username }}</p>
        </div>
      </el-form-item>
      <el-form-item :label="state.dict['status']" prop="status">
        <el-tag :type="state.dicStatus[state.dialogForm['status']]">
          {{ state.dicStatusData.find(item => item.value === state.dialogForm['status'])?.label }}
        </el-tag>
      </el-form-item>
      <el-form-item :label="state.dict['msg']" prop="msg">
        <el-input :disabled="state.dialogForm['status'].toString()!=='1'" type="textarea" :rows="3"
                  v-model="state.dialogForm['msg']" :placeholder="state.dict['msg']"/>
      </el-form-item>
      <el-form-item :label="state.dict['createTime']" prop="createTime">
        {{ state.dialogForm['createTime'] }}
      </el-form-item>
      <el-form-item :label="state.dict['updateTime']" prop="updateTime">
        <template v-if="state.dialogForm['status'].toString()!=='1'">{{ state.dialogForm['updateTime'] }}</template>
      </el-form-item>
      <!--在此上方添加表单项-->
      <!--<el-form-item :label="state.dict['orderNum']" prop="orderNum">-->
      <!--  <el-input-number v-model="state.dialogForm['orderNum']"/>-->
      <!--</el-form-item>-->
      <!--<el-form-item :label="state.dict['isDefault']" prop="isDefault">-->
      <!--  <el-switch v-model="state.dialogForm['isDefault']" :active-value="final.IS_DEFAULT_YES"-->
      <!--             :inactive-value="final.IS_DEFAULT_NO"/>-->
      <!--</el-form-item>-->
      <!--<el-form-item :label="state.dict['disabled']" prop="disabled">-->
      <!--  <el-switch v-model="state.dialogForm['disabled']" :active-value="final.DISABLED_NO"-->
      <!--             :inactive-value="final.DISABLED_YES"/>-->
      <!--</el-form-item>-->
      <!--上方几个酌情使用-->
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button v-no-more-click @click="dCan">取消</el-button>
        <template v-if="state.dialogForm['status'].toString()==='1'">
        <el-button v-no-more-click type="success" @click="dConResolve">通过</el-button>
        <el-button v-no-more-click type="danger" @click="dConReject">驳回</el-button>
        </template>
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
    <el-form-item :label="state.dict['name']" prop="name">
      <el-input v-model="state.filterForm['name']" :placeholder="state.dict['name']"/>
    </el-form-item>
    <el-form-item :label="state.dict['descr']" prop="descr">
      <el-input v-model="state.filterForm['descr']" :placeholder="state.dict['descr']"/>
    </el-form-item>
    <el-form-item :label="state.dict['url']" prop="url">
      <el-input v-model="state.filterForm['url']" :placeholder="state.dict['url']"/>
    </el-form-item>
    <el-form-item :label="state.dict['sortId']" prop="sortId">
      <el-cascader
          v-model="state.filterForm['sortId']"
          :options="state.sortList"
          :props="cascaderProps1"
      />
    </el-form-item>
    <el-form-item :label="state.dict['status']" prop="status">
      <el-cascader
          v-model="state.filterForm['status']"
          :options="state.dicStatusData"
          :props="cascaderProps3"
      />
    </el-form-item>
    <el-form-item label="提交时间" prop="createTime">
      <el-date-picker
          v-model="state.createTime"
          type="datetimerange"
          :shortcuts="shortcuts"
          range-separator="至"
          start-placeholder="时间范围起"
          end-placeholder="时间范围止"
      />
    </el-form-item>
    <el-form-item label="审核时间" prop="updateTime">
      <el-date-picker
          v-model="state.updateTime"
          type="datetimerange"
          :shortcuts="shortcuts"
          range-separator="至"
          start-placeholder="时间范围起"
          end-placeholder="时间范围止"
      />
    </el-form-item>
    <el-form-item :label="state.dict['applyBy']" prop="applyBy">
      <el-input v-model="state.filterForm['applyBy']" placeholder="用户id/用户名/用户昵称"/>
    </el-form-item>
    <el-form-item :label="state.dict['checkBy']" prop="checkBy">
      <el-input v-model="state.filterForm['checkBy']" placeholder="用户id/用户名/用户昵称"/>
    </el-form-item>
    <!--在此上方添加表单项-->
    <el-form-item>
      <el-button v-no-more-click type="primary" @click="fCon">筛选</el-button>
      <el-button v-no-more-click @click="fCan2">重置</el-button>
    </el-form-item>
  </el-form>

  <!--操作按钮-->
  <div style="display: flex;flex-wrap: wrap;gap: 1rem;">
    <el-button-group>
      <el-button v-no-more-click plain @click="gRefresh">刷新</el-button>
      <!--<el-button v-no-more-click type="primary" plain @click="gIns">新增</el-button>-->
      <!--<el-button v-no-more-click="{disabled:state.multipleSelection.length!==1}" type="success" plain-->
      <!--           :disabled="state.multipleSelection.length!==1" @click="gUpd">修改-->
      <!--</el-button>-->
      <el-button v-no-more-click="{disabled:state.multipleSelection.length===0}" type="danger" plain
                 :disabled="state.multipleSelection.length===0" @click="gDel">删除
      </el-button>
    </el-button-group>
    <!--<el-button-group>-->
    <!--  <el-button v-no-more-click="{disabled:state.multipleSelection.length===0}" plain-->
    <!--             :disabled="state.multipleSelection.length===0" @click="gMoveUp">上移-->
    <!--  </el-button>-->
    <!--  <el-button v-no-more-click="{disabled:state.multipleSelection.length===0}" plain-->
    <!--             :disabled="state.multipleSelection.length===0" @click="gMoveDown">下移-->
    <!--  </el-button>-->
    <!--</el-button-group>-->
    <!--<el-button-group>-->
    <!--  <el-button v-no-more-click="{disabled:state.multipleSelection.length===0}" plain-->
    <!--             :disabled="state.multipleSelection.length===0" @click="gDisabledToNo">启用-->
    <!--  </el-button>-->
    <!--  <el-button v-no-more-click="{disabled:state.multipleSelection.length===0}" plain-->
    <!--             :disabled="state.multipleSelection.length===0" @click="gDisabledToYes">禁用-->
    <!--  </el-button>-->
    <!--  <el-button v-no-more-click="{disabled:state.multipleSelection.length===0}" plain-->
    <!--             :disabled="state.multipleSelection.length===0" @click="gDisabledShift">切换-->
    <!--  </el-button>-->
    <!--</el-button-group>-->
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
    <el-table-column prop="descr" :label="state.dict['descr']" width="240"/>
    <el-table-column prop="url" :label="state.dict['url']" width="150">
      <template #default="{row}">
        <a :href="row.url" target="_blank">{{ row.url }}</a>
      </template>
    </el-table-column>
    <el-table-column prop="ico" :label="state.dict['ico']" width="120">
      <template #default="{row}">
        <el-image :src="row.ico" fit="contain" lazy/>
      </template>
    </el-table-column>
    <el-table-column prop="sortName" :label="state.dict['sortName']" width="150"/>
    <el-table-column prop="applyBy" :label="state.dict['applyBy']" width="180">
      <template #default="{row}">
        <p>用户id：{{ row.applyBy.id }}</p>
        <p>用户名：{{ row.applyBy.username }}</p>
      </template>
    </el-table-column>
    <el-table-column prop="checkBy" :label="state.dict['checkBy']" width="180">
      <template #default="{row}">
        <p>用户id：{{ row.checkBy?.id }}</p>
        <p>用户名：{{ row.checkBy?.username }}</p>
      </template>
    </el-table-column>
    <el-table-column prop="status" :label="state.dict['status']" width="120">
      <template #default="{row}">
        <el-tag :type="state.dicStatus[row.status]">
          {{ state.dicStatusData.find(item => item.value === row.status).label }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="msg" :label="state.dict['msg']" width="120"/>
    <!--在此上方添加表格列-->
    <!--<el-table-column prop="orderNum" :label="state.dict['orderNum']" width="180">-->
    <!--  <template #default="{row}">-->
    <!--    <el-input-number-->
    <!--        v-if="config.tableInlineOperate"-->
    <!--        v-model="row.orderNum"-->
    <!--        step-strictly-->
    <!--        :value-on-clear="state2.orderNum"-->
    <!--        @focus="handlerFocus(row.orderNum)"-->
    <!--        @change="handleOrderNumChange(row.id)"-->
    <!--    />-->
    <!--    <template v-else>{{ row['orderNum'] }}</template>-->
    <!--  </template>-->
    <!--</el-table-column>-->
    <!--<el-table-column :label="state.dict['isDefault']" width="80">-->
    <!--  <template #default="{row}">-->
    <!--    <el-switch-->
    <!--        v-if="config.tableInlineOperate"-->
    <!--        v-model="row.isDefault"-->
    <!--        :loading="switchLoadingRef"-->
    <!--        :active-value="final.IS_DEFAULT_YES"-->
    <!--        :inactive-value="final.IS_DEFAULT_NO"-->
    <!--        :before-change="tBeforeChangeIsDefault.bind(this,row.id)"-->
    <!--    />-->
    <!--    <template v-else>{{ row['isDefault'] }}</template>-->
    <!--  </template>-->
    <!--</el-table-column>-->
    <!--<el-table-column :label="state.dict['disabled']" width="80">-->
    <!--  <template #default="{row}">-->
    <!--    <el-switch-->
    <!--        v-if="config.tableInlineOperate"-->
    <!--        v-model="row.disabled"-->
    <!--        :loading="switchLoadingRef"-->
    <!--        :active-value="final.DISABLED_NO"-->
    <!--        :inactive-value="final.DISABLED_YES"-->
    <!--        :before-change="tBeforeChangeDisabled.bind(this,row.id)"-->
    <!--    />-->
    <!--    <template v-else>{{ shift_yes_no[row['disabled']] }}</template>-->
    <!--  </template>-->
    <!--</el-table-column>-->
    <!--<el-table-column prop="createBy" :label="state.dict['createBy']" width="120"/>-->
    <!--<el-table-column prop="updateBy" :label="state.dict['updateBy']" width="120"/>-->
    <el-table-column prop="createTime" :label="state.dict['createTime']" width="180"/>
    <el-table-column :label="state.dict['updateTime']" width="180">
      <template #default="{row}">
        <span v-if="row.status.toString()!=='1'">{{ row.updateTime }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="deleted" :label="state.dict['deleted']" width="60"/>
    <!--上方几个酌情使用-->
    <el-table-column fixed="right" label="操作" min-width="120">
      <template #default="{row}">
        <el-button v-no-more-click link type="primary" size="small" @click="tUpd2(row.id)">
          {{ row.status === '1' ? '审核' : '详情' }}
        </el-button>
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