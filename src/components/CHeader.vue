<script setup>

import CMessage from '@/components/CMessage.vue';
import { emptySelectedList, state } from '@/hooks/useStore.js';
import { reactive } from 'vue';

const tabData = reactive({
  items: [
    {
      id: 0,
      text: '全部',
      key: 'all',
    },
    {
      id: 1,
      text: '文本',
      key: 'text',
    },
    {
      id: 2,
      text: '图片',
      key: 'image',
    },
    {
      id: 3,
      text: '收藏',
      key: 'star',
    },
  ],
})

function switchTab(tab) {
  state.activeTab = tab;
  emptySelectedList();
}

</script>

<template>
  <header class="sticky top-0 pt-0.5 z-50 flex bg-white border-b">
    <div
      v-for="item in tabData.items"
      :key="item.key"
      @click="switchTab(item)"
      class="flex justify-center items-center w-28 h-12 m-2 my-0 rounded-t-md cursor-pointer  z-10"
      :class="item.id === state.activeTab.id ? 'text-[#fca5a5]' : 'hover:bg-gray-100'"
    >
      {{ item.text }}
    </div>
    <div class="bg-[#f4f4f5] absolute left-2 w-28 h-12 rounded-t-md pointer-events-none duration-200"
         :style="`transform: translateX(${state.activeTab.id*8}rem)`"></div>
  </header>
  <CMessage />
</template>

<style scoped>

.tab-active {
  color: #fca5a5;
  background-color: #f4f4f5;
}
</style>
