export const baseUrl = import.meta.env.VITE_APP_BASE_URL

export const imageBUrl = baseUrl + '/ufile/image/'

export const PAGINATION = {
  pageNum: 1,
  pageSize: 10
}

export const publicDict = {
  id: '主键id',
  remark: '备注',
  orderNum: '顺序',
  isDefault: '是否默认',
  disabled: '是否启用',
  createBy: 'createBy',
  updateBy: 'updateBy',
  createTime: 'createTime',
  updateTime: 'updateTime',
  deleted: '逻辑删除'
}

const Y = 'Y'
const N = 'N'
export const final = {
  DEFAULT_PARENT_ID: '0',
  DISABLED_YES: Y,
  DISABLED_NO: N,
  IS_DEFAULT_YES: Y,
  IS_DEFAULT_NO: N
}

export const publicCascaderProps = {
  value: 'id',
  label: 'name',
  disabled: 'casDisbaled'
}
// 只能选择最子层
export const cascaderProps3 = {
  disabled: 'casDisbaled',
  expandTrigger: 'hover',
  emitPath: false // 在选中节点改变时，是否返回由该节点所在的各级菜单的值所组成的数组，若设置 false，则只返回该节点的值
}
export const cascaderProps1 = {
  ...publicCascaderProps,
  ...cascaderProps3
}
// 可以选择任何层
export const cascaderProps2 = {
  ...publicCascaderProps,
  expandTrigger: 'hover',
  emitPath: false, // 在选中节点改变时，是否返回由该节点所在的各级菜单的值所组成的数组，若设置 false，则只返回该节点的值
  checkStrictly: true // 是否严格的遵守父子节点不互相关联
}

export const Operate = {
  success: '操作成功'
}

export const shift_yes_no = {
  Y: N,
  N: Y
}