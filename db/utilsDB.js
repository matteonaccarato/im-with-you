const sqlite3 = require('sqlite3').verbose()

const path = {
    'dev': "./db/im-with-you-dev.db",
    'prod': "./db/im-with-you.db"
}

const connect_dev = () => {
    return connect(path.dev)
}

const connect_prod = () => {
    return connect(path.prod)
}

const connect = path => {
    return new sqlite3.Database(path, err => {
        if (err)
            return console.error(err.message);
        console.log("I'm with you ♥ | Connected to the sqlite DB!");
    });
}

const close = db => {
    db.close(err => {
        if (err)
            console.error(err.message);
        console.log("I'm with you ♥ | Disconnected from the sqlite DB!")
    })
}

module.exports = {
    connect_dev,
    connect_prod,
    close
}