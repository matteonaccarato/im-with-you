const sqlite3 = require('sqlite3').verbose();
const { connect_dev, connect_prod, close } = require('./utilsDB')

exports.TABLE = "People"

exports.read = (id = -1) => {
    const db = connect_dev();
    const sql = 'SELECT People.*, Countries.name AS cName FROM People ' +
        'LEFT JOIN Countries ON (People.countryCode = Countries.alpha_2)' + ((id > -1) ? ` WHERE People.id = ${id}` : '') + ' ORDER BY id DESC;';

    return new Promise((resolve, reject) => {
        var responseObj;
        db.all(sql, function(err, rows) {
            if (err) {
                responseObj = {
                    'error': err
                };
                reject(responseObj);
            } else {
                console.log(rows)
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

exports.create = (person, cb) => {
    const db = connect_dev();

    const sql = "INSERT INTO People VALUES (null, $name, $surname, $yearOfBirth, $monthOfBirth, $dayOfBirth, $quotationMarksColor, $img, $job, $countryCode);"
    db.run(sql, {
        $name: person.name,
        $surname: person.surname,
        $yearOfBirth: person.yearOfBirth,
        $monthOfBirth: person.monthOfBirth,
        $dayOfBirth: person.dayOfBirth,
        $quotationMarksColor: person.quotationMarksColor,
        $img: person.img,
        $job: person.job,
        $countryCode: person.countryCode
    }, err => {
        if (err) {
            console.log(err)
        } else {
            cb()
        }
    })

    close(db);
}

exports.update = (person, cb) => {
    const db = connect_dev();

    const sql = "UPDATE People SET name = $name, surname = $surname, yearOfBirth = $yearOfBirth, monthOfBirth = $monthOfBirth, dayOfBirth = $dayOfBirth, quotationMarksColor = $quotationMarksColor, job = $job, img = $img, countryCode = $countryCode WHERE id = $id;"
    db.run(sql, {
        $name: person.name,
        $surname: person.surname,
        $yearOfBirth: person.yearOfBirth,
        $monthOfBirth: person.monthOfBirth,
        $dayOfBirth: person.dayOfBirth,
        $quotationMarksColor: person.quotationMarksColor,
        $img: person.img,
        $job: person.job,
        $countryCode: person.countryCode,
        $id: person.id
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
    const sql = `DELETE FROM People WHERE id = ${id};`;
    db.run(sql, err => {
        if (err) {
            console.log(err)
        } else {
            cb()
        }
    });
    close(db)
}


exports.getImageUrl = id => {
    const db = connect_dev()

    const sql = `SELECT img FROM People WHERE id = ${id};`

    /* console.log(sql) */
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