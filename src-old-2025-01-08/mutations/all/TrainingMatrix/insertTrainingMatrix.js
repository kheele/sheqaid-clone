/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityTrainingMatrix} from "mutations/types.d.ts";
import updateTrainingPlan from "../TrainingPlan/updateTrainingPlan";
import crudUtils from "../CRUDUtils/CRUDUtils";

// 2
const mutation = graphql`
    mutation insertTrainingMatrixMutation($object: sheq_training_matrices_insert_input!) {
        insert_sheq_training_matrices_one(
            object: $object
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
                id
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

            company {
                id
                name
            }
            client {
                id
                name
            }
            project {
                id
                name
            }
            site {
                id
                name
            }
        }
    }
`;

// 3
export default async (input: EntityTrainingMatrix) => {
    const {
        //1
        client_id,
        project_id,
        site_id,
        //2
        course_id,
        training_plan_list,
        //3
        job_category_list,
        job_position_list,
        sector_list,
        //4
        status,
        date_range_start,
        date_range_end,
        cost,
        //5
        institution_conducting_training,
        trainer_id,
        trainer_external,
        trainer_job_position_id,
        //6
        requirement_legal,
        requirement,
        max_participants_per_course,
        training_standard,
        training_frequency,
        provider_requirement,
        //7
        competency_evaluation,
        unit_standard,
        unit_standard_desc,
        credits,
        nqf_level
    } = input;

    if (training_plan_list) {
        // delete input.training_plan_list;
    }

    crudUtils.injectCreate(input);

    const item = await createMutationImpl({mutation, input});
    if (item) {
        // item.data.training_plan_list = await Promise.all(training_plan_list.map(async id => {
        //     return await updateTrainingPlan({id, training_id: item.id});
        // }));
    }
    return item;
};
