/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntitySector} from "mutations/types.d.ts";

// 2
const mutation = graphql`
  mutation insertIncidentActivityMutation($object: sheq_incident_investigation_activities_insert_input!) {
    insert_sheq_incident_investigation_activities_one(
      object: $object
    ) {
      id
      name
      sector{
        id
        name
      }
    }
  }
`;

// 3
export default (input: EntitySector) =>
  createMutationImpl({ mutation, input });
