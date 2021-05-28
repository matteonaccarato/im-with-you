const sqlite3 = require('sqlite3').verbose(); /* https://github.com/mapbox/node-sqlite3/wiki/API#databaseallsql-param--callback */
const { connect_dev, connect_prod, close } = require('./utilsDB')


exports.create = phrase => {
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
    })

    close(db);
}

exports.read = (id = -1) => {
    const db = connect_dev();
    const sql = "SELECT Phrases.*, Users.username, People.name, People.surname, People.quotationMarksColor, Phrases.yearOfPublication, Phrases.monthOfPublication, Phrases.dayOfPublication" +
        " FROM Phrases LEFT JOIN People ON (Phrases.quotedById = People.id) LEFT JOIN Users ON (Phrases.authorId = Users.id)" + ((id > -1) ? ` WHERE Phrases.id = ${id}` : "") + ";";

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


exports.update = phrase => {
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
    })

    close(db);
}

exports.delete = id => {
    const db = connect_dev();
    const sql = `DELETE FROM Phrases WHERE id = ${id};`;
    db.run(sql);
    close(db)
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