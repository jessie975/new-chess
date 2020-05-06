import api from '../../../../request/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navigator: ['介绍', '时间表', '排名'],
    tabType: 'range', //'introduce',
    matchid: 0,
    navigatorHieght: 0
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

  onLoad: function (options) {
    const that = this
    const eventChannel = this.getOpenerEventChannel()
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('acceptDataFromOpenerPage', function (data) {
      that.setData({
        matchid: data.eventid
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})