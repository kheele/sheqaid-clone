/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityQuestion} from "mutations/types.d.ts";
import {toJS} from "mobx";

// 2
const mutation = graphql`
    mutation updateQuestionOptionMutation($id: default_contractor_questionnaires_ques_options_pk_columns_input!, $_set: default_contractor_questionnaires_ques_options_set_input!) {
        update_default_contractor_questionnaires_ques_options_by_pk(pk_columns: $id, _set: $_set) {
            id
            answer
            optionImage
            optionText
            optionType
            ques{
                id
            }
        }
    }
`;

// 3
export default async (attrs: EntityQuestion) => {
	attrs = toJS(attrs);
	delete attrs.data;

	const {
		id,
		ques_id,
		answer,
		optionImage,
		optionText,
		optionType,
	} = attrs;

	const _attrs = {...attrs};
	// delete _attrs.linkDoc;

	// if(answer_asset) {
	// 	_attrs.answer_asset_id = answer_asset.id;
	// }
	
	return updateMutationImpl({
		mutation,
		id,
		attrs: _attrs,
	});
};
