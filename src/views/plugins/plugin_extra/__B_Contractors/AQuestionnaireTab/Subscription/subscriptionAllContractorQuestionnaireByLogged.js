import GQLClient from "graphql/GQLClient";
import {getVariablesAndQueryConfig} from "../Query/Utils";
import {orgs_fragment} from "graphql/Fragments";
import {contractor_questionnaire_details_fragment} from "../Query/Fragments";

export default (
	{
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
	.subscription({
		query: `
                subscription subscriptionAllContractorQuestionnaireByLoggedQuery {
                    default_contractor_questionnaires(where: {
                        removed: {_eq: ${removed}},
                        group: {_eq: "Contractors"},
                        is_template: {_eq: false},
                        ${filter}
                    }) {
                        ${contractor_questionnaire_details_fragment}
                        ${orgs_fragment}
                    }
                }
            `,
	});
	//</editor-fold>
};