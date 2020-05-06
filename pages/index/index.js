import router from '../../utils/router'
const app = getApp()
Page({
  data: {
    PageCur: 'wheel',
    tabbarHeight: 0,
    hasShare: app.globalData.hasShare,
    room: app.globalData.room
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
  jumpToWebview(e) {
    const {room} = this.data
    const type = e.currentTarget.dataset.type
    router.jumpToWebView(room.room_id, room.room_name, room.room_people_num, type)
  },
  close() {
    app.globalData.hasShare = false
    app.globalData.room = {}
    this.setData({
      hasShare: false,
      room: {}
    })
  },
  onLoad() {
    console.log(this.data.hasShare)
  },
  onReady() {
    this.getTabbarHeight()
  }
})