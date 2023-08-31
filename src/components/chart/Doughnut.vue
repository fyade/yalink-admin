<script setup>
defineProps({
  title: {
    type: String
  },
  percent: {
    type: Number,
    required: true
  },
  size: {
    type: Number,
    default: 150
  },
  borderWidth: {
    type: Number,
    default: 12
  },
  doughnutColor: {
    type: String,
    default: 'blue'
  },
  doughnutBgColor: {
    type: String,
    default: '#ddd'
  },
  bgColor: {
    type: String,
    default: '#fff'
  }
})
</script>

<template>
  <div class="doughnut">
    <div
        class="container"
        :style="{
            padding: `${borderWidth}px`,
            background: `conic-gradient(${doughnutColor} ${360*percent/10000}deg, ${doughnutBgColor} ${360*percent/10000}deg)`,
            width: `${size}px`
        }"
    >
      <div
          :style="{
              backgroundColor: `${bgColor}`
          }"
      >
        {{ percent / 100 }}%
      </div>
    </div>
    <p>{{ title }}</p>
  </div>
</template>

<style scoped lang="scss">
.doughnut {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;

  > .container {
    margin: auto;
    aspect-ratio: 1;
    border-radius: 50%;
    transition: all .2s ease;

    > div {
      display: flex;
      align-items: center;
      justify-content: center;
      aspect-ratio: 1;
      border-radius: 50%;
      font-size: 20px;
    }
  }

  > p {
    font-size: 16px;
  }
}
</style>