import request from 'utils/request.js';

/**
 * 获取所有角色权限信息
 * @returns {*}
 */
export function selAll(pagination) {
  return request({
    url: '/admin/sec/role-menu',
    method: 'GET',
    params: pagination
  });
}

/**
 * 新增角色权限信息
 * @param roleId
 * @param menuId
 * @returns {*}
 */
export function insOne({ roleId, menuId }) {
  return request({
    url: '/admin/sec/role-menu',
    method: 'POST',
    data: {
      roleId,
      menuId
    }
  });
}

/**
 * 删除单个角色权限信息
 * @param roleId
 * @param menuId
 * @returns {*}
 */
export function delOne(roleId, menuId) {
  return request({
    url: '/admin/sec/role-menu',
    method: 'DELETE',
    params: {
      roleId, menuId
    }
  });
}

/**
 * 批量修改角色权限信息
 * @param roleId
 * @param menuList
 * @returns {*}
 */
export function updByList(roleId, menuList, type) {
  return request({
    url: '/admin/sec/role-menu/list',
    method: 'POST',
    data: {
      roleId,
      menuList,
      type
    }
  });
}

/**
 * 删除某角色所有权限
 * @param roleId
 * @returns {*}
 */
export function delRole(roleId) {
  return request({
    url: `/admin/sec/role-menu/${roleId}`,
    method: 'DELETE'
  });
}