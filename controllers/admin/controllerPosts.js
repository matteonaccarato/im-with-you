const sqlite3 = require('sqlite3');

exports.get_page = (req, res) => {
    //db.serialize()

    res.render('admin/posts/all');
}

exports.get_create = (req, res) => {

    const db = new sqlite3.Database('./db/im-with-you-dev.db', err => {
        if (err)
            return console.error(err.message);
        console.log(`I'm with you ♥ | Connected to the sqlite DB!`);
    });

    let quotedBy = [{
        "id": "1",
        "name": "Charles",
        "surname": "Leclerc"
    }];
    let sql = "SELECT name, surname, dateOfBirth, quotationMarksColor, job, countryCode FROM People;";

    res.render('admin/posts/createPost', {

    })
}

exports.create = (req, res) => {
    console.log('ciao');
    console.log(req.body)
}