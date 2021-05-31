const sqlite3 = require('sqlite3').verbose();
const { connect_dev, connect_prod, close } = require('./utilsDB')

exports.TABLE = "Phrases"

exports.FIELDS = {
    "ID": "id",
    "AUTHORID": "authorId",
    "ISFINISHED": "isFinished"
}


exports.create = (phrase, cb) => {
    const db = connect_dev();

    const sql = "INSERT INTO Phrases VALUES (null, $text, $img, $quotedById, $authorId, $isFinished, $yearOfPublication, $monthOfPublication, $dayOfPublication);"
    db.run(sql, {
        $text: phrase.text,
        $img: phrase.img,
        $quotedById: phrase.quotedById * 1,
        $authorId: phrase.authorId,
        $isFinished: phrase.isFinished,
        $yearOfPublication: phrase.yearOfPublication,
        $monthOfPublication: phrase.monthOfPublication,
        $dayOfPublication: phrase.dayOfPublication,
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
    const sql = `SELECT Phrases.*, Users.username, People.name as quoterName, People.surname as quoterSurname, People.quotationMarksColor, People.img as quoterImg, Phrases.yearOfPublication, Phrases.monthOfPublication, Phrases.dayOfPublication
                    FROM Phrases 
                        LEFT JOIN People ON (Phrases.quotedById = People.id) 
                        LEFT JOIN Users ON (Phrases.authorId = Users.id)` +
        ((field != '' && value > -1) ? ` WHERE Phrases.${field} = ${value}` : "") +
        ` ORDER BY Phrases.yearOfPublication DESC, Phrases.monthOfPublication DESC, Phrases.dayOfPublication DESC, Phrases.id DESC;`;

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
    const sql = `SELECT Phrases.*, Users.username, People.name as quoterName, People.surname as quoterSurname, People.quotationMarksColor, People.img as quoterImg, Phrases.yearOfPublication, Phrases.monthOfPublication, Phrases.dayOfPublication
                    FROM Phrases 
                        LEFT JOIN People ON (Phrases.quotedById = People.id) 
                        LEFT JOIN Users ON (Phrases.authorId = Users.id)
                    ORDER BY Phrases.yearOfPublication DESC, Phrases.monthOfPublication DESC, Phrases.dayOfPublication DESC, Phrases.id DESC
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


exports.update = (phrase, cb) => {
    const db = connect_dev();

    const sql = "UPDATE Phrases SET text = $text, img = $img, quotedById = $quotedById, authorId = $authorId, isFinished = $isFinished, yearOfPublication = $yearOfPublication, monthOfPublication = $monthOfPublication, dayOfPublication = $dayOfPublication WHERE id = $id;"
    db.run(sql, {
        $text: phrase.text,
        $img: phrase.img,
        $quotedById: phrase.quotedById,
        $authorId: phrase.authorId,
        $isFinished: phrase.isFinished,
        $yearOfPublication: phrase.yearOfPublication,
        $monthOfPublication: phrase.monthOfPublication,
        $dayOfPublication: phrase.dayOfPublication,
        $id: phrase.id
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
    const sql = `DELETE FROM Phrases WHERE id = ${id};`;
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
    const sql = "SELECT COUNT(id) AS nPhrases FROM Phrases;"
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
                    nPhrases: value.nPhrases
                }
                resolve(responseObj)
            }
            close(db)
        })
    })
}

exports.getImageUrl = id => {
    const db = connect_dev()

    const sql = `SELECT img FROM Phrases WHERE id = ${id};`
    return new Promise((resolve, reject) => {
        var responseObj;
        db.get(sql, (err, value) => {
            if (err) {
                responseObj = {
                    'error': err
                };
                reject(responseObj);
            } else {
                responseObj = {
                    statement: this,
                    url: value.img
                };
                resolve(responseObj);
            }
            close(db)
        })
    })

}