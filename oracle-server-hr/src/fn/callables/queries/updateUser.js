const {query: checkByIdStaffQuery} = require("../graphql/checkByIdStaffQuery");

module.exports = async ({id, attrs}) => {
    const item = await getRelayOne({
        query: checkByIdStaffQuery,
        variables: {id},
    });

    if (!item) {
        return 'NO_DB_USER';
    }

    await updateRelay({
        mutation: `
          mutation updateStaffMutation($id: hr_employees_pk_columns_input!, $_set: hr_employees_set_input!) {
            update_hr_employees_by_pk(pk_columns: $id, _set: $_set) {
              id
              auth_id
            }
          }
        `,
        operationName: "updateStaffMutation",
        id,
        attrs,
    });
};