import ax from 'utils/request.js';

/**
 * 上传文件-图片
 * @param file
 * @returns {*}
 */
export function interface_uploadImage(file) {
  return ax({
    url: '/common/upload/image',
    method: 'POST',
    data: file,
    headers: {
      'content-type': 'multipart/form-data'
    }
  });
}