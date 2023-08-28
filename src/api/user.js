import request from 'utils/request.js';

/**
 * 登录
 * @param username
 * @param password
 * @returns {*}
 */
export function userLogin(username, password) {
  return request({
    url: '/admin/admin/login/up',
    method: 'POST',
    data: {
      username,
      password
    }
  });
}
