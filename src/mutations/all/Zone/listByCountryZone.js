/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityUser} from "mutations/types.d.ts";
import listMutationImpl from "../../listMutationImpl";

// 2
const query = graphql`
    query listByCountryZoneQuery($country_iso2: String) {
        default_zones_connection(where: {country_iso2: {_eq: $country_iso2}}) {
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
export default async (input: string) =>
    listMutationImpl({checkLogin: false, query, variables: {country_iso2: input}});
