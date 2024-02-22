<script setup>

import CButton from '@/components/CButton.vue';
import dbUtil from '@/hooks/dbUtil.js';
import { computeList, initData, initListener, state, updateSelectedList } from '@/hooks/useStore.js';
import { computed, onMounted } from 'vue';

// 解构会失去响应式
const {selectedList/*, listener*/} = state;
const {clipboard, nativeImage} = window;
const displayDataList = computed(() => {
  const {key} = state.activeTab;
  if (key === 'text') {
    return state.textList;
  } else if (key === 'image') {
    return state.imgList;
  } else if (key === 'star') {
    return state.starList;
  }
  return state.dataList;

})

onMounted(() => {
  console.log('mounted.........')
  initData();
  initListener();
});


/**
 * 选择某条数据
 */
const selectItem = (item) => {
  if (selectedList.length >= 9) {
    return;
  }
  if (item.selected) {
    item.selected = false;
    updateSelectedList(item, '-');
  } else {
    item.selected = true;
    updateSelectedList(item, '+')
  }
};

function handleCopy(data) {
  state.listener.stop();
  if (Array.isArray(data)) {
    const dataType = checkDataType(data);
    console.log(dataType)
    if (dataType === 'text') {
      let res = '';
      for (let item of data) {
        res += item.text + '\n';
      }
      // 去除末尾换行符
      res = res.slice(0, -1);
      clipboard.writeText(res);
      console.info('复制成功')
    } else if (dataType === 'image') {
      const obj = nativeImage.createFromDataURL(data[0].data);
      clipboard.writeImage(obj);
    } else {
      console.error('不支持文本与图片混合复制')
    }
  }
  state.listener.start();
}

function handleStar() {
  state.selectedList.forEach((item) => {
    item.star = true
  })
  computeList('star');
  console.log(state.dataList);
}

function handleEmpty() {
  dbUtil.removeData();
}

/**
 * 验证数据格式是否合法(最多就10条数据 O(3n) 影响不大)
 * @param data {array}
 * @returns {string}
 */
function checkDataType(data) {
  if (Array.isArray(data)) {
    if (_includeType('text') && (_includeType('image') || _includeType('file'))) {
      return 'error';
    } else if (_includeType('text')) {
      return 'text';
    } else {
      return 'image';
    }
  }

  function _includeType(type) {
    return data.some(item => item.type === type);
  }
}

</script>

<template>
  <main class="flex w-full px-6 py-2">

    <section class="list-container flex-1">
      <div
        v-for="item in displayDataList"
        :key="item.id"
        class="relative my-2 px-4 py-2 bg-white border rounded-md cursor-pointer "
        :class="item.selected ? 'border-[#fca5a5]' : ''"
        @click="selectItem(item)"
        @dblclick="() => {console.log(123)}"
      >
        <template v-if="item.type==='text'">
          <div class="pr-8 max-h-36 whitespace-pre-wrap overflow-hidden">
            {{ item.text }}
          </div>
          <span class="text-xs text-gray-400">{{ item.length }}个字符</span>
        </template>
        <template v-else>
          <img class="max-h-36" :src="item.data" alt="">
          <span class="text-sm text-gray-400">{{ item.length }}Byte</span>
          <span class="ml-4 text-sm text-gray-400">{{ item.size.width }} x {{ item.size.height }}</span>
        </template>
        <i v-if="item.selected"
           class="block absolute right-1 top-1 w-5 h-5 text-center not-italic bg-red-500 text-sm text-white rounded-full"
        >{{ item.selectedIndex }}</i>
      </div>
    </section>

    <section class="action-container m-4 mr-0 w-14 text-center">
      <div class="fixed h-[85vh] flex flex-col align-middle gap-4">
        <c-button @click="handleCopy(state.selectedList)">copy</c-button>
        <c-button>paste</c-button>
        <c-button @click="handleStar">star</c-button>
        <c-button class="mt-auto" @click="handleEmpty">empty</c-button>
        <span></span>
      </div>
    </section>

  </main>
</template>

<style scoped>
</style>
