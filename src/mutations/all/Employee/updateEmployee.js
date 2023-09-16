/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityEmployee} from "mutations/types.d.ts";
import findByIdEmployee from "./findByIdEmployee";
import findByEmailDuplicateEmployee from "./findByEmailDuplicateEmployee";
import findByPhoneDuplicateEmployee from "./findByPhoneDuplicateEmployee";

// 2
const mutation = graphql`
    mutation updateEmployeeMutation($id: hr_employees_pk_columns_input!, $_set: hr_employees_set_input!) {
        update_hr_employees_by_pk(pk_columns: $id, _set: $_set) {
            id
            created_at
            fname
            lname
            full_name
            email
            phone
            dob
            sex
            id_num
            passport_num
            profile_pic
            employment_num
            employment_date
            medical_list_aggregate(where: {removed: {_eq: false}}){
                aggregate{
                    count
                }
            }
            leave_list_aggregate(where: {removed: {_eq: false}}){
                aggregate{
                    count
                }
            }
            ppe_list_aggregate{
                aggregate{
                    count
                }
            }
            trainer_training_matrix_list_aggregate{
                aggregate{
                    count
                }
            }
            warning_list_aggregate(where: {removed: {_eq: false}}){
                aggregate{
                    count
                }
            }
            supervisor_employee_list_aggregate(where: {removed: {_eq: false}}){
                aggregate{
                    count
                }
            }
            supervisor{
                id
                fname
                lname
                email
                phone
            }
            linked_user {
                id
                fname
                lname
                username
                phone
            }
            department {
                id
                name
            }
            job_position {
                id
                name
            }
            company {
                id
                name
            }
            client {
                id
                name
            }
            project {
                id
                name
            }
            site {
                id
                name
            }
        }
    }
`;

// 3
export default async (attrs: EntityEmployee) => {
	const {
		id,
		email,
		phone,
		profile_pic,
		//
		living_address_list,//[doc]
		banking_detail_list,//[doc]
		document_list,//[doc]
		//
		competency_list,//[doc]
		contract_list,//[doc]
		counselling_list,//[doc]
		leave_list,//[doc]
		license_list,//[doc]
		medical_list,//[doc]
		warning_list,//[doc]
		work_permit_list,//[doc]
		job_appointment_list,//[doc]
	} = attrs;

	const item = await findByIdEmployee(id);
	if (!item) return;

	if (email) {
		const existingUser = await findByEmailDuplicateEmployee({id, email});
		if (existingUser) {
			return "EMAIL_DUP";
		}
	}
	if (phone) {
		const existingUser = await findByPhoneDuplicateEmployee({id, phone});
		if (existingUser) {
			return "PHONE_DUP";
		}
	}

	// const has_profile_pic = profile_pic && !profile_pic.dlUrls;
	// const has_living_address = living_address_list && living_address_list.data;
	// const has_banking_detail = banking_detail_list && banking_detail_list.data;
	// const has_document = document_list && document_list.data;

	// if (has_profile_pic || has_living_address || has_banking_detail || has_document) {
	// 	const updoad = async ({key, doc, name}) => {
	// 		const path = `employees/${id}/docs`;
	// 		const gcsUri = await workers.emit("files/upload", {
	// 			file: doc,
	// 			path,
	// 			name,
	// 		});
	// 		console.log("gcsUri", gcsUri);
	// 		if (key) {
	// 			attrs[key] = gcsUri;
	// 		} else {
	// 			return gcsUri;
	// 		}
	// 	};
	//
	// 	const promises = [];
	// 	if (has_profile_pic) {
	// 		const name = `profile_pic-${Dates.formatTimestamp(new Date())}`;
	// 		promises.push(updoad({
	// 			key: "profile_pic",
	// 			doc: profile_pic,
	// 			name,
	// 		}));
	// 	}
	// 	if (has_living_address) {
	// 		delete attrs.living_address_list;
	// 		promises.push(Promise.all(living_address_list.data.map(async (v, n) => {
	// 			if (v.id) {
	// 				return updateEmployeeDocLivingAddress(v);
	// 			} else {
	// 				return insertEmployeeDocLivingAddress({...v, employee_id: id});
	// 			}
	// 		})));
	// 	}
	// 	if (has_banking_detail) {
	// 		delete attrs.banking_detail_list;
	// 		promises.push(Promise.all(banking_detail_list.data.map(async (v, n) => {
	// 			if (v.id) {
	// 				return updateEmployeeDocBankingDetail(v);
	// 			} else {
	// 				return insertEmployeeDocBankingDetail({...v, employee_id: id});
	// 			}
	// 		})));
	// 	}
	// 	if (has_document) {
	// 		delete attrs.document_list;
	// 		promises.push(Promise.all(document_list.data.map(async (v, n) => {
	// 			if (v.id) {
	// 				return updateEmployeeDocDocument(v);
	// 			} else {
	// 				return insertEmployeeDocDocument({...v, employee_id: id});
	// 			}
	// 		})));
	// 	}
	//
	// 	await Promise.all(promises);
	// }

	return updateMutationImpl({
		mutation,
		id: attrs.id,
		attrs,
	}).then(res => res && findByIdEmployee(res.id));
};