const sqlite3 = require('sqlite3').verbose();
/* const connect = require('./dbUtils') */
/* const sqls = {
    countPosts: 'SELECT COUNT(username) AS nUsers FROM Users;',
    countUsers: 'SELECT COUNT(id) AS nPosts FROM Posts;'
} */

// aggiungere dbUtils
const { ROLE } = require('./../../config/adminUtils')

exports.get_page = (req, res) => {

    const db = new sqlite3.Database('./db/im-with-you-dev.db', err => {
        if (err)
            return console.error(err.message);
        console.log(`I'm with you ♥ | Connected to the sqlite DB!`);
    });

    // first row only
    let nPosts = -1;
    let nUsers = -1;
    let sql = "SELECT COUNT(id) AS nPosts FROM Posts;"
    db.get(sql, (err, row) => {
        if (err)
            return console.error(err.message);
        nPosts = row.nPosts;

        sql = `SELECT COUNT(username) AS nUsers FROM Users WHERE role = '${ROLE.BASIC}'`;
        db.get(sql, (err, row) => {
            if (err)
                return console.error(err.message);

            nUsers = row.nUsers;

            sql = `SELECT COUNT(username) as nAdmins FROM Users WHERE role = '${ROLE.ADMIN}'`;
            db.get(sql, (err, row) => {


                nAdmins = row.nAdmins;


                sql = "SELECT COUNT(id) AS nPhrases FROM Phrases;";
                db.get(sql, (err, row) => {

                    nPhrases = row.nPhrases;

                    res.render('admin/dashboard', {
                        number_phrases: nPhrases,
                        number_admins: nAdmins,
                        number_posts: nPosts,
                        number_users: nUsers,
                        user: req.user
                    });
                })
            })


        })
    })
    db.close();
}