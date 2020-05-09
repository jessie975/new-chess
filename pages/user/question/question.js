import api from '../../../request/index'
Page({
  data: {
    list: []
  },

  onLoad() {
    api.getQuestion().then(res => {
      this.setData({
        list: res.data.msg
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
