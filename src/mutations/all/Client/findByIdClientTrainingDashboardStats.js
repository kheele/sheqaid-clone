/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityCompany} from "mutations/types.d.ts";

// 2
const query = graphql`
    query findByIdClientTrainingDashboardStatsQuery($id: bigint) {
        default_clients_connection(where: {id: {_eq: $id}}) {
            edges {
                node {
                    id
                    cost_list_aggregate:training_matrix_list_aggregate{
                        aggregate {
                            sum {
                                cost
                            }
                        }
                    }
                    training_list_aggregate:training_matrix_list_aggregate{
                        aggregate{
                            count
                        }
                    }
                    participant_list_aggregate:training_plan_list_aggregate(where: {completion_status: {_eq: "Completed"}}) {
                        aggregate {
                            count(distinct: true, columns: employee_id)
                        }
                    }
                    training_course_list_aggregate{
                        aggregate{
                            count
                        }
                    }
                    institution_list_aggregate:training_matrix_list_aggregate{
                        aggregate {
                            count(distinct: true, columns: institution_conducting_training)
                        }
                    }
                    trainer_internal_list_aggregate:training_matrix_list_aggregate{
                        aggregate {
                            count(distinct: true, columns: trainer_id)
                        }
                    }
                    trainer_external_list_aggregate:training_matrix_list_aggregate{
                        aggregate {
                            count(distinct: true, columns: trainer_external_id)
                        }
                    }
                }
            }
        }
    }
`;

// 3
export default async ({input}) =>
    findOneMutationImpl({query, variables: {id: input}});
