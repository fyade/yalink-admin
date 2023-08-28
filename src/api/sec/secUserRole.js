import request from 'utils/request.js';

/**
 * 获取用户角色信息列表，包含用户信息和角色信息
 * @returns {*}
 */
export function selAllNest(pagination) {
  return request({
    url: '/admin/sec/user-role/ur-join-u-r',
    method: 'GET',
    params: pagination
  });
}

/**
 * 新增用户角色信息
 * @param userId
 * @param roleId
 * @returns {*}
 */
export function insOne({ userId, roleId }) {
  return request({
    url: '/admin/sec/user-role',
    method: 'POST',
    data: {
      userId,
      roleId
    }
  });
}

/**
 * 修改用户角色信息
 * @param id
 * @param userId
 * @param roleId
 * @returns {*}
 */
export function altOne({ id, userId, roleId }) {
  return request({
    url: '/admin/sec/user-role',
    method: 'PUT',
    data: {
      id,
      userId,
      roleId
    }
  });
}

/**
 * 删除用户角色信息
 * @param userId
 * @returns {*}
 */
export function delOne(userId) {
  return request({
    url: `/admin/sec/user-role/${userId}`,
    method: 'DELETE'
  });
}

/**
 * 批量修改用户角色信息
 * 新增也能用这个接口
 * roleList传用户修改后角色列表就行了
 * @param userId
 * @param roleList
 * @returns {*}
 */
export function updByList(userId, roleList) {
  return request({
    url: '/admin/sec/user-role/update-with-list',
    method: 'POST',
    data: {
      userId,
      roleList
    }
  });
}
