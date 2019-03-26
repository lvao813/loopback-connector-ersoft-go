const rp = require('request-promise');

/**
* 请求封装 文档：https://github.com/request/request-promise
* @param {String} modelName
* @param {String} uri
* @param {String} method
* @param {Object} param
* @param {Object} headers
*/
module.exports = (uri, method, param, headers) => {
    return new Promise(async (resolve, reject) => {
        try {
            let options = {
                method: method ? method : 'GET',
                uri: uri,
                header: headers,
                json: true,
            };
            // 请求方式不同，参数传值不同
            if (param) {
                if (method == null || method == 'GET') {
                    options.qs = param;
                } else {
                    options.body = param;
                }
            }
            let result = await rp(options);
            resolve(result);
        } catch (error) {
            // 此处仅仅是为了数据源的restful报错方式而这样写
            reject(error.response.body.error);
        }
    });
};
