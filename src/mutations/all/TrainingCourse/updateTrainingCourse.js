/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityTrainingCourse} from "mutations/types.d.ts";
import findByIdEmployeeDocLivingAddress
    from "../EmployeeDocument/EmployeeDocLivingAddress/findByIdEmployeeDocLivingAddress";
import findByIdTrainingCourse from "./findByIdTrainingCourse";
import updateEmployeeDocLivingAddress
    from "../EmployeeDocument/EmployeeDocLivingAddress/updateEmployeeDocLivingAddress";
import insertEmployeeDocLivingAddress
    from "../EmployeeDocument/EmployeeDocLivingAddress/insertEmployeeDocLivingAddress";
import updateProxySectorTrainingCourse from "../ProxySectorTrainingCourse/updateProxySectorTrainingCourse";
import insertProxySectorTrainingCourse from "../ProxySectorTrainingCourse/insertProxySectorTrainingCourse";
import updateProxyJobPositionTrainingCourse
    from "../ProxyJobPositionTrainingCourse/updateProxyJobPositionTrainingCourse";
import insertProxyJobPositionTrainingCourse
    from "../ProxyJobPositionTrainingCourse/insertProxyJobPositionTrainingCourse";

// 2
const mutation = graphql`
  mutation updateTrainingCourseMutation($id: sheq_training_courses_pk_columns_input!, $_set: sheq_training_courses_set_input!) {
    update_sheq_training_courses_by_pk(pk_columns: $id, _set: $_set) {
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
export default async (attrs: EntityTrainingCourse) => {
    const {
        id,
        name,
        frequency,
        // sector_list,
        provider,
        // job_position_list,
        unit_standard,
        unit_standard_desc,
        client_id, project_id, site_id,
    } = attrs;

    const item = await findByIdTrainingCourse(id);
    if (!item) return;

    return updateMutationImpl({
        mutation,
        id,
        attrs,
    });
};