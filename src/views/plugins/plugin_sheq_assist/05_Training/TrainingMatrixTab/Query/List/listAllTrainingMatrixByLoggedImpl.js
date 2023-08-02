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
        provider_requirement,
        requirement,
        status,
        org_id, org_id: {key, value},
    }
) => {
    const {variables, filter} = getVariablesAndQueryConfig({
        job_position_id,
        trainer_id,
        course_id,
        unit_standard,
        provider_requirement,
        requirement,
        status,
        org_id,
    });

    return GQLClient
        .query({
            variables,
            query: `
                query listAllTrainingMatrixByLoggedQuery(
                    $${key}: bigint
                ) {
                    sheq_training_matrices(
                        where: {
                            ${key}: {_eq: $${key}}${filter}
                        },
                        order_by: [
                            {course: {name: asc}},
                            {course: {unit_standard: asc}},
                            {course: {unit_standard_desc: asc}},
                            {unit_standard: asc},
                            {unit_standard_desc: asc}
                        ],
                        offset: ${offset},
                        limit: ${limit}
                    ) {
                          id
                          created_at
                          competency_evaluation
                          cost
                          credits
                          date_range_start
                          date_range_end
                          institution_conducting_training
                          max_participants_per_course
                          nqf_level
                          provider_requirement
                          requirement
                          requirement_legal
                          status
                          training_frequency
                          training_standard
                          unit_standard
                          unit_standard_desc
                
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
                          trainer_job_position{
                            id
                            name
                          }
                          course{
                            id
                            name
                          }
                          
                          competency_list{
                            id
                            created_at
                            accreditation_num
                            competency_type
                            type
                            doc
                            issued_date
                            expiry_date
                            expiry_updated
                            employee{
                              id
                              fname
                              lname
                              phone
                              email
                              id_num
                              passport_num
                            }
                          }
                          job_category_list{
                            id
                            job_category{
                              id
                              name
                            }
                          }
                          job_position_list{
                            id
                            job_position{
                              id
                              name
                            }
                          }
                          sector_list{
                            id
                            sector{
                              id
                              name
                            }
                          }
                          training_plan_list{
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
                          training_register_list{
                            id
                            date
                            time_or_duration
                            list_proof
                            institution_conducting_training
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
                            employee_list{
                              employee{
                                id
                                fname
                                lname
                                email
                                phone
                              }
                            }
                          }
                          
                          ${orgs_fragment}
                    }
                  }
            `,
        });
};