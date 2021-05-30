const { connect_dev, connect_prod, close } = require('./utilsDB')

exports.TABLE = "Posts"

exports.FIELDS = {
    "ID": "id",
    "AUTHORID": "authorId",
    "ISFINISHED": "isFinished"
}

exports.create = (post, cb) => {
    const db = connect_dev();

    const sql = "INSERT INTO Posts VALUES (null, $title, $text, $authorId, $isFinished, $yearOfPublication, $monthOfPublication, $dayOfPublication);"
    db.run(sql, {
        $title: post.title,
        $text: post.text,
        $authorId: post.authorId,
        $isFinished: post.isFinished,
        $yearOfPublication: post.yearOfPublication,
        $monthOfPublication: post.monthOfPublication,
        $dayOfPublication: post.dayOfPublication,
    }, err => {
        if (err) {
            console.log(err)
        } else {
            cb()
        }
    })

    close(db);
}

exports.read = (field = '', value = -1) => {
    const db = connect_dev();
    const sql = `SELECT Posts.*, Users.username
                    FROM Posts 
                        JOIN Users ON (Posts.authorId = Users.id)` +
        ((field != '' && value > -1) ? ` WHERE Posts.${field} = ${value}` : "") +
        ` ORDER BY Posts.yearOfPublication DESC, Posts.monthOfPublication DESC, Posts.dayOfPublication DESC, Posts.id DESC;`;

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

exports.readLasts = lastN => {
    const db = connect_dev()
    const sql = `SELECT Posts.*, Users.username
                    FROM Posts 
                        JOIN Users ON (Posts.authorId = Users.id)
                    ORDER BY Posts.yearOfPublication DESC, Posts.monthOfPublication DESC, Posts.dayOfPublication DESC, Posts.id DESC;
                LIMIT ${lastN};`
    return new Promise((resolve, reject) => {
        var responseObj;
        db.all(sql, (err, rows) => {
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

/* exports.read = (id = -1) => {
    const db = connect_dev();
    const sql = "SELECT Posts.*, Users.username FROM Posts JOIN Users ON (Posts.authorId = Users.id)" + ((id > -1) ? ` WHERE Posts.id = ${id}` : "") + ";";

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
} */


exports.update = (post, cb) => {
    const db = connect_dev();

    const sql = "UPDATE Posts SET title = $title, text = $text, authorId = $authorId, isFinished = $isFinished, yearOfPublication = $yearOfPublication, monthOfPublication = $monthOfPublication, dayOfPublication = $dayOfPublication WHERE id = $id;"
    db.run(sql, {
        $title: post.title,
        $text: post.text,
        $authorId: post.authorId,
        $isFinished: post.isFinished,
        $yearOfPublication: post.yearOfPublication,
        $monthOfPublication: post.monthOfPublication,
        $dayOfPublication: post.dayOfPublication,
        $id: post.id
    }, err => {
        if (err) {
            console.log(err)
        } else {
            cb()
        }
    })

    close(db);
}

exports.delete = (id, cb) => {
    const db = connect_dev();
    const sql = `DELETE FROM Posts WHERE id = ${id};`;
    db.run(sql, err => {
        if (err) {
            console.log(err)
        } else {
            cb()
        }
    });
    close(db)
}

exports.deleteByField = (field, value, cb) => {
    const db = connect_dev();
    const sql = `DELETE FROM ${this.TABLE} WHERE ${field} = ${value};`
    db.run(sql, err => {
        if (err) {
            console.log(err)
        } else {
            cb()
        }
    })
}

exports.getCount = () => {
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
}