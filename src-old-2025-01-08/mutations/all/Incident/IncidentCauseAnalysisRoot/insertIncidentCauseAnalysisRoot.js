/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityAudit} from "mutations/types.d.ts";
import findByIdIncidentCauseAnalysis from "../IncidentCauseAnalysis/findByIdIncidentCauseAnalysis";
import updateIncidentCauseAnalysis from "../IncidentCauseAnalysis/updateIncidentCauseAnalysis";

// 2
const mutation = graphql`
  mutation insertIncidentCauseAnalysisRootMutation($object: sheq_incident_investigation_cause_analysis_root_insert_input!) {
    insert_sheq_incident_investigation_cause_analysis_root_one(
      object: $object
    ) {
      id
    }
  }
`;

// 3
export default async (input: EntityAudit) =>  {
  const {
    cause_analysis_id,
  } = input;

  const cause_analysis = await findByIdIncidentCauseAnalysis(cause_analysis_id);
  if(!cause_analysis) {
    return "INCIDENT_CAUSE_ANALYSIS_NOT_FOUND";
  }

  delete input.cause_analysis_id;

  const res = await createMutationImpl({mutation, input});
  if(res) {
   return updateIncidentCauseAnalysis({id: cause_analysis_id, root_analysis_id: res.id,});
  }
};
