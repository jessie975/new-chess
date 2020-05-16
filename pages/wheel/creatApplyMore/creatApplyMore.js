import api from '../../../request/index'
import $ from '../../../utils/util'
import router from '../../../utils/router'
Page({
  data: {
    limitNumber: '',
    limitReason: ''
  },
  inputInfo(e) {
    const key = e.target.dataset.key
    const value = e.detail.value
    this.setData({
      [key]: value
    })
  },

  submit() {
    const {
      limitReason,
      limitNumber
    } = this.data
    if (limitNumber === '') {
      $.tip('申请人数不能为空')
      return
    }
    if (limitReason === '') {
      $.tip('申请原因不能为空')
      return
    }
    api.applyPlusRoom({
      num: limitNumber,
      reason: limitReason
    }).then(res => {
      if (res.data.code === 0) {
        $.tip('申请成功，请等待审核')
        setTimeout(() => { router.pop() }, 1000)
      } else {
        $.tip(res.data.msg)
      }
    })
  }
})
