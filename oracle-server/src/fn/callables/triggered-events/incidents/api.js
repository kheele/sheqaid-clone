const updateIncidentDoc = require('../../queries/updateIncidentDoc');
const updateIncidentVehicleThirdPartyDoc = require('../../queries/updateIncidentVehicleThirdPartyDoc');
const updateIncidentInvestigationDoc = require('../../queries/updateIncidentInvestigationDoc');

// <editor-fold defaultstate="collapsed" desc="uploadIncidentDocsUpdate">
exports.uploadIncidentDocsUpdate = async (body) => {
	// await authorize();

	if (!body || !body.data || !body.data.table) {
		return;
	}

	const {
		table: {
			table_name,//sheq_incident_investigation_docs
			schema,
			old_item,
			new_item,
		}
	} = body.data;

	if (schema !== "public" || table_name !== "sheq_incident_investigation_docs" || !new_item) {
		return;
	}

	let {id, incident_id, doc,} = new_item;

	console.log('uploadIncidentDocsUpdate', new_item)

	const attrs = {};

	if (doc && doc.path) {
		const {path} = doc;
		console.log('uploadIncidentDocsUpdate doc', path)

		const new_name = `incidents/${incident_id}/${id}/docs`;
		attrs.doc = await uploadDataUri(path, new_name);
	}

	if (Object.keys(attrs).isNotEmpty()) {
		await updateIncidentDoc({id, ...attrs});
	}
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="uploadIncidentVehicleThirdPartyDocsUpdate">
exports.uploadIncidentVehicleThirdPartyDocsUpdate = async (body) => {
	// await authorize();

	if (!body || !body.data || !body.data.table) {
		return;
	}

	const {
		table: {
			table_name,//sheq_incident_investigation_vehicle_third_party_docs
			schema,
			old_item,
			new_item,
		}
	} = body.data;

	if (schema !== "public" || table_name !== "sheq_incident_investigation_vehicle_third_party_docs" || !new_item) {
		return;
	}

	let {id, vehicle_details_id, doc,} = new_item;

	console.log('uploadIncidentVehicleThirdPartyDocsUpdate', new_item)

	const attrs = {};

	if (doc && doc.path) {
		const {path} = doc;
		console.log('uploadIncidentVehicleThirdPartyDocsUpdate doc', path)

		const new_name = `incidents/vehicle-details/${vehicle_details_id}/${id}/docs`;
		attrs.doc = await uploadDataUri(path, new_name);
	}

	if (Object.keys(attrs).isNotEmpty()) {
		await updateIncidentVehicleThirdPartyDoc({id, ...attrs});
	}
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="uploadIncidentInvestigationDocsUpdate">
exports.uploadIncidentInvestigationDocsUpdate = async (body) => {
	// await authorize();

	if (!body || !body.data || !body.data.table) {
		return;
	}

	const {
		table: {
			table_name,//sheq_incident_investigation_investigations_docs
			schema,
			old_item,
			new_item,
		}
	} = body.data;

	if (schema !== "public" || table_name !== "sheq_incident_investigation_investigations_docs" || !new_item) {
		return;
	}

	let {id, investigation_id, doc,} = new_item;

	console.log('uploadIncidentInvestigationDocsUpdate', new_item)

	const attrs = {};

	if (doc && doc.path) {
		const {path} = doc;
		console.log('uploadIncidentInvestigationDocsUpdate doc', path)

		const new_name = `incidents/investigations/${investigation_id}/${id}/docs`;
		attrs.doc = await uploadDataUri(path, new_name);
	}

	if (Object.keys(attrs).isNotEmpty()) {
		await updateIncidentInvestigationDoc({id, ...attrs});
	}
};
// </editor-fold>
