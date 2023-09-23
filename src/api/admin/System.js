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
 * 获取CPU状态
 * @returns {*}
 */
export function getCPUInfo() {
  return request({
    url: '/admin/home/cpu',
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

/**
 * 获取基本信息
 * @returns {*}
 */
export function getNumsInfo() {
  return request({
    url: '/admin/home/nums',
    method: 'GET'
  })
}

/**
 * 分类总览（7天）
 * @returns {*}
 */
export function getSortOfWeek() {
  return request({
    url: '/admin/home/sort/week',
    method: 'GET'
  })
}

/**
 * 链接总览（7天）
 * @returns {*}
 */
export function getLinkOfWeek() {
  return request({
    url: '/admin/home/link/week',
    method: 'GET'
  })
}
