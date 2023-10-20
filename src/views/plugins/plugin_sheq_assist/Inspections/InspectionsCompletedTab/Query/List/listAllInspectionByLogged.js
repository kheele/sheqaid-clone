import GQLClient from "graphql/GQLClient";
import {getVariablesAndQueryConfig} from "../Utils";
import {orgs_fragment} from "graphql/Fragments";
import {inspection_details_fragment} from "../Fragments";

export default (
	{
		offset = 0,
		limit = 50,
		//
		removed = false,
		status,
		//
		site_id, project_id, client_id,
		//
		exact_orgs = false,
	}
) => {
	const {filter} = getVariablesAndQueryConfig({
		status,
		//
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
	  query listAllInspectionCompletedQuestionnaireByLoggedQuery {
      	default_contractor_questionnaires(
          where: {
            removed: {_eq: ${removed}},
            group: {_eq: "Inspections"},
            is_template: {_eq: false},
            status: {_eq: "CompleteAccepted"},
            ${filter}
          },
	        order_by: {name: asc},
	        offset: ${offset},
	        ${limit > 0 ? `limit: ${limit}` : ''}
        ) {
            ${inspection_details_fragment}
            ${orgs_fragment}
        }
      }
    `,
	});//.then(fillNullLists);
	//</editor-fold>
};