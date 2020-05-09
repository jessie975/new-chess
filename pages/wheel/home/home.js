import router from '../../../utils/router'
import api from '../../../request/index'
import $ from '../../../utils/util'
const app = getApp()

Component({
  properties: {
    tabbarHeight: {
      type: Number,
      value: 0,
      observer(height) {
        if (height !== 0) {
          this.initUI(height)
        }
      }
    }
  },

  data: {
    swiperList: [],
    navigator: ['准备中', '对战中', '官方'],
    tabIndex: 0,
    cardCur: 0,
    listHeight: 200,
    cardList: [],
    page: 0,
    showModel: false,
    noMore: false,
    showLoading: true,
    roomid: '',
    roomname: '',
    people: '',
    entryType: '',
    hasShare: false,
    room: null,
    triggered: false,
    roomSecret: ''
  },

  methods: {
    close() {
      app.globalData.hasShare = false
      app.globalData.room = {}
      this.setData({
        hasShare: false,
        room: {}
      })
    },
    async jumpToShareWebview(e) {
      const { room: shareRoomInfo } = this.data
      const type = e.currentTarget.dataset.type
      const { data: { msg: { room } } } = await api.getRoomInfo({ roomid: shareRoomInfo.room_id })
      const event = {
        currentTarget: {
          dataset: {
            roomid: room.roomid,
            password: room.password,
            roomname: room.title,
            people: room.maxACount,
            type
          }
        }
      }
      this.setData({
        hasShare: false
      })
      this.jumpRoom(event)
    },
    initShare() {
      console.log('app.globalData', app.globalData)
      this.setData({
        hasShare: app.globalData.hasShare,
        room: app.globalData.room
      })
      app.globalData.hasShare = false
      app.globalData.room = {}
    },
    creat() {
      router.push('creat')
    },
    search() {
      router.push('search')
    },
    getSwiperList() {
      api.getSwiperList().then(res => {
        const list = res.data.msg
        if (list) {
          this.setData({
            swiperList: list
          })
        } else {
          $.tip('轮播图加载失败')
        }
      })
    },
    jumpWebview(e) {
      const url = e.currentTarget.dataset.url
      wx.navigateTo({
        url: '/pages/webview/webview',
        success: function(res) {
          res.eventChannel.emit('acceptDataFromOpenerPage', {
            url
          })
        }
      })
    },
    async tabSelect(e) {
      const index = e.detail
      let list = []
      if (index === 0) {
        list = await this.getCardList('preparing', 0)
      } else if (index === 1) {
        list = await this.getCardList('fighting', 0)
      } else {
        // TODO: 其他tab栏接口未知
        list = []
      }
      this.setData({
        cardList: list,
        tabIndex: index
      })
    },
    getCardList(status, page) {
      return api.getWheelList({
        page,
        pagesize: 10,
        status
      }).then(res => {
        console.log('getCardList -> res', res)
        return res.data.msg.resultList
      }).catch(err => {
        $.tip(err.data.msg)
      })
    },
    async getMoreList() {
      const page = this.data.page + 1
      let list = []
      if (this.data.tabIndex === 0) {
        list = await this.getCardList('preparing', page)
      } else if (this.data.tabIndex === 1) {
        list = await this.getCardList('fighting', page)
      } else {
        // TODO: 其他tab栏接口未知
        list = []
      }
      if (list.length === 0) {
        this.setData({
          noMore: true
        })
      }
      this.setData({
        cardList: [...this.data.cardList, ...list],
        page
      })
    },
    async refreshList() {
      let list = []
      if (this.data.tabIndex === 0) {
        list = await this.getCardList('preparing', 0)
      } else if (this.data.tabIndex === 1) {
        list = await this.getCardList('fighting', 0)
      } else {
        // TODO: 其他tab栏接口未知
        list = []
      }
      this.setData({
        list
      })
    },
    async onRefresh() {
      if (this._freshing) return
      this._freshing = true
      await this.refreshList()
      this.setData({ triggered: false })
      this._freshing = false
    },
    //  ------------------------------------------------------------------------
    getSwiperHeight() {
      return new Promise(resolve => {
        const query = wx.createSelectorQuery().in(this)
        query.select('#swiper').boundingClientRect(rect => {
          resolve(rect.height)
        }).exec()
      })
    },
    getTabHeight() {
      return new Promise(resolve => {
        const query = wx.createSelectorQuery().in(this)
        query.select('#tab').boundingClientRect(rect => {
          resolve(rect.height)
        }).exec()
      })
    },
    /**
     * 断线重连的检测
     */
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
              const { data: { cardList } } = that
              if (user === 'owner') {
                that.setData({
                  cardList: cardList.filter(item => (item.roomid !== roomid))
                })
              }
            }
          }
        })
      }
    },
    jumpRoom(e) {
      const {
        roomid,
        password,
        roomname,
        people,
        type
      } = e.currentTarget.dataset
      if (password) {
        this.setData({
          showModel: true
        })

        this.setData({
          roomid,
          roomname,
          people,
          entryType: type
        })
      } else {
        if (type === 'comm_audience') {
          this.jumpWatch(roomid, roomname, people)
        }
        if (type === 'comm_fight') {
          this.jumpFight(roomid, roomname, people)
        }
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
    },
    submitSecret() {
      const {
        roomid,
        roomSecret,
        roomname,
        people,
        entryType
      } = this.data
      if (roomSecret === '') {
        $.tip('密码不能为空~')
      } else {
        if (entryType === 'comm_audience') {
          this.jumpWatch(roomid, roomname, people, roomSecret)
        }
        if (entryType === 'comm_fight') {
          this.jumpFight(roomid, roomname, people, roomSecret)
        }
      }
    },
    inputSecret(e) {
      const value = e.detail.value
      this.setData({
        roomSecret: value
      })
    },
    cancelSecret() {
      this.setData({
        roomSecret: '',
        showModel: false
      })
    },
    async initUI(tabbarHeight) {
      const swiperHeight = await this.getSwiperHeight()
      const tabHeight = await this.getTabHeight()
      const {
        screenHeight,
        CustomBar
      } = app.store
      // 40:
      // - #swiper margin上下各10 = 20
      // - .card-list margin上下各10 = 20
      // 20 + 20 = 40
      const listHeight = screenHeight - CustomBar - tabbarHeight - swiperHeight - tabHeight - 40
      console.log('log => : initUI -> listHeight', listHeight)
      this.setData({
        listHeight
      })
    }
  },

  lifetimes: {
    async ready() {
      this.getSwiperList()
      this.setData({
        cardList: await this.getCardList('preparing', 0),
        showLoading: false
      })
      this.initShare()
      this.checkRoom()
    }
  }
})
