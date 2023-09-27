const express = require('express');
const router = express.Router();

const {
	uploadQuestionnaireFilesUpdate,
	uploadQuestionOptionFilesUpdate,
	createScheduleQuestionnaireUpdate,
	//
	onCreatedQuestionnaire,
	onCreatedQuestionnaireMessage,
	onUpdatedQuestionnaireStatus,
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

router.post('/onCreatedQuestionnaire', async (req, res) => {
	// console.log(req.path, req.body)
	const data = await onCreatedQuestionnaire(req.body);
	res.json(data);
});

router.post('/onCreatedQuestionnaireMessage', async (req, res) => {
	// console.log(req.path, req.body)
	const data = await onCreatedQuestionnaireMessage(req.body);
	res.json(data);
});

router.put('/onUpdatedQuestionnaireStatus', async (req, res) => {
	// console.log(req.path, req.body)
	const data = await onUpdatedQuestionnaireStatus(req.body);
	res.json(data);
});

module.exports = router;