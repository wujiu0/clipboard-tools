<script setup>
defineProps({
  tooltipTitle: {
    type: String,
    default: '',
  },
  tooltipPlacement: {
    type: String,
    default: 'left',
  },
})
</script>

<template>
  <a-tooltip :placement="tooltipPlacement" :title="tooltipTitle">
    <button
      class="w-14 h-14 rounded-full bg-slate-400">
      <slot></slot>
    </button>
  </a-tooltip>
  <!--  <button-->
  <!--    class="w-20 h-11 rounded-lg bg-gradient-to-r from-[#ff6e7f] via-[#bfe9ff] to-[#ff6e7f] bg-[length:200%] ">-->
  <!--    <slot></slot>-->
  <!--  </button>-->
</template>

<style scoped>

</style>
