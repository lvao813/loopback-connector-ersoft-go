let errorFactory = require('./errorFactory');
let requestFactory = require('./requestFactory');
let requestTimedOut = require('./requestTimedOut');
module.exports = {
    /**
    * 错误工厂
    * @param {Number} code 返回的code码
    * @param {String} massege 返回的错误提示
    */
    errorFactory: errorFactory,
    /**
    * 自动超时机制
    * @param {Number} time 超时时间 默认3000
    */
    requestTimedOut: requestTimedOut,
    /**
    * 请求封装
    * @param {String} uri
    * @param {String} method
    * @param {Object} param
    * @param {Object} headers
    */
    requestFactory: requestFactory,
};
