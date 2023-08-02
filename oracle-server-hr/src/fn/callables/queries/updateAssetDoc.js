const mutationData = {
	mutation: `
    mutation updateAssetDocMutation($id: asset_docs_pk_columns_input!, $_set: asset_docs_set_input!) {
      update_asset_docs_by_pk(pk_columns: $id, _set: $_set) {
        id
      }
    }
  `,
	operationName: "updateAssetDocMutation",
};

module.exports = async ({id, ...attrs}) => {
	delete attrs.id;

	await updateRelay({
		...mutationData,
		id,
		attrs,
	});
};