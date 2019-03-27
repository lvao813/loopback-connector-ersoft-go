/**
 *  内部方法的实现 ——by lva 2019-03-20
 *  此方法为内部的restful对数据源的实现
 */
let util = require('util');
let Connector = require('loopback-connector').Connector;
const assert = require('assert');
let allFunction = require('./core/allFunction');

module.exports = class ErsoftGo {
    constructor(opts) {
        console.log('this', this);
        console.log('opts ErsoftGo============>', opts);
        this.opts = opts;
        // debug 模式
        this.debug = opts.debug || false;
        // 端口号
        this.port = opts && opts.port ? opts.port : '3000';
         // ip地址
        this.host = opts && opts.host ? opts.host : '0.0.0.0';

        Connector.call(this, 'ErsoftGo', opts);
        // 协议类型
        this.protocol = opts.protocol ? opts.protocol : 'http';
        // 自动生成url
        this.locationUrl = this.protocol + '://' + this.host + ':' + this.port;
        // 是否是自定义url
        this.base_location = opts.url ? opts.url : this.locationUrl;
        util.inherits(ErsoftGo, Connector);
    }
    /**
     * 与后台的连接器
     * @param {String} modelName
     * @param {String} uri
     * @param {String} method
     * @param {Object} param
     * @param {Object} headers
     */
    connect(moelName, uri, method, param, headers) {
        return new Promise(async (resolve, reject) => {
            try {
                let promiseArray = [
                    allFunction.utilFunction.requestFactory(uri, method, param, headers),
                    // allFunction.utilFunction.requestTimedOut(), //超时设置
                ];
                let result = await Promise.race(promiseArray);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    };
    /**
     * 查询语句的转化
     * @param {Object} filter
     */
    buildWhere(filter) {

    }
    /**
     * uri拼接
     * @param {String} modelName 表名
     * @param {String} path 路径
     */
    buildUri(modelName, path) {
        if (path) {
            return this.base_location + '/api/' + modelName + 's' + '/' + path;
        } else {
            return this.base_location + '/api/' + modelName + 's';
        }
    }
    /**
     * find findById 专用 —— by lva
     * @param {String} model model的名字
     * @param {Object} filter 查询语句
     * @param {Object} options 用户信息
     * @param {any} cb 回调
     */
    async all(model, filter, options, cb) {
        console.log('all');
        console.log('model===========>', model);
        console.log('filter===========>', filter);
        console.log('options===========>', options);
        try {
            let uri = this.buildUri(model);
            // 浅拷贝丢失属性，使用深拷贝赋值
            let filter2 = JSON.parse(JSON.stringify(filter));
            // 后台不支持include所以此处删除
            let filter1 = JSON.parse(JSON.stringify(filter));
            delete filter1.include;
            // 判断filter是否存在,存在转为字符串
            let _filter = filter1 ? JSON.stringify(filter1) : null;
            // 判断filter是否为空,为空时不填入
            let qs = _filter ? {filter: _filter} : null;
            let result = await this.connect(model, uri, 'GET', qs);
            console.log(filter);
            if (filter2 && filter2.include) {
                this._models[model].model.include(
                    result,
                    filter.include,
                    options,
                    cb
                );
            } else {
                cb(null, result);
            }
        } catch (error) {
            cb(error);
        }
    };

    /**
     * count 专用 —— by lva
     * @param {String} model model的名字
     * @param {Object} where 查询语句
     * @param {Object} options 用户信息
     * @param {any} cb 回调
     */
    async count(model, where, options, cb) {
        console.log('all');
        console.log('model===========>', model);
        console.log('where===========>', where);
        console.log('options===========>', options);
        try {
            let uri = this.buildUri(model);

            // 判断where是否存在,存在转为字符串
            let _filter = where ? JSON.stringify({where: where}) : null;
            // 判断filter是否为空,为空时不填入
            let qs = _filter ? {filter: _filter} : null;
            let result = await this.connect(model, uri, 'GET', qs);

            cb(null, result.length);
        } catch (error) {
            cb(error);
        }
    };

    /**
     * create 专用 ——by lva
     * @param {String} model model的名字
     * @param {Object} data 创建对象的值
     * @param {Object} options 用户信息
     * @param {any} cb 回调
     */
    async create(model, data, options, cb) {
        console.log('create');
        console.log('model===========>', model);
        console.log('data===========>', data);
        console.log('options===========>', options);
        try {
            let uri = this.buildUri(model, null);
            let result = await this.connect(model, uri, 'POST', data);
            // 因为此处会变成
            // {"title":"test2","content":"hh8","id":{"title":"test2","content":"hh8","id":6}}
            // 的形式，所以此处只取id
            cb(null, result.id);
        } catch (error) {
            cb(error);
        }
    }
    /**
     * destroyAll destroyById 专用 暂时只支持 destroyById 之后真实连接会补全
     * @param {String} model modelName
     * @param {Object} where 查询条件
     * @param {Object} options 用户信息
     * @param {any} cb
     */
    async destroyAll(model, where, options, cb) {
        console.log('destroyAll');
        console.log('model===========>', model);
        console.log('where===========>', where);
        console.log('options===========>', options);
        try {
            let idName = this.idName(model);
            let uri = this.buildUri(model, `${where[idName]}`);
            let result = await this.connect(model, uri, 'DELETE');
            cb(null, result.count);
        } catch (error) {
            cb(error);
        }
    }

    /**
     * update 专用
     * @param {String} model modelName
     * @param {Object} where where语句
     * @param {Object} data 更新内容
     * @param {Object} options 用户信息
     * @param {any} cb
     */
    async update(model, where, data, options, cb) {
        console.log('update');
        console.log('model===========>', model);
        console.log('where===========>', where);
        console.log('data===========>', data);
        console.log('options===========>', options);
        try {
            let _path = where ? JSON.stringify(where) : null;
            let uri = this.buildUri(model, `update?where=${_path}`);
            let result = await this.connect(model, uri, 'POST', data);
            cb(null, result.count);
        } catch (error) {
            cb(error);
        }
    }
    /**
     * 更新对象，更新之前验证是否存在，此方法是挂载到对象上的
     * @param {String} model modelName
     * @param {any} id 需要更新的数据的id
     * @param {Object} data 需要更新的数据
     * @param {Object} options 用户信息
     * @param {any} cb 回调
     */
    async updateAttributes(model, id, data, options, cb) {
        console.log('updateAttributes');
        console.log('model===========>', model);
        console.log('id===========>', id);
        console.log('data===========>', data);
        console.log('options===========>', options);
        try {
            let uri = this.buildUri(model, `${id}`);
            let result = await this.connect(model, uri, 'PATCH', data);
            cb(null, result);
        } catch (error) {
            cb(error);
        }
    }

    /**
     * 更新对象，全量更新
     * @param {String} model modelName
     * @param {any} id 需要更新的数据的id
     * @param {Object} data 需要更新的数据
     * @param {Object} options 用户信息
     * @param {any} cb 回调
     */
    async replaceById(model, id, data, options, cb) {
        console.log('replaceById');
        console.log('model===========>', model);
        console.log('id===========>', id);
        console.log('data===========>', data);
        console.log('options===========>', options);
        try {
            let _path = JSON.stringify({id:id})
            let uri = this.buildUri(model, `update?where=${_path}`);
            // 获取当前数据中所带的id的值
            let idValue = this.getIdValue(model, data);
            // 获取当前mode的id字段
            let idName = this.idName(model);
            delete data[idName];
            let result = await this.connect(model, uri, 'POST', data);
            cb(null, result);
        } catch (error) {
            cb(error);
        }
    }

    /**
     * 更新对象，全量更新，此方法专门挂载到对象上使用
     * @param {String} model modelName
     * @param {Object} data 需要更新的数据
     * @param {Object} options 用户信息
     * @param {any} cb 回调
     */
    async save(model, data, options, cb) {
        console.log('save');
        console.log('model===========>', model);
        console.log('data===========>', data);
        console.log('options===========>', options);
        try {
            // 获取当前数据中所带的id的值
            let idValue = this.getIdValue(model, data);
            // 获取当前mode的id字段
            let idName = this.idName(model);
            if (!idValue) {
                let err = allFunction.utilFunction.errorFactory(400, `Cannot find model with ${idName} ${idValue}`);
                cb(err);
            }
            // 删除数据内的id
            delete data[idName];
            let uri = this.buildUri(model, `${idValue}`);
            let result = await this.connect(model, uri, 'PATCH', data);
            cb(null, result);
        } catch (error) {
            cb(error);
        }
    }

    /**
     * 删除某个条目，此方法挂载到对象上
     * @param {String} model modelName
     * @param {any} id 需要更新的数据
     * @param {Object} options 用户信息
     * @param {any} cb 回调
     */
    async destroy(model, id, options, cb) {
        console.log('destroy');
        console.log('id===========>', model);
        console.log('data===========>', id);
        console.log('options===========>', options);
        try {
            let uri = this.buildUri(model, `${id}`);
            let result = await this.connect(model, uri, 'DELETE');
            cb(null, result.count);
        } catch (error) {
            cb(error);
        }
    }

};
