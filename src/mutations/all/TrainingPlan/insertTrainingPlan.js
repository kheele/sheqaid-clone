/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityTrainingPlan} from "mutations/types.d.ts";
import crudUtils from "../CRUDUtils/CRUDUtils";
import insertTrainingPlanByEmployee from "./insertTrainingPlanByEmployee";

// 2
const mutation = graphql`
    mutation insertTrainingPlanMutation($object: sheq_training_plans__job_position_course_insert_input!) {
        insert_sheq_training_plans__job_position_course_one(
            object: $object
        ) {
            id
            year
            
            course {
                id
                name
            }
            job_position {
                id
                name
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
        employee_plan_list,
        job_position_plan_list,
        course_plan_list,
        year_plan_list,
        client_id,
        project_id,
        site_id,
    } = input;


    if(employee_plan_list) {
        delete input.employee_plan_list;

        return await Promise.all(employee_plan_list.map(async (v) => {
            //completion_status = 'Not Started', employee_id, course_id, year;
            const data = {...v, ...input};
            console.log('plan employee', data)
            return await insertTrainingPlanByEmployee(data);
        }));
    } else {
        crudUtils.injectCreate(input);

        const save = async (input, plan_list) => {
            //insert_sheq_training_plans__job_position_course_one
            await Promise.all(plan_list.map(async (v) => {
                //course_id, job_position_id, year, employee_blacklist;
                const {job_position_id, course_id, year, employee_blacklist = []} = v;
                if (employee_blacklist) {
                    delete v.employee_blacklist;
                }
                await Promise.all(employee_blacklist.map(async ({id: employee_id}) => {
                    const data = {employee_id, course_id, year};
                    console.log('employee_blacklist', data)
                    return await createMutationImpl({mutation, input: data});
                }));
            }));

            return await Promise.all(plan_list.map(async (v) => {
                //course_id, job_position_id, year, employee_blacklist;
                const data = {...v, ...input};
                console.log('plan others', data)
                return await createMutationImpl({mutation, input: data});
            }));
        };

        if (job_position_plan_list) {
            delete input.job_position_plan_list;
            return save(input, job_position_plan_list);
        } else if (course_plan_list) {
            delete input.course_plan_list;
            return save(input, course_plan_list);
        } else if (year_plan_list) {
            delete input.year_plan_list;
            return save(input, year_plan_list);
        }
    }
};
