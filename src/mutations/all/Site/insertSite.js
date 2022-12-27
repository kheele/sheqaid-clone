/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntitySite} from "../../types.d.ts";

// 2
const mutation = graphql`
  mutation insertSiteMutation($object: default_sites_insert_input!) {
    insert_default_sites_one(
      object: $object
    ) {
      id
    }
  }
`;

// 3
export default (input: EntitySite) =>
  createMutationImpl({ mutation, input });
