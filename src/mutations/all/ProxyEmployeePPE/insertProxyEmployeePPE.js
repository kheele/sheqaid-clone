/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityProxyEmployeePPE} from "mutations/types.d.ts";

// 2
const mutation = graphql`
  mutation insertProxyEmployeePPEMutation($object: proxy_employee__ppe_type_insert_input!) {
    insert_proxy_employee__ppe_type_one(
      object: $object
    ) {
      id
    }
  }
`;

// 3
export default (input: EntityProxyEmployeePPE) =>
  createMutationImpl({ mutation, input });
