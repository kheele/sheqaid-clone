const express = require('express');
const router = express.Router();

const {
    onSetCustomUserClaims,
} = require('./api.js');

router.post('/', async (req, res) => {
    const decodedIdToken = await loginSession({req, res});
    console.log(`/ContractorUser decodedIdToken`, decodedIdToken)
    if(!decodedIdToken) return;

    const data = await onSetCustomUserClaims(req.body, decodedIdToken);
    res.json(data);
});

module.exports = router;
