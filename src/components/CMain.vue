<script setup>

import CButton from '@/components/CButton.vue';
import dbUtil from '@/hooks/dbUtil.js';
import { computeList, emptySelectedList, initData, initListener, state, updateSelectedList } from '@/hooks/useStore.js';
import { Empty, message, Modal } from 'ant-design-vue';
import { computed, nextTick, onMounted } from 'vue';

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

function initOverFlow() {
  debugger
  state.dataList.forEach((item) => {
    const el = document.querySelector('#cb-item-' + item.id);
    const res = el.scrollHeight > el.clientHeight;
    console.log(item.id, 'initOverFlow', el, res)
    item.isOverFlow = res;
  })
}

function toggleUnFold(item) {
  item.unFold = !item.unFold;
}

onMounted(() => {
  console.log('mounted.........')
  initData();
  initListener();
  nextTick(() => {
    initOverFlow();
  })
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
  if (data.length === 0) {
    message.error('请选择至少一条内容');
    return;
  }
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
    message.success('复制成功');
  } else if (dataType === 'image') {
    const obj = nativeImage.createFromDataURL(data[0].data);
    clipboard.writeImage(obj);
    if (data.length > 1) {
      message.info('暂不支持多张图片复制，已复制第一张');
    } else {
      message.success('复制成功');
    }
  } else {
    message.error('不支持文本与图片混合复制');
  }
  emptySelectedList();
  state.listener.start();
}

/**
 * 收藏
 * @param data{array|object}
 *
 * array:多条数据，统一加入收藏 object:单条数据，切换收藏状态
 */
function handleStar(data) {
  if (Array.isArray(data) && data.length === 0) {
    if (data.length === 0) {
      // message.error('请选择至少一条内容');
      return;
    }
    data.forEach((item) => {
      item.star = true;
    })
    emptySelectedList();
    message.success('收藏成功');
  } else if (typeof data === 'object') {
    data.star = !data.star;
    data.star && message.success('收藏成功');
  }
  computeList('star');
}

/**
 * 清空剪切板
 */
function handleEmpty() {
  Modal.confirm({
    title: '确认清空剪切板?',
    centered: true,
    width: 300,
    onOk() {
      dbUtil.removeData();
      initData();
      message.success('清空成功');
    },
  });

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

const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;
</script>

<template>
  <main class="flex w-full px-6 py-2">

    <section class="list-container flex-1">
      <a-empty v-if="displayDataList.length === 0" :image="simpleImage" description="暂无数据" class="mt-[20%]" />
      <div
        v-for="item in displayDataList"
        :key="item.id"
        class="relative my-2 px-4 py-2 bg-white border rounded-md cursor-pointer "
        :class="item.selected ? 'border-[#fca5a5]' : ''"
        @click="selectItem(item)"
        @dblclick="handleCopy([item])"
      >
        <template v-if="item.type==='text'">
          <div
            :id="'cb-item-'+ item.id"
            class="pr-8 whitespace-pre-wrap"
            :class="item.isOverFlow && item.unFold ? '': 'line-clamp-6'">
            {{ item.text }}
          </div>
          <span class="text-xs text-gray-400">{{ item.length }}个字符</span>
        </template>
        <template v-else>
          <div :id="'cb-item-'+ item.id ">
            <img class="max-h-36" :src="item.data" alt="">
          </div>
          <span class="text-sm text-gray-400">{{ item.length }}Byte</span>
          <span class="ml-4 text-sm text-gray-400">{{ item.size.width }} x {{ item.size.height }}</span>
        </template>
        <span class="ml-4 text-sm text-gray-400 float-right hover:text-black" v-if="item.isOverFlow"
              @click.stop="toggleUnFold(item)">
          {{ item.unFold ? '⌃收起' : '⌄展开' }}
        </span>
        <template v-if="state.activeTab.key === 'star'">
          <a-popconfirm
            title="取消收藏?"
            ok-text="是"
            cancel-text="否"
            @confirm="handleStar(item)"
          >
            <i class="absolute right-7 top-1" @click.stop>
              <a-tooltip v-if="item.star" title="取消收藏">
                <img src="@/assets/star_fill.svg" alt="" class="mr-px w-5 cursor-pointer">
              </a-tooltip>
            </i>
          </a-popconfirm>
        </template>
        <template v-else>
            <i class="absolute right-7 top-1" @click.stop="handleStar(item)">
          <a-tooltip v-if="item.star" title="取消收藏">
            <img src="@/assets/star_fill.svg" alt="" class="mr-px w-5 cursor-pointer">
          </a-tooltip>
          <a-tooltip v-else title="收藏">
            <img src="@/assets/star.svg" alt="" class="mr-px w-5 cursor-pointer">
          </a-tooltip>
        </i>
        </template>

        <i v-if="item.selected"
           class="block absolute right-1 top-1 w-5 h-5 text-center not-italic bg-red-500 text-sm text-white rounded-full"
        >{{ item.selectedIndex }}</i>
      </div>
    </section>

    <section class="action-container m-4 mr-0 w-14 text-center">
      <div class="fixed h-56 flex flex-col align-middle gap-4">

        <c-button tooltipTitle="复制" @click="handleCopy(state.selectedList)">
          <img src="@/assets/copy.svg" alt="" class="m-auto w-8">
        </c-button>

        <c-button tooltipTitle="粘贴" v-if="false">
          <img src="@/assets/paste.svg" alt="" class="m-auto w-8">
        </c-button>
        <c-button tooltipTitle="收藏" @click="handleStar(state.selectedList)">
          <img src="@/assets/star.svg" alt="" class="m-auto w-8">
        </c-button>
      </div>
      <!-- 分为两部分减小fixed对滚动的影响-->
      <div class="fixed bottom-10 h-16 flex flex-col align-middle gap-4">
        <c-button tooltipTitle="清空" class="mt-auto" @click="handleEmpty">
          <img src="@/assets/delete.svg" alt="" class="m-auto w-8">
        </c-button>
      </div>
    </section>

  </main>
</template>

<style scoped>
</style>
