/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import findByIdQuestionNotifiedList from "./findByIdQuestionNotifiedList";

// 2
const mutation = graphql`
    mutation insertQuestionNotifiedListMutation($object: proxy_contractor_questionnaires__notified_insert_input!) {
        insert_proxy_contractor_questionnaires__notified_one(
            object: $object
        ) {
            id
        }
    }
`;

// 3
export default async (input) => {
	const {
		ques,
		question_id,
		employee,
		employee_id,
	} = input;
	
	if(ques) {
		input.question_id = ques.id;
		delete input.ques;
	}
	
	if(employee) {
		input.employee_id = employee.id;
		delete input.employee;
	}

	const res = await createMutationImpl({
		mutation,
		input
	});
	if (res) {
		return findByIdQuestionNotifiedList(res.id);
	}

	return res;
};
