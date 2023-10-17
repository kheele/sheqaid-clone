const {query: checkByIdContractorQuery} = require("../graphql/checkByIdContractorQuery");

module.exports = async ({id, attrs}) => {
    const item = await getRelayOne({
        query: checkByIdContractorQuery,
        operationName: "checkByIdContractorQuery",
        variables: {id},
    });
    console.log('updateUser item', item)
    if (!item) {
        return 'NO_DB_USER';
    }

    await updateRelay({
        mutation: `
          mutation updateUserMutation($id: default_contractor_users_pk_columns_input!, $_set: default_contractor_users_set_input!) {
            update_default_contractor_users_by_pk(pk_columns: $id, _set: $_set) {
              id
              auth_id
            }
          }
        `,
        operationName: "updateUserMutation",
        id,
        attrs,
    });
};