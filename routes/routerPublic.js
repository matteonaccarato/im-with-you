const express = require('express');
const passport = require('passport')
const controllerPublic = require('../controllers/controllerPublic');
const { checkAuthenticated, checkNotAuthenticated } = require('../config/adminUtils')

const router = express.Router();

router.route('/')
    .get(checkAuthenticated, controllerPublic.get_home);


// maybe li metto in un controller a parte
router.route('/register')
    .get(checkNotAuthenticated, controllerPublic.get_register)
    .post(checkNotAuthenticated, controllerPublic.register)

router.route('/login')
    .get(checkNotAuthenticated, controllerPublic.get_login)
    .post(checkNotAuthenticated, passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    }))

router.route('/logout')
    .delete(controllerPublic.logout)

module.exports = router;