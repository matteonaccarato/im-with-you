const express = require('express');
const controllerDashboard = require('../controllers/admin/controllerDashboard');
const controllerPhrases = require('../controllers/admin/controllerPhrases');
const controllerPeople = require('../controllers/admin/controllerPeople')
const controllerPosts = require('../controllers/admin/controllerPosts');

const { ROLE, authUser, authRole } = require('../config/adminUtils');

const router = express.Router();

router.route('/dashboard')
    .get(controllerDashboard.get_page);
/* .get(authUser, authRole(ROLE.ADMIN), controllerDashboard.get_page); */


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

module.exports = router;