// component/navigator/navigator.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    width: {
      type: [Number, String],
      default: true
    },
    navigator: {
      type: [Array],
      default: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    TabCur: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    tabSelect(e) {
      const id = e.currentTarget.dataset.id
      this.setData({
        TabCur: id
      })
      this.triggerEvent("tabSelect", id)
    }
  }
})