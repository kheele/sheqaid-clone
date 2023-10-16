/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityAudit} from "mutations/types.d.ts";
import findByIdIncidentCorrectiveAction from "./findByIdIncidentCorrectiveAction";
import updateIncidentCorrectiveAction from "./updateIncidentCorrectiveAction";
import updateIncident from "../updateIncident";
import findByIdIncident from "../findByIdIncident";

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
    incident_id,
  } = input;

  const incident = await findByIdIncident(incident_id);
  if(!incident) {
    return "INCIDENT_NOT_FOUND";
  }

  delete input.incident_id;

  const res = await createMutationImpl({mutation, input});
  if(res) {
   return updateIncident({id: incident_id, investigation_id: res.id, status_investigating: true,});
  }
};
