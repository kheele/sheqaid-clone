import {Dates, execWhen} from "../Utils";
import findByFirestoreIdCompany from "mutations/all/Company/findByFirestoreIdCompany";
import findByFirestoreIdClient from "mutations/all/Client/findByFirestoreIdClient";
import findByFirestoreIdProject from "mutations/all/Project/findByFirestoreIdProject";
import insertEmployee from "mutations/all/Employee/insertEmployee";
import findByFirestoreIdSite from "../../mutations/all/Site/findByFirestoreIdSite";
import findByFirestoreIdUser from "../../mutations/all/User/findByFirestoreIdUser";
import findByFirestoreIdContractor from "../../mutations/all/Contractor/findByFirestoreIdContractor";
import findByFirestoreIdContractorUser from "../../mutations/all/ContractorUser/findByFirestoreIdContractorUser";
import findByFirestoreIdDepartment from "../../mutations/all/Department/findByFirestoreIdDepartment";
import findByFirestoreIdJobPosition from "../../mutations/all/JobPosition/findByFirestoreIdJobPosition";
import findByFirestoreIdEmployee from "../../mutations/all/Employee/findByFirestoreIdEmployee";
import findByNameCity from "../../mutations/all/City/findByNameCity";
import findByNameZone from "../../mutations/all/Zone/findByNameZone";
import updateEmployee from "../../mutations/all/Employee/updateEmployee";

