const express = require('express');
const controllerPublic = require('../controllers/controllerPublic');

const router = express.Router();

router.route('/')
    .get(controllerPublic.get_home);

module.exports = router;