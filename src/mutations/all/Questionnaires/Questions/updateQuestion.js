/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityQuestion} from "mutations/types.d.ts";
import findByIdQuestion from "./findByIdQuestion";
import {toJS} from "mobx";

// 2
const mutation = graphql`
    mutation updateQuestionMutation($id: default_contractor_questionnaires_ques_pk_columns_input!, $_set: default_contractor_questionnaires_ques_set_input!) {
        update_default_contractor_questionnaires_ques_by_pk(pk_columns: $id, _set: $_set) {
            id
        }
    }
`;

// 3
export default async (attrs: EntityQuestion) => {
	attrs = toJS(attrs);
	delete attrs.data;

	const {
		id,
		answer_asset,
		answer_employee,
	} = attrs;

	const _attrs = {...attrs};
	delete _attrs.open;
	delete _attrs.notified_list;
	delete _attrs.message_list;
	delete _attrs.question_list;
	delete _attrs.options;
	delete _attrs.questionnaire;
	delete _attrs.linkDoc;
	delete _attrs.answer_asset;
	delete _attrs.answer_employee;

	if(answer_asset) {
		_attrs.answer_asset_id = answer_asset.id;
	}
	if(answer_employee) {
		_attrs.answer_employee_id = answer_employee.id;
	}

	return updateMutationImpl({
		mutation,
		id,
		attrs: _attrs,
	}).then(res => res && findByIdQuestion(res.id));
};