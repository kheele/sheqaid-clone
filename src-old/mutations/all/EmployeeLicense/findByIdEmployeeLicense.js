/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityEmployeeLicense} from "../../types.d.ts";

// 2
const query = graphql`
  query findByIdEmployeeLicenseQuery($id: bigint) {
    hr_employees_docs_licenses_connection(where: {id: {_eq: $id}}) {
      edges {
        node {
          id
          employee {
            id
          }
        }
      }
    }
  }
`;
//firestore_id
// 3
export default (input: number) =>
    findOneMutationImpl({ query, variables: {id: input} });
