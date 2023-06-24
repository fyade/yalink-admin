<script setup>
import { getAllSorts } from 'api/admin/adminSort.js'
import { selLinkBySortId, updLink, insLink, delLink } from 'api/admin/adminLink.js'
import { reactive, ref, watch } from "vue";
import * as DataUtils from "utils/DataUtils.js";
import { ElMessage, ElMessageBox } from "element-plus";
import { cascaderProps1 } from 'utils/base.js'

const state = reactive({
  dialoVisible: false,
  type: {
    label: '',
    value: ''
  },
  dialogForm: {
    id: '',
    name: '',
    descr: '',
    url: '',
    siteSearch: '',
    ico: '',
    sortId: '',
    orderNum: ''
  },
  dict: {
    "id": "主键id",
    "name": "链接名",
    "descr": "链接描述",
    "url": "链接地址",
    "siteSearch": "站内搜索链接",
    "ico": "图标",
    "sortId": "所属分类",
    "orderNum": "排序",
    "createTime": "createTime",
    "updateTime": "updateTime"
  },
  rules: {
    "name": [{ required: true }],
    "url": [{ required: true }],
    "sortId": [{ required: true }]
  },
  sort_current: {},
  sortList: [],
  linkList: [],
  multipleSelection: []
})
let loadingRef = ref(false)
const formRef = ref(null)

watch(() => state.dialoVisible, val => {
  if (!val) formRef.value.resetFields()
})

const dCan = () => {
  state.dialoVisible = false
}
const dCon = () => {
  let arr = []
  Object.keys(state.rules).forEach(item => {
    if (!!!state.dialogForm[item]?.toString()) arr.push(state.dict[item])
  })
  if (arr.length > 0) return ElMessage.warning(`${arr.join('、')}不能为空`)
  if (state.type.value === 'add') {
    insLink(state.dialogForm).then(res => {
      if (res.code === 200) {
        ElMessage.success('新增成功')
        state.dialoVisible = false
        getLinkList()
      }
    })
  } else if (state.type.value === 'edit') {
    updLink(state.dialogForm).then(res => {
      if (res.code === 200) {
        ElMessage.success('修改成功')
        state.dialoVisible = false
        getLinkList()
      }
    })
  }
}
const rIns = () => {
  state.type.value = 'add'
  state.type.label = '新增'
  state.dialoVisible = true
  state.dialogForm.sortId = state.sort_current.id
}
const rUpd = () => {
  if (state.multipleSelection.length !== 1) return ElMessage.warning('请选择一条数据')
  tUpd(state.multipleSelection[0])
}
const rDel = () => {
  if (state.multipleSelection.length === 0) return ElMessage.warning('请选择至少一条数据')
  ElMessageBox.confirm(
      `请确认是否删除选中的 ${state.multipleSelection.length} 条数据？`,
      '警告',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )
      .then(() => {
        delLink(...state.multipleSelection).then(res => {
          if (res.code === 200) {
            ElMessage.success('删除成功')
            getLinkList()
          }
        })
      })
      .catch(() => {
        ElMessage.info('已取消删除')
      })
}
const tUpd = id => {
  state.dialogForm = JSON.parse(JSON.stringify(state.linkList.find(item => item.id === id)))
  state.type.value = 'edit'
  state.type.label = '修改'
  state.dialoVisible = true
}
const tDel = id => {
  ElMessageBox.confirm(
      `请确认是否删除id为 ${id} 的一条数据？`,
      '警告',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )
      .then(() => {
        delLink(id).then(res => {
          if (res.code === 200) {
            ElMessage.success('删除成功')
            getLinkList()
          }
        })
      })
      .catch(() => {
        ElMessage.info('已取消删除')
      })
}

getAllSorts().then(res => {
  let data = res.data
  DataUtils.deepRecursion(data)
  state.sortList = data
})
const getLinkList = () => {
  state.linkList = []
  loadingRef.value = true
  selLinkBySortId(state.sort_current.id).then(res => {
    state.linkList = res.data
  }).finally(() => {
    loadingRef.value = false
  })
}
const handleChange = (value) => {
  // console.log(value)
}
const handleNodeClick = (data) => {
  if (data.children.length === 0) {
    state.sort_current = data
    getLinkList()
  }
}
const handleSelectionChange = row => {
  let arr = []
  for (const rowElement of row) {
    arr.push(rowElement.id)
  }
  state.multipleSelection = arr
}
</script>

<template>
  <el-container>
    <el-aside width="200px">
      <el-tree
          :data="state.sortList"
          @node-click="handleNodeClick"
      />
    </el-aside>

    <el-main>
      <el-dialog
          v-model="state.dialoVisible"
          :title="state.type.label"
          draggable
      >
        <el-form
            ref="formRef"
            :model="state.dialogForm"
            :rules="state.rules"
            label-width="120px"
        >
          <el-form-item v-if="state.type.value!=='add'" :label="state.dict['id']" prop="id">{{
              state.dialogForm.id
            }}
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
                :options="state.sortList"
                :props="cascaderProps1"
                @change="handleChange"
            />
          </el-form-item>
        </el-form>
        <template #footer>
      <span class="dialog-footer">
        <el-button @click="dCan">取消</el-button>
        <el-button type="primary" @click="dCon">确认</el-button>
      </span>
        </template>
      </el-dialog>

      <template v-if="Object.keys(state.sort_current).length===0">
        <div>请先在左侧选择所属分类</div>
      </template>
      <template v-else>
        <el-row class="mb-4">
          <el-button type="primary" plain @click="rIns">新增</el-button>
          <el-button type="primary" plain @click="rUpd">修改</el-button>
          <el-button type="danger" plain @click="rDel">删除</el-button>
        </el-row>

        <el-table
            style="width: 100%"
            :data="state.linkList"
            v-loading="loadingRef"
            @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"/>
          <el-table-column fixed prop="id" :label="state.dict['id']" width="200"/>
          <el-table-column prop="name" :label="state.dict['name']" width="120"/>
          <el-table-column prop="descr" :label="state.dict['descr']" width="200"/>
          <el-table-column prop="url" :label="state.dict['url']" width="300"/>
          <el-table-column prop="siteSearch" :label="state.dict['siteSearch']" width="360"/>
          <el-table-column prop="ico" :label="state.dict['ico']" width="60"/>
          <el-table-column prop="orderNum" :label="state.dict['orderNum']" width="60"/>
          <el-table-column prop="createTime" :label="state.dict['createTime']" width="200"/>
          <el-table-column prop="updateTime" :label="state.dict['updateTime']" width="200"/>
          <el-table-column fixed="right" label="操作" min-width="120">
            <template #default="{row}">
              <el-button link type="primary" size="small" @click="tUpd(row.id)">编辑</el-button>
              <el-button link type="danger" size="small" @click="tDel(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-main>
  </el-container>
</template>

<style lang="scss" scoped></style>