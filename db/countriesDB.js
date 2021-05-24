const sqlite3 = require('sqlite3').verbose();
const db = require('./utilsDB');

exports.connect = () => {
    return new sqlite3.Database(db.path.dev, err => {
        if (err)
            return console.error(err.message);
        console.log("I'm with you ♥ | Connected to the sqlite DB!");
    });
}

exports.read = (id = -1) => {
    const db = this.connect();

    /* const sql = 'SELECT name, surname, dateOfBirth, quotationMarksColor, job, countryCode FROM People' + ((id > -1) ? ` WHERE id = ${id}` : '') + ';'; */
    const sql = 'SELECT * FROM Countriesd' + ((id > -1) ? ` WHERE id = ${id}` : '') + ';';

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
            db.close();
        })
    })
}

exports.create = person => {
    const db = this.connect();

    console.log(person)

    const sql = "INSERT INTO People VALUES (null, $name, $surname, $dateOfBirth, $quotationMarksColor, $job, $countryCode);"
    db.run(sql, {
        $name: person.name,
        $surname: person.surname,
        $dateOfBirth: person.dateOfBirth,
        $quotationMarksColor: person.quotationMarksColor,
        $job: person.job,
        $countryCode: person.countryCode
    })

    this.close(db);
}

exports.update = person => {
    const db = this.connect();

    const sql = "UPDATE People SET name = $name, surname = $surname, dateOfBirth = $dateOfBirth, quotationMarksColor = $quotationMarksColor, job = $job, countryCode = $countryCode WHERE id = $id;"
    db.run(sql, {
        $name: person.name,
        $surname: person.surname,
        $dateOfBirth: person.dateOfBirth,
        $quotationMarksColor: person.quotationMarksColor,
        $job: person.job,
        $countryCode: person.countryCode,
        $id: person.id
    })

    this.close(db);
}

exports.delete = id => {
    const db = this.connect();
    const sql = `DELETE FROM People WHERE id = ${id};`;
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