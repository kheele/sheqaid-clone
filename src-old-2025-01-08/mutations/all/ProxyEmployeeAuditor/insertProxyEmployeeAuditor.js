/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityProxyEmployeeAuditor} from "mutations/types.d.ts";

// 2
const mutation = graphql`
  mutation insertProxyEmployeeAuditorMutation($object: proxy_employee__auditor_insert_input!) {
    insert_proxy_employee__auditor_one(
      object: $object
    ) {
      id
    }
  }
`;

// 3
export default (input: EntityProxyEmployeeAuditor) =>
  createMutationImpl({ mutation, input });
