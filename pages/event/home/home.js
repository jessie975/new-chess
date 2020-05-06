import router from '../../../utils/router'
import api from '../../../request/index'

Component({
  /**
   * 组件的属性列表
   */
  properties: {

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
    showLoading: true
  },
  methods: {
    jumpDetail(e) {
      const eventid = e.currentTarget.dataset.id
      wx.navigateTo({
        url: `/pages/event/detail/home/home`,
        success: function (res) {
          res.eventChannel.emit('acceptDataFromOpenerPage', {
            eventid
          })
        }
      })
    },
    tabSelect(e) {
      this.setData({showLoading: true})
      const index = e.detail
      if (index === 0) {
        this.getList('SIGN_UP', 0)
      } else if (index === 1) {
        this.getList('MATCH_ING', 0)
      } else {
        this.getUserEventList()
      }
      this.setData({
        tabIndex: index
      })
    },
    getUserEventList() {
      api.getUserEventList({
        page: 0
      }).then(res => {
        const list = res.data.msg.resultList
        if (list.length === 0) {
          this.setData({
            showMyEmpty: true
          })
        }
        this.setData({
          list,
          showLoading: false
        })
      })
    },
    getList(status, page) {
      api.getEventList({
        page,
        matchState: status
      }).then(res => {
        const list = res.data.msg.resultList
        console.log("getList -> list", list)
        if (list.length) {
          this.setData({
            showEventEmpty: true
          })
        }
        this.setData({
          list,
          showLoading: false
        })
      })
    }
  },

  lifetimes: {
    ready() {
      this.getList('SIGN_UP', 0)
    }
  }
})