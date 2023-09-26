const updateAssetPhoto = require('../../queries/updateAssetPhoto');
const updateAssetDoc = require('../../queries/updateAssetDoc');
const updateAssetPurchaseInfo = require('../../queries/updateAssetPurchaseInfo');
const updateAssetMonitoringPlanFuelUsage = require('../../queries/updateAssetMonitoringPlanFuelUsage');

// <editor-fold defaultstate="collapsed" desc="uploadAssetPhotoFilesUpdate">
exports.uploadAssetPhotoFilesUpdate = async (body) => {
	const data = getTriggeredEventsData(body, "asset_photos");
	if (!data) {
		return;
	}

	const {new_item} = data;
	let {id, asset_id, doc, is_default,} = new_item;

	console.log('uploadAssetPhotoFilesUpdate', new_item)

	const new_name = `assets/${asset_id}/${id}/photos`;
	await uploadFilesUpdate({id, doc, new_name, onUpdate: updateAssetPhoto});
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="uploadAssetDocFilesUpdate">
exports.uploadAssetDocFilesUpdate = async (body) => {
	const data = getTriggeredEventsData(body, "asset_docs");
	if (!data) {
		return;
	}

	const {new_item} = data;
	let {id, asset_id, doc,} = new_item;

	console.log('uploadAssetDocFilesUpdate', new_item)

	const new_name = `assets/${asset_id}/${id}/docs`;
	await uploadFilesUpdate({id, doc, new_name, onUpdate: updateAssetDoc});
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="uploadAssetPurchaseInfoFilesUpdate">
exports.uploadAssetPurchaseInfoFilesUpdate = async (body) => {
	const data = getTriggeredEventsData(body, "asset_purchase_info");
	if (!data) {
		return;
	}

	const {new_item} = data;
	let {id, warranty_certificate} = new_item;

	console.log('uploadAssetPurchaseInfoFilesUpdate', new_item)

	const new_name = `assets/purchase-info/${id}/warranty-certificate`;
	await uploadFilesUpdate({
		id,
		doc: warranty_certificate,
		key: 'warranty_certificate',
		new_name,
		onUpdate: updateAssetPurchaseInfo
	});
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="uploadAssetMonitoringPlanFuelUsageFilesUpdate">
exports.uploadAssetMonitoringPlanFuelUsageFilesUpdate = async (body) => {
	const data = getTriggeredEventsData(body, "asset_monitoring_plan_fuel_usage");
	if (!data) {
		return;
	}

	const {new_item} = data;
	let {id, monitoring_plan_id, receipt} = new_item;

	console.log('uploadAssetMonitoringPlanFuelUsageFilesUpdate', new_item)

	const new_name = `assets/monitoring-plans/${monitoring_plan_id}/fuel-usage/${id}/receipt`;
	await uploadFilesUpdate({id, doc: receipt, key: 'receipt', new_name, onUpdate: updateAssetMonitoringPlanFuelUsage});
};
// </editor-fold>
