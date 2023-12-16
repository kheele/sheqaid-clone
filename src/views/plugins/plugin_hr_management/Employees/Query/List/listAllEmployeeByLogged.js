import GQLClient from "graphql/GQLClient";
import {orgs_fragment, employee_personal_details_fragment} from "graphql/Fragments";
import {getVariablesAndQueryConfig} from "../Utils";

export default (
	{
		offset = 0,
		limit = 50,
		//
		removed = false,
		incContractors = false,
		department_id,
		job_position_id,
		job_category_id,
		team_id,
		supervisor_id,
		name,
		id_or_pass_num,
		//
		site_id, project_id, client_id,
		//
		exact_orgs = true,
	}
) => {
	const {filter} = getVariablesAndQueryConfig({
		incContractors,
		department_id,
		job_position_id,
		job_category_id,
		team_id,
		supervisor_id,
		name,
		id_or_pass_num,
		//
		site_id, project_id, client_id,
		//
		exact_orgs
	});

	return GQLClient
	.query({
		query: `
      query listAllActiveEmployeeByLoggedQuery {
        hr_employees(
          where: {
            removed: {_eq: ${removed}},
            ${filter}
          },
          order_by: {lname: asc},
          offset: ${offset}
          ${limit > 0 ? `,limit: ${limit}` : ''}
        ) {
          ${employee_personal_details_fragment}
          employment_num
          employment_date
          removed
          
          job_observation_list_aggregate(where: {removed: {_eq: false}}){
            aggregate{
              count
            }
          }
			    job_observation_list{
			      id
			      name
			    }
			    
          medical_list_aggregate(where: {removed: {_eq: false}}){
            aggregate{
              count
            }
          }
          leave_list_aggregate(where: {removed: {_eq: false}}){
            aggregate{
              count
            }
          }
          ppe_list_aggregate{
            aggregate{
              count
            }
          }
          trainer_training_list_aggregate:trainer_training_matrix_list_aggregate{
            aggregate{
              count
            }
          }
          warning_list_aggregate(where: {removed: {_eq: false}}){
            aggregate{
              count
            }
          }
          supervisor_employee_list_aggregate(where: {removed: {_eq: false}}){
            aggregate{
              count
            }
          }
          supervisor{
            ${employee_personal_details_fragment}
          }
          linked_user {
            id
            fname
            lname
            username
            phone
          }
          department {
            id
            name
          }
          job_position {
            id
            name
            job_category{
              id
              name
            }
          }
          ${incContractors ? `
          contractor {
            id
            name
          }` : ''}
          ${orgs_fragment}
        }
      }
    `,
	});
};