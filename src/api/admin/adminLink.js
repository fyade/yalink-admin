import ax from 'utils/request.js';

/**
 * 根据分类获取链接列表
 * @param sortId
 * @returns {*}
 */
export function selLinkBySortId(sortId) {
  return ax({
    url: '/admin/link/s',
    method: 'GET',
    params: {
      sortId
    }
  });
}

/**
 * 获取链接
 * @param pageNum
 * @param pageSize
 * @param name
 * @param descr
 * @param url
 * @param docUrl
 * @param siteSearch
 * @param sortId
 * @returns {*}
 */
export function selList({ pageNum, pageSize, name, descr, url, docUrl, siteSearch, sortId }) {
  return ax({
    url: '/admin/link',
    method: 'GET',
    params: {
      pageNum,
      pageSize,
      name,
      descr,
      url,
      docUrl,
      siteSearch,
      sortId
    }
  })
}

/**
 * 获取某个
 * @param id
 * @returns {*}
 */
export function selOne(id) {
  return ax({
    url: `/admin/link/${id}`,
    method: 'GET'
  })
}

/**
 * 新增链接
 * @param name
 * @param descr
 * @param ico
 * @param url
 * @param docUrl
 * @param siteSearch
 * @param orderNum
 * @param sortId
 * @param disabled
 * @returns {*}
 */
export function insOne({ name, descr, ico, url, docUrl, siteSearch, orderNum, sortId, disabled }) {
  return ax({
    url: '/admin/link',
    method: 'POST',
    data: {
      name,
      descr,
      ico,
      url,
      docUrl,
      siteSearch,
      orderNum,
      sortId,
      disabled
    }
  });
}

/**
 * 修改链接
 * @param id
 * @param name
 * @param descr
 * @param ico
 * @param url
 * @param docUrl
 * @param siteSearch
 * @param orderNum
 * @param sortId
 * @param disabled
 * @returns {*}
 */
export function updOne({ id, name, descr, ico, url, docUrl, siteSearch, orderNum, sortId, disabled }) {
  return ax({
    url: '/admin/link',
    method: 'PUT',
    data: {
      id,
      name,
      descr,
      ico,
      url,
      docUrl,
      siteSearch,
      orderNum,
      sortId,
      disabled
    }
  })
}

/**
 * 修改顺序
 * @param ids
 * @returns {*}
 */
export function updOrder(...ids) {
  return ax({
    url: '/admin/link/order-num',
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
  return ax({
    url: '/admin/link/disabled',
    method: 'POST',
    data: objs
  })
}

/**
 * 删除链接
 * @param ids
 * @returns {*}
 */
export function delList(...ids) {
  return ax({
    url: '/admin/link',
    method: 'DELETE',
    data: ids
  });
}
