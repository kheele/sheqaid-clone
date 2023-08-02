import {Dates, execWhen} from "../Utils";
import findByFirestoreIdCompany from "mutations/all/Company/findByFirestoreIdCompany";
import findByFirestoreIdContractor from "../../mutations/all/Contractor/findByFirestoreIdContractor";
import findByFirestoreIdContractorUser from "../../mutations/all/ContractorUser/findByFirestoreIdContractorUser";
import findByFirestoreIdContractorSite from "../../mutations/all/ContractorSite/findByFirestoreIdContractorSite";
import insertContractorUser from "../../mutations/all/ContractorUser/insertContractorUser";
import updateContractorUser from "../../mutations/all/ContractorUser/updateContractorUser";
import findByFirestoreIdUser from "../../mutations/all/User/findByFirestoreIdUser";
import updateUser from "../../mutations/all/User/updateUser";
import findByKeyModule from "../../mutations/all/Module/findByKeyModule";
import insertPermissionModule from "../../mutations/all/PermissionModule/insertPermissionModule";
import findByValuePermissionOtherKey from "../../mutations/all/PermissionOtherKey/findByValuePermissionOtherKey";
import insertPermissionOther from "../../mutations/all/PermissionOther/insertPermissionOther";
import findByFirestoreIdEmployee from "../../mutations/all/Employee/findByFirestoreIdEmployee";
import listAllContractorUser from "../../mutations/all/ContractorUser/listAllContractorUser";
import moduleManager from "../../app/ModuleManager";
import storage from "../../storage/Storage";

const tbl = "plugin_sheq_assist_contractors_users";
//<editor-fold desc="transfer">
export const contractor_user_transfer = async () => {
	await execWhen(() => window.db && window.storage && storage.loggedUserAuth);


	const list = await workers.emit('relay/get_db2', tbl);

	for (let n = 0; n < list.length; n++) {
		const {id, data} = list[n];
		const {
			auth_type,
			company_id,
			contractor_id,
			contractor_site_id,
			contractor_user_id,
			created_at,
			fname,
			lname,
			// password,
			linked_employee_id,//
			reset_password_id,
			permissions_modules,
			permissions_other,
			phone,
			profile_pic,
			receive_covid_positive_case_notifs,
			receive_covid_return_to_work_notifs,
			receive_covid_screening_notifs,
			receive_covid_vulnerability_notifs,
			receive_expired_docs_notifs,
			receive_modules_notifs, //{checked, text, value}
			username,
			has_biometric,
		} = data;

		let pg_user = await findByFirestoreIdContractorUser(id);

		const pg_company = await findByFirestoreIdCompany(company_id);

		const pg_contractor = await findByFirestoreIdContractor(contractor_id);
		const pg_contractor_site = await findByFirestoreIdContractorSite(contractor_site_id);
		const pg_contractor_user = await findByFirestoreIdContractorUser(contractor_user_id);

		const receive_contractor_management_notifs = receive_modules_notifs && receive_modules_notifs.find(({text}) => text === 'Receive Contractor Management Notifications'); //{checked, text, value}
		const receive_asset_management_notifs = receive_modules_notifs && receive_modules_notifs.find(({text}) => text === 'Receive Asset Management Notifications'); //{checked, text, value}
		const receive_incident_management_notifs = receive_modules_notifs && receive_modules_notifs.find(({text}) => text === 'Receive Incident Management Notifications'); //{checked, text, value}
		const receive_chemicals_management_notifs = receive_modules_notifs && receive_modules_notifs.find(({text}) => text === 'Receive Chemicals Management Notifications'); //{checked, text, value}
		const receive_non_conformance_management_notifs = receive_modules_notifs && receive_modules_notifs.find(({text}) => text === 'Receive Non-Conformance Management Notifications'); //{checked, text, value}

		const item = {
			auth_type: auth_type || 'MultiFactor',
			fname,
			lname,
			username,
			phone,
			profile_pic,
			reset_password_id,
			notifications_settings: {
				data: {
					receive_covid_positive_case_notifs,
					receive_covid_return_to_work_notifs,
					receive_covid_screening_notifs,
					receive_covid_vulnerability_notifs,
					receive_expired_docs_notifs,
					receive_contractor_management_notifs: receive_contractor_management_notifs && receive_contractor_management_notifs.value, //{checked, text, value}
					receive_asset_management_notifs: receive_asset_management_notifs && receive_asset_management_notifs.value, //{checked, text, value}
					receive_incident_management_notifs: receive_incident_management_notifs && receive_incident_management_notifs.value, //{checked, text, value}
					receive_chemicals_management_notifs: receive_chemicals_management_notifs && receive_chemicals_management_notifs.value, //{checked, text, value}
					receive_non_conformance_management_notifs: receive_non_conformance_management_notifs && receive_non_conformance_management_notifs.value, //{checked, text, value}
				}
			},
			created_at: Dates.formatTimestampSQL(created_at || pg_company.created_at),
			company_id: pg_company && pg_company.id,
			contractor_id: pg_contractor && pg_contractor.id,
			contractor_site_id: pg_contractor_site && pg_contractor_site.id,
			contractor_user_id: pg_contractor_user && pg_contractor_user.id,
			auth_id: id,
			// linked_employee_id,
			firebase_linked_employee_id: linked_employee_id,
			// permissions_module_list: {data: permissions_modules.map(({actions}) => ({actions: {data: actions}, module: }))},//
			// permissions_other_list: {data: permissions_other.map(({}) => ({actions: , key: }))},//
			// client_blacklist,
			// project_blacklist,
			// site_blacklist,
			has_biometric: isBoolean(has_biometric) ? has_biometric : false,
		};//

		if (pg_user) {
			item.id = pg_user.id;
			delete item.created_at;

			console.log('updateContractorUser start', item)
			try {
				const res = await updateContractorUser(item);
				console.log('updateContractorUser end', res)
			} catch (e) {
				console.log(username, e);
			}
		} else {
			console.log('insertContractorUser start', item)
			//save plugin
			try {
				const res = await insertContractorUser(item);
				console.log('insertContractorUser end', res)
			} catch (e) {
				console.log(username, e);
			}
		}
	}
};
//</editor-fold>

