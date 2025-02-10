/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";

// 2
const mutation = graphql`
    mutation insertQuestionOptionMutation($object: default_contractor_questionnaires_ques_options_insert_input!) {
        insert_default_contractor_questionnaires_ques_options_one(
            object: $object
        ) {
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
export default async (input) => {
	const {
		ques_id,
		answer,
		optionImage,
		optionText,
		optionType,
	} = input;

	const res = await createMutationImpl({
		mutation,
		input
	});
	if (res) {
		// return findByIdQuestion(res.id);
	}

	return res;
};
