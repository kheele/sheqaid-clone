/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityAudit} from "mutations/types.d.ts";
import findByIdIncidentSeverity from "./findByIdIncidentSeverity";

// 2
const mutation = graphql`
  mutation insertIncidentSeverityMutation($object: sheq_incident_investigation_severity_insert_input!) {
    insert_sheq_incident_investigation_severity_one(
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
   return findByIdIncidentSeverity(res.id);
  }
};
