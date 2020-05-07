import api from '../../../../request/index'
const {
  make2dArr
} = require('./../../../../utils/util')

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
      rivalPoints: '对手分',
      cumulativePoints: '累进分',
      middleRivalPoints: '中间对手分',
      deductRivalPoints: '扣除对手分',
      winPoints: '胜局',
      rivalMostPoints: '对手最高名次',
      blackPoints: '后手局数',
      blackWinPoints: '对手分',
      username: '用户名',
      sortSingle: '排名'
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
      const ret = str.toLowerCase()
      return ret.replace(/_([\w+])/g, (all, letter) => {
        return letter.toUpperCase()
      })
    },
    getData() {
      api.getEventRange({
        matchId: this.data.matchid
      }).then(res => {
        const {
          fractions = [],
          rankingUser = []
        } = res.data.msg
        if (rankingUser.length !== 0) {
          const {
            data: {
              titleMap
            }
          } = this
          const lowFractions = ['sortSingle', 'username', ...fractions.map(item => this.replaceUnderLine(item))]
          const list = make2dArr(lowFractions.length, rankingUser.length + 1)

          rankingUser.forEach((user, i) => {
            lowFractions.forEach((obj, j) => {
              if (i === 0) {
                list[j][i] = titleMap[obj]
              }
              list[j][i + 1] = user[obj]
            })
          })
          console.log('log => : getData -> list', list)
          this.setData({
            list
          })
        }
        this.setData({
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
