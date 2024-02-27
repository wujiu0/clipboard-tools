// Description: 文件操作工具类

const {utools, fs, path} = window;

export default {

  /**
   * 从指定路径中读取图片信息
   * @param uid
   */
  getImgUrl(uid) {
    const imgPath = path.resolve(utools.getPath('userData') + '/clipboard-tools/images/' + uid);
    if (!fs.existsSync(imgPath)) {
      return '';
    }
    let result = fs.readFileSync(imgPath, 'utf8');
    return result;
  },

  /**
   * 保存图片到指定路径
   * @param uid
   * @param data
   */
  saveImg(uid, data) {
    const imgPath = path.resolve(utools.getPath('userData') + '/clipboard-tools/images/' + uid);
    if (!fs.existsSync(path.dirname(imgPath))) {
      fs.mkdirSync(path.dirname(imgPath), {recursive: true});
    }
    fs.writeFile(imgPath, data, (err) => {
      if (!err) {
        console.info('The file has been saved!');
        return;
      }
      console.error('保存图片失败', err);
    });
  },
}
