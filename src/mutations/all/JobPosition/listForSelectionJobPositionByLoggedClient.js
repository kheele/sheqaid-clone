/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityUser} from "mutations/types.d.ts";
import listMutationImpl from "../../listMutationImpl";

// 2
const query = graphql`
    query listForSelectionJobPositionByLoggedClientQuery($client_id: bigint) {
        default_job_positions_connection(where: {client_id: {_eq: $client_id}}, order_by: {name: asc}) {
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
export default async (input: number) =>
    listMutationImpl({ query, variables: {client_id: input} });
