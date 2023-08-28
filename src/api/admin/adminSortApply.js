import request from 'utils/request.js';

export function selList({ pageNum, pageSize }) {
  return request({
    url: '/admin/sort-apply',
    method: 'GET',
    params: {
      pageNum,
      pageSize
    }
  })
}

// export function resolveApply({id,})

/**
 * 驳回申请
 * @param id
 * @param msg
 * @returns {*}
 */
export function rejectApply({ id, msg }) {
  return request({
    url: '/admin/sort-apply/reject',
    method: 'POST',
    data: {
      id,
      msg
    }
  })
}