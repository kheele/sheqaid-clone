const express = require('express');
const router = express.Router();

const sign = require('./sign.js');

router.use("/sign", sign);

module.exports = router;

