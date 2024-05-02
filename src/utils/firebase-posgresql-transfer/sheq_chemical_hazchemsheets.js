import {Dates, execWhen} from "../Utils";
import findByFirestoreIdCompany from "mutations/all/Company/findByFirestoreIdCompany";
import findByFirestoreIdClient from "mutations/all/Client/findByFirestoreIdClient";
import findByFirestoreIdProject from "mutations/all/Project/findByFirestoreIdProject";
import findByFirestoreIdSite from "../../mutations/all/Site/findByFirestoreIdSite";
import findByFirestoreIdUser from "../../mutations/all/User/findByFirestoreIdUser";
import findByFirestoreIdContractor from "../../mutations/all/Contractor/findByFirestoreIdContractor";
import findByFirestoreIdContractorUser from "../../mutations/all/ContractorUser/findByFirestoreIdContractorUser";
import findByFirestoreIdEmployee from "../../mutations/all/Employee/findByFirestoreIdEmployee";
import updateEmployee from "../../mutations/all/Employee/updateEmployee";
import findByFirestoreIdTeam from "../../mutations/all/Team/findByFirestoreIdTeam";
import updateTeam from "../../mutations/all/Team/updateTeam";
import insertChemicalHazchemsheet from "../../mutations/all/Chemicals/ChemicalHazchemsheet/insertChemicalHazchemsheet";
import findByFirestoreIdChemicalProduct
	from "../../mutations/all/Chemicals/ChemicalProduct/findByFirestoreIdChemicalProduct";
import findByFirestoreIdChemicalSDS from "../../mutations/all/Chemicals/ChemicalSDS/findByFirestoreIdChemicalSDS";
import updateChemicalSDS from "../../mutations/all/Chemicals/ChemicalSDS/updateChemicalSDS";
import findByFirestoreIdChemicalHazchemsheet
	from "../../mutations/all/Chemicals/ChemicalHazchemsheet/findByFirestoreIdChemicalHazchemsheet";
import updateChemicalHazchemsheet from "../../mutations/all/Chemicals/ChemicalHazchemsheet/updateChemicalHazchemsheet";

