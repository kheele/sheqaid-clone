const {orgs_fragment} = require("../../../../../graphql/Fragments");
const {training_toolbox_talks_details_fragment, getVariablesAndQueryConfig} = require('./commons');

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
        training_frequency,
        date,
        subject_list,
        subject_category_list,
        trainer_list,
        job_position_list,
        employee_list,
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
        training_frequency,
        date,
        subject_list,
        subject_category_list,
        trainer_list,
        job_position_list,
        employee_list,
        //
        site_id, project_id, client_id,
        //
        exact_orgs
    });

    return listGraphQL({
        query: `
			query listAllToolboxTalksByLoggedQuery {
                sheq_training_toolbox_talks(
                  where: {
                    removed: {_eq: ${removed}},
                    ${filter}
                  },
	                order_by: {subject_category: asc},
                    offset: ${offset},
                    ${limit > 0 ? `limit: ${limit}` : ''}
                ) {
                    ${training_toolbox_talks_details_fragment}
                    ${orgs_fragment}
                }
            }
		`,
        operationName: "listAllToolboxTalksByLoggedQuery",
    });
}
//</editor-fold>