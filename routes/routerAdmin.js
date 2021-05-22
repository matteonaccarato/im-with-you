const express = require('express');
const controllerDashboard = require('../controllers/admin/controllerDashboard');
const controllerPhrases = require('../controllers/admin/controllerPhrases');
const controllerPosts = require('../controllers/admin/controllerPosts');

const router = express.Router();

router.route('/dashboard')
    .get(controllerDashboard.get_page);


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



/* ------------- POSTS  ------------- */
router.route('/posts')
    .get(controllerPosts.get_page);

router.route('/posts/create')
    .get(controllerPosts.get_create)
    .post(controllerPosts.create);

module.exports = router;