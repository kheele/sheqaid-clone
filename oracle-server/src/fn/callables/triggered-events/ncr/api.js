const updateNCRDoc = require('../../queries/updateNCRDoc');

// <editor-fold defaultstate="collapsed" desc="uploadNCRDocsUpdate">
exports.uploadNCRDocsUpdate = async (body) => {
	// await authorize();

	if (!body || !body.data || !body.data.table) {
		return;
	}

	const {
		table: {
			table_name,//sheq_non_conformance_docs
			schema,
			old_item,
			new_item,
		}
	} = body.data;

	if (schema !== "public" || table_name !== "sheq_non_conformance_docs" || !new_item) {
		return;
	}

	let {id, non_conformance_id, doc, type} = new_item;

	console.log('uploadIncidentDocsUpdate', new_item)

	const attrs = {};

	if (doc && doc.path) {
		const {path} = doc;
		console.log('uploadIncidentDocsUpdate doc', path)

		const new_name = `ncr/${non_conformance_id}/${id}/docs`;
		attrs.doc = await uploadDataUri(path, new_name);
	}

	if (Object.keys(attrs).isNotEmpty()) {
		await updateNCRDoc({id, ...attrs});
	}
};
// </editor-fold>
