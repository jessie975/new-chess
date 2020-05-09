// pages/user/aboutUs/aboutUs.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  onShareAppMessage() {
    return {
      title: '欢迎来京华象棋',
      path: '/pages/welcome/index/index',
      imageUrl: '/images/share.jpeg'
    }
  }
})
