const express = require('express');
const router = express.Router();

const chemicals = require("./chemicals");
const coid_claims = require("./coid-claims");
const ncr = require("./ncr");
const incidents = require("./incidents");
const assets = require("./assets");
const ppeItems = require("./ppe-items");
const ppeTypes = require("./ppe-types");
const questionnaires = require("./questionnaires");

router.use('/chemicals', chemicals);
router.use('/coid-claims', coid_claims);
router.use('/ncr', ncr);
router.use('/incidents', incidents);
router.use('/assets', assets);
router.use('/ppe-items', ppeItems);
router.use('/ppe-types', ppeTypes);
router.use('/questionnaires', questionnaires);

module.exports = router;
