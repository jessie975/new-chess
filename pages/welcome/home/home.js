//home.js
//获取应用实例
const app = getApp()

Page({
  data: {
    tip: '参加比赛与车轮战活动，均需进行身份注册',
    motto: '',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    show_btn: false,
    // imgUrl: '../../images/bg.jpg',
  },
  //事件处理函数
  // bindViewTap: function () {
  //   wx.navigateTo({
  //     url: '../logs/logs'
  //   })
  // },
  onLoad: function () {

    if (app.globalData.userInfo) {

      console.log('成功获取到用户头像')
      wx.setStorageSync('avatar_url', app.globalData.userInfo.avatarUrl)
      wx.setStorageSync('nickname', app.globalData.userInfo.nickName)
      wx.navigateTo({
        url: '/pages/welcome/register/register'
      }) // 成功获取到用户头像后跳转


    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {

        console.log('成功获取到用户头像')
        wx.setStorageSync('avatar_url', res.userInfo.avatarUrl)
        wx.setStorageSync('nickname', res.userInfo.nickName)
        wx.navigateTo({
          url: '/pages/welcome/register/register'
        }) // 成功获取到用户头像后跳转


      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo

          console.log('成功获取到用户头像')
          wx.setStorageSync('avatar_url', res.userInfo.avatarUrl)
          wx.setStorageSync('nickname', res.userInfo.nickName)
          wx.navigateTo({
            url: '/pages/welcome/register/register'
          }) // 成功获取到用户头像后跳转

        }
      })
    }
  },



  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo

    if (e.detail.userInfo.nickName != undefined) {
      console.log('成功获取到用户头像')
      wx.setStorageSync('avatar_url', e.detail.userInfo.avatarUrl)
      wx.setStorageSync('nickname', e.detail.userInfo.nickName)
      wx.navigateTo({
        url: '/pages/welcome/register/register'
      }) // 成功获取到用户头像后跳转
    }

  },





})