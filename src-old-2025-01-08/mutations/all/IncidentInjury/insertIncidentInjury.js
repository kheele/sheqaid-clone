/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntitySector} from "mutations/types.d.ts";

// 2
const mutation = graphql`
  mutation insertIncidentInjuryMutation($object: sheq_incident_investigation_injury_list_insert_input!) {
    insert_sheq_incident_investigation_injury_list_one(
      object: $object
    ) {
      id
      name
      type
    }
  }
`;

// 3
export default async (input: EntitySector) =>
  createMutationImpl({ mutation, input });
