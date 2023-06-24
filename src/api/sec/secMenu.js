import ax from 'utils/request.js';

/**
 * 获取当前用户菜单列表
 * @returns {*}
 */
export function selMenusOfCurrent() {
  return ax({
    url: '/admin/sec/menu/current',
    method: 'GET'
  });
}

/**
 * 获取菜单列表
 * @returns {*}
 */
export function selAll() {
  return ax({
    url: '/admin/sec/menu/nest',
    method: 'GET'
  });
}

/**
 * 新增菜单
 * @param parentId
 * @param name
 * @param path
 * @param auth
 * @param icon
 * @param orderNum
 * @returns {*}
 */
export function insOne({ parentId, name, path, auth, icon, orderNum }) {
  return ax({
    url: '/admin/sec/menu',
    method: 'POST',
    data: {
      parentId,
      name,
      path,
      auth,
      icon,
      orderNum
    }
  });
}

/**
 * 修改菜单
 * @param id
 * @param parentId
 * @param name
 * @param path
 * @param auth
 * @param icon
 * @param orderNum
 * @returns {*}
 */
export function altOne({ id, parentId, name, path, auth, icon, orderNum }) {
  return ax({
    url: '/admin/sec/menu',
    method: 'PUT',
    data: {
      id,
      parentId,
      name,
      path,
      auth,
      icon,
      orderNum
    }
  });
}

/**
 * 删除菜单
 * @param id
 * @returns {*}
 */
export function delOne(id) {
  return ax({
    url: `/admin/sec/menu/${id}`,
    method: 'DELETE'
  });
}