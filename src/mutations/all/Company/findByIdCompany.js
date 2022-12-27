/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityCompany} from "../../types.d.ts";

// 2
const query = graphql`
  query findByIdCompanyQuery($id: bigint) {
    default_companies_connection(where: {id: {_eq: $id}}) {
      edges {
        node {
          id
          created_at
        }
      }
    }
  }
`;
//firestore_id
// 3
export default (input: number) =>
    findOneMutationImpl({ query, variables: {id: input} });
