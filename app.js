//app.js
App({
  initUiGlobal() {
    wx.getSystemInfo({
      success: e => {
        const { statusBarHeight: StatusBar, screenHeight, windowWidth } = e
        this.store.StatusBar = StatusBar
        this.store.screenHeight = screenHeight
        this.store.windowWidth = windowWidth
        const capsule = wx.getMenuButtonBoundingClientRect()
        if (capsule) {
          this.store.Custom = capsule
          this.store.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight
        } else {
          this.store.CustomBar = StatusBar + 50
        }
      }
    })
  },
  onLaunch: function () {
    this.initUiGlobal()

    // 获取系统信息
    wx.getSystemInfo({
      success: e => {
        const clientHeight = e.windowHeight
        const rpx2px = clientHeight / 750
        this.globalData.StatusBar = e.statusBarHeight;
        let capsule = wx.getMenuButtonBoundingClientRect();
        if (capsule) {
          this.globalData.Custom = capsule;
          this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
        } else {
          this.globalData.CustomBar = e.statusBarHeight + 50;
        }
        this.globalData.screenHeight = clientHeight - e.statusBarHeight  - this.globalData.CustomBar 
        this.globalData.rpx2px = rpx2px
      }
    })
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        // console.log(res)
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    tabbarHeight: 0
  },
  store: {
    StatusBar: 0,
    Custom: null,
    CustomBar: 0,
    screenHeight: 0,
    windowWidth: 0
  }
})