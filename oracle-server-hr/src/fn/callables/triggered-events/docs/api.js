// <editor-fold defaultstate="collapsed" desc="uploadDocBankingDetailUpdate">
exports.uploadDocBankingDetailUpdate = async (body) => {
	// await authorize();

	const data = getTriggeredEventsData(body, "hr_employees_banking_details");
	if (!data) {
		return;
	}

	const {new_item} = data;

	let {id, employee_id, doc,} = new_item;

	console.log('uploadDocBankingDetailUpdate', new_item)

	const attrs = {};

	if (doc && doc.path) {
		const {path} = doc;
		console.log('uploadDocBankingDetailUpdate doc', path)

		const new_name = `employees/${employee_id}/docs/banking_detail-${id}-${Dates.formatTimestamp(new Date())}`;
		attrs.doc = await uploadDataUri(path, new_name);
	}

	if (Object.keys(attrs).isNotEmpty()) {
		await updateRelay({
			mutation: `
		    mutation updateEmployeeDocBankingDetailMutation($id: hr_employees_banking_details_pk_columns_input!, $_set: hr_employees_banking_details_set_input!) {
		      update_hr_employees_banking_details_by_pk(pk_columns: $id, _set: $_set) {
		        id
		      }
		    }
		  `,
			operationName: "updateEmployeeDocBankingDetailMutation",
			id,
			attrs,
		});
	}
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="uploadDocLivingAddressUpdate">
exports.uploadDocLivingAddressUpdate = async (body) => {
	// await authorize();

	const data = getTriggeredEventsData(body, "hr_employees_living_address");
	if (!data) {
		return;
	}

	const {new_item} = data;

	let {id, employee_id, doc,} = new_item;

	console.log('uploadDocLivingAddressUpdate', new_item)

	const attrs = {};

	if (doc && doc.path) {
		const {path} = doc;
		console.log('uploadDocLivingAddressUpdate doc', path)

		const new_name = `employees/${employee_id}/docs/living_address-${id}-${Dates.formatTimestamp(new Date())}`;
		attrs.doc = await uploadDataUri(path, new_name);
	}

	if (Object.keys(attrs).isNotEmpty()) {
		await updateRelay({
			mutation: `
		    mutation updateEmployeeDocLivingAddressMutation($id: hr_employees_living_address_pk_columns_input!, $_set: hr_employees_living_address_set_input!) {
		      update_hr_employees_living_address_by_pk(pk_columns: $id, _set: $_set) {
		        id
		      }
		    }
		  `,
			operationName: "updateEmployeeDocLivingAddressMutation",
			id,
			attrs,
		});
	}
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="uploadDocDocumentUpdate">
exports.uploadDocDocumentUpdate = async (body) => {
	// await authorize();

	const data = getTriggeredEventsData(body, "hr_employees_documents");
	if (!data) {
		return;
	}

	const {new_item} = data;

	let {id, employee_id, doc, type} = new_item;

	console.log('uploadDocDocumentUpdate', new_item)

	const attrs = {};

	if (doc && doc.path) {
		const {path} = doc;
		console.log('uploadDocDocumentUpdate doc', path)

		const new_name = `employees/${employee_id}/docs/document-${id}-${Dates.formatTimestamp(new Date())}`;
		attrs.doc = await uploadDataUri(path, new_name);
	}

	if (Object.keys(attrs).isNotEmpty()) {
		await updateRelay({
			mutation: `
		    mutation updateEmployeeDocDocumentMutation($id: hr_employees_documents_pk_columns_input!, $_set: hr_employees_documents_set_input!) {
		      update_hr_employees_documents_by_pk(pk_columns: $id, _set: $_set) {
		        id
		      }
		    }
		  `,
			operationName: "updateEmployeeDocDocumentMutation",
			id,
			attrs,
		});
	}
};
// </editor-fold>
