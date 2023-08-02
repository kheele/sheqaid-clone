const mutationData = {
	mutation: `
    mutation updateNCRDocMutation($id: sheq_non_conformance_docs_pk_columns_input!, $_set: sheq_non_conformance_docs_set_input!) {
      update_sheq_non_conformance_docs_by_pk(pk_columns: $id, _set: $_set) {
        id
      }
    }
  `,
	operationName: "updateNCRDocMutation",
};

module.exports = async ({id, ...attrs}) => {
	delete attrs.id;

	await updateRelay({
		...mutationData,
		id,
		attrs,
	});
};