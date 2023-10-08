/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityClaimsProviderMessage} from "mutations/types.d.ts";

// 2
const mutation = graphql`
    mutation insertClaimsProviderMessageMutation($object: coida_claims_coid_provider_messages_insert_input!) {
        insert_coida_claims_coid_provider_messages_one(
            object: $object
        ) {
            id
            date
            msg
            read
            sender{
                id
            }
        }
    }
`;

// 3
export default async (input: EntityClaimsProviderMessage) => {
	return await createMutationImpl({mutation, input});
};
