const express = require('express');
const controllerDashboard = require('../controllers/admin/controllerDashboard');
const controllerProfile = require('../controllers/admin/controllerProfile');
const controllerPhrases = require('../controllers/admin/controllerPhrases');
const controllerPeople = require('../controllers/admin/controllerPeople')
const controllerPosts = require('../controllers/admin/controllerPosts');
const controllerBasics = require('../controllers/admin/users/controllerBasics')
const controllerAdmins = require('../controllers/admin/users/controllerAdmins')
const controllerUsers = require('../controllers/admin/users/controllerUsers')

const { ROLE, authUser, authRole } = require('../config/adminUtils');
const { LANGUAGES } = require('../controllers/public/languages/langUtils')

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

router.route('/posts/:id')
    .get(controllerPosts.get_update)
    .post(controllerPosts.update)

router.route('/posts/delete/:id')
    .delete(controllerPosts.delete)



/* ------------- ADMINS  ------------- */
router.route('/admins')
    .get(controllerAdmins.get_page)


/* ------------- BASICS  ------------- */
router.route('/basics')
    .get(controllerBasics.get_page)


/* ------------- USERS  ------------- */
router.route('/users/create')
    .get(controllerUsers.get_create)
    .post(controllerUsers.create)

router.route('/users/:id')
    .get(controllerUsers.get_update)
    .post(controllerUsers.update)

router.route('/users/delete/:id')
    .delete(controllerUsers.delete)


router.get('/*', (req, res) => {
    const rawContents = require('./../views/public/contents.json')
    if (req.user) {
        console.log(req.user.countryCode)
        switch (req.user.countryCode) {
            case LANGUAGES.IT:
                console.log('ciao')
                contents = rawContents[LANGUAGES.IT]['404']
                break;
            default:
                contents = rawContents[LANGUAGES.EN]['404']
        }
    } else contents = rawContents[LANGUAGES.EN]['404']
    console.log(contents)
    res.status(404).render('errors/404', {
        user: req.user,
        ROLE: ROLE,
        language: contents
    })
})




module.exports = router;