const tbl = "employees";
//<editor-fold desc="transfer">
export const employees_transfer = async () => {
	await execWhen(() => window.db && window.storage && storage.loggedUserAuth && storage.loggedUser);

	const {sess_company_id, sess_my_client_id, sess_my_project_id, sess_my_site_id} = storage.sessionIds;
	const {selectedClient, selectedProject, selectedSite} = storage.selected;

	

	let list = await workers.emit('relay/get_db_hr', tbl);
	

	// list = list.filter(({id, data: {company_id}}) => company_id === sess_company_id);
	// if(selectedClient || sess_my_client_id) {
	//     if(sess_my_client_id) {
	//         list = list.filter(({id, data: {client_id}}) => client_id === sess_my_client_id);
	//     } else {
	//         list = list.filter(({id, data: {client_id}}) => client_id === selectedClient.id);
	//     }
	// }
	// if(selectedProject || sess_my_project_id) {
	//     if(sess_my_project_id) {
	//         list = list.filter(({id, data: {project_id}}) => project_id === sess_my_project_id);
	//     } else {
	//         list = list.filter(({id, data: {project_id}}) => project_id === selectedProject.id);
	//     }
	// }
	// if(selectedSite || sess_my_site_id) {
	//     if(sess_my_site_id) {
	//         list = list.filter(({id, data: {site_id}}) => site_id === sess_my_site_id);
	//     } else {
	//         list = list.filter(({id, data: {site_id}}) => site_id === selectedSite.id);
	//     }
	// }

	for (let n = 0; n < list.length; n++) {
		const {id, data} = list[n];
		const existingItem = await findByFirestoreIdEmployee(id);
		if (existingItem) {

		} else {
			const {
				fname,//
				lname,//
				id_num,//
				passport_num,//
				dob,//
				sex, gender,//
				removed,//
				notifications_removed,//
				email,//
				phone,//
				linked_user_id,//

				documents,//type=[ID, Passport, Driver/Operactor Licence, PrDP, Work Permit]
				compliance_requirements,//[{status, text}]
				dependants,//[{fname, lname, dob, gender}]
				docs,//[hr-modules]
				incident_list,//
				next_of_kin_1,//
				next_of_kin_2,//{fname, lname, phone1, phone2, relationship}
				optional_info,

				created_at,//
				company_id,//
				client_id,//
				project_id,//
				site_id,//
				client,//
				project,//
				site,//
				user_id,//

				contractor_id,//
				contractor_site_id,//
				contractor_user_id,//
			} = data;

			const {
				banking_account_num,
				banking_branch,
				banking_branch_code,
				banking_name,
				banking_doc,

				company_num,
				employment_num,
				employee_id,
				employment_date,

				living_addr_city,//
				living_addr_local_area,
				living_addr_province,//
				living_addr_street,
				living_addr_doc,

				supervisor_email,
				supervisor_name,
				supervisor_phone,

				department,
				job_position,
			} = optional_info || {};

			const {
				doc_id_or_passport_expiry,
				doc_id_or_passport,
				doc_driver_or_operator_licence_expiry,
				doc_driver_or_operator_licence,
				doc_pdrp_expiry,
				doc_pdrp,
				doc_work_permit_expiry,//
				doc_work_permit,//
			} = documents || {};

			const {id: department_id} = department || {};
			const {id: job_position_id} = job_position || {};

			const document_list = [];
			if (doc_id_or_passport) {
				document_list.push({
					type: 'ID/Passport',
					doc: doc_id_or_passport,
					expiry_date: Dates.formatTimestampSQL(doc_id_or_passport_expiry)
				});
			}
			if (doc_driver_or_operator_licence) {
				document_list.push({
					type: 'Driver/Operactor Licence',
					doc: doc_driver_or_operator_licence,
					expiry_date: Dates.formatTimestampSQL(doc_driver_or_operator_licence_expiry)
				});
			}
			if (doc_pdrp) {
				document_list.push({
					type: 'PrDP',
					doc: doc_pdrp,
					expiry_date: Dates.formatTimestampSQL(doc_pdrp_expiry)
				});
			}
			// if(doc_work_permit) {
			//     // document_list.push({});work_permit_list
			// }

			let supervisor_id;
			if (isObject(supervisor_name)) {
				supervisor_id = supervisor_name.id;
			}


			const existingItem = await findByFirestoreIdEmployee(id);
			if(existingItem) {

			} else {
				const pg_company = await findByFirestoreIdCompany(company_id);
				if (!pg_company) {

				} else {
					const pg_client = await findByFirestoreIdClient(client ? client.id : client_id);
					const pg_project = await findByFirestoreIdProject(project ? project.id : project_id);
					const pg_site = await findByFirestoreIdSite(site ? site.id : site_id);
					const pg_user = await findByFirestoreIdUser(user_id);
					const pg_linked_user = await findByFirestoreIdUser(linked_user_id);

					const pg_contractor = await findByFirestoreIdContractor(contractor_id);
					const pg_contractor_site = await findByFirestoreIdSite(contractor_site_id);
					const pg_contractor_user = await findByFirestoreIdContractorUser(contractor_user_id);

					const pg_department = await findByFirestoreIdDepartment(department_id);
					const pg_job_position = await findByFirestoreIdJobPosition(job_position_id);
					const pg_supervisor = await findByFirestoreIdEmployee(supervisor_id);

					let living_addr_city_id;
					let living_addr_province_id;
					let living_addr_country_id;

					const pg_living_addr_city = await findByNameCity(living_addr_city);
					const pg_living_addr_province = await findByNameZone(living_addr_province);
					// const pg_living_addr_country = await findByFirestoreIdEmployee(living_addr_province);

					if (pg_living_addr_city) {
						living_addr_city_id = pg_living_addr_city.id;
						if (pg_living_addr_city.zone) {
							living_addr_province_id = convertIdToBigint(pg_living_addr_city.zone.id);
						}
						if (pg_living_addr_city.country) {
							living_addr_country_id = convertIdToBigint(pg_living_addr_city.country.id);
						}
					}
					if (!living_addr_province_id && pg_living_addr_province) {
						living_addr_province_id = pg_living_addr_province.id;
						if (!living_addr_country_id && pg_living_addr_province.country) {
							living_addr_country_id = convertIdToBigint(pg_living_addr_province.country.id);
						}
					}

					const banking_detail_list = [];
					if (banking_account_num || banking_branch || banking_branch_code || banking_name || banking_doc) {
						banking_detail_list.push({
							account_num: banking_account_num,
							branch: banking_branch,
							code: banking_branch_code,
							name: banking_name,
							doc: banking_doc,
							is_default: true,
						});
					}

					const living_address_list = [];
					if (living_addr_street || living_addr_local_area || living_addr_city_id || living_addr_province_id || living_addr_country_id || living_addr_doc) {
						living_address_list.push({
							street_address: living_addr_street,
							local_address: living_addr_local_area,
							city_id: living_addr_city_id,//living_addr_city
							zone_id: living_addr_province_id,//living_addr_province
							country_id: living_addr_country_id,
							doc: living_addr_doc,
							is_default: true,
						});
					}

					const item = {
						firestore_id: id,
						fname,
						lname,
						id_num: id_num && String(id_num),
						passport_num,
						dob: Dates.formatTimestampSQL(dob),
						sex: (sex || gender) === "male" ? "Male" : ((sex || gender) === "female" ? "Female" : (sex || gender) === "Other" ? null : (sex || gender)),
						removed,
						notifications_removed,
						employment_date: Dates.formatTimestampSQL(employment_date),
						employment_num: employment_num || company_num || employee_id,
						email,
						phone: phone && String(phone),

						linked_user_id: pg_linked_user && pg_linked_user.id,
						// linked_contractor_user_id,

						// competency_list: [{data: []}],
						// contract_list: [{data: []}],
						// counselling_list: [{data: []}],
						// leave_list: [{data: []}],
						// license_list: [{data: []}],
						// medical_list: [{data: []}],
						// warning_list: [{data: []}],
						// work_permit_list: [{data: []}],

						banking_detail_list: {data: banking_detail_list},
						compliance_list: {
							data: (compliance_requirements || []).map(v => {
								if (v.status === "Comformance") {
									v.status = "C";
								} else if (v.status === "Non-Comformance") {
									v.status = "NCR";
								}
								return v;
							})
						},
						dependent_list: {
							data: dependants ? dependants.map(({fname, lname, dob, gender}) => ({
								fname,
								lname,
								dob: Dates.formatTimestampSQL(dob),
								gender
							})) : []
						},
						document_list: {data: document_list},//type=[ID, Passport, Driver/Operactor Licence, PrDP, Work Permit]
						living_address_list: {data: living_address_list},
						next_of_kin_list: {
							data: [next_of_kin_1 ? next_of_kin_1 : null, next_of_kin_2 ? next_of_kin_2 : null].filter(v => !!v).map(v => {
								if (!v.fname) {
									v.fname = '';
								}
								if (!v.lname) {
									v.lname = '';
								}
								return v;
							})
						},

						created_at: Dates.formatTimestampSQL(created_at),

						job_position_id: pg_job_position && pg_job_position.id,
						department_id: pg_department && pg_department.id,
						// supervisor_id: pg_supervisor && pg_supervisor.id,updated
						// team_id,already updated

						company_id: pg_company.id,
						client_id: pg_client && pg_client.id,
						project_id: pg_project && pg_project.id,
						site_id: pg_site && pg_site.id,
						user_id: pg_user && pg_user.id,

						contractor_id: pg_contractor && pg_contractor.id,
						contractor_site_id: pg_contractor_site && pg_contractor_site.id,
						contractor_user_id: pg_contractor_user && pg_contractor_user.id,
					};//

					console.log('insertEmployee', item.company_id, item.client_id, item.project_id, item.site_id, item.lname, item.fname, item.phone, item.email, item.id_num, item.passport_num)
					//save
					try {
						const res = await insertEmployee(item);
						console.log('insertEmployee end', res)
					} catch (e) {
						// console.log(id, fname, lname, e);
					}
				}
			}
		}
	}

	console.log('insertEmployee finished')
};
//</editor-fold>

