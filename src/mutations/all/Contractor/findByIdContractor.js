/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityContractor} from "mutations/types.d.ts";

// 2
const query = graphql`
  query findByIdContractorQuery($id: bigint) {
    default_contractors_connection(where: {id: {_eq: $id}}) {
      edges {
        node {
          id
          created_at,
          name
          username
          inc_contractor_pack
          contractor_user_list_aggregate{
            aggregate{
              count
            }
          }
          employee_list_aggregate{
            aggregate{
              count
            }
          }
          questionnaire_list_aggregate:contractor_questionnaire_list_aggregate{
            aggregate{
              count
            }
          }
          questionnaire_active_list_aggregate:contractor_questionnaire_list_aggregate(where: {status: {_neq: "CompleteAccepted"}}){
            aggregate{
              count
            }
          }
          questionnaire_complete_list_aggregate:contractor_questionnaire_list_aggregate(where: {status: {_eq: "CompleteAccepted"}}){
            aggregate{
              count
            }
          }
          questionnaire_compliance_list_aggregate:contractor_questionnaire_list_aggregate(where: {status: {_eq: "CompleteAccepted"}}){
            nodes {
              id
              question_list_aggregate {
                aggregate {
                  sum {
                    score
                    maxScore
                  }
                  min {
                    score
                  }
                  max {
                    score
                  }
                  avg {
                    score
                  }
                }
              }
            }
          }
          incident_list_aggregate{
            aggregate{
              count
            }
          }
          site_pending_list:site_list(where: {status: {_eq: "Pending"}}){
            id
            status
            contractor{
              id
              name
              username
            }
            site {
              id
              name
              company {
                id
                name
              }
              client {
                id
                name
              }
              project {
                id
                name
              }
            }
          }
          site_accepted_list:site_list(where: {status: {_eq: "Accepted"}}){
            id
            status
            contractor{
              id
              name
              username
            }
            site {
              id
              name
              company {
                id
                name
              }
              client {
                id
                name
              }
              project {
                id
                name
              }
            }
          }
          site_declined_list:site_list(where: {status: {_eq: "Declined"}}){
            id
            status
            contractor{
              id
              name
              username
            }
            site {
              id
              name
              company {
                id
                name
              }
              client {
                id
                name
              }
              project {
                id
                name
              }
            }
          }
          site_cancelled_list:site_list(where: {status: {_eq: "Cancelled"}}){
            id
            status
            contractor{
              id
              name
              username
            }
            site {
              id
              name
              company {
                id
                name
              }
              client {
                id
                name
              }
              project {
                id
                name
              }
            }
          }
          site_removed_list:site_list(where: {status: {_eq: "Removed"}}){
            id
            status
            contractor{
              id
              name
              username
            }
            site {
              id
              name
              company {
                id
                name
              }
              client {
                id
                name
              }
              project {
                id
                name
              }
            }
          }
          site_list{
            id
            status
            contractor{
              id
              name
              username
            }
            site {
              id
              name
              company {
                id
                name
              }
              client {
                id
                name
              }
              project {
                id
                name
              }
            }
          }
          company {
            id
            name
          }
          client {
            id
            name
          }
          project {
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
