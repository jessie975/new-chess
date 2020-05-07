import router from '../utils/router'
const host = 'https://www.yitongkc.com/renren-fast'

/**
 * 封装微信的的request
 */
const request = (params) => {
  return (data = {}) => {
    return new Promise((resolve, reject) => {
      let url = ''
      if (params.url.indexOf('${') > -1) {
        if (params.url.indexOf('?') > -1) {
          url = host + params.url.split('?')[0] + GetRealUrl(data, params.url)
        } else {
          url = host + replaceUrl(params.url, data)
        }
      } else {
        url = host + params.url
      }
      console.log('request -> url', url)
      const method = params.method ? params.method : 'get'
      const userId = wx.getStorageSync('user_id')
      const token = wx.getStorageSync('token')
      wx.request({
        url,
        method,
        data,
        header: {
          Accept: '*/*',
          userId,
          'Content-Type': 'application/json',
          YTKC_CDXSHDWH_TOKEN: token
        },
        success: (res) => {
          if (res.statusCode === 403) {
            router.redirectTo('welcome')
          } else {
            resolve(res)
          }
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  }
}

const replaceUrl = (url, data) => {
  Object.keys(data).forEach(key => {
    const val = `\${${key}}`
    if (url.indexOf(val) !== -1) {
      url = url.replace(val, data[key])
    }
  })
  return url
}

const GetRealUrl = (data, url) => {
  const localParams = {
    ...data
  }
  let reUrl = ''
  let append = ''
  const keys = Object.keys(localParams)
  keys.forEach((item, index) => {
    if (index === 0) {
      append += '?'
    }
    const re = new RegExp(`${item}=`, 'ig')
    if (re.test(url)) {
      append += `${item}=${localParams[item]}`
      if (index !== keys.length - 1) {
        append += '&'
      }
    }
  })
  reUrl += append
  return reUrl
}
module.exports = request
