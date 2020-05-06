const url = require('./url.js');
const base = require('./base.js');

const Api = {};

for (let key in url) {
    Api[key] = base(url[key]);
}

module.exports = Api;