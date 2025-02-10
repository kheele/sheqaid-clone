/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityAudit} from "mutations/types.d.ts";
import findByIdIncidentCauseAnalysisCause from "./findByIdIncidentCauseAnalysisCause";
//
// 2
const mutation = graphql`
  mutation insertIncidentCauseAnalysisCauseMutation($object: sheq_incident_investigation_cause_analysis_causes_insert_input!) {
    insert_sheq_incident_investigation_cause_analysis_causes_one(
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
   return findByIdIncidentCauseAnalysisCause(res.id);
  }
};
