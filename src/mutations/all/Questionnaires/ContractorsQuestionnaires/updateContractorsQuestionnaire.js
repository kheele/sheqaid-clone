/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityContractorsQuestionnaire} from "mutations/types.d.ts";
import findByIdContractorsQuestionnaire from "./findByIdContractorsQuestionnaire";

// 2
const mutation = graphql`
    mutation updateContractorsQuestionnaireMutation($id: default_contractor_questionnaires_pk_columns_input!, $_set: default_contractor_questionnaires_set_input!) {
        update_default_contractor_questionnaires_by_pk(pk_columns: $id, _set: $_set) {
            id
        }
    }
`;

// 3
export default async (attrs: EntityContractorsQuestionnaire) => {
	const {} = attrs;

	return updateMutationImpl({
		mutation,
		id: attrs.id,
		attrs,
	}).then(res => res && findByIdContractorsQuestionnaire(res.id));
};
