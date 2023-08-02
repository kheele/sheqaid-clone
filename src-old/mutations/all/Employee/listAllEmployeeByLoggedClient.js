/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityEmployee} from "../../types.d.ts";
import listMutationImpl from "../../listMutationImpl";

// 2
const query = graphql`
  query listAllEmployeeByLoggedClientQuery($client_id: bigint) {
    hr_employees_connection(where: {client_id: {_eq: $client_id}}) {
      edges {
        node {
          ...EmployeeFragment
        }
      }
    }
  }
`;
//firestore_id
// 3
export default () =>
    listMutationImpl({ query, variables: {client_id: 1} });
