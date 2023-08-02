const express = require('express');
const router = express.Router();

const incidents = require("./incidents");
const assets = require("./assets");
const questionnaires = require("./questionnaires");

router.use('/incidents', incidents);
router.use('/assets', assets);
router.use('/questionnaires', questionnaires);

module.exports = router;