/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";

// 2
const query = graphql`
  query findBySectorAndCourseIdProxySectorTrainingCourseQuery($sector_id: bigint, $course_id: bigint) {
    proxy_sector__training_course_connection(where: {sector_id: {_eq: $sector_id}, course_id: {_eq: $course_id}}) {
      edges {
        node {
          id
        }
      }
    }
  }
`;
//firestore_id
// 3
export default async ({sector_id, course_id}) =>
    findOneMutationImpl({ query, variables: {sector_id, course_id} });
