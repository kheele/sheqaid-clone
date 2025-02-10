/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityOrganogram} from "mutations/types.d.ts";
import findByIdOrganogram
	from "views/plugins/plugin_extra/__C_Structure_And_Responsibility/OrganogramsTab/Query/List/findByIdOrganogram";
import insertProxyEmployeeOrganogramEmployee from '../ProxyEmployeeOrganogramEmployee/insertProxyEmployeeOrganogramEmployee';
import updateProxyEmployeeOrganogramEmployee from '../ProxyEmployeeOrganogramEmployee/updateProxyEmployeeOrganogramEmployee';
import insertProxyEmployeeOrganogram from '../ProxyEmployeeOrganogram/insertProxyEmployeeOrganogram';
import updateProxyEmployeeOrganogram from '../ProxyEmployeeOrganogram/updateProxyEmployeeOrganogram';

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
		id, target, client, project, site, type, doc, employee_list
	} = attrs;

	if(doc && !doc.dlUrls) {
		delete attrs.doc;

		const path = `organograms/${id}`;
		const name = "organogram-doc";
		const gcsUri = await workers.emit("files/upload", {
			file: doc,
			path,
			name,
		});
		console.log("gcsUri", gcsUri);

		attrs.doc = gcsUri;
	}

	if(employee_list) {
		delete attrs.employee_list;

		await Promise.all(employee_list.map(async v => {
			const {employee_list} = v;
			if(v.id) {
				if(employee_list) {
					delete v.employee_list;
					await Promise.all(employee_list.map(async v => {
						if(v.id) {
							return updateProxyEmployeeOrganogramEmployee(v);
						} else {
							return insertProxyEmployeeOrganogramEmployee({proxy_employee__organogram_id: v.id, ...v});
						}
					}));
				}
				return updateProxyEmployeeOrganogram(v);
			} else {
				if(employee_list) {
					v.employee_list = {
						data: employee_list,
					};
				}
				return insertProxyEmployeeOrganogram({organogram_id: id, ...v});
			}
		}));
	}

	return updateMutationImpl({
		mutation,
		id: attrs.id,
		attrs,
	}).
	then(res => res && findByIdOrganogram(res.id));
};
