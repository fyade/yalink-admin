import request from 'utils/request.js';
import useStore from 'store';

const store = useStore();

/**
 * 获取文件上传记录
 * @param pageNum
 * @param pageSize
 * @returns {*}
 */
export function selFileUploadLog(pageNum = store.page.getPageNum, pageSize = store.page.getPageSize) {
  return request({
    url: '/admin/file/select-image-log',
    method: 'POST',
    data: {
      pageNum,
      pageSize
    }
  });
}
