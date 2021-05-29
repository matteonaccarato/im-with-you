const bcrypt = require('bcrypt')
const passport = require('passport')

const initalizePassport = require('../../config/passport')
const usersDB = require('../../db/usersDB')
const { updateLastSeen } = require('../../db/usersDB')
const { ROLE } = require('../../config/adminUtils')
const { SALT_ROUNDS } = require('../../db/utilsDB')
const { PAGES, LANGUAGES } = require('./languages/langUtils')

const { create, readById, readByEmail, checkUniqueFields } = require('../../db/usersDB')
initalizePassport(
    passport,
    readByEmail,
    readById,
)

const getContents = user => {
    const rawContents = require('../../views/public/contents.json')
    if (user) {
        switch (user.countryCode) {
            case LANGUAGES.IT:
                contents = rawContents[LANGUAGES.IT][PAGES['/']]
                break;
            default:
                contents = rawContents[LANGUAGES.EN][PAGES['/']]
        }
    } else contents = rawContents[LANGUAGES.EN][PAGES['/']]

    return contents;
}

exports.get_home = (req, res) => {
    const contents = getContents(req.user)
    res.render('public/index', {
        user: req.user,
        ROLE: ROLE,
        language: contents
    });
}

exports.get_register = (req, res) => {
    const contents = getContents(req.user)
    res.render('register', {
        user: req.user,
        language: contents
    })
}


/*

let date_ob = new Date();

// adjust 0 before single digit date
let date = ("0" + date_ob.getDate()).slice(-2);

// current month
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

// current year
let year = date_ob.getFullYear();

// current hours
let hours = date_ob.getHours();

// current minutes
let minutes = date_ob.getMinutes();

// current seconds
let seconds = date_ob.getSeconds();

// prints date & time in YYYY-MM-DD HH:MM:SS format
console.log(year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);

*/

exports.register = async(req, res) => {
    try {
        const lastSeen = new Date().toISOString().split('T')[0] // 2021-05-26T21:53:36.244Z
        const hashedPassword = await bcrypt.hash(req.body.password, SALT_ROUNDS) // scrivere cosa è il 10!!?

        const usernameEmailValid = (await checkUniqueFields(req.body.email, req.body.username)).isValid
        if (usernameEmailValid) {
            create({
                email: req.body.email,
                username: req.body.username,
                password: hashedPassword,
                name: req.body.name,
                surname: req.body.surname,
                dateOfBirth: req.body.dateOfBirth,
                img: '',
                yearOfLastSeen: lastSeen.split('-')[0],
                monthOfLastSeen: lastSeen.split('-')[1],
                dayOfLastSeen: lastSeen.split('-')[2],
                countryCode: '',
                role: ROLE.BASIC
            })
            req.flash('info', 'Registrazione completata con successo')
            res.redirect('/login')
        } else {
            req.flash('error', 'Qualcuno ha già utilizzato questa email o questo username')
            res.redirect('/register')
        }
    } catch { // because is async function
        res.redirect('/register')
    }
}

exports.get_login = (req, res) => {
    const contents = getContents(req.user)
    res.render('login', {
        user: req.user,
        language: contents
    })
}

exports.logout = (req, res) => {
    updateLastSeen(req.user.id)
    req.flash('info', 'Logout completato con successo')
    req.logOut()
    res.redirect('/login')
}