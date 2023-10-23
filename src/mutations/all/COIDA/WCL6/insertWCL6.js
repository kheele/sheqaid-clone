/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityWCL6} from "mutations/types.d.ts";
import findByIdWCL6 from "./findByIdWCL6";

// 2
const mutation = graphql`
  mutation insertWCL6Mutation($object: coida_claims_wcl_6_insert_input!) {
    insert_coida_claims_wcl_6_one(
      object: $object
    ) {
      id
    }
  }
`;

// 3
export default async (input: EntityWCL6) => {
  const {
  } = input;

  return await createMutationImpl({mutation, input}).
  then(res => res && findByIdWCL6(res.id));
};
