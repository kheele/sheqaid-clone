/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityUser} from "../../types.d.ts";
import listMutationImpl from "../../listMutationImpl";

// 2
const query = graphql`
    query listByZoneCityQuery($zone_id: bigint) {
        default_cities_connection(where: {zone_id: {_eq: $zone_id}}) {
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
export default (input: number) =>
    listMutationImpl({query, variables: {zone_id: input}});
