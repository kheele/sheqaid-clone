/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityContractorsQuestionnaireTemplate} from "../../types.d.ts";

// 2
const query = graphql`
  query findByIdContractorsQuestionnaireTemplateQuery($id: bigint) {
    default_contractor_questionnaire_templates_connection(where: {id: {_eq: $id}}) {
      edges {
        node {
          id
        }
      }
    }
  }
`;
//firestore_id
// 3
export default (input: number) =>
    findOneMutationImpl({ query, variables: {id: input} });
