/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityUser} from "../../types.d.ts";
import listMutationImpl from "../../listMutationImpl";

// 2
const query = graphql`
  query listAllCountryQuery {
    default_countries_connection {
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
export default () =>
    listMutationImpl({ query });
