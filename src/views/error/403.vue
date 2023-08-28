<script setup>
import { useRoute } from "vue-router";

const route = useRoute()
const from = route.redirectedFrom?.path
const msg = `${from}对应页面您无权限`
</script>

<template>
  <div>403</div>
  <div v-if="!!from">{{ msg }}</div>
</template>

<style scoped lang="scss">

</style>