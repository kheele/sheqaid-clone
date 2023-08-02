const mutationData = {
	mutation: `
    mutation updateIncidentVehicleThirdPartyDocMutation($id: sheq_incident_investigation_vehicle_third_party_docs_pk_columns_input!, $_set: sheq_incident_investigation_vehicle_third_party_docs_set_input!) {
      update_sheq_incident_investigation_vehicle_third_party_docs_by_pk(pk_columns: $id, _set: $_set) {
        id
      }
    }
  `,
	operationName: "updateIncidentVehicleThirdPartyDocMutation",
};

module.exports = async ({id, ...attrs}) => {
	delete attrs.id;

	await updateRelay({
		...mutationData,
		id,
		attrs,
	});
};