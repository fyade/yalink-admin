import request from 'utils/request.js';

/**
 * 上传文件-图片
 * @param file
 * @returns {*}
 */
export function interface_uploadImage(file) {
  return request({
    url: '/common/upload/image',
    method: 'POST',
    data: file,
    headers: {
      'content-type': 'multipart/form-data'
    }
  });
}

/**
 * 获取字典
 * @param type
 * @returns {*}
 */
export function getDictData({ type }) {
  return request({
    url: '/dict',
    method: 'GET',
    params: {
      type
    }
  })
}