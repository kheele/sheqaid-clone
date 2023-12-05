const {orgs_fragment} = require("../../../../../graphql/Fragments");
const {training_register_details_fragment, getVariablesAndQueryConfig} = require('./commons');

//<editor-fold desc="listImpl">
module.exports = async (socket, data) => {
    // console.log('data', data)

    let {
        offset = 0,
        limit = 50,
        //
        removed = false,
        id,
        //
        job_position_list,
        trainer_list,
        course_list,
        unit_standard,
        date,
        //
        site_id, project_id, client_id,
        //
        exact_orgs = false,
        //
        client_filter,
        orgs_filter = [],
    } = data;

    const {filter} = getVariablesAndQueryConfig({
        orgs_filter,
        //
        id,
        //
        job_position_list,
        trainer_list,
        course_list,
        unit_standard,
        date,
        //
        site_id, project_id, client_id,
        //
        exact_orgs
    });

    return listGraphQL({
        query: `
			query listAllTrainingRegisterByLoggedQuery {
                sheq_training_registers(
                  where: {
                    removed: {_eq: ${removed}},
                    ${filter}
                  },
                    order_by: {training: {course: {name: asc}}, date: asc},
                    offset: ${offset},
                    ${limit > 0 ? `limit: ${limit}` : ''}
                ) {
                    ${training_register_details_fragment}
                    ${orgs_fragment}
                }
            }
		`,
        operationName: "listAllTrainingRegisterByLoggedQuery",
    });
}
//</editor-fold>