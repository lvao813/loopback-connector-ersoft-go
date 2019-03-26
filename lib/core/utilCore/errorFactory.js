
/**
* 错误工厂
* @param {Number} code 返回的code码
* @param {String} massege 返回的错误提示
*/
module.exports = (code, massege) => {
    let err = new Error(massege ? massege : '');
    if (code) {
        err.statusCode = code;
        return err;
    } else {
        return err;
    }
};
