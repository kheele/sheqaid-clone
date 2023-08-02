/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityProxySectorCompany} from "mutations/types.d.ts";

// 2
const mutation = graphql`
  mutation insertProxySectorCompanyMutation($object: proxy_sector__company_insert_input!) {
    insert_proxy_sector__company_one(
      object: $object
    ) {
      id
    }
  }
`;

// 3
export default (input: EntityProxySectorCompany) =>
  createMutationImpl({ mutation, input });
