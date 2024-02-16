const {query: checkByUsernameContractorQuery} = require("../../callables/graphql/checkByUsernameContractorQuery");

exports = async ({username, reset_password_id}) => {
	const item = await getRelayOne({
		query: checkByUsernameContractorQuery,
		operationName: "checkByUsernameContractorQuery",
		variables: {username},
	});
	console.log('CheckUserByUsername item', item)
	if (!item) {
		return 'NO_DB_USER';
	}
	
	const {id} = item;
	
	await updateRelay({
		mutation: `
          mutation updateResetPassIDMutation($id: default_contractor_users_pk_columns_input!, $_set: default_contractor_users_set_input!) {
            update_default_contractor_users_by_pk(pk_columns: $id, _set: $_set) {
              id
              auth_id
            }
          }
        `,
		operationName: "updateResetPassIDMutation",
		id,
		attrs: {reset_password_id},
	});
};
