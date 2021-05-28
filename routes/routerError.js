const express = require('express')
const controllerError = require('./../controllers/controllerError')
const router = express.Router()

router.route('/:code')
    .get(controllerError.get_page)

module.exports = router