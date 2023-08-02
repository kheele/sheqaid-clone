/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityContractorsQuestionnaireTemplate} from "mutations/types.d.ts";

// 2
const query = graphql`
  query findByIdContractorsQuestionnaireTemplateQuery($id: bigint) {
    default_contractor_questionnaire_templates_connection(where: {id: {_eq: $id}}) {
      edges {
        node {
          id
          created_at
          name
          category
          desc
          doc_version_list{
            id
            type
            doc_num
            doc
            expiry
          }
          latest_version: doc_version_list(order_by: {expiry: desc_nulls_last}){
            id
            type
            doc_num
            doc
            expiry
          }
          contractor_site{
            id
            name
          }
          contractor {
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