//<editor-fold desc="update">
export const employees_update = async () => {
	await execWhen(() => window.db && window.storage && storage.loggedUserAuth);

	

	const list = await workers.emit('relay/get_db_hr', tbl);
	
	for (let n = 0; n < list.length; n++) {
		const {id, data} = list[n];
		const {
			fname,//
			lname,//

			documents,//type=[ID, Passport, Driver/Operactor Licence, PrDP, Work Permit]
			docs,//[hr-modules]
			incident_list,//
			optional_info,
		} = data;

		const {
			supervisor_email,
			supervisor_name,
			supervisor_phone,
		} = optional_info || {};

		// const {
		//     doc_work_permit_expiry,//
		//     doc_work_permit,//
		// } = documents || {};

		// if(doc_work_permit) {
		//     // document_list.push({});work_permit_list
		// }

		let supervisor_id;
		if (isObject(supervisor_name)) {
			supervisor_id = supervisor_name.id;
		}
		const pg_supervisor = await findByFirestoreIdEmployee(supervisor_id);

		let item = await findByFirestoreIdEmployee(id);

		item = {
			...item,
			supervisor_id: pg_supervisor && pg_supervisor.id,

			// competency_list: [{data: []}],
			// contract_list: [{data: []}],
			// counselling_list: [{data: []}],
			// leave_list: [{data: []}],
			// license_list: [{data: []}],
			// medical_list: [{data: []}],
			// warning_list: [{data: []}],
			// work_permit_list: [{data: []}],
		};

		console.log('updateEmployee start', item)
		try {
			const res = await updateEmployee(item);
			console.log('updateEmployee end', res)

			if (res && res.id) {
				const res_id = convertIdToBigint(res.id);
			}
		} catch (e) {
			console.log(id, fname, lname, e);
		}
	}
};
//</editor-fold>
