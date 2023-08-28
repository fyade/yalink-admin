import request from 'utils/request.js';

/**
 * 获取角色列表
 * @returns {*}
 */
export function selRole() {
  return request({
    url: '/admin/sec/role',
    method: 'GET'
  });
}

/**
 * 新增角色
 * @param code
 * @param name
 * @returns {*}
 */
export function insRole({ code, name }) {
  return request({
    url: '/admin/sec/role',
    method: 'POST',
    data: {
      code,
      name
    }
  });
}

/**
 * 修改角色
 * @param id
 * @param code
 * @param name
 * @returns {*}
 */
export function altRole({ id, code, name }) {
  return request({
    url: '/admin/sec/role',
    method: 'PUT',
    data: {
      id,
      code,
      name
    }
  });
}

/**
 * 删除角色
 * @param id
 * @returns {*}
 */
export function delRole(id) {
  return request({
    url: `/admin/sec/role/${id}`,
    method: 'DELETE'
  });
}