import request from 'utils/request.js';
import useStore from 'store';

const store = useStore();

/**
 * 分页获取用户信息
 * @param pageNum
 * @param pageSize
 * @returns {*}
 */
export function selUserPage({ pageNum, pageSize }) {
  return request({
    url: '/admin/user/u',
    method: 'GET',
    params: {
      pageNum,
      pageSize
    }
  });
}

/**
 * 新增用户信息
 * @param username
 * @param password
 * @param nickname
 * @param realname
 * @param avatar
 * @param tel
 * @param email
 * @param sex
 * @param birth
 * @returns {*}
 */
export function insOneUser({ username, password, nickname, realname, avatar, tel, email, sex, birth }) {
  return request({
    url: '/admin/user/u',
    method: 'POST',
    data: {
      username,
      password,
      nickname,
      realname,
      avatar,
      tel,
      email,
      sex,
      birth
    }
  });
}

/**
 * 修改用户信息
 * @param id
 * @param username
 * @param password
 * @param nickname
 * @param realname
 * @param avatar
 * @param tel
 * @param email
 * @param sex
 * @param birth
 * @returns {*}
 */
export function updOneUser({ id, username, password, nickname, realname, avatar, tel, email, sex, birth }) {
  return request({
    url: '/admin/user/u',
    method: 'PUT',
    data: {
      id,
      username,
      password,
      nickname,
      realname,
      avatar,
      tel,
      email,
      sex,
      birth
    }
  })
}

/**
 * 删除用户信息
 * @param id
 * @returns {*}
 */
export function delOneUser(id) {
  return request({
    url: `/admin/user/u/${id}`,
    method: 'DELETE'
  });
}

/**
 * 获取用户登录记录
 * @param userId
 * @param status
 * @param descr
 * @param pageNum
 * @param pageSize
 * @returns {*}
 */
export function selUserLoginLog(userId, status, descr, pageNum = store.page.pageNum, pageSize = store.page.pageSize) {
  let data = { pageNum, pageSize };
  if (!!userId) data.userId = userId;
  if (!!status) data.status = status;
  if (!!descr) data.descr = descr;
  return request({
    url: '/admin/user/select-login-log',
    method: 'POST',
    data: data
  });
}
