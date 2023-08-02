const mutationData = {
	mutation: `
    mutation updateAssetPhotoMutation($id: asset_photos_pk_columns_input!, $_set: asset_photos_set_input!) {
      update_asset_photos_by_pk(pk_columns: $id, _set: $_set) {
        id
      }
    }
  `,
	operationName: "updateAssetPhotoMutation",
};

module.exports = async ({id, ...attrs}) => {
	delete attrs.id;

	await updateRelay({
		...mutationData,
		id,
		attrs,
	});
};