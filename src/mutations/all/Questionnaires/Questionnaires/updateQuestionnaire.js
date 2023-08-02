/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityQuestionnaire} from "mutations/types.d.ts";

// 2
const mutation = graphql`
    mutation updateQuestionnaireMutation($id: default_contractor_questionnaires_pk_columns_input!, $_set: default_contractor_questionnaires_set_input!) {
        update_default_contractor_questionnaires_by_pk(pk_columns: $id, _set: $_set) {
            id
        }
    }
`;

// 3
export default async (attrs: EntityQuestionnaire) => {
	const {} = attrs;

	return updateMutationImpl({
		mutation,
		id: attrs.id,
		attrs,
	});
};
