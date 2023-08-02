const express = require('express');
const router = express.Router();

const {
	uploadNCRDocsUpdate,
} = require("./api.js");

router.put('/uploadNCRDocsUpdate', async (req, res) => {
	// console.log(req.path, req.body)
	const data = await uploadNCRDocsUpdate(req.body);
	res.json(data);
});

module.exports = router;