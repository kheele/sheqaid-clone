const express = require('express');
const router = express.Router();

ohs_docs = require("./ohs-docs");

const {
	uploadDocUpdate,
} = require("./api.js");

router.put('/uploadDocumentVersionUpdate', async (req, res) => {
	// console.log(req.path, req.body)
	const data = await uploadDocUpdate(req.body);
	res.json();
});

router.use('/ohs-docs', ohs_docs);

module.exports = router;
