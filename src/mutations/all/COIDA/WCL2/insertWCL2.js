/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityWCL2} from "mutations/types.d.ts";
import findByIdWCL2 from "./findByIdWCL2";

// 2
const mutation = graphql`
  mutation insertWCL2Mutation($object: coida_claims_wcl_2_insert_input!) {
    insert_coida_claims_wcl_2_one(
      object: $object
    ) {
      id
    }
  }
`;

// 3
export default async (input: EntityWCL2) => {
  const {
  } = input;

  return await createMutationImpl({mutation, input}).
  then(res => res && findByIdWCL2(res.id));
};
