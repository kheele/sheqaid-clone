/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import {toJS} from 'mobx';
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityAudit} from "mutations/types.d.ts";
import findByIdAudit from "./findByIdAudit";
import {Dates} from "utils/Dates";
import updateAuditDefinition from "../AuditDefinition/updateAuditDefinition";
import insertAuditDefinition from "../AuditDefinition/insertAuditDefinition";
import updateAuditItem from "../AuditItem/updateAuditItem";
import insertAuditItem from "../AuditItem/insertAuditItem";
import updateProxyEmployeeAuditor from "../../ProxyEmployeeAuditor/updateProxyEmployeeAuditor";
import insertProxyEmployeeAuditor from "../../ProxyEmployeeAuditor/insertProxyEmployeeAuditor";
import updateProxyEmployeeAuditRepresentative
	from "../../ProxyEmployeeAuditRepresentative/updateProxyEmployeeAuditRepresentative";
import insertProxyEmployeeAuditRepresentative
	from "../../ProxyEmployeeAuditRepresentative/insertProxyEmployeeAuditRepresentative";

// 2
const mutation = graphql`
    mutation updateAuditMutation($id: sheq_compliance_audits_pk_columns_input!, $_set: sheq_compliance_audits_set_input!) {
        update_sheq_compliance_audits_by_pk(pk_columns: $id, _set: $_set) {
            id
        }
    }
`;

// 3
export default async (attrs: EntityAudit) => {
	attrs = toJS(attrs);

	const {
		id,
		//0
		client_id,
		project_id,
		site_id,
		//1
		scope,
		date,
		type,
		//2
		representative_list,
		//3
		auditor_list,
		//4
		definition_list,//[{title, desc}]
		//5
		list
	} = attrs;

	const audit_id = id;

	const item = await findByIdAudit(id);
	if (!item) return;

	if (representative_list && representative_list.isNotEmpty()) {
		//proxy_employee__audit_representative
		//{id, audit_id, employee_id, other_person_id}
		await Promise.all(representative_list.map(async v => {
			const {id, audit_id, employee_id, other_person_id, employee, other_person} = v;
			if (id) {
				const attrs = {};
				if(employee && employee.id !== employee_id) {
					attrs.employee_id = employee.id;
				}
				if(other_person) {
					if(!other_person.id) {
						attrs.other_person = other_person;
					} else if(other_person.id !== other_person_id) {
						attrs.other_person_id = other_person.id;
					}
				}
				if(Object.keys(attrs).isEmpty()) {
					return;
				}
				attrs.id = id;
				await updateProxyEmployeeAuditRepresentative(attrs);
			} else {
				const {other_person, employee} = v;
				await insertProxyEmployeeAuditRepresentative({
					audit_id,
					employee_id: employee && employee.id,
					other_person,
				});
			}
		}));
	}

	if (auditor_list && auditor_list.isNotEmpty()) {
		//proxy_employee__auditor
		//{id, audit_id, employee_id, other_person_id}
		await Promise.all(auditor_list.map(async v => {
			const {id, audit_id, employee_id, other_person_id, employee, other_person} = v;
			if (id) {
				const attrs = {};
				if(employee && employee.id !== employee_id) {
					attrs.employee_id = employee.id;
				}
				if(other_person) {
					if(!other_person.id) {
						attrs.other_person = other_person;
					} else if(other_person.id !== other_person_id) {
						attrs.other_person_id = other_person.id;
					}
				}
				if(Object.keys(attrs).isEmpty()) {
					return;
				}
				attrs.id = id;
				await updateProxyEmployeeAuditor(attrs);
			} else {
				const {other_person, employee} = v;
				await insertProxyEmployeeAuditor({
					audit_id,
					employee_id: employee && employee.id,
					other_person,
				});
			}
		}));
	}

	if (definition_list && definition_list.isNotEmpty()) {
		//sheq_compliance_audits_definitions
		//{id, audit_id, title, desc}
		await Promise.all(definition_list.map(async v => {
			const {id, audit_id, title, desc} = v;
			if (id) {
				delete v.audit;
				await updateAuditDefinition(toJS(v));
			} else {
				const {title, desc} = v;
				await insertAuditDefinition({
					audit_id, title, desc,
				});
			}
		}));
	}

	if (list && list.isNotEmpty()) {
		//sheq_compliance_audits_items
		//{}
		await Promise.all(list.map(async v => {
			const {
				id,
				achieved_score,//
				audit_findings,//
				audit_summary,//
				comments,//
				compliance,//
				due_date,//
				element,//
				possible_score,//
				target_date,//
				responsible_person,//
				sub_element,
			} = v;
			if (id) {
				delete v.responsible_person;
				await updateAuditItem({
					...toJS(v),
					due_date: Dates.formatDateSQL(due_date),//
					target_date: Dates.formatDateSQL(target_date),//
					responsible_person_id: responsible_person && responsible_person.id,
				});
			} else {
				const {title, desc} = v;
				await insertAuditItem({
					audit_id,
					//
					achieved_score,//
					audit_findings,//
					audit_summary,//
					comments,//
					compliance,//
					due_date: Dates.formatDateSQL(due_date),//
					element,//
					possible_score,//
					target_date: Dates.formatDateSQL(target_date),//
					responsible_person_id: responsible_person && responsible_person.id,//
					sub_element,
				});
			}
		}));
	}

	return updateMutationImpl({
		mutation,
		id: attrs.id,
		attrs,
	}).then(res => res && findByIdAudit(id));
};
