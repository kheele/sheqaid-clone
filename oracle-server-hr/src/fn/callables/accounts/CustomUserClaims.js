const express = require('express');
const router = express.Router();

const {
    onSetCustomUserClaims,
} = require('./api.js');

router.post('/User', async (req, res) => {
    const access_type = "User";
    const decodedIdToken = await loginSession({req, res, access_type});
    console.log(`/${access_type} decodedIdToken`, decodedIdToken)
    if(!decodedIdToken) return;

    const data = await onSetCustomUserClaims(req.body, decodedIdToken, access_type);
    console.log('/User data', data)
    res.json(data);
});

router.post('/ContractorUser', async (req, res) => {
    const access_type = "ContractorUser";
    const decodedIdToken = await loginSession({req, res, access_type});
    console.log(`/${access_type} decodedIdToken`, decodedIdToken)
    if(!decodedIdToken) return;

    const data = await onSetCustomUserClaims(req.body, decodedIdToken, access_type);
    res.json(data);
});

router.post('/Staff', async (req, res) => {
    const access_type = "Staff";
    const decodedIdToken = await loginSession({req, res, access_type});
    console.log(`/${access_type} decodedIdToken`, decodedIdToken)
    if(!decodedIdToken) return;

    const data = await onSetCustomUserClaims(req.body, decodedIdToken, access_type);
    res.json(data);
});

module.exports = router;

