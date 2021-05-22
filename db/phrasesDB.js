const sqlite3 = require('sqlite3').verbose(); /* https://github.com/mapbox/node-sqlite3/wiki/API#databaseallsql-param--callback */
const db = require('./utilsDB');

exports.connect = () => {
    /* console.log(db.path.dev) */
    return new sqlite3.Database(db.path.dev, err => {
        if (err)
            return console.error(err.message);
        console.log("I'm with you ♥ | Connected to the sqlite DB!");
    });
}

exports.create = phrase => {
    const db = this.connect();
    const sql = "INSERT INTO Phrases VALUES (null, $text, $img, $quotedById, $authorId, $isFinished, $date);"

    db.run(sql, {
        $text: phrase.text,
        $img: phrase.img,
        $quotedById: phrase.quotedById * 1,
        $authorId: phrase.authorId,
        $isFinished: phrase.isFinished,
        $date: phrase.date + ""
    })

    this.close(db);
}

exports.read = (id = -1) => {
    const db = this.connect();
    const sql = "SELECT Phrases.id, Phrases.authorId, Users.username, Phrases.text, Phrases.img, Phrases.isFinished, Phrases.quotedById, People.name, People.surname, People.quotationMarksColor, Phrases.date" +
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
            db.close()
        })
    })
}


exports.update = phrase => {
    const db = this.connect();

    const sql = "UPDATE Phrases SET text = $text, img = $img, quotedById = $quotedById, authorId = $authorId, isFinished = $isFinished, date = $date WHERE id = $id;"
    db.run(sql, {
        $text: phrase.text,
        $img: phrase.img,
        $quotedById: phrase.quotedById,
        $authorId: phrase.authorId,
        $isFinished: phrase.isFinished,
        $date: phrase.date + "",
        $id: phrase.id
    })

    this.close(db);
}

exports.delete = id => {
    const db = this.connect();
    const sql = `DELETE FROM Phrases WHERE id = ${id};`;
    db.run(sql);
    this.close(db)
}

exports.close = db => {
    db.close(err => {
        if (err)
            console.error(err.message);
        console.log("I'm with you ♥ | Disconnected from the sqlite DB!")
    })
}

exports.getImageUrl = id => {
    const db = this.connect()

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
            this.close(db)
        })
    })

}