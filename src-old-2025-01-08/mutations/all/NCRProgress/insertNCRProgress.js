/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityNCRProgress} from "mutations/types.d.ts";

// 2
const mutation = graphql`
  mutation insertNCRProgressMutation($object: sheq_non_conformance_progress_insert_input!) {
    insert_sheq_non_conformance_progress_one(
      object: $object
    ) {
      id
      outstanding
      notes
      date
    }
  }
`;

// 3
export default async (input: EntityNCRProgress) => {
    const {
        outstanding,
        notes,
        date,
    } = input;

    return createMutationImpl({mutation, input});
};
