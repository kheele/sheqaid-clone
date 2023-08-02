/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityEmployeeWorkPermit} from "mutations/types.d.ts";

// 2
const query = graphql`
  query findByIdEmployeeDocLivingAddressQuery($id: bigint) {
    hr_employees_living_address_connection(where: {id: {_eq: $id}}) {
      edges {
        node {
          id
          is_default
          doc
          local_address
          street_address
          employee_id
          employee{
            id
          }
          city{
            id
            name
          }
          zone{
            id
            name
          }
          country{
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
export default async (input: number) =>
    findOneMutationImpl({ query, variables: {id: input} });
