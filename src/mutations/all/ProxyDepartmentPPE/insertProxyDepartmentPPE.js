/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityProxyDepartmentPPE} from "mutations/types.d.ts";

// 2
const mutation = graphql`
  mutation insertProxyDepartmentPPEMutation($object: proxy_department__ppe_insert_input!) {
    insert_proxy_department__ppe_one(
      object: $object
    ) {
      id
    }
  }
`;

// 3
export default (input: EntityProxyDepartmentPPE) =>
  createMutationImpl({ mutation, input });
