/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityTrainingToolboxTalkRegister} from "mutations/types.d.ts";

// 2
const query = graphql`
  query findByIdTrainingToolboxTalkRegisterQuery($id: bigint) {
    sheq_training_toolbox_talk_registers_connection(where: {id: {_eq: $id}}) {
      edges {
        node {
          id
          date
          subject{
            id
            name
          }
          employee_list{
            id
            signature
            date
            employee{
              id
              fname
              lname
              job_position{
                id
                name
              }
            }
          }
          site{
            id
            name
          }
          project{
            id
            name
          }
          client{
            id
            name
          }
          company{
            id
            name
          }
        }
      }
    }
  }
`;

// 3
export default async (input: number) =>
    findOneMutationImpl({ query, variables: {id: input} });
