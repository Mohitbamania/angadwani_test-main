const express = require('express');
const router = express.Router();

const userRouting = require('./user.routing');

router.use('/user', userRouting);

module.exports = router;
