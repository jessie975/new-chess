// pages/register.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // avatar_url:wx.getStorageSync('avatar_url'),
    avatar_url: '',
    nickname: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.data.avatar_url = wx.getStorageSync('avatar_url')
    this.data.nickname = wx.getStorageSync('nickname')
    // console.log(wx.getStorageSync('avatar_url'))
  },

  // 获取手机号
  getPhoneNumber(e) {
    console.log(e.detail.errMsg)
    if (e.detail.iv != undefined) {
      // 获取成功后，执行登录请求
      const open_id = wx.getStorageSync('open_id')
      const seesion_key = wx.getStorageSync('seesion_key')
      const iv = e.detail.iv
      const encryptedData = e.detail.encryptedData

      // 获取到头像信息了才允许注册
      if (this.data.nickname != undefined && this.data.avatar_url != undefined && this.data.avatar_url != '') {
        console.log('获取到昵称', this.data.nickname)
        console.log('获取到头像', this.data.avatar_url)
        const nickname = this.data.nickname
        const avatar = this.data.avatar_url
        this.register(open_id, seesion_key, iv, encryptedData, nickname, avatar)
      } else {
        wx.showToast({
          title: '请先授权头像',
          icon: 'none',
          duration: 3000
        })
        wx.navigateTo({ url: '/pages/welcome/home/home' }) // 获取头像失败，需要重新获取
      }
    } else {
      console.log('获取失败')
    }
  },

  // 手机号注册
  register(open_id, seesion_key, iv, encryptedData, nickname, avatar) {
    console.log('请求注册', open_id, seesion_key, iv, encryptedData, nickname, avatar)
    wx.login({
      success(res) {
        // console.log('jscode：', res.code)
        // 先得到jscode
        if (res.code) {
          wx.request({
            url: 'https://wxaccount.jhbrain.cn/register',
            // url : "http://127.0.0.1:5000/register",
            method: 'POST',
            data: {
              // answer : JSON.stringify(this.data.answer),
              js_code: res.code,
              iv: iv,
              encryptedData: encryptedData,
              nickname: nickname,
              avatar: avatar
            },
            header: {
              'Content-Type': 'application/json',
              Accept: '*/*'
            },

            success: function(res) {
              const r = res.data
              console.log(r)
              // 登录成功，传参打开webview
              if (r['code'] == 0) {
                wx.showToast({
                  title: '注册成功',
                  icon: 'success',
                  duration: 2000
                })

                // 储存token，传参加载webview
                wx.setStorageSync('user_id', r['data']['open_id'])
                wx.setStorageSync('user_id', r['data']['user_id'])
                wx.setStorageSync('token', r['data']['token'])
                wx.reLaunch({
                  url: '../index/index'
                })
              }
              // 如果登录失败，强制使用手机号注册
              else if (r['code'] == 400) {
                wx.showToast({
                  title: '注册失败，服务器错误',
                  icon: 'none',
                  duration: 2000
                })
              }
            }
          })
        }
      }
    })
  }

})
