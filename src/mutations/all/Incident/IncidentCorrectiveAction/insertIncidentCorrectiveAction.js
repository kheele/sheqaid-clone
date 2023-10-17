/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityAudit} from "mutations/types.d.ts";
import findByIdIncidentCorrectiveAction from "./findByIdIncidentCorrectiveAction";

// 2
const mutation = graphql`
  mutation insertIncidentCorrectiveActionMutation($object: sheq_incident_investigation_corrective_actions_factors_insert_input!) {
    insert_sheq_incident_investigation_corrective_actions_factors_one(
      object: $object
    ) {
      id
    }
  }
`;

// 3
export default async (input: EntityAudit) =>  {
  const {
  } = input;

  const res = await createMutationImpl({mutation, input});
  if(res) {
   return findByIdIncidentCorrectiveAction(res.id);
  }
};
