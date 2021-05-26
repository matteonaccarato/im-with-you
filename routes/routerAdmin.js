const express = require('express');
const controllerDashboard = require('../controllers/admin/controllerDashboard');
const controllerProfile = require('../controllers/admin/controllerProfile');
const controllerPhrases = require('../controllers/admin/controllerPhrases');
const controllerPeople = require('../controllers/admin/controllerPeople')
const controllerPosts = require('../controllers/admin/controllerPosts');
const controllerBasics = require('../controllers/admin/users/controllerBasics')
const controllerAdmins = require('../controllers/admin/users/controllerAdmins')

const { ROLE, authUser, authRole } = require('../config/adminUtils');

const router = express.Router();

/* ------------- DASHBOARD ------------- */
router.route('/dashboard')
    .get(controllerDashboard.get_page);


/* ------------- PROFILE  ------------- */
router.route('/profile')
    .get(controllerProfile.get_page)

router.route('/profile/:id')
    .post(controllerProfile.update)


/* ------------- PHRASES  ------------- */
router.route('/phrases')
    .get(controllerPhrases.get_page)

router.route('/phrases/create')
    .get(controllerPhrases.get_create)
    .post(controllerPhrases.create)

router.route('/phrases/:id')
    .get(controllerPhrases.get_update)
    .post(controllerPhrases.update)

router.route('/phrases/delete/:id')
    .delete(controllerPhrases.delete)


/* ------------- PEOPLE ------------- */
router.route('/people')
    .get(controllerPeople.get_page)

router.route('/people/create')
    .get(controllerPeople.get_create)
    .post(controllerPeople.create)

router.route('/people/:id')
    .get(controllerPeople.get_update)
    .post(controllerPeople.update)

router.route('/people/delete/:id')
    .delete(controllerPeople.delete)



/* ------------- POSTS  ------------- */
router.route('/posts')
    .get(controllerPosts.get_page);

router.route('/posts/create')
    .get(controllerPosts.get_create)
    .post(controllerPosts.create);



/* ------------- ADMINS  ------------- */
router.route('/admins')
    .get(controllerAdmins.get_page)

router.route('/admins/create')
    .get(controllerAdmins.get_create)
    .post(controllerAdmins.create)

router.route('/admins/:id')
    .get(controllerAdmins.get_update)
    .post(controllerAdmins.update)

router.route('/admins/delete/:id')
    .delete(controllerAdmins.delete)

/* ------------- USERS  ------------- */
router.route('/users')
    .get(controllerBasics.get_page)


module.exports = router;