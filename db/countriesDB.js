const sqlite3 = require('sqlite3').verbose();
const { connect_dev, connect_prod, close } = require('./utilsDB')


exports.read = (id = -1) => {
    const db = connect_dev();
    const sql = 'SELECT name, alpha_2 FROM Countries' + ((id > -1) ? ` WHERE id = ${id}` : '') + ';';

    return new Promise((resolve, reject) => {
        var responseObj;
        db.all(sql, function(err, rows) {
            if (err) {
                responseObj = {
                    'error': err
                };
                reject(responseObj);
            } else {
                responseObj = {
                    statement: this,
                    rows: rows
                };
                resolve(responseObj);
            }
            close(db);
        })
    })
}