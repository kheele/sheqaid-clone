/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityQuestion} from "mutations/types.d.ts";
import {toJS} from "mobx";
import findByIdQuestionNotifiedList from "./findByIdQuestionNotifiedList";

// 2
const mutation = graphql`
    mutation updateQuestionNotifiedListMutation($id: proxy_contractor_questionnaires__notified_pk_columns_input!, $_set: proxy_contractor_questionnaires__notified_set_input!) {
        update_proxy_contractor_questionnaires__notified_by_pk(pk_columns: $id, _set: $_set) {
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
		ques,
		question_id,
		employee,
		employee_id,
	} = attrs;
	
	if(ques) {
		attrs.question_id = ques.id;
		delete attrs.ques;
	}

	if(employee) {
		attrs.employee_id = employee.id;
		delete attrs.employee;
	}

	const _attrs = {...attrs};
	
	return updateMutationImpl({
		mutation,
		id,
		attrs: _attrs,
	}).then(res => res && findByIdQuestionNotifiedList(res.id));
};
