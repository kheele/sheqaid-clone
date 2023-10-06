const CheckUserByUsername = require("../graphql/CheckUserByUsername");
const queries = {
    User: {
        mutation: `
          mutation updateResetPassIDMutation($id: default_users_pk_columns_input!, $_set: default_users_set_input!) {
            update_default_users_by_pk(pk_columns: $id, _set: $_set) {
              id
              auth_id
            }
          }
        `,
        operationName: "updateResetPassIDMutation",
    },
    ContractorUser: {
        mutation: `
          mutation updateResetPassIDMutation($id: default_contractor_users_pk_columns_input!, $_set: default_contractor_users_set_input!) {
            update_default_contractor_users_by_pk(pk_columns: $id, _set: $_set) {
              id
              auth_id
            }
          }
        `,
        operationName: "updateResetPassIDMutation",
    },
    Staff: {
        mutation: `
          mutation updateResetPassIDMutation($id: hr_employees_pk_columns_input!, $_set: hr_employees_set_input!) {
            update_hr_employees_by_pk(pk_columns: $id, _set: $_set) {
              id
              auth_id
            }
          }
        `,
        operationName: "updateResetPassIDMutation",
    },
};

module.exports = async ({username, reset_password_id, access_type}) => {
    const queryData = CheckUserByUsername[access_type];
    if (!queryData) {
        return null;
    }

    const item = await getRelayOne({
        ...queryData,
        variables: {username},
    });
    console.log('CheckUserByUsername item', item)
    if (!item) {
        return 'NO_DB_USER';
    }

    const {id} = item;

    const mutationData = queries[access_type];
    if (!mutationData) {
        return null;
    }

    await updateRelay({
        ...mutationData,
        id,
        attrs: {reset_password_id},
    });
};
