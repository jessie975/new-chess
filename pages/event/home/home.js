import api from '../../../request/index'

const app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabbarHeight: {
      type: Number
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    navigator: ['报名中', '对战中', '我的赛事'],
    list: [],
    currentSwiperIndex: 0,
    tabIndex: 0,
    showMyEmpty: false,
    showEventEmpty: false,
    showLoading: true,
    listHeight: 0,
    statusMap: {
      SIGN_UP: '报名中',
      MATCH_ING: '对战中'
    },
    page: 0,
    noMore: false,
    refresh: false
  },
  methods: {
    jumpDetail(e) {
      const eventid = e.currentTarget.dataset.id
      const eventname = e.currentTarget.dataset.name
      wx.navigateTo({
        url: `/pages/event/detail/home/home`,
        success(res) {
          res.eventChannel.emit('acceptDataFromOpenerPage', {
            eventid,
            eventname
          })
        }
      })
    },
    async tabSelect(e) {
      this.setData({
        showLoading: true
      })
      const index = e.detail
      let list = []
      if (index === 0) {
        list = await this.getList('SIGN_UP', 0)
      } else if (index === 1) {
        list = await this.getList('MATCH_ING', 0)
      } else {
        list = await this.getUserEventList()
      }
      this.setData({
        tabIndex: index,
        list,
        showLoading: false
      })
    },
    getUserEventList(page = 0) {
      return api.getUserEventList({
        page
      }).then(res => {
        return res.data.msg.resultList
      })
    },
    getList(status, page) {
      return api.getEventList({
        page,
        matchState: status,
        pageSize: 10
      }).then(res => {
        return res.data.msg.resultList
      })
    },
    async getMoreList() {
      const page = this.data.page + 1
      let list = []
      if (this.data.tabIndex === 0) {
        list = await this.getList('SIGN_UP', page)
      } else if (this.data.tabIndex === 1) {
        list = await this.getList('MATCH_ING', page)
      } else {
        list = await this.getUserEventList(page)
      }
      if (list.length === 0) {
        this.setData({
          noMore: true
        })
      }
      this.setData({
        list: [...this.data.list, ...list],
        page
      })
    },
    async refreshList() {
      let list = []
      if (this.data.tabIndex === 0) {
        list = await this.getList('SIGN_UP', 0)
      } else if (this.data.tabIndex === 1) {
        list = await this.getList('MATCH_ING', 0)
      } else {
        list = await this.getUserEventList()
      }
      this.setData({
        list
      })
    },
    // 下拉
    // TODO:你有时间就研究下这里为啥不加setTimeout就没办法更改refresh的值吧
    // 这样有一个延迟体验不太好，我看了一下好像是这个下拉一直触发下拉被中止的事件bindrefresherabort
    onPulling() {
      setTimeout(() => {
        this.setData({
          refresh: true
        })
      }, 500)
    },

    onRefresh() {
      this.refreshList()
      setTimeout(() => {
        this.setData({
          refresh: false
        })
      }, 1000)
    },
    getTabHeight() {
      return new Promise(resolve => {
        const query = wx.createSelectorQuery().in(this)
        query.select('#tab').boundingClientRect(rect => {
          resolve(rect.height)
        }).exec()
      })
    },
    async initUI(tabbarHeight) {
      const tabHeight = await this.getTabHeight()
      const {
        screenHeight,
        CustomBar
      } = app.store
      // 50:
      // - .tab margin上下各20 = 40
      // - .tabbar margin下10 = 10
      const listHeight = screenHeight - CustomBar - tabbarHeight - tabHeight - 50
      this.setData({
        listHeight
      })
    }
  },

  lifetimes: {
    async ready() {
      const list = await this.getList('SIGN_UP', 0)
      this.setData({
        list,
        showLoading: false
      })
      this.initUI(this.data.tabbarHeight)
    }
  }
})
