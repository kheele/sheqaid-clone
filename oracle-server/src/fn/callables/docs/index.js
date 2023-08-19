const express = require('express');
const router = express.Router();

const {
	createDoc,
	editDoc,
	editDocTitle,
	updateDocUpload,
	removeDoc,
	viewDoc,
} = require('./api.js');

router.post('/create', async (req, res) => {
	const data = await createDoc(req.body);
	res.json(data);
});

router.post('/edit', async (req, res) => {
	const data = await editDoc(req.body);
	res.json(data);
});

router.post('/edit-title', async (req, res) => {
	const data = await editDocTitle(req.body);
	res.json(data);
});

router.post('/update-upload', async (req, res) => {
	const data = await updateDocUpload(req.body);
	res.json(data);
});

router.post('/remove', async (req, res) => {
	const data = await removeDoc(req.body);
	res.json(data);
});

router.post('/view', async (req, res) => {
	const data = await viewDoc(req.body);
	res.json(data);
});

module.exports = router;

