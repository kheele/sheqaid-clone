/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityTrainingRegister} from "mutations/types.d.ts";

// 2
const query = graphql`
  query findByIdTrainingRegisterQuery($id: bigint) {
    sheq_training_registers_connection(where: {id: {_eq: $id}}) {
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

          client {
            id
            name
          }
          project {
            id
            name
          }
          site {
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
    findOneMutationImpl({ query, variables: {id: input} });
