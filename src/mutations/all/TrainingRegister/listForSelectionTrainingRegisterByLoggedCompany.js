/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityUser} from "mutations/types.d.ts";
import listMutationImpl from "../../listMutationImpl";

// 2
const query = graphql`
    query listForSelectionTrainingRegisterByLoggedCompanyQuery($company_id: bigint) {
        sheq_training_registers_connection(where: {company_id: {_eq: $company_id}}) {
            edges {
                node {
                    id
                    created_at
                    date
                    institution_conducting_training
                    time_or_duration
                    list_proof
                    trainer{
                        id
                        fname
                        lname
                        email
                        phone
                    }
                    trainer_external{
                        id
                        fname
                        lname
                        email
                        phone
                    }
                    training{
                        id
                        course {
                            id
                            name
                        }
                    }
                    employee_list{
                        id
                        employee{
                            id
                            fname
                            lname
                            email
                            phone
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
    listMutationImpl({ query, variables: {company_id: input} });
