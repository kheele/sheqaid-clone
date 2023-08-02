/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityTrainingMatrix} from "mutations/types.d.ts";
import findByIdTrainingCourse from "../TrainingCourse/findByIdTrainingCourse";
import updateProxySectorTrainingCourse from "../ProxySectorTrainingCourse/updateProxySectorTrainingCourse";
import insertProxySectorTrainingCourse from "../ProxySectorTrainingCourse/insertProxySectorTrainingCourse";
import updateProxyJobPositionTrainingCourse
    from "../ProxyJobPositionTrainingCourse/updateProxyJobPositionTrainingCourse";
import insertProxyJobPositionTrainingCourse
    from "../ProxyJobPositionTrainingCourse/insertProxyJobPositionTrainingCourse";
import updateProxyJobCategoryTrainingMatrix
    from "../ProxyJobCategoryTrainingMatrix/updateProxyJobCategoryTrainingMatrix";
import insertProxyJobCategoryTrainingMatrix
    from "../ProxyJobCategoryTrainingMatrix/insertProxyJobCategoryTrainingMatrix";
import findByIdTrainingMatrix from "./findByIdTrainingMatrix";

// 2
const mutation = graphql`
  mutation updateTrainingMatrixMutation($id: sheq_training_matrices_pk_columns_input!, $_set: sheq_training_matrices_set_input!) {
    update_sheq_training_matrices_by_pk(pk_columns: $id, _set: $_set) {
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
export default async (attrs: EntityTrainingMatrix) => {
    const {
        id,
        //2
        course, training_plan,
        //3
        job_category_list, job_position_list, sector_list,
        //4
        status, date_range, cost,
        //5
        institution_conducting_training, trainer, trainer_job_position,
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
        nqf_level,
        //1
        client_id, project_id, site_id,
    } = attrs;

    const item = await findByIdTrainingMatrix(id);
    if (!item) return;

    const promises = [];

    if(sector_list) {
        delete attrs.sector_list;
        promises.push(Promise.all(sector_list.map(async (v, n) => {
            if(v.id) {
                return updateProxySectorTrainingCourse(v);
            } else {
                return insertProxySectorTrainingCourse({...v, course_id: id});
            }
        })));
    }
    if(job_position_list) {
        delete attrs.job_position_list;
        promises.push(Promise.all(job_position_list.map(async (v, n) => {
            if(v.id) {
                return updateProxyJobPositionTrainingCourse(v);
            } else {
                return insertProxyJobPositionTrainingCourse({...v, job_position_id: id});
            }
        })));
    }
    if(job_category_list) {
        delete attrs.job_category_list;
        promises.push(Promise.all(job_category_list.map(async (v, n) => {
            if(v.id) {
                return updateProxyJobCategoryTrainingMatrix(v);
            } else {
                return insertProxyJobCategoryTrainingMatrix({...v, job_category_id: id});
            }
        })));
    }

    await Promise.all(promises);

    return updateMutationImpl({
        mutation,
        id: attrs.id,
        attrs,
    });
};
