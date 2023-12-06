/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import findBySectorAndCourseIdProxySectorTrainingCourse from "./findBySectorAndCourseIdProxySectorTrainingCourse";

// 2
const mutation = graphql`
  mutation deleteProxySectorTrainingCourseMutation($id: bigint!) {
    delete_proxy_sector__training_course_by_pk(id: $id) {
      id
      course{
        id
        name
      }
      sector{
        id
        name
      }
    }
  }
`;

// 3
export default async ({sector_id, course_id}) => {
    const item = await findBySectorAndCourseIdProxySectorTrainingCourse({sector_id, course_id});
    if (!item) return;

    return updateMutationImpl({
        mutation,
        id: item.id,
    });
};