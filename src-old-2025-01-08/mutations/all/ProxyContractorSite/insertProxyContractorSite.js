/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityProxyContractorSite} from "mutations/types.d.ts";

// 2
const mutation = graphql`
  mutation insertProxyContractorSiteMutation($object: proxy_contractors__sites_insert_input!) {
    insert_proxy_contractors__sites_one(
      object: $object
    ) {
      id
    }
  }
`;

// 3
export default (input: EntityProxyContractorSite) =>
  createMutationImpl({ mutation, input });
