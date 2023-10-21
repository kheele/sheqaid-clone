const {orgs_no_project_and_site_fragment} = require("../../../../../graphql/Fragments");
const {inspection_template_details_fragment, getVariablesAndQueryConfig} = require('./commons');

//<editor-fold desc="listImpl">
module.exports = async (socket, data) => {
    // console.log('data', data)

    let {
        offset = 0,
        limit = 50,
        //
        removed = false,
        status,
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
        status,
        //
        site_id, project_id, client_id,
        //
        exact_orgs
    });

    return listGraphQL({
        query: `
			  query listAllInspectionTemplateByLoggedQuery {
				default_contractor_questionnaires(
				  where: {
					_and: [
                      {removed: {_eq: ${removed}}},
                      {group: {_eq: "Inspections"}},
                      {is_template: {_eq: true}},
                      {_or: [
                        {visibility: {_eq: "Public"}},
                        {_and: [
                          {visibility: {_eq: "Private"}}, 
                          ${filter}
                        ]}
                      ]}
                    ]
				  },
					order_by: {name: asc},
					offset: ${offset},
					${limit > 0 ? `limit: ${limit}` : ''}
				) {
				    ${inspection_template_details_fragment}
                    ${orgs_no_project_and_site_fragment}
				}
			  }
			`,
        operationName: "listAllInspectionTemplateByLoggedQuery",
    });
}
//</editor-fold>