/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityTeam} from "mutations/types.d.ts";
import listMutationImpl from "../../listMutationImpl";

// 2
const query = graphql`
  query listAllTeamByLoggedSiteQuery($site_id: bigint) {
    default_teams_connection(where: {site_id: {_eq: $site_id}}, order_by: {name: asc}) {
      edges {
        node {
          id
          created_at
          name
          status

          supervisor {
            id
            fname
            lname
            email
            phone
            job_position{
              id
              name
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

          employee_list_aggregate{
            aggregate{
              count
            }
          }
          ppe_type_list_aggregate{
            aggregate{
              count
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
