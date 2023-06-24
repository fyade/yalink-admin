import ax from 'utils/request.js';

/**
 * 获取所有分类信息
 * @returns {*}
 */
export function getAllSorts() {
  return ax({
    url: '/admin/sort',
    method: 'GET'
  });
}

/**
 * 修改分类
 * @param id
 * @param name
 * @param descr
 * @param orderNum
 * @param parentId
 * @returns {*}
 */
export function setSort({ id, name, descr, orderNum, parentId = 0 }) {
  return ax({
    url: '/admin/sort',
    method: 'PUT',
    data: {
      id,
      name,
      descr,
      orderNum,
      parentId
    }
  });
}

/**
 * 删除分类
 * @param id
 * @returns {*}
 */
export function delSortById(id) {
  return ax({
    url: `/admin/sort/${id}`,
    method: 'DELETE'
  });
}

/**
 * 新增分类
 * @param name
 * @param descr
 * @param orderNum
 * @param parentId
 * @returns {*}
 */
export function addSort({ name, descr, orderNum, parentId }) {
  return ax({
    url: '/admin/sort/add',
    method: 'POST',
    data: {
      name,
      descr,
      orderNum,
      parentId: !!parentId ? parentId : 0
    }
  });
}
