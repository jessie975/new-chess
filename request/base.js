import router from '../utils/router'
const host = 'https://www.yitongkc.com/renren-fast/';

/**
 * 封装微信的的request
 */
const request = (params) => {
    return (data = {}) => {
        return new Promise((resolve, reject) => {
            let url = ''
            if (params.url.indexOf('${') > -1) {
                url = host + params.url.split('?')[0] + GetRealUrl(data, params.url)
            } else {
                url = host + params.url
            }
            console.log("request -> url", url)
            let method = params.method ? params.method : 'get';
            const user_id = wx.getStorageSync('user_id')
            const token = wx.getStorageSync('token')
            wx.request({
                url,
                method,
                data,
                header: {
                    'Accept': '*/*',
                    'userId': user_id,
                    'Content-Type': 'application/json',
                    'YTKC_CDXSHDWH_TOKEN': token
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
            });
        });
    };
};
const GetRealUrl = (params) => {
    let localParams = {
        ...params
    };
    let reUrl = '';
    let append = '';
    let keys = Object.keys(localParams);
    keys.forEach((item, index) => {
        if (index === 0) {
            append += '?';
        }
        append += `${item}=${localParams[item]}`;
        if (index !== keys.length - 1) {
            append += '&';
        }
    });
    reUrl += append;
    return reUrl;
};
module.exports = request;