const express = require('express');
const router = express.Router();

const {onEmployeesExpiry} = require("./api.js");

router.post('/onEmployeesExpiry', async (req, res) => {
    // console.log(req.path, req.body)
    // const data = await onEmployeesExpiry(req.body);
    // res.json(data);
});

module.exports = router;

