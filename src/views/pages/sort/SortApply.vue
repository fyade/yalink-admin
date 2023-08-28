<script setup>
// import { reactive, ref } from "vue"
// import { final, imageBUrl, publicDict } from "utils/base.js"
// import Pagination from "comp/pagination/Pagination.vue"
// import { funcTablePage } from "@/composition/tablePage/tablePage.js"
// import { selList, rejectApply } from 'api/admin/adminSortApply.js'
// import { ElMessage, ElMessageBox } from "element-plus";
//
// let state = reactive({
//   dialogVisible: false,
//   type: {
//     value: '',
//     label: ''
//   },
//   // 这个是弹出框表单
//   // 格式: {
//   //   id: '',
//   //   disabled: final.DISABLED_NO,
//   //   parentId: final.DEFAULT_PARENT_ID,
//   //   ...
//   // }
//   dialogForm: {},
//   // 这个是弹出框表单校验
//   // 格式: {
//   //   name: [{ required: true }],
//   //   ...
//   // }
//   dFormRules: {},
//   // 字典
//   // 格式: {
//   //   ...publicDict,
//   //   name: '名字',
//   //   ...
//   // }
//   dict: {
//     ...publicDict,
//     name: '分类名',
//     descr: '分类描述',
//     parentId: '父级分类id',
//     parentSort: '父级分类',
//     applyBy: '申请人',
//     checkBy: '审核人',
//     status: '审核状态',
//     msg: '审核结果'
//   },
//   // 筛选表单
//   // 格式: {
//   //   name: '',
//   //   ...
//   // }
//   filterForm: {},
//   list: [],
//   multipleSelection: [],
//   total: -1
// })
// let state2 = reactive({
//   orderNum: 0
// })
// let dialogFormRef = ref(null)
// let filterFormRef = ref(null)
// let tableLoadingRef = ref(false)
// let switchLoadingRef = ref(false)
// let config = reactive({
//   selectParam: {}, // 查询参数（补充
//   notGetDataOnMounted: false, // 页面加载时不获取数据，默认false
//   pageQuery: true, // 是否分页，默认false
//   watchDialogVisible: true // 监听dialogVisible变化，默认true
// })
//
// const func = {
//   /**
//    * 查询列表
//    * @param params
//    */
//   selectList: params => {
//     return selList(params)
//   },
//   /**
//    * 查询单个
//    * @param id
//    */
//   selectById: id => {
//     // return func(id)
//   },
//   /**
//    * 新增
//    * @param obj
//    */
//   insertOne: obj => {
//     // return func(obj)
//   },
//   /**
//    * 修改
//    * @param obj
//    */
//   updateOne: obj => {
//     // return func(obj)
//   },
//   /**
//    * 修改顺序
//    * @param ids
//    */
//   updateOrder: (...ids) => {
//     // return func(...ids)
//   },
//   /**
//    * 启用禁用
//    * @param objs
//    */
//   updateDisabled: (...objs) => {
//     // return func(...objs)
//   },
//   /**
//    * 删除
//    * @param ids
//    */
//   deleteList: (...ids) => {
//     // return func(...ids)
//   }
// }
//
// const tWatch = id => {
// }
// const tResolve = id => {
//   resolveA
// }
// const tReject = id => {
//   ElMessageBox.prompt('请输入驳回原因', 'Warning', {
//     confirmButtonText: '驳回',
//     cancelButtonText: '取消',
//     inputPattern: /^.{1,}$/,
//     inputErrorMessage: '请输入驳回原因',
//   }).then(({ value }) => {
//     rejectApply({ id, value }).then(res => {
//       if (res.code === 200) {
//         ElMessage.success('操作成功')
//         gRefresh()
//       }
//     })
//   }).catch(() => {
//   })
// }
//
// const {
//   dCan,
//   dCon,
//   fEnter,
//   fCon,
//   fCan,
//   gRefresh,
//   gIns,
//   gUpd,
//   gDel,
//   gMoveUp,
//   gMoveDown,
//   gDisabledToNo,
//   gDisabledToYes,
//   gDisabledShift,
//   tUpd,
//   tDel,
//   tBeforeChangeDisabled,
//   handleSelectionChange,
//   handlerFocus,
//   handleOrderNumChange,
//   pageChange
// } = funcTablePage(
//     config,
//     state,
//     state2,
//     dialogFormRef,
//     filterFormRef,
//     tableLoadingRef,
//     switchLoadingRef,
//     func
// )
</script>

