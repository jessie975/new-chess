import api from '../../../request/index'
import $ from '../../../utils/util'
import router from '../../../utils/router'
Page({
  data: {
    nickname: ''
  },
  inputValue(e) {
    this.setData({
      nickname: e.detail.value
    })
  },
  submit() {
    const {
      nickname
    } = this.data
    if (nickname === '') {
      $.tip('修改内容不能为空')
    } else {
      api.modifyUserInfo({
        nickname
      }).then(() => {
        $.tip('修改成功')
        setTimeout(() => {
          router.pop()
        }, 500)
      })
    }
  }
})
