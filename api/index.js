'use-strict';
const express = require('express');
const router = express.Router();

//Import API Routes


const matrix = require('./matrix');
const config = require('./config');


//API Route

router.use('/matrix',matrix);
router.use('/config',config);

module.exports = router