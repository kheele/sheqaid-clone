/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityProxyJobPositionPPE} from "mutations/types.d.ts";

// 2
const mutation = graphql`
  mutation insertProxyJobPositionPPEMutation($object: proxy_job_position__ppe_insert_input!) {
    insert_proxy_job_position__ppe_one(
      object: $object
    ) {
      id
    }
  }
`;

// 3
export default (input: EntityProxyJobPositionPPE) =>
  createMutationImpl({ mutation, input });
