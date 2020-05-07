const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const tip = (msg, duration = 2000) => {
  return new Promise(resolve =>
    wx.showToast({
      title: msg,
      icon: 'none',
      duration,
      complete() {
        setTimeout(() => {
          resolve()
        }, duration)
      }
    })
  )
}

const make2dArr = (line, column) => {
  const arr = new Array()
  for (let i = 0; i < line; i++) {
    arr[i] = new Array()
    for (let j = 0; j < column; j++) {
      arr[i][j] = null
    }
  }

  return arr
}

module.exports = {
  formatTime,
  tip,
  make2dArr
}
