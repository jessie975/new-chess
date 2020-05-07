// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    tip: '参加比赛与车轮战活动，均需进行身份注册',
    motto: '',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    show_btn: false
  },
  initShareData(options) {
    console.log('options!!!', options)
    const { room_id = '', room_name = '', room_people_num = '' } = options
    app.globalData.hasShare = !!Object.keys(options).length
    app.globalData.room = {
      room_id: room_id,
      room_name,
      room_people_num
    }
  },
  onLoad: function(options) {
    // this.getUserInfo(e)// 获取用户信息
    this.initShareData(options)

    this.login() // 启动时调用登录接口

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },

  // onRouterB () {
  //   wx.navigateTo({ url: '/pages/register/register' })
  // },

  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })

    console.log('成功获取到用户头像')
    wx.setStorageSync('avatar_url', e.detail.userInfo.avatarUrl)
    wx.setStorageSync('nickname', e.detail.userInfo.nickName)
  },

  // 微信登录
  login() {
    const self = this
    wx.login({
      success(res) {
        console.log('jscode：', res.code)
        // 先得到jscode
        if (res.code) {
          wx.request({
            url: 'https://wxaccount.jhbrain.cn/login',
            // url : "http://127.0.0.1:5000/login",
            method: 'POST',
            data: {
              // answer : JSON.stringify(this.data.answer),
              js_code: res.code
            },
            header: {
              'Content-Type': 'application/json',
              Accept: '*/*'
            },
            success: function(res) {
              const r = res.data
              // 登录成功，传参打开webview
              if (r['code'] == 0) {
                wx.showToast({
                  title: '登录成功',
                  icon: 'success',
                  duration: 2000
                })

                // 储存token，传参加载webview
                wx.setStorageSync('user_id', r['data']['user_id'])
                wx.setStorageSync('token', r['data']['token'])
                wx.setStorageSync('open_id', r['data']['open_id'])

                // console.log(r)
                const base_url = 'https://webview.jhbrain.cn/'
                // const base_url = 'https://show.jhbrain.cn/'
                const token = r['data']['token']
                const user_id = r['data']['user_id']
                const open_id = r['data']['open_id']

                // 小程序的自带传参需要分隔开，不能拼接好了再传入，在option中会自动拆为键值对
                // wx.redirectTo({
                //   url: '../webview/webview?base_url=' + base_url + '&token=' + token + '&user_id=' + user_id + '&open_id=' + open_id
                // })
                wx.redirectTo({
                  url: '/pages/index/index'
                })
              }
              // 如果登录失败，强制使用手机号注册
              else if (r['code'] == 400) {
                wx.showToast({
                  title: '欢迎使用京华象棋',
                  icon: 'none',
                  duration: 2000
                })

                self.setData({
                  show_btn: true
                })

                wx.redirectTo({
                  url: '../home/home'
                })

                const data = res.data
                const open_id = data['data']['open_id']
                const session_key = data['data']['session_key']
                console.log('获取到了腾讯的各种id', open_id, session_key)
                // 储存在本地
                wx.setStorageSync('open_id', open_id)
                wx.setStorageSync('session_key', session_key)
              }
            }
          })
        } else {
          wx.redirectTo({
            url: '../home/home'
          })

          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  }

})
