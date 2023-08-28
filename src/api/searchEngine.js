import request from 'utils/request.js';

/**
 * 获取所有
 * @returns {*}
 */
export function selAll({ pageNum, pageSize, name, descr, url, secondLevelUrl, paramKey }) {
  return request({
    url: '/admin/search-engine',
    method: 'GET',
    params: {
      pageNum,
      pageSize,
      name,
      descr,
      url,
      secondLevelUrl,
      paramKey
    }
  });
}

/**
 * 获取单个
 * @param id
 * @returns {*}
 */
export function selOne(id) {
  return request({
    url: `/admin/search-engine/${id}`,
    method: 'GET'
  })
}

/**
 * 新增
 * @param name
 * @param descr
 * @param url
 * @param secondLevelUrl
 * @param paramKey
 * @param orderNum
 * @returns {*}
 */
export function insOne({ name, descr, url, secondLevelUrl, paramKey, orderNum, disabled }) {
  return request({
    url: '/admin/search-engine',
    method: 'POST',
    data: {
      name,
      descr,
      url,
      secondLevelUrl,
      paramKey,
      orderNum,
      disabled
    }
  });
}

/**
 * 修改
 * @param id
 * @param name
 * @param descr
 * @param url
 * @param secondLevelUrl
 * @param paramKey
 * @param orderNum
 * @returns {*}
 */
export function updOne({ id, name, descr, url, secondLevelUrl, paramKey, orderNum, disabled }) {
  return request({
    url: '/admin/search-engine',
    method: 'PUT',
    data: {
      id,
      name,
      descr,
      url,
      secondLevelUrl,
      paramKey,
      orderNum,
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
    url: '/admin/search-engine/order-num',
    method: 'POST',
    data: ids
  })
}

/**
 * 启用禁用
 * objs格式为{id:'',disabled:''}
 * @param objs
 * @returns {*}
 */
export function updDisabled(...objs) {
  return request({
    url: '/admin/search-engine/disabled',
    method: 'POST',
    data: objs
  })
}

/**
 * 删除
 * @param ids
 * @returns {*}
 */
export function delList(...ids) {
  return request({
    url: '/admin/search-engine',
    method: 'DELETE',
    data: ids
  });
}