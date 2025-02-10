/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";

// 2
const query = graphql`
  query findByJobPositionAndCourseIdProxyJobPositionTrainingCourseQuery($job_position_id: bigint, $course_id: bigint) {
    proxy_job_position__training_course_connection(where: {job_position_id: {_eq: $job_position_id}, course_id: {_eq: $course_id}}) {
      edges {
        node {
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
    }
  }
`;
//firestore_id
// 3
export default async ({job_position_id, course_id}) =>
    findOneMutationImpl({ query, variables: {job_position_id, course_id} });
