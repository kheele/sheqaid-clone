const express = require('express');
const router = express.Router();

const {
    sendWelcomeEmail,
    sendWelcomeOTP,
    sendNewContractorSiteEmail,
    sendUpdateStatusContractorSiteEmail,
    onResetPassword,
} = accountsApi;

const CustomUserClaims = require('./CustomUserClaims.js');
const sign = require('./sign.js');

router.use("/onSetCustomUserClaims", CustomUserClaims);

router.use("/sign", sign);

router.post('/sendWelcomeEmail', async (req, res) => {
    const data = await sendWelcomeEmail(req.body);
    res.json(data);
});

router.post('/sendWelcomeOTP', async (req, res) => {
    const data = await sendWelcomeOTP(req.body);
    res.json(data);
});

router.post('/sendNewContractorSiteEmail', async (req, res) => {
    const data = await sendNewContractorSiteEmail(req.body);
    res.json(data);
});

router.post('/sendUpdateStatusContractorSiteEmail', async (req, res) => {
    const data = await sendUpdateStatusContractorSiteEmail(req.body);
    res.json(data);
});

router.post('/onResetPassword', async (req, res) => {
    const {access_type} = req.params;
    if (isValidAccessType(access_type)) {
        const data = await onResetPassword(req.body, access_type);
        res.json(data);
    } else {

    }
});


module.exports = router;

