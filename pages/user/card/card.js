import api from '../../../request/index'
Page({
  data: {
    srcMap: {
      CARNIVAL: '红',
      MONTH_FREE: '银',
      TEACHER: '蓝',
      MASTER: '棕',
      PLUS_ROOM: '金'
    },
    titleMap: {
      CARNIVAL: '嘉年华',
      MONTH_FREE: '尊享无限卡',
      TEACHER: '',
      MASTER: '',
      PLUS_ROOM: '尊享扩容卡'
    },
    cardList: [],
    showEmpty: false
  },
  getCard() {
    api.getUserGoodsInfo().then(res => {
      console.log('getCard -> res', res)
      const list = res.data.msg
      if (list) {
        list.forEach(item => {
          item['src'] = this.data.srcMap[item.goodsType]
          item['title'] = this.data.titleMap[item.goodsType]
          item['isMan'] = item.goodsType === 'TEACHER' || item.goodsType === 'MASTER'
        })
        this.setData({
          cardList: list
        })
      } else {
        this.setData({
          showEmpty: true
        })
      }
    })
  },
  onLoad() {
    this.getCard()
  }
})
