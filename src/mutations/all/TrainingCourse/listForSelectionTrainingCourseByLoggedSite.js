/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityUser} from "mutations/types.d.ts";
import listMutationImpl from "../../listMutationImpl";

// 2
const query = graphql`
    query listForSelectionTrainingCourseByLoggedSiteQuery($site_id: bigint) {
        sheq_training_courses_connection(
            where: {site_id: {_eq: $site_id}},
            order_by: [{name: asc_nulls_last}, {unit_standard: asc_nulls_last}, {unit_standard_desc: asc_nulls_last}]
        ) {
            edges {
                node {
                    id
                    name
                    unit_standard
                    sector_list {
                        id
                        sector{
                            id
                            name
                        }
                    }
                    job_position_list{
                        id
                        job_position{
                            id
                            name
                        }
                    }
                    training_plan_list{
                        id
                        completion_status
                        result
                        result_status
                        year
                        employee{
                            id
                            fname
                            lname
                            email
                            phone
                            id_num
                            passport_num
                            employment_num
                            job_position{
                                id
                                name
                            }
                            department{
                                id
                                name
                            }
                        }
                        course {
                            id
                            name
                        }
                        training{
                            id
                            course{
                                id
                                name
                            }
                        }
                    }
                }
            }
        }
    }
`;
//firestore_id
// 3
export default async (input: number) =>
    listMutationImpl({ query, variables: {site_id: input} });
