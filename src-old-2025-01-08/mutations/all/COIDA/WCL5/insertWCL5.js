/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityWCL5} from "mutations/types.d.ts";
import findByIdWCL5 from "./findByIdWCL5";

// 2
const mutation = graphql`
  mutation insertWCL5Mutation($object: coida_claims_wcl_5_insert_input!) {
    insert_coida_claims_wcl_5_one(
      object: $object
    ) {
      id
    }
  }
`;

// 3
export default async (input: EntityWCL5) => {
  const {
  } = input;

  return await createMutationImpl({mutation, input}).
  then(res => res && findByIdWCL5(res.id));
};
