/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntitySafetyFilesQuestionnaire} from "mutations/types.d.ts";
import findByIdSafetyFilesQuestionnaireTemplate from "./findByIdSafetyFilesQuestionnaireTemplate";
import {updateQuestion} from "mutations/update";
import {insertQuestion} from "mutations/create";

const mutation = graphql`
    mutation updateSafetyFilesQuestionnaireTemplateMutation($id: default_contractor_questionnaires_pk_columns_input!, $_set: default_contractor_questionnaires_set_input!) {
        update_default_contractor_questionnaires_by_pk(pk_columns: $id, _set: $_set) {
            id
        }
    }
`;

export default async (attrs: EntitySafetyFilesQuestionnaire) => {
    const {id, question_list} = attrs;

    if (question_list) {
        delete attrs.question_list;

        await Promise.all(question_list.map(async q => {
            if (q.id) {
                return updateQuestion(q);
            } else {
                return insertQuestion({questionnaire_id: id, ...q});
            }
        }));
    }

    return updateMutationImpl({
        mutation,
        id: attrs.id,
        attrs,
    }).then(res => res && findByIdSafetyFilesQuestionnaireTemplate(res.id));
};
