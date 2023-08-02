/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityClient} from "mutations/types.d.ts";
import createMutationImpl from "../../createMutationImpl";

// 2
const mutation = graphql`
  mutation insertModuleProxyClientMutation($object: proxy_plugin_module__company_insert_input!) {
    insert_proxy_plugin_module__company_one(
        object: $object
    ) {
      id
    }
  }
`;

// 3
export default async (input) =>
    createMutationImpl({ mutation, input });
