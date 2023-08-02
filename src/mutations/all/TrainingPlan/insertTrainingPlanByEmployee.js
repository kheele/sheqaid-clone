/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityTrainingPlan} from "mutations/types.d.ts";
import crudUtils from "../CRUDUtils/CRUDUtils";

// 2
const mutation = graphql`
    mutation insertTrainingPlanByEmployeeMutation($object: sheq_training_plans__employee_training_insert_input!) {
        insert_sheq_training_plans__employee_training_one(
            object: $object
        ) {
            id
            completion_status
            result_status
            result
            year
            
            course {
                id
                name
            }
            employee {
                id
                fname
                lname
                email
                phone
                dob
                sex
                id_num
                passport_num
                profile_pic
                employment_num
            }
            
            training{
                id
                course{
                    id
                    name
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
export default async (input: EntityTrainingPlan) => {
    const {
        completion_status,
        employee_id,
        course_id,
        year,
        client_id,
        project_id,
        site_id,
    } = input;

    crudUtils.injectCreate(input);

    return await createMutationImpl({mutation, input});
};
