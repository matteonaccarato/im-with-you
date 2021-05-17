const sqlite3 = require('sqlite3').verbose();
/* const connect = require('./dbUtils') */
/* const sqls = {
    countPosts: 'SELECT COUNT(username) AS nUsers FROM Users;',
    countUsers: 'SELECT COUNT(id) AS nPosts FROM Posts;'
} */

exports.get_page = (req, res) => {

    const db = new sqlite3.Database('./db/im-with-you-dev.db', err => {
        if (err)
            return console.error(err.message);
        console.log(`I'm with you ♥ | Connected to the sqlite DB!`);
    });

    // first row only
    let nPosts = -1;
    let nUsers = -1;
    let sql = 'SELECT COUNT(id) AS nPosts FROM Posts;'
    db.get(sql, (err, row) => {
        if (err)
            return console.error(err.message);
        nPosts = row.nPosts;

        sql = 'SELECT COUNT(username) AS nUsers FROM Users;'
        db.get(sql, (err, row) => {
            if (err)
                return console.error(err.message);

            nUsers = row.nUsers;
            res.render('admin/dashboard', {
                number_posts: nPosts,
                number_users: nUsers
            });
        })
    })
    db.close();
}