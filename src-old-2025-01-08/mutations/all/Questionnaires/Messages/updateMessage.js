/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityMessage} from "mutations/types.d.ts";
import {toJS} from "mobx";

// 2
const mutation = graphql`
    mutation updateMessageMutation($id: default_contractor_questionnaires_messages_pk_columns_input!, $_set: default_contractor_questionnaires_messages_set_input!) {
        update_default_contractor_questionnaires_messages_by_pk(pk_columns: $id, _set: $_set) {
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
export default async (attrs: EntityMessage) => {
	attrs = toJS(attrs);

	const {
		id,
	} = attrs;

	return updateMutationImpl({
		mutation,
		id,
		attrs: _attrs,
	});
};