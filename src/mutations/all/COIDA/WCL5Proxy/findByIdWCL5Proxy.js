/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityWCL5Proxy} from "mutations/types.d.ts";
import {Dates} from "../../../../utils/Dates";

// 2
const query = graphql`
  query findByIdWCL5ProxyQuery($id: bigint) {
    proxy_coida_claims__wcl_5_connection(where: {id: {_eq: $id}}) {
      edges {
        node {
          id
        }
      }
    }
  }
`;
//firestore_id
// 3
export default async (input: number) =>
    findOneMutationImpl({ query, variables: {id: input} });
