/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityUser} from "mutations/types.d.ts";
import listMutationImpl from "../../listMutationImpl";

// 2
const query = graphql`
  query listAllCompanyCategoryQuery {
    default_company_categories_connection(order_by: {name: asc}) {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;
//firestore_id
// 3
export default async () =>
    listMutationImpl({ checkLogin: false, query });
