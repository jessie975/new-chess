import $ from '../../../utils/util'
import api from '../../../request/index'
import router from '../../../utils/router'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: app.globalData.screenHeight - 60,
    inputValue: '',
    showEmpty: false,
    list: [],
    showLoading: false,
    page: -1,
    totalPage: -1,
    showModel: false,
    roomid: '',
    roomname: '',
    people: '',
    entryType: ''
  },

  inputValue(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  async getMoreList(inputValue) {
    const list = await this.getCardList(this.data.page + 1, inputValue)
    if (list.length !== 0) {
      this.setData({ list: [...this.data.list, ...list] })
    } else {
      if (this.data.page === 1) { this.setData({ showEmpty: true }) }
    }
  },
  async getCardList(page, inputValue) {
    if (page !== this.data.totalPage) {
      this.setData({ showLoading: true })
      const res = await api.searchRoom({
        page,
        pagesize: 10,
        searchkey: inputValue
      })
      this.setData({ showLoading: false, page, totalPage: res.data.msg.totalPage })
      return res.data.msg.resultList
    }
    return []
  },
  search() {
    const {
      inputValue
    } = this.data
    if (inputValue === '') {
      $.tip('输入内容不能为空')
    } else {
      this.getMoreList(inputValue)
    }
  },
  onShareAppMessage() {
    return {
      title: '欢迎使用京华象棋',
      path: '/pages/welcome/index/index',
      imageUrl: '/images/share.jpeg'
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
  }
})
