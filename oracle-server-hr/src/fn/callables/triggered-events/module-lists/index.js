const express = require('express');
const router = express.Router();

const {
	uploadDocsUpdate,
} = require("./api.js");

router.put('/uploadDocsUpdate', async (req, res) => {
	// console.log(req.path, req.body)
	const data = await uploadDocsUpdate(req.body);
	res.json(data);

	const session = req.session;
	io.to(session.id).emit("insertEmployee", req.path);
});

module.exports = router;