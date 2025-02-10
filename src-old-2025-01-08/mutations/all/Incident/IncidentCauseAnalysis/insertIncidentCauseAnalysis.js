/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityAudit} from "mutations/types.d.ts";
import updateIncidentInvestigation from "../IncidentInvestigation/updateIncidentInvestigation";
import findByIdIncidentInvestigation from "../IncidentInvestigation/findByIdIncidentInvestigation";

// 2
const mutation = graphql`
  mutation insertIncidentCauseAnalysisMutation($object: sheq_incident_investigation_cause_analysis_insert_input!) {
    insert_sheq_incident_investigation_cause_analysis_one(
      object: $object
    ) {
      id
    }
  }
`;

// 3
export default async (input: EntityAudit) =>  {
  const {
    investigation_id,
  } = input;

  const investigation = await findByIdIncidentInvestigation(investigation_id);
  if(!investigation) {
    return "INVESTIGATION_NOT_FOUND";
  }

  delete input.investigation_id;

  const res = await createMutationImpl({mutation, input});
  if(res) {
   return updateIncidentInvestigation({id: investigation_id, cause_analysis_id: res.id});
  }
};
