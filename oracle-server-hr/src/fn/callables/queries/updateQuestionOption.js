const mutationData = {
	mutation: `
    mutation updateQuestionOptionMutation($id: default_contractor_questionnaires_ques_options_pk_columns_input!, $_set: default_contractor_questionnaires_ques_options_set_input!) {
      update_default_contractor_questionnaires_ques_options_by_pk(pk_columns: $id, _set: $_set) {
        id
      }
    }
  `,
	operationName: "updateQuestionOptionMutation",
};

module.exports = async ({id, ...attrs}) => {
	delete attrs.id;

	await updateRelay({
		...mutationData,
		id,
		attrs,
	});
};