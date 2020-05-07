// pages/webview/webview.js
import router from './../../utils/router'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: '',
    title: '',
    roomPeopleNum: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(option) {
    const that = this
    const eventChannel = that.getOpenerEventChannel()
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('acceptDataFromOpenerPage', function(data) {
      console.log('data', data)
      that.setData({
        url: data.url,
        title: data.title,
        roomPeopleNum: data.roomPeopleNum
      })
      wx.setNavigationBarTitle({
        title: data.title || ''
      })
    })
  },
  onShareAppMessage(options) {
    console.log('onShareAppMessage -> options', options)
    const url = options.webViewUrl
    console.log('onShareAppMessage -> url', url)
    const query = url.split('room_id=')[1]
    const roomId = query.split('&')[0]
    console.log('onShareAppMessage -> roomId', roomId)
    return {
      title: '欢迎来京华象棋',
      path: `/pages/welcome/index/index?room_id=${roomId}&room_name=${this.data.title}&room_people_num=${this.data.roomPeopleNum}`,
      imageUrl: '/images/share.jpeg',
      success: function(res) {
        console.log('成功', res)
      }
    }
  },
  onUnload() {
    router.reLaunch('indexPage')
  }
})
