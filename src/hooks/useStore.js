import dbUtil from '@/hooks/dbUtil.js';
import useClipboardListener from '@/hooks/useClipboardListener.js';
import { reactive } from 'vue';

const {clipboard} = window;
const {ClipboardListener} = useClipboardListener(clipboard);

export const state = reactive({
  /**
   * 已开启的监听器
   */
  listener: null,
  activeTab: {
    id: 0,
    text: '全部',
    key: 'all',
  },
  dataList: [],
  textList: [],
  imgList: [],
  starList: [],
  /**
   * 已选择列表
   */
  selectedList: [],
})

/**
 * 数据初始化：读取数据并计算分类
 */
export function initData() {
  state.dataList = dbUtil.getData();
  computeList();
}

/**
 *
 * 计算分类列表
 * @param [type] {'text'|'image'|'star'}
 */
export function computeList(type) {
  if (!type || type === 'text') {
    state.textList = state.dataList.filter((item) => item.type === 'text');
  }
  if (!type || type === 'image') {
    state.imgList = state.dataList.filter(item => item.type === 'image');
  }
  if (!type || type === 'star') {
    state.starList = state.dataList.filter(item => item.star === true);
  }
}

/**
 * 更新选择列表
 * @param item
 * @param type {'+'|'-'}
 */
export function updateSelectedList(item, type) {
  if (type === '+') {
    state.selectedList.push(item);
  } else {
    state.selectedList.splice(state.selectedList.indexOf(item), 1);
  }
  refreshLabel();
}

/**
 * 清空选择列表
 */
export function emptySelectedList() {
  state.selectedList.forEach(item => item.selected = false);
  state.selectedList = [];
}

/**
 * 同步标签序号
 */
export function refreshLabel() {
  state.selectedList.forEach((item, index) => {
    item.selectedIndex = index + 1;
  })
}

export function initListener() {
  state.listener = new ClipboardListener({
    onTextChange: (text) => {
      state.dataList.unshift({
        id: state.dataList.length + 1,
        text,
        type: 'text',
        length: text.length,
      })
      dbUtil.saveData(state.dataList);
    },
    onImageChange: img => {
      state.dataList.unshift({
        id: state.dataList.length + 1,
        type: 'image',
        data: img.toDataURL(),
        length: img.toPNG().byteLength,
        size: img.getSize(),
      })
      dbUtil.saveData(state.dataList);
    },
  })
}

export function setListener(listener) {
  state.listener = listener;
}

