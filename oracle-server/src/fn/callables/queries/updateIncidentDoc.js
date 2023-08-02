const mutationData = {
	mutation: `
    mutation updateIncidentDocMutation($id: sheq_incident_investigation_docs_pk_columns_input!, $_set: sheq_incident_investigation_docs_set_input!) {
      update_sheq_incident_investigation_docs_by_pk(pk_columns: $id, _set: $_set) {
        id
      }
    }
  `,
	operationName: "updateIncidentDocMutation",
};

module.exports = async ({id, ...attrs}) => {
	delete attrs.id;

	await updateRelay({
		...mutationData,
		id,
		attrs,
	});
};