import fileUtil from '@/hooks/fileUtil.js';
import { cloneDeep } from 'lodash';
import { toRaw } from 'vue';

const {utools} = window;
const C_DOC_KEY = 'c-dataList';

export default {
  getData() {
    const dataList = utools.dbStorage.getItem(C_DOC_KEY) || [];
    dataList.forEach(item => {
      if (item.type === 'image') {
        item.data = fileUtil.getImgUrl(item.uid);
      }
    })
    return dataList;
  },

  saveData(dataList) {
    const savedDatas = cloneDeep(toRaw(dataList));
    // 去除data中的selected字段，防止初始化问题
    savedDatas.forEach(item => {
      delete item.selected;
      delete item.selectedIndex;
      // 如果为图片，保存文件到本地，并去除元素中的data字段
      if (item.type === 'image') {
        fileUtil.saveImg(item.uid, item.data);
        delete item.data;
      }
    })

    console.log(savedDatas)
    utools.dbStorage.setItem(C_DOC_KEY, savedDatas);
  },
  removeData() {
    utools.dbStorage.removeItem(C_DOC_KEY);
  },
}
