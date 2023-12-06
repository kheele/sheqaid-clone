/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import findByJobPositionAndCourseIdProxyJobPositionTrainingCourse
    from "./findByJobPositionAndCourseIdProxyJobPositionTrainingCourse";

// 2
const mutation = graphql`
  mutation deleteProxyJobPositionTrainingCourseMutation($id: bigint!) {
    delete_proxy_job_position__training_course_by_pk(id: $id) {
        id
        course{
            id
            name
        }
        job_position{
            id
            name
        }
    }
  }
`;

// 3
export default async ({job_position_id, course_id}) => {
    const item = await findByJobPositionAndCourseIdProxyJobPositionTrainingCourse({job_position_id, course_id});
    if (!item) return;

    return updateMutationImpl({
        mutation,
        id: item.id,
    });
};