const express = require('express');
const router = express.Router();

const {
    uploadDocsUpdate,
} = require("./api.js");

router.put('/uploadDocsUpdate', async (req, res) => {
    // console.log(req.path, req.body)
    const data = await uploadDocsUpdate(req, req.body);
    res.json();
});

module.exports = router;