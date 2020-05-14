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
    navigator: ['报名中', '进行中', '我的赛事'],
    list: [],
    currentSwiperIndex: 0,
    tabIndex: 0,
    showMyEmpty: false,
    showEventEmpty: false,
    showLoading: true,
    listHeight: 200,
    statusMap: {
      SIGN_UP: '报名中',
      MATCH_ING: '进行中'
    },
    page: 0,
    noMore: false,
    triggered: false
  },
  methods: {
    jumpDetail(e) {
      const eventid = e.currentTarget.dataset.id
      const eventname = e.currentTarget.dataset.name
      const state = e.currentTarget.dataset.state

      wx.navigateTo({
        url: `/pages/event/detail/home/home`,
        success(res) {
          res.eventChannel.emit('acceptDataFromOpenerPage', {
            eventid,
            eventname,
            state
          })
        }
      })
    },
    async tabSelect(e) {
      this.setData({
        showLoading: true,
        noMore: false
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
        this.setData({
          noMore: !res.data.msg.more
        })
        return res.data.msg.resultList
      })
    },
    getList(status, page) {
      return api.getEventList({
        page,
        matchState: status,
        pageSize: 10
      }).then(res => {
        this.setData({
          noMore: !res.data.msg.more
        })
        return res.data.msg.resultList
      })
    },
    async getMoreList() {
      if (!this.data.noMore) {
        const page = this.data.page + 1
        let list = []
        if (this.data.tabIndex === 0) {
          list = await this.getList('SIGN_UP', page)
        } else if (this.data.tabIndex === 1) {
          list = await this.getList('MATCH_ING', page)
        } else {
          list = await this.getUserEventList(page)
        }
        this.setData({
          list: [...this.data.list, ...list],
          page
        })
      }
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
    async onRefresh() {
      if (this._freshing) return
      this._freshing = true
      await this.refreshList()
      this.setData({ triggered: false })
      this._freshing = false
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
      const listHeight = screenHeight - CustomBar - tabbarHeight - tabHeight - 32
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
