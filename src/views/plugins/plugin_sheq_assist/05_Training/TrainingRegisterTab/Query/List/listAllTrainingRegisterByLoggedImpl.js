import GQLClient from "graphql/GQLClient";
import {orgs_fragment, employee_personal_details_fragment} from "graphql/Fragments";
import {getVariablesAndQueryConfig} from "../Utils";

export default (
	{
		offset = 0,
		limit = 50,
		//
		job_position_id,
		trainer_id,
		course_id,
		unit_standard,
		date,
		org_id, org_id: {key, value},
	}
) => {
	const {variables, filter} = getVariablesAndQueryConfig({
		job_position_id,
		trainer_id,
		course_id,
		unit_standard,
		date,
		org_id,
	});

	return GQLClient
	.query({
		variables,
		query: `
                query listAllTrainingRegisterByLoggedQuery(
                    $${key}: bigint
                ) {
                    sheq_training_registers(
                        where: {
                            ${key}: {_eq: $${key}}${filter}
                        },
                        order_by: {training: {course: {name: asc}}, date: asc},
                        offset: ${offset}
                        ${limit > 0 ? `,limit: ${limit}` : ''}
                    ) {
                          id
                          created_at
                          date
                          institution_conducting_training
                          time_or_duration
                          list_proof
                          trainer{
                            id
                            fname
                            lname
                            email
                            phone
                          }
                          trainer_external{
                            id
                            fname
                            lname
                            email
                            phone
                          }
                          training{
                            id
                            course {
                              id
                              name
                            }
                          }
                          employee_list{
                            id
                            employee{
                              id
                              fname
                              lname
                              email
                              phone
                            }
                          }
                          ${orgs_fragment}
                    }
                  }
            `,
	});
};