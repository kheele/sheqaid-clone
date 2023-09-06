const express = require('express');
const router = express.Router();

const {
	getUserUidByUsername,
	getUserUidByEmail,
	getUserUidByPhone,
	getUserUidAndPasswordByEmail,
} = require('./api.js');

router.post('/getUserUidByUsername', express.text({type: '*/*', limit: "200mb"}), async (req, res) => {
	const data = await getUserUidByUsername(req.body);
	res.json(data);
});

router.post('/getUserUidByEmail', express.text({type: '*/*', limit: "200mb"}), async (req, res) => {
	const data = await getUserUidByEmail(req.body);
	res.json(data);
});

router.post('/getUserUidByPhone', express.text({type: '*/*', limit: "200mb"}), async (req, res) => {
	const data = await getUserUidByPhone(req.body);
	res.json(data);
});

router.post('/getUserUidAndPasswordByEmail', express.text({type: '*/*', limit: "200mb"}), async (req, res) => {
	const data = await getUserUidAndPasswordByEmail(req.body);
	res.json(data);
});

module.exports = router;

