/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityCompanyCategory} from "../../types.d.ts";

// 2
const mutation = graphql`
  mutation insertCompanyCategoryMutation($object: default_company_categories_insert_input!) {
    insert_default_company_categories_one(
      object: $object
    ) {
      id
    }
  }
`;

// 3
export default (input: EntityCompanyCategory) =>
  createMutationImpl({ mutation, input });
