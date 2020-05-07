import router from '../../../utils/router'
import api from '../../../request/index'
import $ from '../../../utils/util'

Component({
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    userInfo: {},
    entryList: [{
      name: '我的卡包',
      type: 'userCardInfo'
    },
    {
      name: '修改资料',
      type: 'userInfoModify'
    },
    {
      name: '联系客服',
      type: 'contact'
    },
    {
      name: '常见问题',
      type: 'userQuestion'
    },
    {
      name: '关于我们',
      type: 'userAboutUs'
    }
    ],
    showModel: false,
    showLoading: true,
    phone: '',
    wechat: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    jump(e) {
      const type = e.currentTarget.dataset.type
      if (type !== 'contact') {
        router.push(type)
      } else {
        this.setData({
          showModel: true
        })
      }
    },
    getUserInfo() {
      const targetUserId = wx.getStorageSync('user_id')
      api.getUserInfo({
        targetUserId
      }).then(res => {
        this.setData({
          userInfo: res.data.msg,
          showLoading: false
        })
      })
    },
    getContact() {
      api.getContact().then(res => {
        const {
          contactPhone,
          contactWx
        } = res.data.msg
        this.setData({
          phone: contactPhone,
          wechat: contactWx
        })
      })
    },
    copy(e) {
      const type = e.target.dataset.type
      const data = type === 'phone' ? this.data.phone : this.data.wechat
      wx.setClipboardData({
        data,
        success() {
          wx.getClipboardData({
            success() {
              $.tip('复制成功')
            }
          })
        }
      })
    }
  },
  lifetimes: {
    ready() {
      this.getUserInfo()
      this.getContact()
    }
  },
  pageLifetimes: {
    show() {
      this.getUserInfo()
    }
  }
})
