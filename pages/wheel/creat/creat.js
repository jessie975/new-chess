import api from '../../../request/index'
import $ from '../../../utils/util'
import router from '../../../utils/router'
Page({
  data: {
    roomName: '',
    roomDetail: '',
    password: '',
    canWatch: true,
    people: 0,
    timeIndex: null,
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
    showPassword: false
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
    const type = e.currentTarget.dataset.type
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

  createData() {
    let PeopleBase = 2
    let gameBase = 5
    let addBase = 0
    let peoplePicker = []
    let gameTimePicker = []
    let addTimePicker = []
    while (PeopleBase < 21) {
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
    this.setData({
      peoplePicker,
      gameTimePicker,
      addTimePicker
    })
  },

  createRoom() {
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
      addTimePicker
    } = this.data
    const nickname = wx.getStorageSync('nickname')
    const title = roomName || nickname + '的房间'
    const summary = roomDetail || '欢迎大家来玩~'
    const beginTime = String($.formatTime(new Date()))
    const hostStep = stepTimePicker[hostStepTime]
    const playerStep = stepTimePicker[customStepTime]
    const ownerStepTime = hostStepTime > 1 ? Number(parseInt(hostStep) * 60) : Number(parseInt(hostStep))
    const playerStepTime = customStepTime > 1 ? Number(parseInt(playerStep) * 60) : Number(parseInt(playerStep))
    let data = {
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
        playerStepTime,
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
    api.createRoom(data).then(res => {
      console.log("createRoom -> res", res)
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

  onLoad() {
    this.createData()
  }
})