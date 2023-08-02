const express = require('express');
const router = express.Router();

const {
	getUserUidByUsername,
	getDecodedIdTokenFromSession,
} = require('./api.js');

router.post('/getUserUidByUsername', express.text({type: '*/*', limit: "200mb"}), async (req, res) => {
	const data = await getUserUidByUsername(req.body);
	res.json(data);
});

router.post('/getDecodedIdTokenFromSession', async (req, res) => {
	const data = await getDecodedIdTokenFromSession(req);
	res.json(data);
});

module.exports = router;

