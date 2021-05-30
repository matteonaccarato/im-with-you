const express = require('express');
const passport = require('passport')
const controllerPublic = require('../controllers/public/controllerPublic');
const { ROLE, checkRole, checkAuthenticated, checkNotAuthenticated } = require('../config/adminUtils')
const { updateLastSeen } = require('../db/usersDB')
const { LANGUAGES } = require('../controllers/public/languages/langUtils')

const router = express.Router();

router.route('/')
    .get(controllerPublic.get_home);

router.route('/phrases')
    .get(controllerPublic.get_phrases)

router.route('/posts')
    .get(controllerPublic.get_posts)



router.route('/save/post/:id')
    .post(checkAuthenticated, controllerPublic.save_post)

router.route('/unsave/post/:id')
    .delete(checkAuthenticated, controllerPublic.unsave_post)


router.route('/save/phrase/:id')
    .post(checkAuthenticated, controllerPublic.save_phrase)

router.route('/unsave/phrase/:id')
    .delete(checkAuthenticated, controllerPublic.unsave_phrase)


router.route('/saved')
    .get(checkAuthenticated, controllerPublic.get_saved)


// maybe li metto in un controller a parte
router.route('/register')
    .get(checkNotAuthenticated, controllerPublic.get_register)
    .post(checkNotAuthenticated, controllerPublic.register)

router.route('/login')
    .get(checkNotAuthenticated, controllerPublic.get_login)
    .post(checkNotAuthenticated, passport.authenticate('local', {
        // successRedirect: '/',
        successRedirect: '/landing',
        failureRedirect: '/login',
        failureFlash: true
    }))

router.route('/logout')
    .delete(controllerPublic.logout)


router.route('/landing')
    .get(checkAuthenticated, (req, res) => {
        /* (req.user.role === ROLE.ADMIN) ? 'admin/landing' : 'public/index' */
        updateLastSeen(req.user.id)
        req.flash('info', 'Login effettuato correttamente')
        if (req.user.role === ROLE.ADMIN) {
            res.render('admin/landing', {
                user: req.user
            })
        } else {
            res.redirect('/')
        }
    })


/* router.get('/*', (req, res) => {
    const rawContents = require('../views/public/contents.json')
    if (req.user) {
        switch (req.user.countryCode) {
            case LANGUAGES.IT:
                contents = rawContents[LANGUAGES.IT]['/*']
                break;
            default:
                contents = rawContents[LANGUAGES.EN]['/*']
        }
    } else contents = rawContents[LANGUAGES.EN]['/*']
    res.status(404).render('errors/404', {
        user: req.user,
        ROLE: ROLE,
        language: contents
    })
}) */


module.exports = router;