/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityClaimsClient} from "mutations/types.d.ts";
import findByIdClaimsClient from "./findByIdClaimsClient";

// 2
const mutation = graphql`
    mutation updateClaimsClientMutation($id: coida_claims_pk_columns_input!, $_set: coida_claims_set_input!) {
        update_coida_claims_by_pk(pk_columns: $id, _set: $_set) {
            id
        }
    }
`;

// 3
export default async (attrs: EntityClaimsClient) => {
	const {
		id,
		claim_number,
		doctor_email,
	} = attrs;
	
	const item = await findByIdClaimsClient(id);
	if (!item) return 'NOT_FOUND';
	
	return updateMutationImpl({
		mutation,
		id: attrs.id,
		attrs,
	});
};
