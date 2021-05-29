const express = require('express');
const passport = require('passport')
const controllerPublic = require('../controllers/controllerPublic');
const { ROLE, checkRole, checkAuthenticated, checkNotAuthenticated } = require('../config/adminUtils')
const { updateLastSeen } = require('../db/usersDB')

const router = express.Router();

router.route('/')
    .get( /* checkAuthenticated, */ controllerPublic.get_home);


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

module.exports = router;