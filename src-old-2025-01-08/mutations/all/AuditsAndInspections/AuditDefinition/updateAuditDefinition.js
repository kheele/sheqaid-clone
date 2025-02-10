/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityAudit} from "mutations/types.d.ts";
import findByIdAuditDefinition from "./findByIdAuditDefinition";

// 2
const mutation = graphql`
    mutation updateAuditDefinitionMutation($id: sheq_compliance_audits_definitions_pk_columns_input!, $_set: sheq_compliance_audits_definitions_set_input!) {
        update_sheq_compliance_audits_definitions_by_pk(pk_columns: $id, _set: $_set) {
            id
        }
    }
`;

// 3
export default async (attrs: EntityAudit) => {
	const {
		id,
	} = attrs;

	const item = await findByIdAuditDefinition(id);
	if (!item) return;

	return updateMutationImpl({
		mutation,
		id: attrs.id,
		attrs,
	}).then(res => res && findByIdAuditDefinition(id));
};
