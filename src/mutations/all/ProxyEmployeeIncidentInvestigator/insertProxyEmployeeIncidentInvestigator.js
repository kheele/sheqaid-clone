/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityProxyEmployeeIncidentInvestigator} from "mutations/types.d.ts";

// 2
const mutation = graphql`
  mutation insertProxyEmployeeIncidentInvestigatorMutation($object: proxy_incident__investigator_insert_input!) {
    insert_proxy_incident__investigator_one(
      object: $object
    ) {
      id
    }
  }
`;

// 3
export default (input: EntityProxyEmployeeIncidentInvestigator) =>
  createMutationImpl({ mutation, input });
