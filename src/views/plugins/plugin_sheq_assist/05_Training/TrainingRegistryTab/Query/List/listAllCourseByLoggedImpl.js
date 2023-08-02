import GQLClient from "graphql/GQLClient";
import {orgs_fragment} from "graphql/Fragments";
import {getVariablesAndQueryConfig} from "../Utils";

export default (
    {
        offset = 0,
        limit = 50,
        //
        name,
        unit_standard,
        frequency,
        provider,
        job_position_id,
        sector_id,
        org_id, org_id: {key, value},
    }
) => {
    const {variables, filter} = getVariablesAndQueryConfig({
        name,
        unit_standard,
        frequency,
        provider,
        job_position_id,
        sector_id,
        org_id,
    });

    return GQLClient
        .query({
            variables,
            query: `
                query listAllCourseByLoggedQuery(
                    $${key}: bigint
                ) {
                    sheq_training_courses(
                        where: {
                            ${key}: {_eq: $${key}},${filter}
                        },
                        order_by: [{name: asc_nulls_last}, {unit_standard: asc_nulls_last}, {unit_standard_desc: asc_nulls_last}],
                        offset: ${offset},
                        limit: ${limit}
                    ) {
                          id
                          created_at
                
                          name
                          frequency
                          provider
                          unit_standard
                          unit_standard_desc
                
                          job_position_list {
                            id
                            job_position{
                              id
                              name
                            }
                          }
                          sector_list {
                            id
                            sector{
                              id
                              name
                            }
                          }
                
                          training_manual_list {
                            id
                          }
                          training_matrix_list {
                              id
                              cost
                              institution_conducting_training
                              trainer {
                                  id
                              }
                          }
                          training_plan_list{
                                #id
                                completion_status
                                result
                                result_status
                                year
                                employee{
                                    id
                                    fname
                                    lname
                                    email
                                    phone
                                    id_num
                                    passport_num
                                    employment_num
                                    job_position{
                                        id
                                        name
                                    }
                                    department{
                                        id
                                        name
                                    }
                                }
                                course {
                                    id
                                    name
                                }
                                training{
                                    id
                                    course{
                                      id
                                      name
                                    }
                                }
                            }
                          ${orgs_fragment}
                    }
                  }
            `,
        });
};