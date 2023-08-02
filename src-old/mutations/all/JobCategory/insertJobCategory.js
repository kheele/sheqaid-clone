/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityJobCategory} from "../../types.d.ts";

// 2
const mutation = graphql`
  mutation insertJobCategoryMutation($object: default_job_categories_insert_input!) {
    insert_default_job_categories_one(
      object: $object
    ) {
      id
    }
  }
`;

// 3
export default (input: EntityJobCategory) =>
  createMutationImpl({ mutation, input });
