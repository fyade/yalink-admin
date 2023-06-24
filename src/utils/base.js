export const baseUrl = import.meta.env.VITE_APP_BASE_URL

export const imageBUrl = baseUrl + '/ufile/image/'

export const PAGINATION = {
  pageNum: 1,
  pageSize: 10
}

export const publicDict = {
  id: '主键id',
  disabled: '是否禁用',
  createTime: '创建时间',
  updateTime: '更新时间'
}

export const cascaderProps1 = {
  expandTrigger: 'hover',
  emitPath: false // 在选中节点改变时，是否返回由该节点所在的各级菜单的值所组成的数组，若设置 false，则只返回该节点的值
}
export const cascaderProps2 = {
  expandTrigger: 'hover',
  emitPath: false, // 在选中节点改变时，是否返回由该节点所在的各级菜单的值所组成的数组，若设置 false，则只返回该节点的值
  checkStrictly: true // 是否严格的遵守父子节点不互相关联
}
