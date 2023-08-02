/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityContractorSite} from "mutations/types.d.ts";

// 2
const mutation = graphql`
  mutation insertContractorSiteMutation($object: default_sites_insert_input!) {
    insert_default_sites_one(
      object: $object
    ) {
      id
    }
  }
`;

// 3
export default async (input: EntityContractorSite) =>
  createMutationImpl({ mutation, input });
