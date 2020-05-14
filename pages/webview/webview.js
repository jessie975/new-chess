// pages/webview/webview.js
import router from './../../utils/router'
import api from '../../request/index'
import $ from '../../utils/util'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: '',
    title: '',
    roomPeopleNum: 0,
    enterMode: '',
    ownerNickname: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    const that = this
    const eventChannel = that.getOpenerEventChannel()
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('acceptDataFromOpenerPage', function(data) {
      console.log('data', data)
      that.setData({
        url: data.url,
        title: data.title,
        roomPeopleNum: data.roomPeopleNum,
        enterMode: data.enterMode || '',
        ownerNickname: data.ownerNickname
      })
      wx.setNavigationBarTitle({
        title: data.title || ''
      })
    })

    wx.setKeepScreenOn({
      keepScreenOn: true
    })
  },
  onShareAppMessage(options) {
    const enterMode = this.data.enterMode
    let title = '欢迎使用京华象棋'
    // comm_fight/comm_audience/create_room/race_fight/race_audience
    if (['comm_fight', 'comm_audience', 'create_room'].includes(enterMode)) {
      if (this.data.ownerNickname !== '') {
        title = `欢迎加入${this.data.ownerNickname}的房间对战观战`
      } else {
        title = `欢迎加入${this.data.title}对战观战`
      }
    }
    if (['race_fight', 'race_audience'].includes(enterMode)) {
      title = `欢迎参加${this.data.title}比赛`
    }
    console.log('onShareAppMessage -> options', options)
    const url = options.webViewUrl
    console.log('onShareAppMessage -> url', url)
    const query = url.split('room_id=')[1]
    const roomId = query.split('&')[0]
    console.log('onShareAppMessage -> roomId', roomId)
    return {
      title,
      path: `/pages/welcome/index/index?room_id=${roomId}&room_name=${this.data.title}&room_people_num=${this.data.roomPeopleNum}`,
      imageUrl: '/images/share.jpeg',
      success: function(res) {
        console.log('成功', res)
      }
    }
  },
  async onUnload() {
    // router.reLaunch('indexPage')
    await this.checkRoom()
  },
  async checkRoom() {
    const that = this
    const { data: { msg: { user = '', roomid = '' } } } = await api.getMyRoom()
    if (user && roomid) {
      wx.showModal({
        title: '提示',
        content: '是否回到上次断线的房间',
        async success(res) {
          if (res.confirm) {
            const { data: { msg: { room } } } = await api.getRoomInfo({ roomid })
            console.log('log => : success -> room', room)
            let type = ''
            if (user === 'fight' || user === 'owner') {
              type = 'comm_fight'
            }
            if (user === 'audience') {
              type = 'comm_audience'
            }
            if (type !== '') {
              const event = {
                currentTarget: {
                  dataset: {
                    roomid,
                    password: false,
                    roomname: room.title,
                    people: room.maxACount,
                    type
                  }
                }
              }
              that.jumpRoom(event)
            } else {
              $.tip('获取重连类型失败')
            }
          } else if (res.cancel) {
            api.leaveMyRoom({ roomid }) // 退出房间
          }
        }
      })
    }
  },
  jumpRoom(e) {
    const {
      roomid,
      roomname,
      people,
      type
    } = e.currentTarget.dataset
    if (type === 'comm_audience') {
      this.jumpWatch(roomid, roomname, people)
    }
    if (type === 'comm_fight') {
      this.jumpFight(roomid, roomname, people)
    }
  },
  jumpWatch(roomid, roomname, people, password = '') {
    api.jumpWatch({
      roomid,
      password
    }).then(res => {
      if (res.data.code === 0) {
        router.jumpToWebView(roomid, roomname, people, 'comm_audience')
      } else {
        $.tip(res.data.msg)
      }
    })
  },
  jumpFight(roomid, roomname, people, password = '') {
    api.jumpFight({
      roomid,
      password
    }).then(res => {
      if (res.data.code === 0) {
        router.jumpToWebView(roomid, roomname, people, 'comm_fight')
      } else {
        $.tip(res.data.msg)
      }
    })
  }
})
