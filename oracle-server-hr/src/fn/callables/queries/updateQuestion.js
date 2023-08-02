const mutationData = {
	mutation: `
    mutation updateQuestionMutation($id: default_contractor_questionnaires_ques_pk_columns_input!, $_set: default_contractor_questionnaires_ques_set_input!) {
      update_default_contractor_questionnaires_ques_by_pk(pk_columns: $id, _set: $_set) {
        id
      }
    }
  `,
	operationName: "updateQuestionMutation",
};

module.exports = async ({id, ...attrs}) => {
	delete attrs.id;

	await updateRelay({
		...mutationData,
		id,
		attrs,
	});
};