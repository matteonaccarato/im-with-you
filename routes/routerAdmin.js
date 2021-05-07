const express = require('express');
const controllerDashboard = require('../controllers/admin/controllerDashboard');
const controllerPhrases = require('../controllers/admin/controllerPhrases');

const router = express.Router();

router.route('/dashboard')
    .get(controllerDashboard.get_page);

router.route('/phrases')
    .get(controllerPhrases.get_page)

module.exports = router;