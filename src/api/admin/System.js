import request from 'utils/request.js';

/**
 * 获取系统信息
 * @returns {*}
 */
export function getSystemInfo() {
  return request({
    url: '/admin/home/sys',
    method: 'GET'
  })
}

/**
 * 获取内存信息
 * @returns {*}
 */
export function getMemoryInfo() {
  return request({
    url: '/admin/home/memory',
    method: 'GET'
  })
}

/**
 * 获取磁盘信息
 * @returns {*}
 */
export function getDiskInfo() {
  return request({
    url: '/admin/home/disk',
    method: 'GET'
  })
}
