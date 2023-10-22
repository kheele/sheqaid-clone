const express = require('express');
const router = express.Router();

const {onScheduleNextDate} = require("./api.js");

router.post('/onScheduleNextDate', async (req, res) => {
    // console.log(req.path, req.body)
    const data = await onScheduleNextDate(req.body);
    res.json(data);
});

// onScheduleNextDate();

module.exports = router;

