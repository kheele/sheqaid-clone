/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityTrainingToolboxTalk} from "mutations/types.d.ts";

// 2
const mutation = graphql`
  mutation updateTrainingToolboxTalkMutation($id: sheq_training_toolbox_talks_pk_columns_input!, $_set: sheq_training_toolbox_talks_set_input!) {
    update_sheq_training_toolbox_talks_by_pk(pk_columns: $id, _set: $_set) {
        id
    }
  }
`;

// 3
export default async (attrs: EntityTrainingToolboxTalk) =>
  updateMutationImpl({
    mutation,
    id: attrs.id,
    attrs,
  });
