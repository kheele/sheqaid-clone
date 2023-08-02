/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityProxyEmployeeAuditRepresentative} from "mutations/types.d.ts";

// 2
const mutation = graphql`
  mutation insertProxyEmployeeAuditRepresentativeMutation($object: proxy_employee__audit_representative_insert_input!) {
    insert_proxy_employee__audit_representative_one(
      object: $object
    ) {
      id
    }
  }
`;

// 3
export default (input: EntityProxyEmployeeAuditRepresentative) =>
  createMutationImpl({ mutation, input });
