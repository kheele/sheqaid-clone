/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityMessage} from "mutations/types.d.ts";

// 2
const mutation = graphql`
    mutation insertMessageMutation($object: default_contractor_questionnaires_messages_insert_input!) {
        insert_default_contractor_questionnaires_messages_one(
            object: $object
        ) {
            id
            question_id
            date
            msg
            read
            sender_id
            recipient_id
            contractor_sender_id
            contractor_recipient_id
            sender{
                id
                full_name
                username
            }
            recipient{
                id
                full_name
                username
            }
            contractor_sender{
                id
                full_name
                username
            }
            contractor_recipient{
                id
                full_name
                username
            }
        }
    }
`;

// 3
export default async (input: EntityMessage) => {
	const {
		date,
		msg,
		read,
		sender_id,
	} = input;

	const {user} = storage.loggedUser;
	input.logged_user_id = user.id;

	const res = await createMutationImpl({
		mutation,
		input
	});

	return res;
};
