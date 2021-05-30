const phrasesDB = require('./phrasesDB')
const peopleDB = require('./peopleDB')
const postsDB = require('./postsDB')
const usersDB = require('./usersDB')
const { connect_dev, connect_prod, close } = require('./utilsDB')

exports.SAVES_TBLS = {
    "PHRASE": "LikesPhrases",
    "POST": "LikesPosts"
}

exports.FIELDS = {
    "CONTENT_ID": "contentId",
    "USER_ID": "userId"
}

exports.create = (tbl, entityId, userId) => {
    const db = connect_dev();

    const sql = `INSERT INTO ${tbl} VALUES (${entityId * 1}, ${userId * 1});`
    db.run(sql, async err => {
        console.log(err)
    })

    close(db);
}

exports.read = (tbl, userId) => {
    const db = connect_dev();

    let sql
    if (tbl == this.SAVES_TBLS.PHRASE) {
        sql = `SELECT ${tbl}.*, ${phrasesDB.TABLE}.*, ${peopleDB.TABLE}.name as quoterName, ${peopleDB.TABLE}.surname as quoterSurname, ${peopleDB.TABLE}.quotationMarksColor, ${peopleDB.TABLE}.img as quoterImg, ${usersDB.TABLE}.username
                FROM ${tbl} JOIN ${phrasesDB.TABLE} ON (${tbl}.contentId = ${phrasesDB.TABLE}.id) LEFT JOIN ${peopleDB.TABLE} ON (${phrasesDB.TABLE}.quotedById = people.id) LEFT JOIN ${usersDB.TABLE} ON (${phrasesDB.TABLE}.authorId = ${usersDB.TABLE}.id)
                WHERE ${tbl}.userId = ${userId} AND ${phrasesDB.TABLE}.isFinished = 1;`
    } else {
        sql = `SELECT ${tbl}.*, ${postsDB.TABLE}.*, ${usersDB.TABLE}.username FROM ${tbl} JOIN ${postsDB.TABLE} ON (${tbl}.contentId = ${postsDB.TABLE}.id) JOIN ${usersDB.TABLE} ON (${tbl}.userId = Users.id) WHERE ${tbl}.userId = ${userId};`;
    }

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
            close(db)
        })
    })
}

exports.getLikes = tbl => {
    const db = connect_dev()
    const sql = `SELECT ${tbl}.${this.FIELDS.CONTENT_ID}, COUNT(${this.FIELDS.USER_ID}) AS likes FROM ${tbl}
                    GROUP BY ${this.FIELDS.CONTENT_ID};`
    return new Promise((resolve, reject) => {
        var responseObj;
        db.all(sql, (err, rows) => {
            if (err) {
                responseObj = {
                    'error': err
                }
                reject(responseObj)
            } else {
                responseObj = {
                        statement: this,
                        rows: rows
                    }
                    /* console.log(responseObj) */
                resolve(responseObj)
            }
            close(db)
        })
    })
}

exports.likedByUser = (tbl, userId) => {
    const db = connect_dev()
    const sql = `SELECT ${this.FIELDS.CONTENT_ID} FROM ${tbl} WHERE ${this.FIELDS.USER_ID} = ${userId};`

    console.log(sql)
    return new Promise((resolve, reject) => {
        var responseObj;
        db.all(sql, function(err, rows) {
            if (err) {
                responseObj = {
                    'error': err
                }
                reject(responseObj)
            } else {
                responseObj = {
                    statement: this,
                    rows: rows
                }
                resolve(responseObj)
            }
            close(db)
        })
    })
}

exports.delete = (tbl, contentId, userId) => {
    const db = connect_dev();
    const sql = `DELETE FROM ${tbl} WHERE ${this.FIELDS.CONTENT_ID} = ${contentId} AND ${this.FIELDS.USER_ID} = ${userId};`;
    db.run(sql);
    close(db)
}