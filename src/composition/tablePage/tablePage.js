import { nextTick, onMounted, watch } from "vue"
import { ElMessage, ElMessageBox } from "element-plus"
import { final, Operate, shift_yes_no } from "utils/base.js"
import { usePageStore } from "store/module/page.js"

export const funcTablePage = ({
                                config,
                                state,
                                state2,
                                dialogFormRef,
                                dialogFormInput1Ref,
                                filterFormRef,
                                tableLoadingRef,
                                switchLoadingRef,
                                func
                              }) => {
  /**
   * 查询
   */
  const getData = () => {
    tableLoadingRef.value = true
    state.list = []
    let obj = { ...usePageStore().getPage, ...state.filterForm, ...config?.selectParam }
    func.selectList(obj).then(res => {
      if (!Object.keys(config).includes('pageQuery') || config?.pageQuery !== false) {
        state.list = res.data.list
        state.total = res.data.total
      } else {
        state.list = res.data
      }
    }).finally(() => {
      tableLoadingRef.value = false
    })
  }
  /**
   * 查询单个
   * @param id
   */
  const getDataById = id => {
    tableLoadingRef.value = true
    func.selectById(id).then(res => {
      state.list[state.list.findIndex(item => item.id === id)] = res.data
    }).finally(() => {
      tableLoadingRef.value = false
    })
  }
  /**
   * 新增
   */
  const insData = () => {
    let obj = state.dialogForm
    func.insertOne(obj).then(res => {
      if (res.code === 200) {
        ElMessage.success(Operate.success)
        state.dialogVisible = false
        getData()
      }
    })
  }
  /**
   * 修改
   */
  const updData = (obj = state.dialogForm) => {
    tableLoadingRef.value = true
    let t = true
    func.updateOne(obj).then(res => {
      if (res.code === 200) {
        t = false
        ElMessage.success(Operate.success)
        state.dialogVisible = false
        getData()
      }
    }).finally(() => {
      if (t) {
        tableLoadingRef.value = false
      }
    })
  }
  /**
   * 修改顺序
   * @param ids
   */
  const updDataOrder = (...ids) => {
    func.updateOrder(...ids).then(res => {
      if (res.code === 200) {
        ElMessage.success(Operate.success)
        getData()
      }
    })
  }
  /**
   * 修改禁用状态
   * @param objs
   */
  const updDataDisabled = (...objs) => {
    tableLoadingRef.value = true
    let t = true
    func.updateDisabled(...objs).then(res => {
      if (res.code === 200) {
        t = false
        getData()
      }
    }).finally(() => {
      if (t) {
        tableLoadingRef.value = false
      }
    })
  }
  /**
   * 修改单个禁用状态
   * 数据列表内开关专用，请勿删除
   * @param id
   */
  const updDataDisabledById = id => {
    let obj = state.list.find(item => item.id === id)
    obj.disabled = shift_yes_no[obj.disabled]
    return func.updateOne(obj)
  }
  /**
   * 删除
   */
  const delData = (...ids) => {
    tableLoadingRef.value = true
    let t = true
    func.deleteList(...ids).then(res => {
      if (res.code === 200) {
        t = false
        ElMessage.success(Operate.success)
        getData()
      }
    }).finally(() => {
      if (t) {
        tableLoadingRef.value = false
      }
    })
  }

  onMounted(() => {
    if (config?.getDataOnMounted !== false) {
      getData()
    }
  })
  if (config?.watchDialogVisible !== false) {
    watch(() => state.dialogVisible, (newVal) => {
      nextTick(() => {
        if (newVal) {
          Promise.resolve().then(() => {
            dialogFormInput1Ref?.value?.focus()
          })
        } else {
          dialogFormRef.value?.resetFields()
        }
      })
    })
  }

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
  const fEnter = () => {
    const hasValue = Object.values(state.filterForm).some(item => !!item.toString().trim())
    if (hasValue) {
      fCon()
    } else {
      fCan()
    }
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
  // 刷新
  const gRefresh = () => {
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
  // 启用
  const gDisabledToNo = () => {
    if (state.multipleSelection.length === 0) return ElMessage.warning('请至少选择 1 条数据')
    let objs = []
    state.multipleSelection.forEach(item => {
      objs.push({
        id: item.id,
        disabled: final.DISABLED_NO
      })
    })
    updDataDisabled(...objs)
  }
  // 禁用
  const gDisabledToYes = () => {
    if (state.multipleSelection.length === 0) return ElMessage.warning('请至少选择 1 条数据')
    let objs = []
    state.multipleSelection.forEach(item => {
      objs.push({
        id: item.id,
        disabled: final.DISABLED_YES
      })
    })
    updDataDisabled(...objs)
  }
  // 切换
  const gDisabledShift = () => {
    if (state.multipleSelection.length === 0) return ElMessage.warning('请至少选择 1 条数据')
    let objs = []
    state.multipleSelection.forEach(item => {
      objs.push({
        id: item.id,
        disabled: shift_yes_no[item.disabled]
      })
    })
    updDataDisabled(...objs)
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
  const tBeforeChangeDisabled = id => {
    switchLoadingRef.value = true
    return new Promise((resolve, reject) => {
      updDataDisabledById(id).then(res => {
        if (res.code === 200) {
          ElMessage.success(Operate.success)
          resolve(true)
        } else {
          reject(false)
        }
      }).catch(err => {
        reject(false)
      }).finally(() => {
        state.list.find(item => item.id === id).disabled = shift_yes_no[state.list.find(item => item.id === id).disabled]
        getDataById(id)
        switchLoadingRef.value = false
      })
    })
  }
  // 设为默认
  const tBeforeChangeIsDefault = id => {
    switchLoadingRef.value = true
    return new Promise((resolve, reject) => {
      let obj = state.list.find(item => item.id === id)
      obj.isDefault = shift_yes_no[obj.isDefault]
      switchLoadingRef.value = false
      updData(obj)
    })
  }
  const handleSelectionChange = val => {
    let arr = []
    val.forEach(item => {
      arr[state.list.findIndex(i => i.id === item.id)] = item
    })
    state.multipleSelection = arr.filter(Boolean)
  }
  const handlerFocus = num => {
    state2.orderNum = num
  }
  const handleOrderNumChange = id => {
    updData(state.list.find(item => item.id === id))
  }
  const pageChange = () => {
    getData()
  }

  const refresh = () => {
    getData()
  }

  return {
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
  }
}