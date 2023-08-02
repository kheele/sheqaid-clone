/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityUser} from "mutations/types.d.ts";
import listMutationImpl from "../../listMutationImpl";

// 2
const query = graphql`
    query listForSelectionJobCategoryByLoggedCompanyQuery($company_id: bigint) {
        default_job_categories_connection(where: {company_id: {_eq: $company_id}}, order_by: {name: asc}) {
            edges {
                node {
                    id
                    name
                    job_position_list{
                        id
                        name
                    }
                }
            }
        }
    }
`;
//firestore_id
// 3
export default async (input: number) =>
    listMutationImpl({ query, variables: {company_id: input} });
