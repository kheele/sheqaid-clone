/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityAudit} from "mutations/types.d.ts";
import findByIdAuditItem from "./findByIdAuditItem";

// 2
const mutation = graphql`
    mutation updateAuditItemMutation($id: sheq_compliance_audits_items_pk_columns_input!, $_set: sheq_compliance_audits_items_set_input!) {
        update_sheq_compliance_audits_items_by_pk(pk_columns: $id, _set: $_set) {
            id
        }
    }
`;

// 3
export default async (attrs: EntityAudit) => {
	const {
		id,
	} = attrs;

	const item = await findByIdAuditItem(id);
	if (!item) return;

	return updateMutationImpl({
		mutation,
		id: attrs.id,
		attrs,
	}).then(res => res && findByIdAuditItem(id));
};
