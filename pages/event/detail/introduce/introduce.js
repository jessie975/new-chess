import api from '../../../../request/index'
import $ from '../../../../utils/util'
import router from '../../../../utils/router'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    matchid: {
      type: [Number]
    },
    matchname: {
      type: [String]
    },
    matchState: {
      type: [String]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    match: {},
    showLoading: true,
    clock: '',
    userList: [],
    stop: false,
    hasSignUp: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getMatch() {
      return api.getEventDetail({
        matchId: this.data.matchid
      }).then(res => {
        console.log('getMatch -> res', res)
        return res.data.msg.match
      })
    },
    formDataTime(time) {
      // 计算出相差天数
      const days = Math.floor(time / (24 * 3600 * 1000))
      // 计算出小时数
      const leave1 = time % (24 * 3600 * 1000) // 计算天数后剩余的毫秒数
      const hours = Math.floor(leave1 / (3600 * 1000))
      // 计算相差分钟数
      const leave2 = leave1 % (3600 * 1000) // 计算小时数后剩余的毫秒数
      const minutes = Math.floor(leave2 / (60 * 1000))
      // 计算相差秒数
      const leave3 = leave2 % (60 * 1000) // 计算分钟数后剩余的毫秒数
      const seconds = Math.round(leave3 / 1000)
      return `${days}天${hours}小时${minutes}分钟${seconds}秒`
    },
    getClock(totalMicroSecond) {
      const that = this
      that.setData({
        clock: this.formDataTime(totalMicroSecond)
      })

      if (totalMicroSecond <= 0) {
        that.setData({
          clock: '已经截止啦~',
          stop: true
        })
        return
      }
      setTimeout(() => {
        totalMicroSecond -= 10
        that.getClock(totalMicroSecond)
      }, 10)
    },
    getMatchEnrollpsn() {
      return api.getMatchEnrollpsn({
        matchId: this.data.matchid
      }).then(res => {
        return res.data.msg
      })
    },
    signUp() {
      const that = this
      if (this.data.stop) {
        $.tip('赛事已经截止咯~')
      } else if (this.data.hasSignUp) {
        $.tip('您已经报名了')
      } else {
        wx.showModal({
          title: '提示',
          content: '报名后不可以取消，是否确认报名？',
          success(res) {
            if (res.confirm) {
              const userId = wx.getStorageSync('user_id')
              api.signUpEvent({
                userKeys: userId,
                matchId: that.data.matchid
              }).then(e => {
                if (e.data.code === 0) {
                  $.tip('报名成功~')
                  that.setData({
                    hasSignUp: true
                  })
                  // 重新拉取报名人数
                  api.getMatchEnrollpsn({
                    matchId: that.data.matchid
                  }).then(res => {
                    that.setData({
                      userList: res.data.msg
                    })
                  })
                }
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    },
    getHasSignUp() {
      return api.hasSignUpEvent({
        matchId: this.data.matchid
      }).then(e => {
        return e.data.msg
      })
    },
    jumpFight(roomid, roomname) {
      api.jumpFight({
        roomid
      }).then(res => {
        if (res.data.code === 0) {
          router.jumpToWebView(roomid, roomname, 1, 'race_fight')
        } else {
          $.tip(res.data.msg)
        }
      })
    },
    enterEvent() {
      // 选手进入比赛的接口参数不对，好像请求流程也不对（房间id怎么会是1位数）
      // 正确流程提示：请求比赛进入接口，得到房间id，拿房间id请求进入房间接口，请求成功——进入，请求失败——报错
      api.enterEvent({
        matchId: this.data.matchid
      }).then(res => {
        console.log('log => : enterEvent -> res', res)
        if (res.data.code !== 0) {
          $.tip(res.data.msg)
        } else {
          const { roomId = '' } = res.data.msg
          if (roomId !== '') {
            this.jumpFight(roomId, this.data.matchname)
          } else {
            $.tip('比赛尚未开始') // 获取到的roomId为空
          }
        }
      })
    }
  },
  lifetimes: {
    async ready() {
      const matchIntroduce = await this.getMatch()
      console.log('ready -> matchIntroduce', matchIntroduce)
      const userList = await this.getMatchEnrollpsn()
      const time = matchIntroduce.signendtime.replace(/-/g, '/')
      const timeDiff = new Date(time).getTime() - new Date().getTime() // 时间差的毫秒数
      this.setData({
        match: matchIntroduce,
        showLoading: false,
        clock: this.getClock(timeDiff),
        userList,
        hasSignUp: await this.getHasSignUp()
      })
    }
  }
})
