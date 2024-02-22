import { toRaw } from 'vue';

const {utools} = window;
const C_DOC_KEY = 'c-dataList';

export default {
  getData() {
    return utools.dbStorage.getItem(C_DOC_KEY) || [];
  },
  
  saveData(dataList) {
    const savedDatas = toRaw(dataList);
    // 去除data中的selected字段，防止初始化问题
    savedDatas.forEach(item => {
      delete item.selected;
      delete item.selectedIndex;
    })

    console.log(savedDatas)
    utools.dbStorage.setItem(C_DOC_KEY, savedDatas);
  },
  removeData() {
    utools.dbStorage.removeItem(C_DOC_KEY);
  },
}
