
/**
* 错误工厂
* @param {Number} code 返回的code码
* @param {String} message 返回的错误提示
*/
module.exports = (code, message) => {
    let err = new Error(message ? message : '');
    if (code) {
        err.statusCode = code;
        return err;
    } else {
        return err;
    }
};
