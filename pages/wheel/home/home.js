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
    listHeight: 0,
    cardList: [],
    page: 0,
    showModel: false,
    noMore: false,
    showLoading: true,
    roomid: '',
    roomname: '',
    people: '',
    entryType: ''
  },

  methods: {
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
        success: function (res) {
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
        //TODO: 其他tab栏接口未知
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
        console.log("getCardList -> res", res)
        return res.data.msg.resultList
      }).catch(err => {
        $.tip(err.data.msg)
      })
    },
    async getList() {
      const page = this.data.page + 1
      let list = []
      if (this.data.tabIndex === 0) {
        list = await this.getCardList('preparing', page)
      } else if (this.data.tabIndex === 1) {
        list = await this.getCardList('fighting', page)
      } else {
        //TODO: 其他tab栏接口未知
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
        // TODO:有密码时加入观战房间
        this.setData({
          roomid,
          roomname,
          people,
          entryType: type
        })
      } else {
        router.jumpToWebView(roomid, roomname, people, type)
      }
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
        api.jumpWatch({
          roomid,
          password: roomSecret
        }).then(res => {
          if (res.data.code === 0) {
            router.jumpToWebView(roomid, roomname, people, entryType)
          } else {
            $.tip(res.data.msg)
          }
        })
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
    }
  }
})