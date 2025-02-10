/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityWCL5Proxy} from "mutations/types.d.ts";
import crudUtils from "../../CRUDUtils/CRUDUtils";
import {Dates} from "../../../../utils/Dates";

// 2
const mutation = graphql`
  mutation insertWCL5ProxyMutation($object: proxy_coida_claims__wcl_5_insert_input!) {
    insert_proxy_coida_claims__wcl_5_one(
      object: $object
    ) {
      id
    }
  }
`;

// 3
export default async (input: EntityWCL5Proxy) => {
  const {
  } = input;

  return await createMutationImpl({mutation, input});
};
