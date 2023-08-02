const updateAssetPhoto = require('../../queries/updateAssetPhoto');
const updateAssetDoc = require('../../queries/updateAssetDoc');
const updateAssetPurchaseInfo = require('../../queries/updateAssetPurchaseInfo');
const updateAssetMonitoringPlanFuelUsage = require('../../queries/updateAssetMonitoringPlanFuelUsage');

// <editor-fold defaultstate="collapsed" desc="uploadAssetPhotoFilesUpdate">
exports.uploadAssetPhotoFilesUpdate = async (body) => {
	// await authorize();

	if (!body || !body.data || !body.data.table) {
		return;
	}

	const {
		table: {
			table_name,//asset_photos
			schema,
			old_item,
			new_item,
		}
	} = body.data;

	if (schema !== "public" || table_name !== "asset_photos" || !new_item) {
		return;
	}

	let {id, asset_id, doc, is_default,} = new_item;

	console.log('uploadAssetPhotoFilesUpdate', new_item)

	const attrs = {};

	if (doc && doc.path) {
		const {path} = doc;
		console.log('uploadAssetPhotoFilesUpdate doc', path)

		const new_name = `assets/${asset_id}/${id}/photos`;
		attrs.doc = await uploadDataUri(path, new_name);
	}

	if (Object.keys(attrs).isNotEmpty()) {
		await updateAssetPhoto({id, ...attrs});
	}
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="uploadAssetDocFilesUpdate">
exports.uploadAssetDocFilesUpdate = async (body) => {
	// await authorize();

	if (!body || !body.data || !body.data.table) {
		return;
	}

	const {
		table: {
			table_name,//asset_docs
			schema,
			old_item,
			new_item,
		}
	} = body.data;

	if (schema !== "public" || table_name !== "asset_docs" || !new_item) {
		return;
	}

	let {id, asset_id, doc,} = new_item;

	console.log('uploadAssetDocFilesUpdate', new_item)

	const attrs = {};

	if (doc && doc.path) {
		const {path} = doc;
		console.log('uploadAssetDocFilesUpdate doc', path)

		const new_name = `assets/${asset_id}/${id}/docs`;
		attrs.doc = await uploadDataUri(path, new_name);
	}

	if (Object.keys(attrs).isNotEmpty()) {
		await updateAssetDoc({id, ...attrs});
	}
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="uploadAssetPurchaseInfoFilesUpdate">
exports.uploadAssetPurchaseInfoFilesUpdate = async (body) => {
	// await authorize();

	if (!body || !body.data || !body.data.table) {
		return;
	}

	const {
		table: {
			table_name,//asset_purchase_info
			schema,
			old_item,
			new_item,
		}
	} = body.data;

	if (schema !== "public" || table_name !== "asset_purchase_info" || !new_item) {
		return;
	}

	let {id, warranty_certificate} = new_item;

	console.log('uploadAssetPurchaseInfoFilesUpdate', new_item)

	const attrs = {};

	if (warranty_certificate && warranty_certificate.path) {
		const {path} = warranty_certificate;
		console.log('uploadAssetPurchaseInfoFilesUpdate warranty_certificate', path)

		const new_name = `assets/purchase-info/${id}/warranty-certificate`;
		attrs.warranty_certificate = await uploadDataUri(path, new_name);
	}

	if (Object.keys(attrs).isNotEmpty()) {
		await updateAssetPurchaseInfo({id, ...attrs});
	}
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="uploadAssetMonitoringPlanFuelUsageFilesUpdate">
exports.uploadAssetMonitoringPlanFuelUsageFilesUpdate = async (body) => {
	// await authorize();

	if (!body || !body.data || !body.data.table) {
		return;
	}

	const {
		table: {
			table_name,//asset_monitoring_plan_fuel_usage
			schema,
			old_item,
			new_item,
		}
	} = body.data;

	if (schema !== "public" || table_name !== "asset_monitoring_plan_fuel_usage" || !new_item) {
		return;
	}

	let {id, monitoring_plan_id, receipt} = new_item;

	console.log('uploadAssetMonitoringPlanFuelUsageFilesUpdate', new_item)

	const attrs = {};

	if (receipt && receipt.path) {
		const {path} = receipt;
		console.log('uploadAssetMonitoringPlanFuelUsageFilesUpdate optionImage', path)

		const new_name = `assets/monitoring-plans/${monitoring_plan_id}/fuel-usage/${id}/receipt`;
		attrs.receipt = await uploadDataUri(path, new_name);
	}

	if (Object.keys(attrs).isNotEmpty()) {
		await updateAssetMonitoringPlanFuelUsage({id, ...attrs});
	}
};
// </editor-fold>
