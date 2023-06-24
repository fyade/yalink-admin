import ax from 'utils/request.js';

/**
 * 获取所有
 * @returns {*}
 */
export function selAll({ pageNum, pageSize, name, descr, url, secondLevelUrl, paramKey }) {
  return ax({
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
 * 新增
 * @param name
 * @param descr
 * @param url
 * @param secondLevelUrl
 * @param paramKey
 * @param orderNum
 * @returns {*}
 */
export function insOne({ name, descr, url, secondLevelUrl, paramKey, orderNum }) {
  return ax({
    url: '/admin/search-engine',
    method: 'POST',
    data: {
      name,
      descr,
      url,
      secondLevelUrl,
      paramKey,
      orderNum
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
export function updOne({ id, name, descr, url, secondLevelUrl, paramKey, orderNum }) {
  return ax({
    url: '/admin/search-engine',
    method: 'PUT',
    data: {
      id,
      name,
      descr,
      url,
      secondLevelUrl,
      paramKey,
      orderNum
    }
  });
}

/**
 * 删除
 * @param ids
 * @returns {*}
 */
export function delList(...ids) {
  return ax({
    url: '/admin/search-engine',
    method: 'DELETE',
    data: ids
  });
}