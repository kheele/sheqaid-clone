/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityUser} from "mutations/types.d.ts";

// 2
const query = graphql`
  query findByUsernameEmployeeQuery($username: String) {
    hr_employees_connection(where: {_or: [{email: {_eq: $username}}, {phone: {_eq: $username}}]}) {
      edges {
        node {
          id
          auth_id
        }
      }
    }
  }
`;
//firestore_id
// 3
export default async (input: string) =>
    input && findOneMutationImpl({checkLogin: false, query, variables: {username: input} });
