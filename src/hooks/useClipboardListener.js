import { isReactive, toRaw } from 'vue';

function useClipboardListener(clipboard) {

  class ClipboardListener {
    duration;
    /**
     * 轮询计时器
     */
    timer;
    /**
     * 临时文本（上一次复制的）
     */
    tmpText;
    /**
     * 临时图片
     */
    tmpImage;
    /**
     * 文本变化回调
     */
    onTextChange;
    /**
     * 图片变化回调
     */
    onImageChange;

    /**
     *
     * @param options {{duration: number, onTextChange: function, onImageChange: function}}
     */
    constructor(options = {}) {
      const {duration = 500, onTextChange, onImageChange} = options;
      /**
       * 轮询间隔时间
       */
      this.duration = duration;
      this.onTextChange = onTextChange;
      this.onImageChange = onImageChange;

      if (this.onTextChange || this.onImageChange) {
        this.start();
      }
    }

    /**
     * 设置定时器
     */
    setTimer() {
      this.timer = setInterval(() => {
        console.log(`~~~~~~~timer:${this.timer}~~~~~`)
        if (this.onTextChange) {
          const text = clipboard.readText();
          if (this.isDiffText(this.tmpText, text)) {
            console.log(text)
            this.onTextChange(text, this.tmpText);
            this.tmpText = text;
          }
        }

        if (this.onImageChange) {
          const image = clipboard.readImage();
          if (this.isDiffImage(this.tmpImage, image)) {
            this.onImageChange(image, this.tmpImage);
            this.tmpImage = image;
          }
        }
      }, this.duration);
    }

    /**
     * 清除定时器
     */
    clearTimer() {
      clearInterval(this.timer);
    }

    /**
     * 设置剪贴板默认内容
     */
    setClipboardDefaultValue() {
      if (this.onTextChange) {
        this.tmpText = clipboard.readText();
      }
      if (this.onImageChange) {
        this.tmpImage = clipboard.readImage();
      }
    }

    /**
     * 判断内容是否不一致
     * @param tmpText
     * @param newText
     * @returns
     */
    isDiffText(tmpText, newText) {
      return newText && tmpText !== newText;
    }

    /**
     * 判断图片是否不一致
     * @param tmpImage
     * @param newImage
     * @returns
     */
    isDiffImage(tmpImage, newImage) {
      // tmpImage 存在listener（reactive对象）中，需转换为原始对象才可使用
      if (isReactive && isReactive(tmpImage)) {
        tmpImage = toRaw(tmpImage)
      }
      return newImage && !newImage.isEmpty() && tmpImage.toDataURL() !== newImage.toDataURL();
    }

    /**
     * 开始
     */
    start() {
      this.setClipboardDefaultValue();
      this.setTimer();
    }

    /**
     * 暂停
     */
    stop() {
      this.clearTimer();
    }
  }

  return {ClipboardListener}
}

export default useClipboardListener;
