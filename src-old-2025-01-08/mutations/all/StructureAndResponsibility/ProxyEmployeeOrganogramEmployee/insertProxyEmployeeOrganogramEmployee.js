/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityProxyEmployeeOrganogramEmployee} from "mutations/types.d.ts";

// 2
const mutation = graphql`
  mutation insertProxyEmployeeOrganogramEmployeeMutation($object: proxy_employee__organogram__employees_insert_input!) {
    insert_proxy_employee__organogram__employees_one(
      object: $object
    ) {
      id
    }
  }
`;

// 3
export default (input: EntityProxyEmployeeOrganogramEmployee) =>
  createMutationImpl({ mutation, input });
