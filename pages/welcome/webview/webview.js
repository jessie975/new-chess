Page({

  data: {
    // url:'https://show.jhbrain.cn/',
    // url:'http://localhost:7456/build/',
    // user_id : wx.getStorageSync('user_id'),
    // token :wx.getStorageSync('token'),
   
    full_url: '',


  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // 接受url的传参
    this.setData({
      full_url: options.base_url + '?token=' + options.token+ '&user_id=' + options.user_id + '&open_id=' + options.open_id,
    });


    console.log(options, this.data.real_url)

    wx.showToast({
      title: '正在加载资源',
      icon: 'loading',
      duration: 1000
    })

    wx.vibrateShort({

      success: function () {

        console.log("vibrate success");

      },

      fail: function () {

        console.log("vibrate fail");

      }
    })


    //屏幕常亮
    wx.setKeepScreenOn({
      keepScreenOn: true
    })




    console.log(this.data.full_url)

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