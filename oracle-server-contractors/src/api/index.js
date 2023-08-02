const express = require('express');
const router = express.Router();
const callables = require('../fn/callables');

router.use('/callables', callables);

module.exports = router;