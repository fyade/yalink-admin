import { nextTick, onMounted, watch } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { shift_yes_no } from "utils/base.js";

export const funcTablePage = (
    state,
    dialogFormRef,
    filterFormRef,
    tableLoadingRef,
    switchLoadingRef,
    getData,
    insData,
    updData,
    updDataDisabled,
    updDataOrder,
    delData
) => {
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
}