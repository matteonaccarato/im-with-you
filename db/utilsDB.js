const sqlite3 = require('sqlite3').verbose()

const path = {
    'dev': "./db/im-with-you-dev.db",
    'prod': "./db/im-with-you.db"
}

const SALT_ROUNDS = 10 // for brcypt.hash(plainText, saltRounds)

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
    });
}

const close = db => {
    db.close(err => {
        if (err)
            console.error(err.message);
    })
}

const internalError = (res, code, message) => {
    res.render('errors/error', {
        code: code,
        message: message
    })
}

module.exports = {
    connect_dev,
    connect_prod,
    close,
    SALT_ROUNDS,
    internalError
}