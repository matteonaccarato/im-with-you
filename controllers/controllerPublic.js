const bcrypt = require('bcrypt')
const passport = require('passport')

/* const initalizePassport = require('../config/passport')
initalizePassport(
    passport,
    email => users.find(user => user.email === email)
) */

const initalizePassport = require('../config/passport')
initalizePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)

const users = []

exports.get_home = (req, res) => {
    res.render('public/index', {
        name: req.user.name
    });
}

exports.get_register = (req, res) => {
    res.render('register')
}

exports.register = async(req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10) // scrivere cosa è il 10
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        res.redirect('/login')
    } catch { // because is async function
        res.redirect('/register')
    }

    /* console.log(users) */
}

exports.get_login = (req, res) => {
    res.render('login')
}

exports.logout = (req, res) => {
    req.logOut()
    res.redirect('/login')
}

/* exports.login = () */