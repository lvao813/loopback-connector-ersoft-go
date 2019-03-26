let ErsoftGo = require('./ErsoftGo');

exports.initialize = function initializeDataSource(dataSource, callback) {
    // console.log(dataSource.settings);
    // dataSource.connector = new ErsoftGo(dataSource.settings);
    // dataSource.connector.dataSource = dataSource;

    let settings = dataSource.settings || {};
    // console.log('constructor========>',dataSource);
    let connector = new ErsoftGo(settings);

    dataSource.connector = connector;
    // odooConnector.connect(cb);
    // console.log(Odoo.prototype.odooFactory)
    dataSource.connector.dataSource = dataSource;
    process.nextTick(function() {
        callback && callback();
    });
};
