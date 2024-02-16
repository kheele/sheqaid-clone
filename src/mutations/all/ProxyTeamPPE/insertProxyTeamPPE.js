/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityProxyTeamPPE} from "mutations/types.d.ts";

// 2
const mutation = graphql`
  mutation insertProxyTeamPPEMutation($object: proxy_team__ppe_type_insert_input!) {
    insert_proxy_team__ppe_type_one(
      object: $object
    ) {
      id
    }
  }
`;

// 3
export default async (input: EntityProxyTeamPPE) =>
  createMutationImpl({ mutation, input });
