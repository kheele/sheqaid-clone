const express = require('express');
const router = express.Router();

const {
	uploadDocUpdate,
} = require("./api.js");

router.put('/uploadDocumentVersionUpdate', async (req, res) => {
	// console.log(req.path, req.body)
	const data = await uploadDocUpdate(req.body);
	res.json();
});

module.exports = router;
