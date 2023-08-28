import request from 'utils/request.js';

/**
 * 获取所有分类信息
 * @returns {*}
 */
export function selList() {
  return request({
    url: '/admin/sort',
    method: 'GET'
  });
}

/**
 * 获取某个
 * @param id
 * @returns {*}
 */
export function selOne(id) {
  return request({
    url: `/admin/sort/${id}`,
    method: 'GET'
  })
}

/**
 * 新增分类
 * @param name
 * @param descr
 * @param orderNum
 * @param parentId
 * @param disabled
 * @returns {*}
 */
export function insOne({ name, descr, orderNum, parentId, disabled }) {
  return request({
    url: '/admin/sort',
    method: 'POST',
    data: {
      name,
      descr,
      orderNum,
      parentId,
      disabled
    }
  });
}

/**
 * 修改分类
 * @param id
 * @param name
 * @param descr
 * @param orderNum
 * @param parentId
 * @param disabled
 * @returns {*}
 */
export function updOne({ id, name, descr, orderNum, parentId, disabled }) {
  return request({
    url: '/admin/sort',
    method: 'PUT',
    data: {
      id,
      name,
      descr,
      orderNum,
      parentId,
      disabled
    }
  });
}

/**
 * 修改顺序
 * @param ids
 * @returns {*}
 */
export function updOrder(...ids) {
  return request({
    url: '/admin/sort/order-num',
    method: 'POST',
    data: ids
  })
}

/**
 * 启用禁用
 * @param objs
 * @returns {*}
 */
export function updDisabled(...objs) {
  return request({
    url: '/admin/sort/disabled',
    method: 'POST',
    data: objs
  })
}

/**
 * 删除分类
 * @param ids
 * @returns {*}
 */
export function delList(...ids) {
  return request({
    url: `/admin/sort`,
    method: 'DELETE',
    data: ids
  });
}
