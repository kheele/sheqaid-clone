const mutationData = {
	mutation: `
    mutation updateAssetMonitoringPlanFuelUsageMutation($id: asset_monitoring_plan_fuel_usage_pk_columns_input!, $_set: asset_monitoring_plan_fuel_usage_set_input!) {
      update_asset_monitoring_plan_fuel_usage_by_pk(pk_columns: $id, _set: $_set) {
        id
      }
    }
  `,
	operationName: "updateAssetMonitoringPlanFuelUsageMutation",
};

module.exports = async ({id, ...attrs}) => {
	delete attrs.id;

	await updateRelay({
		...mutationData,
		id,
		attrs,
	});
};