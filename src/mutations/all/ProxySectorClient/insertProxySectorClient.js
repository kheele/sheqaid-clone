/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityProxySectorClient} from "mutations/types.d.ts";

// 2
const mutation = graphql`
  mutation insertProxySectorClientMutation($object: proxy_sector__client_insert_input!) {
    insert_proxy_sector__client_one(
      object: $object
    ) {
      id
    }
  }
`;

// 3
export default (input: EntityProxySectorClient) =>
  createMutationImpl({ mutation, input });
