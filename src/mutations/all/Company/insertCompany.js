/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityCompany} from "../../types.d.ts";

// 2
const mutation = graphql`
  mutation insertCompanyMutation($object: default_companies_insert_input!) {
    insert_default_companies_one(
      object: $object
    ) {
      id
    }
  }
`;

// 3
export default (input: EntityCompany) =>
  createMutationImpl({ mutation, input });
