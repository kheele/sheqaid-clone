/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityUser} from "mutations/types.d.ts";
import listMutationImpl from "../../listMutationImpl";

// 2
const query = graphql`
    query listForSelectionEmployeeByLoggedProjectQuery($project_id: bigint) {
        hr_employees_connection(where: {project_id: {_eq: $project_id}}) {
            edges {
                node {
                    id
                    created_at,
                    fname
                    lname
                    full_name
                    email
                    phone
                    dob
                    sex
                    id_num
                    passport_num
                    profile_pic
                    employment_num
                }
            }
        }
    }
`;
//firestore_id
// 3
export default async (input: number) =>
    listMutationImpl({ query, variables: {project_id: input} });
