/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityTrainingCourse} from "mutations/types.d.ts";

// 2
const query = graphql`
  query findByNameTrainingCourseQuery($name: String, $client_id: bigint) {
    sheq_training_courses_connection(where: {client_id: {_eq: $client_id}, name: {_eq: $name}}) {
      edges {
        node {
          id
          client_id
        }
      }
    }
  }
`;
//firestore_id
// 3
export default ({name, client_id}) =>
    name && client_id && findOneMutationImpl({ query, variables: {name, client_id} });
