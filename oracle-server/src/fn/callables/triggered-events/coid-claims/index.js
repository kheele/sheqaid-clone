const express = require('express');
const router = express.Router();

const {
	onUpdateCOIDClaim,
} = require("./api.js");

router.put('/onUpdateCOIDClaim', async (req, res) => {
	// console.log(req.path, req.body)
	const data = await onUpdateCOIDClaim(req.body);
	res.end();
});

module.exports = router;
