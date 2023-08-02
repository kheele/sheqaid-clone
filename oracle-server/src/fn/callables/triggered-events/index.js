const express = require('express');
const router = express.Router();

const ncr = require("./ncr");
const incidents = require("./incidents");
const assets = require("./assets");
const questionnaires = require("./questionnaires");

router.use('/ncr', ncr);
router.use('/incidents', incidents);
router.use('/assets', assets);
router.use('/questionnaires', questionnaires);

module.exports = router;