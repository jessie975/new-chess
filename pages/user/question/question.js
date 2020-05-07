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
  }
})
