const sqlite3 = require('sqlite3').verbose();
const { connect_dev, connect_prod, close } = require('./utilsDB')


exports.read = (id = -1) => {
    const db = connect_dev();

    /* const sql = 'SELECT name, surname, dateOfBirth, quotationMarksColor, job, countryCode FROM People' + ((id > -1) ? ` WHERE id = ${id}` : '') + ';'; */
    const sql = 'SELECT People.id, People.name, People.surname, People.dateOfBirth, People.img, People.job, People.quotationMarksColor, People.countryCode, Countries.name AS cName FROM People ' +
        'LEFT JOIN Countries ON (People.countryCode = Countries.alpha_2)' + ((id > -1) ? ` WHERE People.id = ${id}` : '') + ';';

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

exports.create = person => {
    const db = connect_dev();

    console.log(person)

    const sql = "INSERT INTO People VALUES (null, $name, $surname, $dateOfBirth, $quotationMarksColor, $img, $job, $countryCode);"
    db.run(sql, {
        $name: person.name,
        $surname: person.surname,
        $dateOfBirth: person.dateOfBirth,
        $quotationMarksColor: person.quotationMarksColor,
        $img: person.img,
        $job: person.job,
        $countryCode: person.countryCode
    })

    close(db);
}

exports.update = person => {
    const db = connect_dev();

    const sql = "UPDATE People SET name = $name, surname = $surname, dateOfBirth = $dateOfBirth, quotationMarksColor = $quotationMarksColor, job = $job, img = $img, countryCode = $countryCode WHERE id = $id;"
    db.run(sql, {
        $name: person.name,
        $surname: person.surname,
        $dateOfBirth: person.dateOfBirth,
        $quotationMarksColor: person.quotationMarksColor,
        $img: person.img,
        $job: person.job,
        $countryCode: person.countryCode,
        $id: person.id
    })

    close(db);
}

exports.delete = id => {
    const db = connect_dev();
    const sql = `DELETE FROM People WHERE id = ${id};`;
    db.run(sql);
    close(db)
}


exports.getImageUrl = id => {
    const db = connect_dev()

    const sql = `SELECT img FROM People WHERE id = ${id};`
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