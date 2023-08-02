/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityTrainingManual} from "../../types.d.ts";

// 2
const mutation = graphql`
  mutation insertTrainingManualMutation($object: sheq_training_manuals_insert_input!) {
    insert_sheq_training_manuals_one(
      object: $object
    ) {
      id
    }
  }
`;

// 3
export default (input: EntityTrainingManual) =>
  createMutationImpl({ mutation, input });
