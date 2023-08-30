import request from "utils/request.js";

/**
 * 查询链接申请列表
 * @param pageNum
 * @param pageSize
 * @param name
 * @param descr
 * @param url
 * @param sortId
 * @param status
 * @param createTimeStart
 * @param createTimeEnd
 * @param updateTimeStart
 * @param updateTimeEnd
 * @param applyBy
 * @param checkBy
 * @returns {*}
 */
export function getList({
                          pageNum,
                          pageSize,
                          name,
                          descr,
                          url,
                          sortId,
                          status,
                          createTimeStart,
                          createTimeEnd,
                          updateTimeStart,
                          updateTimeEnd,
                          applyBy,
                          checkBy
                        }) {
  return request({
    url: '/admin/link-apply',
    method: 'GET',
    params: {
      pageNum,
      pageSize,
      name,
      descr,
      url,
      sortId,
      status,
      createTimeStart,
      createTimeEnd,
      updateTimeStart,
      updateTimeEnd,
      applyBy,
      checkBy
    }
  })
}

/**
 * 通过
 * @param id
 * @param msg
 * @param name
 * @param descr
 * @param url
 * @param docUrl
 * @param siteSearch
 * @param ico
 * @param orderNum
 * @param disabled
 * @returns {*}
 */
export function updateStatusToResolve({ id, msg, name, descr, url, docUrl, siteSearch, ico, orderNum, disabled }) {
  return request({
    url: '/admin/link-apply/resolve',
    method: 'POST',
    data: {
      id,
      msg,
      status: "3",
      name,
      descr,
      url,
      docUrl,
      siteSearch,
      ico,
      orderNum,
      disabled
    }
  })
}

/**
 * 驳回
 * @param id
 * @param msg
 * @returns {*}
 */
export function updateStatusToReject({ id, msg }) {
  return request({
    url: '/admin/link-apply/reject',
    method: 'POST',
    data: {
      id,
      msg,
      status: "2"
    }
  })
}

/**
 * 删除收录申请
 * @param ids
 * @returns {*}
 */
export function delList(...ids) {
  return request({
    url: '/admin/link-apply',
    method: 'DELETE',
    data: ids
  })
}