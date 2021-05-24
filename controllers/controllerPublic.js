const bcrypt = require('bcrypt')
const passport = require('passport')


const initalizePassport = require('../config/passport')
const usersDB = require('./../db/usersDB')
const { ROLE } = require('../config/adminUtils')

const { create, readById, readByEmail } = require('./../db/usersDB')
initalizePassport(
    passport,
    readByEmail,
    readById,
)

exports.get_home = (req, res) => {
    res.render('public/index', {
        user: req.user
    });
}

exports.get_register = (req, res) => {
    res.render('register')
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
        const hashedPassword = await bcrypt.hash(req.body.password, 10) // scrivere cosa è il 10!!?
        create({
            email: req.body.email,
            username: req.body.username,
            password: hashedPassword,
            name: req.body.name,
            surname: req.body.surname,
            dateOfBirth: req.body.dateOfBirth,
            imgUrl: req.body.imgUrl,
            lastSeen: new Date(),
            countryCode: req.body.countryCode,
            role: ROLE.BASIC
        })
        res.redirect('/login')
    } catch { // because is async function
        res.redirect('/register')
    }

}

exports.get_login = (req, res) => {
    res.render('login')
}

exports.logout = (req, res) => {
    req.logOut()
    res.redirect('/login')
}