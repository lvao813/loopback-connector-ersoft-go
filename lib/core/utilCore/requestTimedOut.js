
/**
* 自动超时机制
* @param {Number} time 超时时间 默认3000
*/
module.exports = (time) => {
    return new Promise(async (resolve, reject) => {
        setTimeout(() => {
            let err = new Error('Service Unavailable');
            err.statusCode = 503;
            reject(err);
        }, time ? time : 3000);
    });
};
