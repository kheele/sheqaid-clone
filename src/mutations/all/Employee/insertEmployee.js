/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityEmployee} from "mutations/types.d.ts";
import crudUtils from "../CRUDUtils/CRUDUtils";
import findByIdEmployee from "./findByIdEmployee";
import findByEmailEmployee from "./findByEmailEmployee";
import findByPhoneEmployee from "./findByPhoneEmployee";
import findByAuthIdUser from "../User/findByAuthIdUser";
import updateUser from "../User/updateUser";

// 2
const mutation = graphql`
    mutation insertEmployeeMutation($object: hr_employees_insert_input!) {
        insert_hr_employees_one(
            object: $object
        ) {
            id
            created_at,
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
            document_list_aggregate{
                aggregate{
                    count
                }
            }
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
            contractor {
                id
                name
            }
            contractor_client {
                id
                name
            }
            contractor_site {
                id
                name
            }
        }
    }
`;

// 3
export default async (input: EntityEmployee) => {
	const {
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
	} = input;

	let existingUser = await findByEmailEmployee(email);
	if (existingUser) {
		return "EMAIL_DUP";
	}
	existingUser = await findByPhoneEmployee(phone);
	if (existingUser) {
		return "PHONE_DUP";
	}

	if (email) {
		input.auth_id = await workers.emit("plugin_sheq_assist/employees/accounts/check/auth/username", email);
	}
	if (phone && !input.auth_id) {
		input.auth_id = await workers.emit("plugin_sheq_assist/employees/accounts/check/auth/username", phone);
	}

	if (input.auth_id) {
		const linkedUser = await findByAuthIdUser(input.auth_id);
		input.linked_user_id = linkedUser && linkedUser.id;
	}

	// let living_address_list_doc, banking_detail_list_doc, document_list_doc;
	// if (profile_pic) {
	// 	delete input.profile_pic;
	// }
	// if (living_address_list && living_address_list.data && living_address_list.data.anyMatch(v => !!v.doc)) {
	// 	living_address_list_doc = true;
	// 	delete input.living_address_list;
	// }
	// if (banking_detail_list && banking_detail_list.data && banking_detail_list.data.anyMatch(v => !!v.doc)) {
	// 	banking_detail_list_doc = true;
	// 	delete input.banking_detail_list;
	// }
	// if (document_list && document_list.data && document_list.data.anyMatch(v => !!v.doc)) {
	// 	document_list_doc = true;
	// 	delete input.document_list;
	// }

	crudUtils.injectCreate(input);

	const res = await createMutationImpl({mutation, input});
	if (res) {
		const {id} = res;

		if (input.linked_user_id) {
			await updateUser({id: input.linked_user_id, linked_employee_id: id});
		}

		// if (profile_pic || living_address_list_doc || banking_detail_list_doc || document_list_doc) {
		return new Promise((resolve, reject) => {
			findByIdEmployee(id).then(resolve, reject);//TODO: remove after socket on server send response

			socket.on('insertEmployee', (data) => {
				console.log('insertEmployee got', data);

				// Display the event data in the `content` div
				// document.querySelector('#content').innerHTML = event.data;
				findByIdEmployee(id).then(resolve, reject);
			});
		});

		// const updateAttrs = {};
		// const updoad = async ({key, doc, name}) => {
		// 	const path = `employees/${id}/docs`;
		// 	const gcsUri = await workers.emit("files/upload", {
		// 		file: doc,
		// 		path,
		// 		name,
		// 	});
		// 	console.log("gcsUri", gcsUri);
		// 	if (key) {
		// 		updateAttrs[key] = gcsUri;
		// 	} else {
		// 		return gcsUri;
		// 	}
		// };
		//
		// const promises = [];
		// if (profile_pic) {
		// 	const name = `profile_pic-${Dates.formatTimestamp(new Date())}`;
		// 	promises.push(updoad({
		// 		key: "profile_pic",
		// 		doc: profile_pic,
		// 		name,
		// 	}));
		// }
		// if (living_address_list_doc) {
		// 	promises.push(Promise.all(living_address_list.data.map(async (v, n) => {
		// 		const name = `living_address-${n}-${Dates.formatTimestamp(new Date())}`;
		// 		const gcsUri = await updoad({
		// 			doc: v.doc,
		// 			name,
		// 		});
		// 		v.doc = gcsUri;
		// 		return insertEmployeeDocLivingAddress({...v, employee_id: id});
		// 	})));
		// }
		// if (banking_detail_list_doc) {
		// 	promises.push(Promise.all(banking_detail_list.data.map(async (v, n) => {
		// 		const name = `banking_detail-${n}-${Dates.formatTimestamp(new Date())}`;
		// 		const gcsUri = await updoad({
		// 			doc: v.doc,
		// 			name,
		// 		});
		// 		v.doc = gcsUri;
		// 		return insertEmployeeDocBankingDetail({...v, employee_id: id});
		// 	})));
		// }
		// if (document_list_doc) {
		// 	promises.push(Promise.all(document_list.data.map(async (v, n) => {
		// 		const name = `document-${n}-${Dates.formatTimestamp(new Date())}`;
		// 		const gcsUri = await updoad({
		// 			doc: v.doc,
		// 			name,
		// 		});
		// 		v.doc = gcsUri;
		// 		return insertEmployeeDocDocument({...v, employee_id: id});
		// 	})));
		// }
		//
		// await Promise.all(promises);
		//
		// 	return updateEmployee({id, ...updateAttrs});
		// }

		return findByIdEmployee(id);
	}

	return res;
};
