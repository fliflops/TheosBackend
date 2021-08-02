'use-strict';
const express = require('express');
const router = express.Router();

//Import API Routes
const booking = require('./booking');
const landingpage = require('./landingpage');
const trip = require('./trip');
const master = require('./master');
const matrix = require('./matrix');
const config = require('./config');
const test = require('./test');


//API Route


router.use('/booking', booking);
router.use('/trip', trip);
router.use('/master', master);
router.use('/matrix',matrix);
router.use('/config',config);
router.use('/test',test);


module.exports = router