
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
    this.getTabbarHeight()
  },
  onShareAppMessage() {
    return {
      title: '欢迎来京华象棋',
      path: '/pages/welcome/index/index',
      imageUrl: '/images/share.jpeg'
    }
  }
})
