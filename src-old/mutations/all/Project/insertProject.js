/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityProject} from "../../types.d.ts";

// 2
const mutation = graphql`
  mutation insertProjectMutation($object: default_projects_insert_input!) {
    insert_default_projects_one(
      object: $object
    ) {
      id
    }
  }
`;

// 3
export default (input: EntityProject) =>
  createMutationImpl({ mutation, input });
