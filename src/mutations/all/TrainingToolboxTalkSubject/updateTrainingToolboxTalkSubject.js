/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityTrainingToolboxTalkSubject} from "mutations/types.d.ts";
import findByIdTrainingToolboxTalkSubject from "./findByIdTrainingToolboxTalkSubject";

// 2
const mutation = graphql`
  mutation updateTrainingToolboxTalkSubjectMutation($id: sheq_training_toolbox_talk_subjects_pk_columns_input!, $_set: sheq_training_toolbox_talk_subjects_set_input!) {
    update_sheq_training_toolbox_talk_subjects_by_pk(pk_columns: $id, _set: $_set) {
        id
      name
    }
  }
`;

// 3
export default async (attrs: EntityTrainingToolboxTalkSubject) => {
  const {
    id,
    name,
  } = attrs;
  
  const item = await findByIdTrainingToolboxTalkSubject(id);
  if(!item) return;
  
  return updateMutationImpl({
    mutation,
    id: attrs.id,
    attrs,
  });
};
