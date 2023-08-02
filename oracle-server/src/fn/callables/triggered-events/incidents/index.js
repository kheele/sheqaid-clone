const express = require('express');
const router = express.Router();

const {
	uploadIncidentDocsUpdate,
	uploadIncidentVehicleThirdPartyDocsUpdate,
	uploadIncidentInvestigationDocsUpdate,
} = require("./api.js");

router.put('/uploadIncidentDocsUpdate', async (req, res) => {
	// console.log(req.path, req.body)
	const data = await uploadIncidentDocsUpdate(req.body);
	res.json(data);
});

router.put('/uploadIncidentVehicleThirdPartyDocsUpdate', async (req, res) => {
	// console.log(req.path, req.body)
	const data = await uploadIncidentVehicleThirdPartyDocsUpdate(req.body);
	res.json(data);
});

router.put('/uploadIncidentInvestigationDocsUpdate', async (req, res) => {
	// console.log(req.path, req.body)
	const data = await uploadIncidentInvestigationDocsUpdate(req.body);
	res.json(data);
});

module.exports = router;