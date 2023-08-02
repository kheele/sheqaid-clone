const express = require('express');
const router = express.Router();

const {
	uploadQuestionnaireFilesUpdate,
	uploadQuestionOptionFilesUpdate,
	createScheduleQuestionnaireUpdate,
} = require("./api.js");

router.put('/uploadQuestionnaireFilesUpdate', async (req, res) => {
	// console.log(req.path, req.body)
	const data = await uploadQuestionnaireFilesUpdate(req.body);
	res.json(data);
});

router.put('/uploadQuestionOptionFilesUpdate', async (req, res) => {
	// console.log(req.path, req.body)
	const data = await uploadQuestionOptionFilesUpdate(req.body);
	res.json(data);
});

router.put('/createScheduleQuestionnaireUpdate', async (req, res) => {
	// console.log(req.path, req.body)
	const data = await createScheduleQuestionnaireUpdate(req.body);
	res.json(data);
});

module.exports = router;