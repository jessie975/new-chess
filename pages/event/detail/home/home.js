Page({

  /**
   * 页面的初始数据
   */
  data: {
    navigator: ['介绍', '时间表', '排名'],
    tabType: 'introduce',
    matchid: 0,
    navigatorHieght: 0,
    matchname: ''
  },
  tabSelect(e) {
    const index = e.detail
    let type = ''
    if (index === 0) {
      type = 'introduce'
    } else if (index === 1) {
      type = 'timeTable'
    } else {
      type = 'range'
    }
    this.setData({
      tabType: type
    })
  },

  getTabbarHeight() {
    const query = wx.createSelectorQuery().in(this)
    query.select('#navigator').boundingClientRect(rect => {
      this.setData({
        navigatorHieght: rect.height
      })
    }).exec()
  },

  onLoad() {
    const that = this
    const eventChannel = this.getOpenerEventChannel()
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('acceptDataFromOpenerPage', function(data) {
      that.setData({
        matchid: data.eventid,
        matchname: data.eventname
      })
    })
  },
  onShareAppMessage() {
    return {
      title: '欢迎来京华象棋',
      path: '/pages/welcome/index/index',
      imageUrl: '/images/share.jpeg'
    }
  }
})
