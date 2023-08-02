/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityUser} from "mutations/types.d.ts";
import listMutationImpl from "../../listMutationImpl";

// 2
const query = graphql`
    query listForSelectionTrainingMatrixByLoggedProjectQuery($project_id: bigint) {
        sheq_training_matrices_connection(
            where: {project_id: {_eq: $project_id}},
            order_by: [
                {course: {name: asc_nulls_last}},
                {course: {unit_standard: asc_nulls_last}},
                {course: {unit_standard_desc: asc_nulls_last}},
                {unit_standard: asc_nulls_last},
                {unit_standard_desc: asc_nulls_last}
            ]
        ) {
            edges {
                node {
                    id
                    unit_standard
                    date_range_start
                    date_range_end
                    course{
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
    listMutationImpl({ query, variables: {project_id: input} });
