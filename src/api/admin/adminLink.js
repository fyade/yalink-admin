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
 * @param siteSearch
 * @param sortId
 * @returns {*}
 */
export function selLink({ pageNum, pageSize, name, descr, url, siteSearch, sortId }) {
  return ax({
    url: '/admin/link',
    method: 'GET',
    params: {
      pageNum,
      pageSize,
      name,
      descr,
      url,
      siteSearch,
      sortId
    }
  })
}

/**
 * 修改链接
 * @param id
 * @param name
 * @param descr
 * @param ico
 * @param url
 * @param siteSearch
 * @param orderNum
 * @param sortId
 * @returns {*}
 */
export function updLink({ id, name, descr, ico, url, siteSearch, orderNum, sortId }) {
  return ax({
    url: '/admin/link',
    method: 'PUT',
    data: {
      id,
      name,
      descr,
      ico,
      url,
      siteSearch,
      orderNum,
      sortId
    }
  });
}

/**
 * 新增链接
 * @param name
 * @param descr
 * @param ico
 * @param url
 * @param siteSearch
 * @param orderNum
 * @param sortId
 * @returns {*}
 */
export function insLink({ name, descr, ico, url, siteSearch, orderNum, sortId }) {
  return ax({
    url: '/admin/link',
    method: 'POST',
    data: {
      name,
      descr,
      ico,
      url,
      siteSearch,
      orderNum,
      sortId
    }
  });
}

/**
 * 删除链接
 * @param ids
 * @returns {*}
 */
export function delLink(...ids) {
  return ax({
    url: '/admin/link',
    method: 'DELETE',
    data: ids
  });
}
