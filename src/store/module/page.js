import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { PAGINATION } from 'utils/base.js';

export const usePageStore = defineStore('page', () => {
  let pageNumRef = ref(PAGINATION.pageNum);
  let pageSizeRef = ref(PAGINATION.pageSize);

  let getPageNum = computed(() => {
    return pageNumRef.value;
  });
  let getPageSize = computed(() => {
    return pageSizeRef.value;
  });
  let getPage = computed(() => {
    return {
      pageNum: getPageNum.value,
      pageSize: getPageSize.value
    }
  });
  let setPageNum = num => {
    pageNumRef.value = num;
  }
  let setPageSize = num => {
    pageSizeRef.value = num;
  }
  let setPage = obj => {
    setPageNum(obj.pageNum);
    setPageSize(obj.pageSize);
  }
  let init = () => {
    setPageNum(PAGINATION.pageNum);
    setPageSize(PAGINATION.pageSize);
  }

  return {
    getPageNum,
    getPageSize,
    getPage,
    setPageNum,
    setPageSize,
    setPage,
    init
  }
});
