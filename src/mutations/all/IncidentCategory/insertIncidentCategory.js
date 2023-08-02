/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntitySector} from "mutations/types.d.ts";

// 2
const mutation = graphql`
  mutation insertIncidentCategoryMutation($object: sheq_incident_investigation_categories_insert_input!) {
    insert_sheq_incident_investigation_categories_one(
      object: $object
    ) {
      id
      name
    }
  }
`;

// 3
export default (input: EntitySector) =>
  createMutationImpl({ mutation, input });
