const bcrypt = require('bcrypt')
const passport = require('passport')

const initalizePassport = require('../../config/passport')
    /* const usersDB = require('../../db/usersDB') */
const phrasesDB = require('../../db/phrasesDB')
const postsDB = require('../../db/postsDB')
const savesDB = require('../../db/savesDB')
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

const getContents = (user, page) => {
    const rawContents = require('../../views/public/contents.json')
    if (user) {
        switch (user.countryCode) {
            case LANGUAGES.IT:
                contents = rawContents[LANGUAGES.IT][page]
                break;
            default:
                contents = rawContents[LANGUAGES.EN][page]
        }
    } else contents = rawContents[LANGUAGES.EN][page]

    return contents;
}

exports.get_home = (req, res) => {
    const contents = getContents(req.user, PAGES['/'])
    res.render('public/index', {
        user: req.user,
        ROLE: ROLE,
        language: contents
    });
}


exports.get_phrases = async(req, res) => {
    const contents = getContents(req.user, PAGES['/phrases'])

    try {
        const phrases = (await phrasesDB.read(phrasesDB.FIELDS.ISFINISHED, 1)).rows

        let likedByUser
        if (req.user) {
            const tmp = (await savesDB.likedByUser(savesDB.SAVES_TBLS.PHRASE, req.user.id)).rows
            likedByUser = tmp.map(obj => obj.contentId)
            console.log(likedByUser)

            phrases.map(phrase => {

                /* if (likedByUser.includes(phrase.id)) {
                    return phrase.liked = true
                } else return phrase.liked = false */

                return phrase.liked = likedByUser.includes(phrase.id)

                /* likedByUser.forEach(liked => {
                    if (phrase.id === liked.contentId) {
                        phrase.liked = phrase.id === liked.contentId;
                        return phrase
                    }
                })
                return phrase */
            })
        }

        console.log(phrases)




        res.render('public/phrases', {
            user: req.user,
            ROLE: ROLE,
            language: contents,
            phrases: phrases
        })
    } catch (err) {
        res.render('errors/error', {
            code: 500,
            message: 'Internal error',
            user: req.user
        })
    }

}

exports.get_posts = async(req, res) => {
    const contents = getContents(req.user, PAGES['/posts'])
    const posts = (await postsDB.read(postsDB.FIELDS.ISFINISHED, 1)).rows

    res.render('public/posts', {
        user: req.user,
        ROLE: ROLE,
        language: contents,
        posts: posts
    })
}


exports.save_phrase = (req, res) => {
    savesDB.create(savesDB.SAVES_TBLS.PHRASE, req.params.id, req.user.id)
    res.status(200).redirect('/phrases')
}

exports.unsave_phrase = (req, res) => {
    savesDB.delete(savesDB.SAVES_TBLS.PHRASE, req.params.id, req.user.id)
    res.status(200).redirect('/phrases')
        /* res.status(200).redirect('/saved') */
}

exports.save_post = (req, res) => {
    savesDB.create(savesDB.SAVES_TBLS.POST, req.params.id, req.user.id)
    res.status(200).redirect('/posts')
}

exports.unsave_post = (req, res) => {
    savesDB.delete(savesDB.SAVES_TBLS.POST, req.params.id, req.user.id)
    res.status(200).redirect('/posts')
        /* res.status(200).redirect('/saved') */
}

exports.get_saved = async(req, res) => {
    const contents = getContents(req.user, PAGES['/saved'])
    try {
        const phrasesSaved = (await savesDB.read(savesDB.SAVES_TBLS.PHRASE, req.user.id)).rows
        const postsSaved = (await savesDB.read(savesDB.SAVES_TBLS.POST, req.user.id)).rows

        console.log(phrasesSaved)
        console.log(postsSaved)

        res.render('public/saved', {
            user: req.user,
            ROLE: ROLE,
            language: contents,
            phrases: phrasesSaved,
            posts: postsSaved
        })
    } catch (err) {
        res.render('errors/error', {
            code: 500,
            message: 'Internal error',
            user: req.user
        })
    }
}



exports.get_register = (req, res) => {
    const contents = getContents(req.user, PAGES['/register'])
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
    const contents = getContents(req.user, PAGES['/login'])
    res.render('login', {
        user: req.user,
        language: contents
    })
}

exports.logout = (req, res) => {
    if (req.user) {
        updateLastSeen(req.user.id)
    }
    req.flash('info', 'Logout completato con successo')
    req.logOut()
    res.redirect('/login')
}