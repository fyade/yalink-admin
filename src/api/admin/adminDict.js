import request from 'utils/request.js';

/**
 * 查询字典类型
 * @returns {*}
 */
export function getDictTypeList() {
  return request({
    url: '/admin/dict/type',
    method: 'GET'
  })
}

/**
 * 查询单个
 * @param id
 * @returns {*}
 */
export function getDictTypeById(id) {
  return request({
    url: `/admin/dict/type/${id}`,
    method: 'GET'
  })
}

/**
 * 新增字典类型
 * @param name
 * @param type
 * @param remark
 * @param disabled
 * @returns {*}
 */
export function insDictType({ name, type, remark, disabled }) {
  return request({
    url: '/admin/dict/type',
    method: 'POST',
    data: {
      name,
      type,
      remark,
      disabled
    }
  })
}

/**
 * 修改字典类型
 * @param id
 * @param name
 * @param type
 * @param remark
 * @param disabled
 * @returns {*}
 */
export function updDictType({ id, name, type, remark, disabled }) {
  return request({
    url: '/admin/dict/type',
    method: 'PUT',
    data: {
      id,
      name,
      type,
      remark,
      disabled
    }
  })
}

/**
 * 修改启用/禁用
 * @param objs
 * @returns {*}
 */
export function updDicTypeDisabled(...objs) {
  return request({
    url: '/admin/dict/type/disabled',
    method: 'POST',
    data: objs
  })
}

/**
 * 删除字典类型列表
 * @param ids
 * @returns {*}
 */
export function delDictTypeList(...ids) {
  return request({
    url: '/admin/dict/type',
    method: 'DELETE',
    data: ids
  })
}

/**
 * 查询字典数据
 * @param type
 * @returns {*}
 */
export function getDictDataList({ type }) {
  return request({
    url: '/admin/dict/data',
    method: 'GET',
    params: {
      type
    }
  })
}

/**
 * 查询单个
 * @param id
 * @returns {*}
 */
export function getDictDataById(id) {
  return request({
    url: `/admin/dict/data/${id}`,
    method: 'GET'
  })
}

/**
 * 新增字典数据
 * @param label
 * @param value
 * @param type
 * @param remark
 * @param isDefault
 * @param disabled
 * @param orderNum
 * @returns {*}
 */
export function insDictData({ label, value, type, remark, isDefault, disabled, orderNum }) {
  return request({
    url: '/admin/dict/data',
    method: 'POST',
    data: {
      label,
      value,
      type,
      remark,
      isDefault,
      disabled,
      orderNum
    }
  })
}

/**
 * 修改字典数据
 * @param id
 * @param label
 * @param value
 * @param type
 * @param remark
 * @param isDefault
 * @param disabled
 * @param orderNum
 * @returns {*}
 */
export function updDicData({ id, label, value, type, remark, isDefault, disabled, orderNum }) {
  return request({
    url: '/admin/dict/data',
    method: 'PUT',
    data: {
      id,
      label,
      value,
      type,
      remark,
      isDefault,
      disabled,
      orderNum
    }
  })
}

/**
 * 修改字典数据顺序
 * @param ids
 * @returns {*}
 */
export function updDictDataOrderNum(...ids) {
  return request({
    url: '/admin/dict/data/order-num',
    method: 'POST',
    data: ids
  })
}

/**
 * 修改字典数据禁用状态
 * @param objs
 * @returns {*}
 */
export function updDictDataDisabled(...objs) {
  return request({
    url: '/admin/dict/data/disabled',
    method: 'POST',
    data: objs
  })
}

/**
 * 删除字典数据列表
 * @param ids
 * @returns {*}
 */
export function delDictDataList(...ids) {
  return request({
    url: '/admin/dict/data',
    method: 'DELETE',
    data: ids
  })
}