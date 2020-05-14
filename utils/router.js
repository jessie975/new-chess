const pages = {
  welcome: '/pages/welcome/index/index',
  creat: '/pages/wheel/creat/creat',
  search: '/pages/wheel/search/search',
  userCardInfo: '/pages/user/card/card',
  userInfoModify: '/pages/user/modify/modify',
  userQuestion: '/pages/user/question/question',
  userAboutUs: '/pages/user/aboutUs/aboutUs',
  indexPage: '/pages/index/index'
}

export default {
  push(url, events = {}, callback = () => {}) {
    wx.navigateTo({
      url: pages[url],
      events,
      success: callback
    })
  },

  pop(delta) {
    wx.navigateBack({
      delta
    })
  },

  redirectTo(url) {
    wx.redirectTo({
      url: pages[url]
    })
  },

  reLaunch(url) {
    wx.reLaunch({
      url: pages[url]
    })
  },

  jumpToWebView(roomId, roomName, roomPeopleNum, enterMode, ownerNickname = '') {
    const base_url = 'https://dev.jhbrain.cn/'
    const userId = wx.getStorageSync('user_id')
    const token = wx.getStorageSync('token')
    const url = `${base_url}?user_id=${userId}&token=${token}&room_id=${roomId}&room_people_num=${roomPeopleNum}&enter_mode=${enterMode}`
    console.log('jumpToWebView -> url', url)
    wx.navigateTo({
      url: '/pages/webview/webview',
      success: function(res) {
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          url,
          title: roomName,
          roomPeopleNum,
          enterMode,
          ownerNickname
        })
      }
    })
  }
}