<template>
  <!--&lt;!&ndash;弹框&ndash;&gt;-->
  <!--<el-dialog-->
  <!--    v-model="state.dialogVisible"-->
  <!--    :title="state.type.label"-->
  <!--    draggable-->
  <!--    append-to-body-->
  <!--&gt;-->
  <!--  <el-form-->
  <!--      ref="dialogFormRef"-->
  <!--      :model="state.dialogForm"-->
  <!--      label-width="120px"-->
  <!--      :rules="state.dFormRules"-->
  <!--  >-->
  <!--    <el-form-item v-if="state.type.value!=='ins'" :label="state.dict['id']" prop="id">-->
  <!--      <span>{{ state.dialogForm['id'] }}</span>-->
  <!--    </el-form-item>-->
  <!--    &lt;!&ndash;在此下方添加表单项&ndash;&gt;-->
  <!--    &lt;!&ndash;<el-form-item :label="state.dict['']" prop="">&ndash;&gt;-->
  <!--    &lt;!&ndash;  <el-input v-model="state.dialogForm['']" :placeholder="state.dict['']"/>&ndash;&gt;-->
  <!--    &lt;!&ndash;</el-form-item>&ndash;&gt;-->
  <!--    &lt;!&ndash;在此上方添加表单项&ndash;&gt;-->
  <!--    &lt;!&ndash;<el-form-item :label="state.dict['disabled']" prop="disabled">&ndash;&gt;-->
  <!--    &lt;!&ndash;  <el-switch v-model="state.dialogForm['disabled']" :active-value="final.DISABLED_NO"&ndash;&gt;-->
  <!--    &lt;!&ndash;             :inactive-value="final.DISABLED_YES"/>&ndash;&gt;-->
  <!--    &lt;!&ndash;</el-form-item>&ndash;&gt;-->
  <!--    &lt;!&ndash;上方几个酌情使用&ndash;&gt;-->
  <!--  </el-form>-->
  <!--  <template #footer>-->
  <!--    <span class="dialog-footer">-->
  <!--      <el-button v-no-more-click @click="dCan">取消</el-button>-->
  <!--      <el-button v-no-more-click type="primary" @click="dCon">确认</el-button>-->
  <!--    </span>-->
  <!--  </template>-->
  <!--</el-dialog>-->

  <!--&lt;!&ndash;顶部筛选表单&ndash;&gt;-->
  <!--<el-form-->
  <!--    class="demo-form-inline"-->
  <!--    v-if="Object.keys(state.filterForm).length>0"-->
  <!--    ref="filterFormRef"-->
  <!--    :model="state.filterForm"-->
  <!--    :inline="true"-->
  <!--    @keyup.enter="fEnter"-->
  <!--&gt;-->
  <!--  &lt;!&ndash;在此下方添加表单项&ndash;&gt;-->
  <!--  &lt;!&ndash;<el-form-item :label="state.dict['']" prop="">&ndash;&gt;-->
  <!--  &lt;!&ndash;  <el-input v-model="state.filterForm['']" :placeholder="state.dict['']"/>&ndash;&gt;-->
  <!--  &lt;!&ndash;</el-form-item>&ndash;&gt;-->
  <!--  &lt;!&ndash;在此上方添加表单项&ndash;&gt;-->
  <!--  <el-form-item>-->
  <!--    <el-button v-no-more-click type="primary" @click="fCon">筛选</el-button>-->
  <!--    <el-button v-no-more-click @click="fCan">重置</el-button>-->
  <!--  </el-form-item>-->
  <!--</el-form>-->

  <!--&lt;!&ndash;操作按钮&ndash;&gt;-->
  <!--<div style="display: flex;flex-wrap: wrap;gap: 1rem;">-->
  <!--  <el-button-group>-->
  <!--    <el-button v-no-more-click plain @click="gRefresh">刷新</el-button>-->
  <!--    &lt;!&ndash;<el-button v-no-more-click type="primary" plain @click="gIns">新增</el-button>&ndash;&gt;-->
  <!--    &lt;!&ndash;<el-button v-no-more-click type="success" plain :disabled="state.multipleSelection.length!==1" @click="gUpd">修改&ndash;&gt;-->
  <!--    &lt;!&ndash;</el-button>&ndash;&gt;-->
  <!--    &lt;!&ndash;<el-button v-no-more-click type="danger" plain :disabled="state.multipleSelection.length===0" @click="gDel">删除&ndash;&gt;-->
  <!--    &lt;!&ndash;</el-button>&ndash;&gt;-->
  <!--  </el-button-group>-->
  <!--  &lt;!&ndash;<el-button-group>&ndash;&gt;-->
  <!--  &lt;!&ndash;  <el-button v-no-more-click plain :disabled="state.multipleSelection.length===0" @click="gMoveUp">上移</el-button>&ndash;&gt;-->
  <!--  &lt;!&ndash;  <el-button v-no-more-click plain :disabled="state.multipleSelection.length===0" @click="gMoveDown">下移&ndash;&gt;-->
  <!--  &lt;!&ndash;  </el-button>&ndash;&gt;-->
  <!--  &lt;!&ndash;</el-button-group>&ndash;&gt;-->
  <!--  &lt;!&ndash;<el-button-group>&ndash;&gt;-->
  <!--  &lt;!&ndash;  <el-button v-no-more-click plain :disabled="state.multipleSelection.length===0" @click="gDisabledToNo">启用&ndash;&gt;-->
  <!--  &lt;!&ndash;  </el-button>&ndash;&gt;-->
  <!--  &lt;!&ndash;  <el-button v-no-more-click plain :disabled="state.multipleSelection.length===0" @click="gDisabledToYes">禁用&ndash;&gt;-->
  <!--  &lt;!&ndash;  </el-button>&ndash;&gt;-->
  <!--  &lt;!&ndash;  <el-button v-no-more-click plain :disabled="state.multipleSelection.length===0" @click="gDisabledShift">切换&ndash;&gt;-->
  <!--  &lt;!&ndash;  </el-button>&ndash;&gt;-->
  <!--  &lt;!&ndash;</el-button-group>&ndash;&gt;-->
  <!--</div>-->

  <!--&lt;!&ndash;数据表格&ndash;&gt;-->
  <!--<el-table-->
  <!--    style="width: 100%"-->
  <!--    v-loading="tableLoadingRef"-->
  <!--    :data="state.list"-->
  <!--    @selection-change="handleSelectionChange"-->
  <!--&gt;-->
  <!--  <el-table-column fixed type="selection" width="55"/>-->
  <!--  &lt;!&ndash;<el-table-column fixed prop="id" :label="state.dict['id']" width="180"/>&ndash;&gt;-->
  <!--  &lt;!&ndash;上面id列的宽度改一下&ndash;&gt;-->
  <!--  &lt;!&ndash;在此下方添加表格列&ndash;&gt;-->
  <!--  <el-table-column prop="name" :label="state.dict['name']" width="120"/>-->
  <!--  <el-table-column prop="descr" :label="state.dict['descr']" width="180"/>-->
  <!--  <el-table-column :label="state.dict['parentSort']" width="180">-->
  <!--    <template #default="{row}">-->
  <!--      {{ row.parentSort?.name || 'null' }}-->
  <!--    </template>-->
  <!--  </el-table-column>-->
  <!--  <el-table-column :label="state.dict['applyBy']" width="240">-->
  <!--    <template #default="{row}">-->
  <!--      <div style="display: flex;align-items: center;gap: 10px;">-->
  <!--        <el-image style="width: 100px;" :src="imageBUrl+row.applyBy.avatar" fit="contain" lazy/>-->
  <!--        <div>-->
  <!--          <p>用户名：{{ row.applyBy.username }}</p>-->
  <!--          <p>昵称：{{ row.applyBy.nickname }}</p>-->
  <!--        </div>-->
  <!--      </div>-->
  <!--    </template>-->
  <!--  </el-table-column>-->
  <!--  <el-table-column :label="state.dict['checkBy']" width="240">-->
  <!--    <template #default="{row}">-->
  <!--      <template v-if="!!row.checkBy">-->
  <!--        <div style="display: flex;align-items: center;gap: 10px;">-->
  <!--          <el-image style="width: 100px;" :src="imageBUrl+row.checkBy.avatar" fit="contain" lazy/>-->
  <!--          <div>-->
  <!--            <p>用户名：{{ row.checkBy.username }}</p>-->
  <!--            <p>昵称：{{ row.checkBy.nickname }}</p>-->
  <!--          </div>-->
  <!--        </div>-->
  <!--      </template>-->
  <!--    </template>-->
  <!--  </el-table-column>-->
  <!--  <el-table-column prop="status" :label="state.dict['status']" width="120"/>-->
  <!--  <el-table-column prop="msg" :label="state.dict['msg']" width="180"/>-->
  <!--  &lt;!&ndash;在此上方添加表格列&ndash;&gt;-->
  <!--  &lt;!&ndash;<el-table-column prop="orderNum" :label="state.dict['orderNum']" width="180">&ndash;&gt;-->
  <!--  &lt;!&ndash;  <template #default="{row}">&ndash;&gt;-->
  <!--  &lt;!&ndash;    <el-input-number&ndash;&gt;-->
  <!--  &lt;!&ndash;        v-model="row.orderNum"&ndash;&gt;-->
  <!--  &lt;!&ndash;        step-strictly&ndash;&gt;-->
  <!--  &lt;!&ndash;        :value-on-clear="state2.orderNum"&ndash;&gt;-->
  <!--  &lt;!&ndash;        @focus="handlerFocus(row.orderNum)"&ndash;&gt;-->
  <!--  &lt;!&ndash;        @change="handleOrderNumChange(row.id)"&ndash;&gt;-->
  <!--  &lt;!&ndash;    />&ndash;&gt;-->
  <!--  &lt;!&ndash;  </template>&ndash;&gt;-->
  <!--  &lt;!&ndash;</el-table-column>&ndash;&gt;-->
  <!--  &lt;!&ndash;<el-table-column :label="state.dict['disabled']" width="80">&ndash;&gt;-->
  <!--  &lt;!&ndash;  <template #default="{row}">&ndash;&gt;-->
  <!--  &lt;!&ndash;    <el-switch&ndash;&gt;-->
  <!--  &lt;!&ndash;        v-model="row.disabled"&ndash;&gt;-->
  <!--  &lt;!&ndash;        :loading="switchLoadingRef"&ndash;&gt;-->
  <!--  &lt;!&ndash;        :active-value="final.DISABLED_NO"&ndash;&gt;-->
  <!--  &lt;!&ndash;        :inactive-value="final.DISABLED_YES"&ndash;&gt;-->
  <!--  &lt;!&ndash;        :before-change="tBeforeChangeDisabled.bind(this,row.id)"&ndash;&gt;-->
  <!--  &lt;!&ndash;    />&ndash;&gt;-->
  <!--  &lt;!&ndash;  </template>&ndash;&gt;-->
  <!--  &lt;!&ndash;</el-table-column>&ndash;&gt;-->
  <!--  &lt;!&ndash;<el-table-column prop="createBy" :label="state.dict['createBy']" width="120"/>&ndash;&gt;-->
  <!--  &lt;!&ndash;<el-table-column prop="updateBy" :label="state.dict['updateBy']" width="120"/>&ndash;&gt;-->
  <!--  <el-table-column prop="createTime" :label="state.dict['createTime']" width="180"/>-->
  <!--  <el-table-column prop="updateTime" :label="state.dict['updateTime']" width="180"/>-->
  <!--  &lt;!&ndash;<el-table-column prop="deleted" :label="state.dict['deleted']" width="60"/>&ndash;&gt;-->
  <!--  &lt;!&ndash;上方几个酌情使用&ndash;&gt;-->
  <!--  <el-table-column fixed="right" label="操作" min-width="120">-->
  <!--    <template #default="{row}">-->
  <!--      <el-button v-no-more-click link type="primary" size="small" @click="tWatch(row.id)">查看</el-button>-->
  <!--      <el-button v-no-more-click v-if="row.status==='0'" link type="primary" size="small" @click="tResolve(row.id)">通过</el-button>-->
  <!--      <el-button v-no-more-click v-if="row.status==='0'" link type="danger" size="small" @click="tReject(row.id)">驳回</el-button>-->
  <!--    </template>-->
  <!--  </el-table-column>-->
  <!--  <template #append>-->
  <!--    <span>{{ `已选 ${state.multipleSelection.length} 条数据` }}</span>-->
  <!--  </template>-->
  <!--</el-table>-->

  <!--&lt;!&ndash;分页&ndash;&gt;-->
  <!--<Pagination-->
  <!--    v-if="state.total!==-1"-->
  <!--    :total="Number(state.total)"-->
  <!--    @page-change="pageChange"-->
  <!--/>-->
</template>

<style scoped lang="scss">
</style>