

// <editor-fold defaultstate="collapsed" desc="uploadProductDocsUpdate">
exports.uploadProductDocsUpdate = async (body) => {
	// await authorize();

	const data = getTriggeredEventsData(body, "sheq_chemical_products");
	if(!data){
		return;
	}

	const {new_item} = data;

	let {id, sds_doc, hazchem_sheet_doc, risk_assessment_doc} = new_item;

	console.log('uploadProductDocsUpdate', new_item)

	const attrs = {};

	const promises = [];

	if (sds_doc && sds_doc.path) {
		promises.push(async ()=>{
			const {path} = sds_doc;
			console.log('uploadProductDocsUpdate sds_doc', path)

			const new_name = `chemicals/products/sds/${id}/docs`;
			attrs.sds_doc = await uploadDataUri(path, new_name);
		})
	}

	if (hazchem_sheet_doc && hazchem_sheet_doc.path) {
		promises.push(async ()=>{
			const {path} = hazchem_sheet_doc;
			console.log('uploadProductDocsUpdate hazchem_sheet_doc', path)

			const new_name = `chemicals/products/hazchem-sheet/${id}/docs`;
			attrs.hazchem_sheet_doc = await uploadDataUri(path, new_name);
		})
	}

	if (risk_assessment_doc && risk_assessment_doc.path) {
		promises.push(async ()=>{
			const {path} = risk_assessment_doc;
			console.log('uploadProductDocsUpdate risk_assessment_doc', path)

			const new_name = `chemicals/products/risk-assessment/${id}/docs`;
			attrs.risk_assessment_doc = await uploadDataUri(path, new_name);
		})
	}

	await Promise.all(promises);

	if (Object.keys(attrs).isNotEmpty()) {
		await updateDoc({id, ...attrs});
	}
};
// </editor-fold>

const mutationData = {
	mutation: `
    mutation updateDocMutation($id: sheq_chemical_products_pk_columns_input!, $_set: sheq_chemical_products_set_input!) {
      update_sheq_chemical_products_by_pk(pk_columns: $id, _set: $_set) {
        id
      }
    }
  `,
	operationName: "updateDocMutation",
};

const updateDoc = async ({id, ...attrs}) => {
	delete attrs.id;

	await updateRelay({
		...mutationData,
		id,
		attrs,
	});
};
