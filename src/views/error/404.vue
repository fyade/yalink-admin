<script setup>
import { useRoute } from "vue-router";

const route = useRoute()
const from = route.redirectedFrom?.path
const msg = `${from}对应页面不存在`
</script>

<template>
  <div>404</div>
  <div v-if="!!from">{{ msg }}</div>
</template>

<style scoped lang="scss">

</style>