/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityUser} from "mutations/types.d.ts";
import listMutationImpl from "../../listMutationImpl";

// 2
const query = graphql`
    query listAllSectorByPublicQuery {
        default_sectors_connection(where: {sector_owner: {_eq: "Public"}}, order_by: {name: asc}) {
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
    listMutationImpl({checkLogin: false, query});
