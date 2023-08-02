import GQLClient from "graphql/GQLClient";
import {getVariablesAndQueryConfig} from "../Utils";
import {orgs_no_project_and_site_fragment} from "graphql/Fragments";
import {contractor_questionnaire_library_details_fragment} from "../Fragments";

export default (
	{
		offset = 0,
		limit = 50,
		//
		removed = false,
		//
		site_id, project_id, client_id,
		//
		exact_orgs = false,
	}
) => {
	const {filter} = getVariablesAndQueryConfig({
		site_id, project_id, client_id,
		//
		exact_orgs
	});

	const fillNullLists = (list) => list.map(v => {
		// !v.data.page_title_list && (v.data.page_title_list = []);
		// !v.data.question_list && (v.data.question_list = []);
		return v;
	});

	//<editor-fold desc="ByEach">
	return GQLClient
	.query({
		query: `
      query listAllContractorQuestionnaireLibraryByLoggedQuery {
        default_contractor_questionnaires(
          where: {
            _and: [
              {removed: {_eq: ${removed}}},
              {group: {_eq: "Contractors"}},
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
          ${contractor_questionnaire_library_details_fragment}
          ${orgs_no_project_and_site_fragment}
        }
      }
    `,
	});//.then(fillNullLists);
	//</editor-fold>
};