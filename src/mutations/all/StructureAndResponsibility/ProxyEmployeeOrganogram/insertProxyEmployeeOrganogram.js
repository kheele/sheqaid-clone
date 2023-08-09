/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityProxyEmployeeOrganogram} from "mutations/types.d.ts";

// 2
const mutation = graphql`
  mutation insertProxyEmployeeOrganogramMutation($object: proxy_employee__organogram_insert_input!) {
    insert_proxy_employee__organogram_one(
      object: $object
    ) {
      id
    }
  }
`;

// 3
export default (input: EntityProxyEmployeeOrganogram) =>
  createMutationImpl({ mutation, input });
