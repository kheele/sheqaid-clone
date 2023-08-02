const mutationData = {
	mutation: `
    mutation updateAssetPurchaseInfoMutation($id: asset_purchase_info_pk_columns_input!, $_set: asset_purchase_info_set_input!) {
      update_asset_purchase_info_by_pk(pk_columns: $id, _set: $_set) {
        id
      }
    }
  `,
	operationName: "updateAssetPurchaseInfoMutation",
};

module.exports = async ({id, ...attrs}) => {
	delete attrs.id;

	await updateRelay({
		...mutationData,
		id,
		attrs,
	});
};