const express = require('express');
const router = express.Router();

const {
	onUpdateCOIDClaim,
	uploadCOIDClaimWCI2,
	uploadCOIDClaimWCI4,
	uploadCOIDClaimWCI5,
} = require("./api.js");

router.put('/onUpdateCOIDClaim', async (req, res) => {
	// console.log(req.path, req.body)
	const data = await onUpdateCOIDClaim(req.body);
	res.end();
});

router.put('/uploadCOIDClaimWCI2', async (req, res) => {
	// console.log(req.path, req.body)
	const data = await uploadCOIDClaimWCI2(req.body);
	res.end();
});

router.put('/uploadCOIDClaimWCI4', async (req, res) => {
	// console.log(req.path, req.body)
	const data = await uploadCOIDClaimWCI4(req.body);
	res.end();
});

router.put('/uploadCOIDClaimWCI5', async (req, res) => {
	// console.log(req.path, req.body)
	const data = await uploadCOIDClaimWCI5(req.body);
	res.end();
});

module.exports = router;
