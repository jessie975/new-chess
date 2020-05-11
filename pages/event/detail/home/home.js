Page({

  /**
   * 页面的初始数据
   */
  data: {
    navigator: ['介绍', '时间表', '排名'],
    tabType: 'introduce',
    matchid: 0,
    navigatorHieght: 0,
    matchname: '',
    matchState: 'SIGN_UP'
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
        matchname: data.eventname,
        matchState: data.state || 'SIGN_UP'
      })
    })
  },
  async onUnload() {
    const page = getCurrentPages()
    if (page.length > 0 && page[0].route === 'pages/welcome/index/index') {
      wx.redirectTo({
        url: '/pages/index/index'
      })
    }
  },
  onShareAppMessage() {
    const { matchid, matchname, matchState } = this.data
    const path = `/pages/welcome/index/index?page=event_detail&matchid=${matchid}&matchname=${matchname}&matchState=${matchState}`
    return {
      title: `欢迎参加${matchname}比赛`,
      path,
      imageUrl: '/images/share.jpeg'
    }
  }

})