const tbl = "plugin_sheq_assist_Hazardous_Chemical_Substances_hazchem_sheets";
//<editor-fold desc="transfer">
export const sheq_chemical_hazchemsheets_transfer = async () => {
	await execWhen(() => window.db && window.storage && storage.loggedUserAuth);
	
	
	const list = await workers.emit('relay/get_db2', tbl);
	
	for (let n = 0; n < list.length; n++) {
		const {id, data} = list[n];
		const {
			company_id,
			user_id,
			contractor_user_id,
			contractor_id,
			contractor_site_id,
			//
			created_at,
			//0
			client_id,
			project_id,
			site_id,
			client,
			project,
			site,
			//1
			name,
			physical_state,
			type,
			product,
			sds,
			//2
			precaution_photo_concentrate_list,
			precaution_photo_application_list,
			//3
			active_ingredient_list,
			//4
			hazard_identification_physical_list,
			hazard_identification_reproductive_list,
			hazard_identification_biological_list,
			//5
			first_aid_procedure_splashes_in_eyes_list,
			first_aid_procedure_contact_with_skin_list,
			first_aid_procedure_mouth_contact_or_eaten_list,
			first_aid_procedure_fumes_breathed_in_list,
			//6
			emergency_action_for_spills_small_list,
			emergency_action_for_spills_large_list,
			//7
			disposal_used_container_list,
			disposal_unused_product_list,
			//8
			contacts_emergency_name,
			contacts_emergency_num,
			contacts_manufacturer_name,
			contacts_manufacturer_num,
			//9
			doc
		} = data;
		
		const existingItem = await findByFirestoreIdChemicalHazchemsheet(id);
		if (existingItem) {
			const pg_product = await findByFirestoreIdChemicalProduct(product && product.id);
			const pg_sds = await findByFirestoreIdChemicalSDS(sds && sds.id);
			
			const item = {
				id: existingItem.id,
				//
				created_at: Dates.formatDateSQL(created_at),
				//
				product_id: pg_product && pg_product.id,
				sds_id: pg_sds && pg_sds.id,
			};
			console.log('updateChemicalHazchemsheet start', item)
			//save
			try {
				const res = await updateChemicalHazchemsheet(item);
				console.log('updateChemicalHazchemsheet end', res)
			} catch (e) {
				console.log(name, e);
			}
		} else {
			const pg_company = await findByFirestoreIdCompany(company_id);
			const pg_client = await findByFirestoreIdClient(client ? client.id : client_id);
			const pg_project = await findByFirestoreIdProject(project ? project.id : project_id);
			const pg_site = await findByFirestoreIdSite(site ? site.id : site_id);
			const pg_user = await findByFirestoreIdUser(user_id);
			
			const pg_contractor = await findByFirestoreIdContractor(contractor_id);
			const pg_contractor_site = await findByFirestoreIdSite(contractor_site_id);
			const pg_contractor_user = await findByFirestoreIdContractorUser(contractor_user_id);
			
			const pg_product = await findByFirestoreIdChemicalProduct(product && product.id);
			const pg_sds = await findByFirestoreIdChemicalSDS(sds && sds.id);
			
			const item = {
				firestore_id: id,
				company_id: pg_company && pg_company.id,
				user_id: pg_user && pg_user.id,
				contractor_id: pg_contractor && pg_contractor.id,
				contractor_site_id: pg_contractor_site && pg_contractor_site.id,
				contractor_user_id: pg_contractor_user && pg_contractor_user.id,
				//0
				client_id: pg_client && pg_client.id,
				project_id: pg_project && pg_project.id,
				site_id: pg_site && pg_site.id,
				//1
				name,
				physical_state,
				type,
				product_id: pg_product && pg_product.id,
				sds_id: pg_sds && pg_sds.id,
				//2
				precaution_photo_list: {
					data: [
						...(precaution_photo_concentrate_list || []).map((doc) => ({
							doc,
							type: "Concentrate"
						})),
						...(precaution_photo_application_list || []).map((doc) => ({
							doc,
							type: "Application"
						}))
					]
				},
				//3, 4, 5, 6, 7
				list: {
					data: [
						//3
						//active_ingredient_list
						...(active_ingredient_list || []).map(value => ({
							value: value.text || value,
							group: "Active Ingredient",
						})),
						//4
						//hazard_identification_physical_list
						...(hazard_identification_physical_list || []).map(value => ({
							value: value.text || value,
							group: "Hazard Identification",
							type: "Physical",
						})),
						//hazard_identification_reproductive_list
						...(hazard_identification_reproductive_list || []).map(value => ({
							value: value.text || value,
							group: "Hazard Identification",
							type: "Reproductive",
						})),
						//hazard_identification_biological_list
						...(hazard_identification_biological_list || []).map(value => ({
							value: value.text || value,
							group: "Hazard Identification",
							type: "Biological",
						})),
						//5
						//first_aid_procedure_splashes_in_eyes_list: {
						...(first_aid_procedure_splashes_in_eyes_list || []).map(value => ({
							value: value.text || value,
							group: "First Aid Procedure",
							type: "Splashes In Eyes",
						})),
						//first_aid_procedure_contact_with_skin_list: {
						...(first_aid_procedure_contact_with_skin_list || []).map(value => ({
							value: value.text || value,
							group: "First Aid Procedure",
							type: "Contact with Skin",
						})),
						//first_aid_procedure_mouth_contact_or_eaten_list: {
						...(first_aid_procedure_mouth_contact_or_eaten_list || []).map(value => ({
							value: value.text || value,
							group: "First Aid Procedure",
							type: "Mouth Contact or Eaten",
						})),
						//first_aid_procedure_fumes_breathed_in_list: {
						...(first_aid_procedure_fumes_breathed_in_list || []).map(value => ({
							value: value.text || value,
							group: "First Aid Procedure",
							type: "Fumes Breathed In",
						})),
						//6
						//emergency_action_for_spills_small_list
						...(emergency_action_for_spills_small_list || []).map(value => ({
							value: value.text || value,
							group: "Emergency Action For Spills",
							type: "Small Spills",
						})),
						//emergency_action_for_spills_large_list
						...(emergency_action_for_spills_large_list || []).map(value => ({
							value: value.text || value,
							group: "Emergency Action For Spills",
							type: "Large Spills",
						})),
						//7
						//disposal_used_container_list
						...(disposal_used_container_list || []).map(value => ({
							value: value.text || value,
							group: "Disposal",
							type: "Used Containers",
						})),
						//disposal_unused_product_list
						...(disposal_unused_product_list || []).map(value => ({
							value: value.text || value,
							group: "Disposal",
							type: "Unused Product",
						})),
					]
				},
				//8
				contacts_emergency_name,
				contacts_emergency_num,
				contacts_manufacturer_name,
				contacts_manufacturer_num,
				//9
				doc,
			};//
			
			console.log('insertChemicalHazchemsheet start', item)
			//save
			try {
				const res = await insertChemicalHazchemsheet(item);
				console.log('insertChemicalHazchemsheet end', res)
			} catch (e) {
				console.log(name, e);
			}
		}
	}
};
//</editor-fold>

//<editor-fold desc="update">
export const sheq_chemical_hazchemsheets_update = async () => {
	await execWhen(() => window.db && window.storage && storage.loggedUserAuth);
	
	
	const list = await workers.emit('relay/get_db', tbl);
	
	for (let n = 0; n < list.length; n++) {
		const {id, data} = list[n];
		const {
			name,
		} = data;
		
		const pg_supervisor = await findByFirestoreIdEmployee(supervisor && supervisor.id);
		
		let item = await findByFirestoreIdTeam(id);
		await Promise.all((employee_list || []).map(async id => {
			let item2 = await findByFirestoreIdEmployee(id);
			if (item2) {
				item2 = {
					id: item2.id,
					team_id: item.id,
				};
				console.log('updateEmployee start', item2)
				try {
					const res = await updateEmployee(item2);
					console.log('updateEmployee end', res)
				} catch (e) {
					console.log(id, e);
				}
			}
		}));
		
		item = {
			id: item.id,
			supervisor_id: pg_supervisor && pg_supervisor.id,
		};
		
		console.log('updateTeam start', item)
		try {
			const res = await updateTeam(item);
			console.log('updateTeam end', res)
		} catch (e) {
			console.log(id, name, e);
		}
	}
};
//</editor-fold>
