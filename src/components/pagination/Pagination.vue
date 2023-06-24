<script>
import { onMounted, ref } from 'vue';
import useStore from 'store';

export default {
  name: "Pagination",
  props: {
    pageNum: {
      type: Number,
      default: useStore().page.getPageNum
    },
    pageSize: {
      type: Number,
      default: useStore().page.getPageSize
    },
    total: {
      type: Number,
      required: true
    }
  },
  emits: ['pageChange'],
  setup(props, ctx) {
    const store = useStore();
    onMounted(() => {
      pageNumRef.value = props.pageNum;
      pageSizeRef.value = props.pageSize;
    });

    let pageNumRef = ref(store.page.getPageNum);
    let pageSizeRef = ref(store.page.getPageSize);

    let handleSizeChange = val => {
      let obj = {
        pageNum: pageNumRef.value,
        pageSize: val
      };
      store.page.setPageSize(val);
      ctx.emit('pageChange');
    };
    let handleCurrentChange = val => {
      let obj = {
        pageNum: val,
        pageSize: pageSizeRef.value
      };
      store.page.setPageNum(val);
      ctx.emit('pageChange');
    }

    return {
      pageNumRef,
      pageSizeRef,
      handleSizeChange,
      handleCurrentChange
    }
  }
}
</script>

<template>
  <el-pagination
      class="my-pagination"
      v-model:current-page="pageNumRef"
      v-model:page-size="pageSizeRef"
      :page-sizes="[pageSize, 2*pageSize, 5*pageSize, 10*pageSize]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
  />
</template>

<style scoped lang="scss">
.my-pagination {
  display: flex;
  justify-content: flex-end;
}
</style>