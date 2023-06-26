<script setup>
import { nextTick, onMounted, reactive, ref, watch } from "vue"
import { usePageStore } from "store/page.js"
import { ElMessage, ElMessageBox } from "element-plus"
import { cascaderProps1, Operate, publicDict } from "utils/base.js"
import Pagination from "comp/pagination/Pagination.vue";
import { getAllSorts } from 'api/admin/adminSort.js'
import { selLink, updLink, insLink, delLink } from 'api/admin/adminLink.js'
import { deepRecursion } from "utils/DataUtils.js";

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
    siteSearch: '',
    orderNum: '',
    sortId: ''
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
    siteSearch: '站内搜索链接',
    ico: '图标',
    sortId: '父分类'
  },
  // 筛选表单
  filterForm: {
    name: '',
    descr: '',
    url: '',
    siteSearch: ''
  },
  list: [],
  multipleSelection: [],
  total: 0,
  sort_current: {},
  list_sort: []
})
let formRef = ref(null)
let loadingRef = ref(false)

/**
 * 获取数据
 */
let getData = () => {
  loadingRef.value = true
  // 调接口
  selLink({
    ...usePageStore().getPage,
    ...state.filterForm,
    ...{ sortId: state.sort_current.id }
  }).then(res => {
    state.list = res.data.list
    state.total = res.data.total
  }).finally(() => {
    loadingRef.value = false
  })
}
/**
 * 新增
 * 记得把弹出框设回隐藏
 */
let insData = () => {
  let obj = state.dialogForm
  insLink(obj).then(res => {
    if (res.code === 200) {
      ElMessage.success(Operate.success)
      state.dialogVisible = false
      getData()
    }
  })
}
/**
 * 修改
 * 记得把弹出框设回隐藏
 */
let updData = () => {
  let obj = state.dialogForm
  updLink(obj).then(res => {
    if (res.code === 200) {
      ElMessage.success(Operate.success)
      getData()
    }
  }).finally(() => {
    state.dialogVisible = false
  })
}
/**
 * 删除数据
 * @param ids
 */
let delData = (...ids) => {
  delLink(...ids).then(res => {
    if (res.code === 200) {
      ElMessage.success(Operate.success)
      getData()
    }
  })
}

getAllSorts().then(res => {
  let data = res.data
  deepRecursion(data)
  state.list_sort = data
})
onMounted(() => getData())
watch(() => state.dialogVisible, (newVal) => {
  if (newVal) {
  } else {
    formRef.value?.resetFields();
  }
})

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
  state.dialogForm.sortId = state.sort_current.id
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
      }
  ).then(() => {
    delData(id)
  }).catch(err => {
  })
}
const handleSelectionChange = val => {
  let arr = [];
  val.forEach(item => arr.push(item.id));
  state.multipleSelection = arr;
}
const pageChange = () => {
  getData()
}

const handleNodeClick = (data) => {
  if (data.children.length === 0) {
    state.sort_current = data
    getData()
  }
}
const handleChange = (value) => {
  // console.log(value)
}
</script>

<template>
  <el-container>
    <el-aside width="200px">
      <el-tree
          :data="state.list_sort"
          @node-click="handleNodeClick"
      />
    </el-aside>

    <el-main>
      <!--弹框-->
      <el-dialog
          v-model="state.dialogVisible"
          :title="state.type.label"
      >
        <el-form
            ref="formRef"
            :model="state.dialogForm"
            label-width="120px"
            :rules="state.dFormRules"
        >
          <!--在此下方添加表单项-->
          <el-form-item v-if="state.type.value!=='ins'" :label="state.dict['id']" prop="id">
            <span>{{ state.dialogForm.id }}</span>
          </el-form-item>
          <el-form-item :label="state.dict['name']" prop="name">
            <el-input v-model.trim="state.dialogForm.name"/>
          </el-form-item>
          <el-form-item :label="state.dict['descr']" prop="descr">
            <el-input v-model.trim="state.dialogForm.descr" type="textarea"/>
          </el-form-item>
          <el-form-item :label="state.dict['ico']" prop="ico">
            <el-input v-model.trim="state.dialogForm.ico"/>
          </el-form-item>
          <el-form-item :label="state.dict['url']" prop="url">
            <el-input v-model.trim="state.dialogForm.url"/>
          </el-form-item>
          <el-form-item :label="state.dict['siteSearch']" prop="siteSearch">
            <el-input v-model.trim="state.dialogForm.siteSearch"/>
          </el-form-item>
          <el-form-item :label="state.dict['orderNum']" prop="orderNum">
            <el-input-number v-model="state.dialogForm.orderNum"/>
          </el-form-item>
          <el-form-item :label="state.dict['sortId']" prop="sortId">
            <el-cascader
                v-model="state.dialogForm.sortId"
                :options="state.list_sort"
                :props="cascaderProps1"
                @change="handleChange"
            />
          </el-form-item>
          <!--在此上方添加表单项-->
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button v-no-more-click @click="dCan">取消</el-button>
            <el-button v-no-more-click type="primary" @click="dCon">确认</el-button>
          </span>
        </template>
      </el-dialog>

      <template v-if="Object.keys(state.sort_current).length===0">
        <div>请先在左侧选择所属分类</div>
      </template>
      <template v-else>
        <!--顶部筛选表单-->
        <el-form
            class="demo-form-inline"
            v-if="Object.keys(state.filterForm).length>0"
            :inline="true"
            :model="state.filterForm"
        >
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
          <el-form-item :label="state.dict['siteSearch']">
            <el-input v-model.trim="state.filterForm['siteSearch']" :placeholder="state.dict['siteSearch']"/>
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
          <el-button v-no-more-click type="success" plain :disabled="state.multipleSelection.length!==1" @click="gUpd">
            修改
          </el-button>
          <el-button v-no-more-click type="danger" plain :disabled="state.multipleSelection.length===0" @click="gDel">删除
          </el-button>
        </div>

        <!--数据表格-->
        <el-table
            style="width: 100%"
            v-loading="loadingRef"
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
          <el-table-column prop="siteSearch" :label="state.dict['siteSearch']" width="240"/>
          <el-table-column prop="ico" :label="state.dict['ico']" width="60">
            <template #default="{row}">
              <el-image :src="row.ico" fit="contain"/>
            </template>
          </el-table-column>
          <!--在此上方添加表格列-->
          <el-table-column prop="orderNum" :label="state.dict['orderNum']" width="60"/>
          <!--<el-table-column prop="createBy" :label="state.dict['createBy']" width="120"/>-->
          <!--<el-table-column prop="updateBy" :label="state.dict['updateBy']" width="120"/>-->
          <el-table-column prop="createTime" :label="state.dict['createTime']" width="200"/>
          <el-table-column prop="updateTime" :label="state.dict['updateTime']" width="200"/>
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
    </el-main>
  </el-container>
</template>

<style scoped lang="scss">

</style>