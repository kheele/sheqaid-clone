/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityTrainingToolboxTalkSubjectCategory} from "mutations/types.d.ts";
import findByIdTrainingToolboxTalkSubjectCategory from "./findByIdTrainingToolboxTalkSubjectCategory";

// 2
const mutation = graphql`
  mutation updateTrainingToolboxTalkSubjectCategoryMutation($id: sheq_training_toolbox_talk_subject_categories_pk_columns_input!, $_set: sheq_training_toolbox_talk_subject_categories_set_input!) {
    update_sheq_training_toolbox_talk_subject_categories_by_pk(pk_columns: $id, _set: $_set) {
        id
    }
  }
`;

// 3
export default async (attrs: EntityTrainingToolboxTalkSubjectCategory) => {
  const {
    id,
    name,
  } = attrs;
  
  const item = await findByIdTrainingToolboxTalkSubjectCategory(id);
  if(!item) return;
  
  return updateMutationImpl({
    mutation,
    id: attrs.id,
    attrs,
  });
};
