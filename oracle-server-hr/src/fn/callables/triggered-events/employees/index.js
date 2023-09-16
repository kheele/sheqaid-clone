const express = require('express');
const router = express.Router();

const {
	uploadProfileImageUpdate,
} = require("./api.js");

router.put('/uploadProfileImageUpdate', async (req, res) => {
	// console.log(req.path, req.body)
	const data = await uploadProfileImageUpdate(req.body);
	res.json(data);
});

module.exports = router;