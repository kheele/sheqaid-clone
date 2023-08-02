/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityUser} from "mutations/types.d.ts";
import listMutationImpl from "../../listMutationImpl";

// 2
const query = graphql`
  query listAllCountryQuery {
    default_countries_connection {
      edges {
        node {
          id
          name
          iso2
          phone_code
        }
      }
    }
  }
`;
//firestore_id
// 3
export default async () => {
  const {countries} = storage.list;
  if(countries && !countries.isEmpty()) {
    return countries;
  }
  return listMutationImpl({checkLogin: false, query });
}