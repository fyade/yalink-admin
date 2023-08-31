<script setup>
defineProps({
  title: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="item-wrap-container">
    <div class="header">
      <div class="tit">{{ title }}</div>
      <div class="left"></div>
      <div class="right"></div>
    </div>
    <div class="content">
      <slot/>
    </div>
  </div>
</template>

<style scoped lang="scss">
.item-wrap-container {
  padding: 8px;
  border-radius: 8px;
  box-shadow: 0 2px 10px 2px #ededed;

  > .header {
    display: flex;
    align-items: center;
    gap: 8px;

    > .left {
      order: 1;
      width: 8px;
      height: 16px;
      background-color: #0058ff;
      border-radius: 2px;
    }

    > .tit {
      order: 2;
      font-size: 18px;
    }

    > .right {
      order: 3;
    }
  }

  > .content {
    margin-top: 8px;
    min-height: 200px;

    :deep(> *) {
      width: 100%;
      height: 100%;
    }
  }
}
</style>