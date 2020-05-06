import $ from '../../../utils/util'
import api from '../../../request/index'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: app.globalData.screenHeight - 60,
    inputValue: '',
    showEmpty: false,
    list: [],
    showLoading: false
  },

  inputValue(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  search() {
    const {
      inputValue
    } = this.data
    if (inputValue === '') {
      $.tip('输入内容不能为空')
    } else {
      this.setData({
        showLoading: true
      })
      api.searchRoom({
        page: 0,
        pagesize: 10,
        searchkey: inputValue
      }).then(res => {
        console.log("search -> res", res)
        const list = res.data.msg.resultList
        if (list) {
          this.setData({
            list,
            showLoading: false
          })
        } else {
          this.setData({
            showEmpty: true,
            showLoading: false
          })
        }
      })
    }
  }
})