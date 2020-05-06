const app = getApp()
Page({
  data: {
    PageCur: 'wheel',
    tabbarHeight: 0
  },
  NavChange(e) {
    this.setData({
      PageCur: e.currentTarget.dataset.cur
    })
  },
  getTabbarHeight() {
    const query = wx.createSelectorQuery().in(this)
    query.select('#tabbar').boundingClientRect(rect => {
      this.setData({
        tabbarHeight: rect.height
      })
    }).exec()
  },
  onLoad() {

  },
  onReady() {
    console.log('onReady')
    this.getTabbarHeight()
  }
})