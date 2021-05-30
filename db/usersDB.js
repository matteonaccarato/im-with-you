const { connect_dev, connect_prod, close } = require('./utilsDB')

const TABLE = "Users"

const FIELDS = {
    'ID': 'id',
    'EMAIL': 'email',
    'USERNAME': 'username'
}


const readGeneric = (field = '', value = -1) => {
    const db = connect_dev();
    const sql = 'SELECT * FROM Users' + ((field != '') ? ` WHERE ${field} = ${value}` : '') + ';';
    console.log(sql)
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

const readByRole = (role, id = -1 /* , callback */ ) => {
    const db = connect_dev();
    const sql = `SELECT * FROM Users WHERE role = '${role}'` + ((id > -1) ? ` AND Users.id = ${id}` : "") + ";";

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

const create = user => {
    const db = connect_dev();
    const sql = "INSERT INTO Users VALUES (null, $email, $username, $password, $name, $surname, $yearOfBirth, $monthOfBirth, $dayOfBirth, $img, $countryCode, $yearOfLastSeen, $monthOfLastSeen, $dayOfLastSeen, $role);"

    console.log(user)

    db.run(sql, {
        $email: user.email,
        $username: user.username,
        $password: user.password,
        $name: user.name,
        $surname: user.surname,
        $yearOfBirth: user.yearOfBirth,
        $monthOfBirth: user.monthOfBirth,
        $dayOfBirth: user.dayOfBirth,
        $img: user.img,
        $yearOfLastSeen: user.yearOfLastSeen,
        $monthOfLastSeen: user.monthOfLastSeen,
        $dayOfLastSeen: user.dayOfLastSeen,
        $countryCode: user.countryCode,
        $role: user.role,
    })

    close(db);
}

const update = user => {
    const db = connect_dev();

    const sql = "UPDATE Users SET email = $email," + ((user.password != '') ? ` password = '${user.password}', ` : "") + "username = $username, name = $name, surname = $surname, yearOfBirth = $yearOfBirth, monthOfBirth = $monthOfBirth, dayOfBirth = $dayOfBirth, img = $img, yearOfLastSeen = $yearOfLastSeen, monthOfLastSeen = $monthOfLastSeen, dayOfLastSeen = $dayOfLastSeen, countryCode = $countryCode, role = $role WHERE id = $id;"
    console.log(sql)
    db.run(sql, {
        $email: user.email,
        $username: user.username,
        $name: user.name,
        $surname: user.surname,
        $yearOfBirth: user.yearOfBirth,
        $monthOfBirth: user.monthOfBirth,
        $dayOfBirth: user.dayOfBirth,
        $img: user.img,
        $yearOfLastSeen: user.yearOfLastSeen,
        $monthOfLastSeen: user.monthOfLastSeen,
        $dayOfLastSeen: user.dayOfLastSeen,
        $countryCode: user.countryCode,
        $role: user.role,
        $id: user.id
    })

    close(db);
}

const updateLastSeen = id => {
    const db = connect_dev();

    const date = new Date().toISOString().split('T')[0] // 2021-05-26T21:53:36.244Z
    const sql = "UPDATE Users SET yearOfLastSeen = $yearOfLastSeen, monthOfLastSeen = $monthOfLastSeen, dayOfLastSeen = $dayOfLastSeen WHERE id = $id;"
    db.run(sql, {
        $yearOfLastSeen: date.split('-')[0],
        $monthOfLastSeen: date.split('-')[1],
        $dayOfLastSeen: date.split('-')[2],
        $id: id
    })
    console.log('Last seen updated!')

    close(db)
}

const deleteUser = async id => {
    const db = connect_dev();
    const sql = `DELETE FROM Users WHERE id = ${id};`;
    db.run(sql);
    close(db)
}

const getCount = role => {
    const db = connect_dev();
    const sql = `SELECT COUNT(username) as nUsers FROM Users WHERE role = '${role}'`
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
                    nUsers: value.nUsers
                }
                resolve(responseObj)
            }
            close(db)
        })
    })
}

const getUsersActiveToday = () => {
    const db = connect_dev()
    const sql = "SELECT yearOfLastSeen, monthOfLastSeen, dayOfLastSeen FROM Users;"
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
                    rows: rows,
                    nActive: 0,
                    nUsers: rows.length
                };
                const today = new Date()
                responseObj.rows.forEach(row => {
                    // if lastSeen == today
                    if (row.dayOfLastSeen == today.getDate() && row.monthOfLastSeen == (today.getMonth() + 1) && row.yearOfLastSeen == today.getFullYear()) {
                        responseObj.nActive++
                    }
                })
                resolve(responseObj);
            }
            close(db)
        })
    })
}


const getImageUrl = id => {
    const db = connect_dev()

    const sql = `SELECT img FROM Users WHERE id = ${id};`
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


const checkUniquedField = async(field, value) => {
    const db = connect_dev();
    const sql = `SELECT COUNT(id) as nUsers FROM Users WHERE ${field} = '${value}';`
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
                    isValid: (value.nUsers != 0) ? false : true
                }
                resolve(responseObj)
            }
            close(db)
        })
    })
}


const checkEmailValid = async email => {
    return (await checkUniquedField(FIELDS.EMAIL, email)).isValid
}

const checkUsernameValid = async username => {
    return (await checkUniquedField(FIELDS.USERNAME, username)).isValid
}



const checkUniqueFields = async(email, username) => {
    const db = connect_dev();
    const sql = `SELECT COUNT(id) as nUsers FROM Users WHERE email = '${email}' OR username = '${username}';`
    return new Promise((resolve, reject) => {
        var responseObj
        db.get(sql, (err, value) => {
            if (err) {
                responseObj = {
                    'error': err
                }
                reject(responseObj)
            } else {
                console.log(sql)
                console.log(value)
                responseObj = {
                    statement: this,
                    isValid: (value.nUsers != 0) ? false : true
                }
                resolve(responseObj)
            }
            close(db)
        })
    })
}



// for passport
const read = async(field, value, callback) => {
    const db = connect_dev();
    const sql = `SELECT * FROM Users WHERE ${field} = ${value}`;
    db.get(sql, (err, row) => {
        callback(row)
        close(db)
    })
}

const readById = async(id, callback) => {
    read(FIELDS.ID, id, callback)
}

const readByEmail = async(email, callback) => [
    read(FIELDS.EMAIL, `'${email}'`, callback)
]


module.exports = {
    TABLE,
    FIELDS,
    create,
    readById,
    readByEmail,
    readByRole,
    readGeneric,
    getCount,
    getUsersActiveToday,
    getImageUrl,
    update,
    updateLastSeen,
    deleteUser,
    checkUniqueFields,
    checkEmailValid,
    checkUsernameValid
}