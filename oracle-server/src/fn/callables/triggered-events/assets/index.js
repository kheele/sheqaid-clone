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
	res.json();
});
//x-hasura-user-id: {{$session_variables['x-hasura-user-id']}}
router.put('/uploadAssetDocFilesUpdate', async (req, res) => {
	// console.log(req.path, req.body)
	const data = await uploadAssetDocFilesUpdate(req.body);
	res.json();

	// // const session = req.session;
	// const userId = req.get('x-hasura-user-id');
	// // const userId = session['x-hasura-user-id'];
	// console.log('userId', userId);
	//
	// io.to(userId).emit("insertAssetDoc");
});

router.put('/uploadAssetPurchaseInfoFilesUpdate', async (req, res) => {
	// console.log(req.path, req.body)
	const data = await uploadAssetPurchaseInfoFilesUpdate(req.body);
	res.json();
});

router.put('/uploadAssetMonitoringPlanFuelUsageFilesUpdate', async (req, res) => {
	// console.log(req.path, req.body)
	const data = await uploadAssetMonitoringPlanFuelUsageFilesUpdate(req.body);
	res.json();
});

// automate.run();
// automate.loadFiles('2. License Disc', (data) => {
// 	const lines = data.text_pages[0].split('\n').filter(v => v.isNotEmpty());
// 	const reg_num = lines.find(v => v.contains('Licence number')).split('Licence number')[1].trim().split(' ')[0].replaceAll(' ', '');
// 	const date = lines.find(v => v.contains('Datum')).trim().split('Datum')[0].trim().substring(2).trim().replace(' ', '-');//.trim().split('Vervaldatum')[0].replaceAll(' ', '').replaceAll('--', '-');
// 	const expiry = lines.find(v => v.contains('Date of expiry')).split('Date of expiry')[1].trim().split('Vervaldatum')[0].replaceAll(' ', '').replaceAll('--', '-');
//
// 	data = {reg_num, date: date ? `20${date}`: null, expiry};
// 	return data;
// });
// automate.loadFiles('2. License Disc', (data) => {
// 	const lines = data.text_pages[0].split('\n').filter(v => v.isNotEmpty());
// 	const reg_num = lines.find(v => v.contains('Licence number')).split('Licence number')[1].trim().split(' ')[0].replaceAll(' ', '');
// 	const date = lines.find(v => v.contains('Datum')).trim().split('Datum')[0].trim().substring(2).trim().replace(' ', '-');//.trim().split('Vervaldatum')[0].replaceAll(' ', '').replaceAll('--', '-');
// 	const expiry = lines.find(v => v.contains('Date of expiry')).split('Date of expiry')[1].trim().split('Vervaldatum')[0].replaceAll(' ', '').replaceAll('--', '-');
//
// 	data = {reg_num, date: date ? `20${date}`: null, expiry};
// 	return data;
// });

module.exports = router;