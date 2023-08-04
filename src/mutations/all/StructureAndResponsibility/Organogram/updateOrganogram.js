/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityOrganogram} from "mutations/types.d.ts";
import findByIdOrganogram
	from "views/plugins/plugin_extra/__C_Structure_And_Responsibility/OrganogramsTab/Query/List/findByIdOrganogram";

// 2
const mutation = graphql`
    mutation updateOrganogramMutation($id: sheq_organograms_pk_columns_input!, $_set: sheq_organograms_set_input!) {
        update_sheq_organograms_by_pk(pk_columns: $id, _set: $_set) {
            id
        }
    }
`;

// 3
export default async (attrs: EntityOrganogram) => {
	const {
		target, client, project, site, type, doc, employee_list
	} = attrs;

	return updateMutationImpl({
		mutation,
		id: attrs.id,
		attrs,
	}).
	then(res => res && findByIdOrganogram(res.id));
};
