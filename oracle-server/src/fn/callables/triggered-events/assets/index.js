const express = require('express');
const router = express.Router();

const automate = require('./automate');

const {
	uploadAssetPhotoFilesUpdate,
	uploadAssetDocFilesUpdate,
	uploadAssetPurchaseInfoFilesUpdate,
	uploadAssetMonitoringPlanFuelUsageFilesUpdate,
} = require("./api.js");

router.put('/uploadAssetPhotoFilesUpdate', async (req, res) => {
	// console.log(req.path, req.body)
	const data = await uploadAssetPhotoFilesUpdate(req.body);
	res.json(data);
});

router.put('/uploadAssetDocFilesUpdate', async (req, res) => {
	// console.log(req.path, req.body)
	const data = await uploadAssetDocFilesUpdate(req.body);
	res.json(data);
});

router.put('/uploadAssetPurchaseInfoFilesUpdate', async (req, res) => {
	// console.log(req.path, req.body)
	const data = await uploadAssetPurchaseInfoFilesUpdate(req.body);
	res.json(data);
});

router.put('/uploadAssetMonitoringPlanFuelUsageFilesUpdate', async (req, res) => {
	// console.log(req.path, req.body)
	const data = await uploadAssetMonitoringPlanFuelUsageFilesUpdate(req.body);
	res.json(data);
});

automate.run();

module.exports = router;