import api from '../../../../request/index'
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    matchid: {
      type: [Number]
    },
    navigatorHieght: {
      type: [Number],
      value: 0,
      observer(height) {
        if (height !== 0) {
          this.initUI(height)
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    time: '2020-05-02 14:22:43',
    state: '进行中...',
    height: app.globalData.screenHeight - 100,
    page: '3',
    sumPage: '7',
    eventList: [],
    showLoading: true,
    roundList: [],
    roundIndex: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getTimeTable(roundIndex) {
      api.getTimeTable({
        matchId: this.data.matchid,
        roundno: roundIndex + 1
      }).then(res => {
      console.log("getTimeTable -> res", res)
        this.setData({
          eventList: res.data.msg
        })
      })
    },
    getTimeTableMatch() {
      api.getTimeTableMatch({
        matchId: 1
      }).then(res => {
        this.setData({
          roundList: res.data.msg
        })
      })
    },
    beforeMatch() {
      const {
        roundIndex
      } = this.data
      console.log("beforeMatch -> roundIndex", roundIndex)
      if (roundIndex > 0) {
        this.getTimeTable(roundIndex - 1)
        this.setData({
          roundIndex: roundIndex - 1
        })
      }
    },
    nextMatch() {
      const {
        roundIndex,
        roundList
      } = this.data
      console.log("nextMatch -> roundIndex", roundIndex)
      if (roundIndex < roundList.length - 1) {
        this.getTimeTable(roundIndex + 1)
        this.setData({
          roundIndex: roundIndex + 1
        })
      }

    },
    getTimeHeight() {
      return new Promise(resolve => {
        const query = wx.createSelectorQuery().in(this)
        query.select('#time').boundingClientRect(rect => {
          resolve(rect.height)
        }).exec()
      })
    },
    getFooterHeight() {
      return new Promise(resolve => {
        const query = wx.createSelectorQuery().in(this)
        query.select('#footer').boundingClientRect(rect => {
          resolve(rect.height)
        }).exec()
      })
    },
    async initUI(navigatorHieght) {
      const timeHeight = await this.getTimeHeight()
      const footerHeight = await this.getFooterHeight()
      const {
        screenHeight,
        CustomBar
      } = app.store
      // 40: 
      // - #navigator margin上下各40 20 = 60
      // - #content margin上下各20 = 40
      // 60 + 40 = 100
      const height = screenHeight - CustomBar - navigatorHieght - timeHeight - footerHeight - 100
      this.setData({
        height
      })
    }
  },

  lifetimes: {
    ready() {
      this.getTimeTable(0)
      this.getTimeTableMatch()
      this.setData({
        showLoading: false
      })
    }
  }
})