import api from '../../../request/index'
import $ from '../../../utils/util'
import router from '../../../utils/router'
const app = getApp()
Page({
  data: {
    height: app.globalData.screenHeight,
    roomName: '',
    roomDetail: '',
    password: '',
    canWatch: true,
    people: 0,
    timeIndex: null,
    nickname: '',
    peoplePicker: [],
    gameTimePicker: [],
    stepTimePicker: ['20秒', '40秒', '1分钟', '2分钟', '3分钟', '5分钟', '10分钟', '15分钟', '20分钟'],
    addTimePicker: [],
    hostGameTime: 5,
    hostStepTime: 0,
    hostAddTime: 0,
    customGameTime: 5,
    customStepTime: 0,
    customAddTime: 0,
    showPassword: false,
    roomPersonLimit: 3,
    showLimit: false,
    limitNumber: null,
    limitReason: ''
  },

  changeWatchState() {
    this.setData({
      canWatch: !this.data.canWatch
    })
  },

  showPicker(e) {
    this.setData({
      timeIndex: e.currentTarget.dataset.index
    })
  },

  PickerChange(e) {
    const {
      peoplePicker
    } = this.data
    const type = e.currentTarget.dataset.type
    const value = e.detail.value
    this.setData({
      // eslint-disable-next-line eqeqeq
      showLimit: type === 'people' && value == peoplePicker.length - 1
    })
    this.setData({
      [type]: e.detail.value
    })
  },

  showPassword() {
    this.setData({
      showPassword: !this.data.showPassword
    })
  },

  inputInfo(e) {
    const type = e.target.dataset.type
    const value = e.detail.value
    this.setData({
      [type]: value
    })
  },

  createData(roomPersonLimit) {
    let PeopleBase = 2
    let gameBase = 5
    let addBase = 0
    const peoplePicker = []
    const gameTimePicker = []
    const addTimePicker = []
    while (PeopleBase < roomPersonLimit + 1) {
      peoplePicker.push(PeopleBase)
      PeopleBase++
    }
    while (gameBase < 30) {
      gameTimePicker.push(gameBase)
      gameBase += 5
    }
    while (gameBase < 121) {
      gameTimePicker.push(gameBase)
      gameBase += 30
    }
    while (addBase < 30) {
      addTimePicker.push(addBase)
      addBase += 5
    }
    peoplePicker.push('申请扩容')
    this.setData({
      peoplePicker,
      gameTimePicker,
      addTimePicker
    })
  },

  applyPlusRoom() {
    const {
      limitNumber,
      limitReason
    } = this.data
    return api.applyPlusRoom({
      num: limitNumber,
      reason: limitReason
    }).then(res => {
      return res.data.code
    })
  },

  async createRoom() {
    const {
      roomName,
      roomDetail,
      canWatch,
      hostGameTime,
      hostStepTime,
      hostAddTime,
      customGameTime,
      customStepTime,
      customAddTime,
      peoplePicker,
      people,
      password,
      showPassword,
      gameTimePicker,
      stepTimePicker,
      addTimePicker,
      showLimit,
      limitNumber,
      limitReason,
      nickname
    } = this.data
    const title = roomName || nickname + '的房间'
    const summary = roomDetail || '欢迎大家来玩~'
    const beginTime = String($.formatTime(new Date()))
    const hostStep = stepTimePicker[hostStepTime]
    const playerStep = stepTimePicker[customStepTime]
    const ownerStepTime = hostStepTime > 1 ? Number(parseInt(hostStep) * 60) : Number(parseInt(hostStep))
    const playerStepTime = customStepTime > 1 ? Number(parseInt(playerStep) * 60) : Number(parseInt(playerStep))
    const data = {
      beginTime,
      canWatch,
      nickname,
      maxBCount: Number(peoplePicker[people]),
      summary,
      timeRule: {
        ownerMatchTime: Number(gameTimePicker[hostGameTime] * 60),
        ownerStepAddTime: Number(addTimePicker[hostAddTime]),
        ownerStepTime,
        playerMatchTime: Number(gameTimePicker[customGameTime] * 60),
        playerStepAddTime: Number(addTimePicker[customAddTime]),
        playerStepTime
      },
      title
    }
    if (showPassword) {
      if (password === '') {
        $.tip('开启密码后，密码不能为空')
        return
      } else {
        data.password = password
      }
    }
    if (showLimit) {
      if (!limitNumber || !limitReason) {
        $.tip('申请扩容后，申请人数和申请原因不能为空')
        return
      } else {
        const applyState = await this.applyPlusRoom()
        if (applyState !== 0) {
          $.tip('申请扩容失败~')
        } else {
          data.num = Number(limitNumber)
          data.reason = String(limitReason)
        }
      }
    }
    api.createRoom(data).then(res => {
      if (res.data.code === 0) {
        $.tip('创建成功，即将跳转~')
        const {
          roomid,
          title,
          maxACount
        } = res.data.msg.room
        router.jumpToWebView(roomid, title, maxACount, 'create_room')
      } else {
        $.tip('创建失败，请稍后重试~')
      }
    })
  },

  getUserIdentity() {
    return api.getUserIdentity().then(res => {
      return res.data.msg
    })
  },

  async onLoad() {
    const { roomPersonLimit, nickname } = await this.getUserIdentity()
    this.setData({
      roomPersonLimit,
      nickname
    })
    this.createData(this.data.roomPersonLimit)
  },
  onShareAppMessage() {
    return {
      title: '欢迎来京华象棋',
      path: '/pages/welcome/index/index',
      imageUrl: '/images/share.jpeg'
    }
  }
})
