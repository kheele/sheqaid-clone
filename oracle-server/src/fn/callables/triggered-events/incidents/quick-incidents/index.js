const express = require('express');
const router = express.Router();

const {
	sendNewQuickIncidentNotification,
} = require("./api.js");

router.post('/sendNewQuickIncidentNotification', async (req, res) => {
	// console.log(req.path, req.body)
	const data = await sendNewQuickIncidentNotification(req.body);
	res.json(data);
});

module.exports = router;