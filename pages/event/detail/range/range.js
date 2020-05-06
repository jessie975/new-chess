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
    title: [],
    name: [],
    list: [],
    showLoading: true,
    titleMap: {
      rivalPoints: "对手分",
      cumulativePoints: "累进分",
      middleRivalPoints: "中间对手分",
      deductRivalPoints: "扣除对手分",
      winPoints: "胜局",
      rivalMostPoints: "对手最高名次",
      blackPoints: "后手局数",
      blackWinPoints: "对手分"
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getRange() {
      return api.getEventRange({
        matchId: this.data.matchid
      }).then(res => {
        return res.data.msg.match
      })
    },
    replaceUnderLine(str) {
      let ret = str.toLowerCase()
      return ret.replace(/_([\w+])/g, (all, letter) => {
        return letter.toUpperCase();
      })
    },
    getData() {
      api.getEventRange({
        matchId: 1//this.data.matchid
      }).then(res => {
        console.log("getData -> res", res)
        const {
          fractions,
          rankingUser
        } = res.data.msg
        const lowFractions = fractions.map(item => this.replaceUnderLine(item))
        const sort = ['排名']
        const name = ['姓名']
        const list = []
        rankingUser.forEach((item, index) => {
          sort.push(item.sortSingle)
          name.push(item.username)
        })
        list.push(sort)
        list.push(name)
        lowFractions.forEach(item => {
          const arr = []
          arr.push(this.data.titleMap[item])
          list.push(arr)
        })
        console.log(list)
        console.log(sort, name)
        this.setData({
          list,
          showLoading: false
        })
      })
    }
  },
  lifetimes: {
    ready() {
      // const matchRange = await this.getRange()
      // this.setData({
      //   match: matchIntroduce
      // })
      // console.log(matchRange)
      this.getData()
    }
  }
})