//<editor-fold desc="update">
export const contractor_user_update = async () => {
	await execWhen(() => window.db && window.storage && storage.loggedUserAuth);


	const list = await workers.emit('relay/get_db2', tbl);

	for (let n = 0; n < list.length; n++) {
		const {id, data} = list[n];
		const {
			user_id,
			linked_employee_id,
			permissions_modules,
			permissions_other,
			username,
		} = data;

		const pg_user = await findByFirestoreIdContractorUser(id);
		if (pg_user) {
			const pg_contractor_user = await findByFirestoreIdContractorUser(user_id);

			if (permissions_modules) {
				console.log('permissions_modules', permissions_modules)
				for (let n = 0; n < permissions_modules.length; n++) {
					const {key, desc, actions} = permissions_modules[n];
					const pg_module = await findByKeyModule(key);
					if (pg_module) {
						//sheq_permissions_modules
						const item = {
							contractor_user_id: pg_user.id,
							module_id: pg_module.id,
							actions: {data: actions},
						};
						console.log('insertPermissionModule start', item)
						try {
							const res = await insertPermissionModule(item);
							console.log('insertPermissionModule end', res)
						} catch (e) {
							console.log(username, key, e);
						}
					} else {
						//e4@cp.com: Documents,
						//coid1@cp.com: 02_Claim_Management_For_MedicalCenters,
						//rhespo@gmail.com: _18_Procedure_for_Management_of_Nonconformities_CA
						console.log('updateUser pg_module not found', username, key)
					}
				}
			}

			if (permissions_other) {
				console.log('permissions_other', permissions_other)
				for (let n = 0; n < permissions_other.length; n++) {
					const {key, desc, actions} = permissions_other[n];
					//sheq_permissions_other
					let item = {
						contractor_user_id: pg_user.id,
						actions: {data: actions},
					};
					const pg_key = await findByValuePermissionOtherKey(key);
					if (pg_key) {
						item.key_id = pg_key.id;
					} else {
						item.key = {data: {value: key}};
					}
					console.log('insertPermissionOther start', item)
					try {
						const res = await insertPermissionOther(item);
						console.log('insertPermissionOther end', res)
					} catch (e) {
						console.log(username, key, e);
					}
				}
			}

			const pg_linked_employee = await findByFirestoreIdEmployee(linked_employee_id);

			const item = {
				linked_employee_id: pg_linked_employee && pg_linked_employee.id,
				contractor_user_id: pg_contractor_user && pg_contractor_user.id,
				id: pg_user.id,
			};

			console.log('updateContractorUser start', item)
			try {
				const res = await updateContractorUser(item);
				console.log('updateContractorUser end', res)
			} catch (e) {
				console.log(username, e);
			}
		}
	}
};

export const contractor_user_update_pg = async () => {
	const list = await listAllContractorUser();

	for (let n = 0; n < list.length; n++) {
		const {id: contractor_user_id, data} = list[n];
		let {
			user_id,
			permissions_module_list,
			permissions_other_list,
			username,
		} = data;

		if (!permissions_module_list || permissions_module_list.isEmpty()) {
			permissions_module_list = moduleManager.moduleListInstalledAll.map(({id}) => {
				return {module_id: id, actions: {data: {create: true, view: true, edit: true, remove: true, share: true}}};
			});

			console.log('permissions_module_list', permissions_module_list)
			for (let n = 0; n < permissions_module_list.length; n++) {
				const item = permissions_module_list[n];
				item.contractor_user_id = contractor_user_id;
				console.log('insertPermissionModule start', item)
				try {
					// const res = await insertPermissionModule(item);
					console.log('insertPermissionModule end', username)
					// console.log('insertPermissionModule end', res)
				} catch (e) {
					console.log(username, item.module_id, e);
				}
			}
		}

		if (!permissions_other_list || permissions_other_list.isEmpty()) {
			permissions_other_list = storage.list.permissionOtherKeys.map(key => {
				return {key_id: key.id, actions: {data: {create: true, edit: true, view: true, remove: true, share: true}}};
			});//{id, key: {id, value}, actions}

			console.log('permissions_other_list', permissions_other_list)
			for (let n = 0; n < permissions_other_list.length; n++) {
				const item = permissions_other_list[n];
				item.contractor_user_id = contractor_user_id;
				console.log('insertPermissionOther start', item)
				try {
					// const res = await insertPermissionOther(item);
					console.log('insertPermissionOther end', username)
					// console.log('insertPermissionOther end', res)
				} catch (e) {
					console.log(username, item.key_id, e);
				}
			}
		}
	}
};
//</editor-fold>
