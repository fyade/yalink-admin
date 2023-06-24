import ax from 'utils/request.js';

/**
 * 登录
 * @param username
 * @param password
 * @returns {*}
 */
export function userLogin(username, password) {
  return ax({
    url: '/admin/admin/login',
    method: 'POST',
    data: {
      username,
      password
    }
  });
}
