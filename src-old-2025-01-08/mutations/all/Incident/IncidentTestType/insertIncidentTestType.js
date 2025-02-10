/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityAudit} from "mutations/types.d.ts";
import findByIdIncidentTestType from "./findByIdIncidentTestType";

// 2
const mutation = graphql`
  mutation insertIncidentTestTypeMutation($object: sheq_incident_investigation_test_type_list_insert_input!) {
    insert_sheq_incident_investigation_test_type_list_one(
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
   return findByIdIncidentTestType(res.id);
  }
};
