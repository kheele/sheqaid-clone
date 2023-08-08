import GQLClient from "graphql/GQLClient";
import {getVariablesAndQueryConfig} from "../Utils";
import {orgs_fragment} from "graphql/Fragments";
import {job_observation_details_fragment} from "../Fragments";

export default (
	{
		offset = 0,
		limit = 50,
		//
		removed = false,
		job_position,
		employee,
		template,
		//
		site_id, project_id, client_id,
		//
		exact_orgs = false,
	}
) => {
	const {filter} = getVariablesAndQueryConfig({
		template,
		job_position,
		employee,
		//
		site_id, project_id, client_id,
		//
		exact_orgs
	});

	//<editor-fold desc="ByEach">
	return GQLClient
	.query({
		query: `
      query listAllObservationQuestionnaireByLoggedQuery {
        default_contractor_questionnaires(
          where: {
            removed: {_eq: ${removed}},
            group: {_eq: "Job Observations"},
            is_template: {_eq: false}
            ${filter}
          },
	        order_by: {employee: {full_name: asc}, employee_other: {full_name: asc}},
	        offset: ${offset},
	        limit: ${limit}
        ) {
            ${job_observation_details_fragment}
            ${orgs_fragment}
        }
      }
    `,
	});//.then(fillNullLists);
	//</editor-fold>
};