import api from '../../../../request/index'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    matchid: {
      type: [Number]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    match: {},
    showLoading: true,
    clock: '',
    userList: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getMatch() {
      return api.getEventDetail({
        matchId: this.data.matchid
      }).then(res => {
        return res.data.msg.match
      })
    },
    formDataTime(time) {
      //计算出相差天数  
      const days = Math.floor(time / (24 * 3600 * 1000))
      //计算出小时数  
      const leave1 = time % (24 * 3600 * 1000) //计算天数后剩余的毫秒数  
      const hours = Math.floor(leave1 / (3600 * 1000))
      //计算相差分钟数  
      const leave2 = leave1 % (3600 * 1000) //计算小时数后剩余的毫秒数  
      const minutes = Math.floor(leave2 / (60 * 1000))
      //计算相差秒数  
      const leave3 = leave2 % (60 * 1000) //计算分钟数后剩余的毫秒数  
      const seconds = Math.round(leave3 / 1000)
      return `${days}天${hours}小时${minutes}分钟${seconds}秒`
    },
    getClock(total_micro_second) {
      const that = this
      that.setData({
        clock: this.formDataTime(total_micro_second)
      })

      if (total_micro_second <= 0) {
        that.setData({
          clock: "已经截止啦~"
        })
        return
      }
      setTimeout(function () {
        total_micro_second -= 10
        that.getClock(total_micro_second)
      }, 10)
    },
    getMatchEnrollpsn() {
      return api.getMatchEnrollpsn({
        matchId: this.data.matchid
      }).then(res => {
        return res.data.msg
      })
    }
  },
  lifetimes: {
    async ready() {
      const matchIntroduce = await this.getMatch()
      console.log("ready -> matchIntroduce", matchIntroduce)
      const userList = await this.getMatchEnrollpsn()
      const time = matchIntroduce.signendtime
      const timeDiff = new Date(time).getTime() - new Date().getTime() //时间差的毫秒数 
      this.setData({
        match: matchIntroduce,
        showLoading: false,
        clock: this.getClock(timeDiff),
        userList
      })
    }
  }
})