// component/model/model.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: [Boolean]
    },
    canCatch: {
      type: [Boolean]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    closeModel() {
      if (this.data.canCatch) {
        this.setData({
          show: false
        })
      }
    }
  }
})