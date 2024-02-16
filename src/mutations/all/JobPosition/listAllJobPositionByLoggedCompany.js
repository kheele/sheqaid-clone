/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityUser} from "mutations/types.d.ts";
import listMutationImpl from "../../listMutationImpl";

// 2
const query = graphql`
  query listAllJobPositionByLoggedCompanyQuery($company_id: bigint) {
    default_job_positions_connection(where: {company_id: {_eq: $company_id}}, order_by: {name: asc}) {
      edges {
        node {
          id
          created_at
          name
          desc
          doc
          job_position_owner
          employee_list_aggregate{
            aggregate{
              count
            }
          }
          employee_external_list_aggregate{
            aggregate{
              count
            }
          }
          ppe_type_list_aggregate{
            aggregate{
              count
            }
          }
          toolbox_talk_list_aggregate{
            aggregate{
              count
            }
          }
          training_plan_list_aggregate{
            aggregate{
              count
            }
          }
          job_category {
            id
            name
          }
          company{
            id
            name
          }
          client{
            id
            name
          }
          project{
            id
            name
          }
          site{
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
