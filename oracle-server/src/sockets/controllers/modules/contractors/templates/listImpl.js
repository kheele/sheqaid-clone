const {orgs_no_project_and_site_fragment} = require("../../../../../graphql/Fragments");
const {contractor_questionnaire_template_details_list_fragment, getVariablesAndQueryConfig} = require('./commons');

//<editor-fold desc="listImpl">
module.exports = async (socket, data) => {
	console.log('data', data)
	
	let {
		offset = 0,
		limit = 50,
		//
		removed = false,
		//
		id,
		//
		name,
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
		name,
		//
		site_id, project_id, client_id,
		//
		exact_orgs
	});
	
	const fillNullLists = (list) => list.map(v => {
		!v.doc_version_list && (v.doc_version_list = []);
		if(isArray(v.latest_version)) {
			v.latest_version = v.latest_version[0];
		}
		return v;
	});
	
	if (id) {
		return listGraphQL({
			query: `
        query listAllContractorQuestionnaireTemplateByLoggedQuery {
            default_contractor_questionnaire_templates(
              where: {
                 ${filter}
              }
            ) {
                ${contractor_questionnaire_template_details_list_fragment}
                ${orgs_no_project_and_site_fragment}
            }
        }
      `,
			operationName: "listAllContractorQuestionnaireTemplateByLoggedQuery",
		}).then(fillNullLists);
	} else {
		return listGraphQL({
			query: `
        query listAllContractorQuestionnaireTemplateByLoggedQuery {
            default_contractor_questionnaire_templates(
              where: {
                ${filter}
              },
              order_by: {name: asc},
              offset: ${offset},
              ${limit > 0 ? `limit: ${limit}` : ''}
            ) {
                ${contractor_questionnaire_template_details_list_fragment}
                ${orgs_no_project_and_site_fragment}
            }
        }
      `,
			operationName: "listAllContractorQuestionnaireTemplateByLoggedQuery",
		}).then(fillNullLists);
	}
}
//</editor-fold>
