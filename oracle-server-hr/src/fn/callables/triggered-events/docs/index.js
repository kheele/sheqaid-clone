const express = require('express');
const router = express.Router();

const {
    uploadDocBankingDetailUpdate,
    uploadDocLivingAddressUpdate,
    uploadDocDocumentUpdate,
} = require("./api.js");

router.put('/uploadDocBankingDetailUpdate', async (req, res) => {
    // console.log(req.path, req.body)
    const data = await uploadDocBankingDetailUpdate(req.body);
    res.json();
});

router.put('/uploadDocLivingAddressUpdate', async (req, res) => {
    // console.log(req.path, req.body)
    const data = await uploadDocLivingAddressUpdate(req.body);
    res.json();
});

router.put('/uploadDocDocumentUpdate', async (req, res) => {
    // console.log(req.path, req.body)
    const data = await uploadDocDocumentUpdate(req.body);
    res.json();
});

module.exports = router;