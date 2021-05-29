const phrasesDB = require('./phrasesDB')
const peopleDB = require('./peopleDB')
const postsDB = require('./postsDB')
const usersDB = require('./usersDB')
const { connect_dev, connect_prod, close } = require('./utilsDB')

exports.SAVES_TBLS = {
    "PHRASE": "LikesPhrases",
    "POST": "LikesPosts"
}

exports.create = (tbl, entityId, userId) => {
    const db = connect_dev();

    const sql = `INSERT INTO ${tbl} VALUES (${entityId * 1}, ${userId * 1});`
    console.log(sql)
    db.run(sql)

    close(db);
}

exports.read = (tbl, userId) => {
    const db = connect_dev();

    let sql
    if (tbl == this.SAVES_TBLS.PHRASE) {
        sql = `SELECT ${tbl}.*, ${phrasesDB.TABLE}.*, ${peopleDB.TABLE}.name as quoterName, ${peopleDB.TABLE}.surname as quoterSurname, ${peopleDB.TABLE}.quotationMarksColor, ${peopleDB.TABLE}.img as quoterImg 
                FROM ${tbl} JOIN ${phrasesDB.TABLE} ON (${tbl}.contentId = ${phrasesDB.TABLE}.id) LEFT JOIN ${peopleDB.TABLE} ON (phrases.quotedById = people.id)
                WHERE ${tbl}.userId = ${userId};`
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


/* exports.update = post => {
    const db = connect_dev();

    const sql = "UPDATE   WHERE id = $id;"
    db.run(sql, {

        $id: post.id
    })

    close(db);
} */

exports.delete = (tbl, contentId, userId) => {
    const db = connect_dev();
    const sql = `DELETE FROM Posts WHERE id = ${id};`;
    db.run(sql);
    close(db)
}

/* exports.getCount = () => {
    const db = connect_dev();
    const sql = "SELECT COUNT(id) AS nPosts FROM Posts;"
    return new Promise((resolve, reject) => {
        var responseObj;
        db.get(sql, (err, value) => {
            if (err) {
                responseObj = {
                    'error': err
                }
                reject(responseObj)
            } else {
                responseObj = {
                    statement: this,
                    nPosts: value.nPosts
                }
                resolve(responseObj)
            }
            close(db)
        })
    })
} */