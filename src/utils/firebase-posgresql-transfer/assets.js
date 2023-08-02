import {Dates, execWhen} from "../Utils";
import findByFirestoreIdCompany from "mutations/all/Company/findByFirestoreIdCompany";
import findByFirestoreIdClient from "mutations/all/Client/findByFirestoreIdClient";
import findByFirestoreIdProject from "mutations/all/Project/findByFirestoreIdProject";
import findByFirestoreIdSite from "../../mutations/all/Site/findByFirestoreIdSite";
import findByFirestoreIdUser from "../../mutations/all/User/findByFirestoreIdUser";
import findByFirestoreIdContractor from "../../mutations/all/Contractor/findByFirestoreIdContractor";
import findByFirestoreIdContractorUser from "../../mutations/all/ContractorUser/findByFirestoreIdContractorUser";
import findByFirestoreIdEmployee from "../../mutations/all/Employee/findByFirestoreIdEmployee";
import insertAsset from "../../mutations/all/Asset/insertAsset";
import findByFirestoreIdAsset from "../../mutations/all/Asset/findByFirestoreIdAsset";

const tbl = "plugin_sheq_assist_19_Maintenance_tools";
//<editor-fold desc="transfer">
export const assets_transfer = async () => {
	await execWhen(() => window.db && window.storage && storage.loggedUserAuth);


	const list = await workers.emit('relay/get_db', tbl);

	for (let n = 0; n < list.length; n++) {
		const {id, data} = list[n];
		const {
			created_at,
			//
			company_id,
			user_id,
			contractor_user_id,
			contractor_id,
			contractor_site_id,
			//0
			client_id, project_id, site_id,
			client, project, site,
			//1
			asset_type,
			name,
			desc,
			owning_company,
			condition,
			location,
			serial_num,
			reg_num,
			status,
			written_off,
			manufacturer,
			model,
			toolkit,
			notes,

			photo,
			profile_pic,

			doc_pdf,
			doc_pdf_desc,
			doc_pdf_expiry,
			doc_clearance_certificate,
			doc_procedure,
			doc_work_manual,

			is_in_service,//

			purchase_info,//{acquisition_date, acquisition_value, reference_num, warranty_certificate, warranty_expiry, vendor}
			acquisition_date,//.
			acquisition_value,//.
			vendor,//.
			warranty_certificate,//.
			warranty_expiry,//.
			reference_num,//.

			calibration_record,//{list:[calibrating_company, calibration_date, certificate_num, reference_standard], next_calibration_date, next_calibration_interval}
			depreciation,//{asset_cost, depreciation_factor, depreciation_method, depreciation_years, partial_year_depreciation, salvage_value}
			maintenance_plan,//{list:[reason_for_service, service_date, service_hrs_or_km], next_service_hrs_or_km}
			monitoring_plan_list,//[date, fuel_usage, working_hrs_or_km]

			responsible_person,
		} = data;

		const existingItem = await findByFirestoreIdAsset(id);
		if (existingItem) {

		} else {
			const pg_company = await findByFirestoreIdCompany(company_id);
			if (pg_company && pg_company.id) {
				const pg_client = await findByFirestoreIdClient(client ? client.id : client_id);
				const pg_project = await findByFirestoreIdProject(project ? project.id : project_id);
				const pg_site = await findByFirestoreIdSite(site ? site.id : site_id);
				const pg_user = await findByFirestoreIdUser(user_id);

				const pg_contractor = await findByFirestoreIdContractor(contractor_id);
				const pg_contractor_site = await findByFirestoreIdSite(contractor_site_id);
				const pg_contractor_user = await findByFirestoreIdContractorUser(contractor_user_id);

				const pg_responsible_person = await findByFirestoreIdEmployee(responsible_person && responsible_person.id);

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
					//
					created_at: Dates.formatDateSQL(created_at),
					status,
					written_off,
					//1 done
					asset_detail: {
						data: {
							owning_company,
							name,
							asset_type,
							desc,
							manufacturer,
							model,
							reg_num,
							serial_num,
							location,
							toolkit,
							condition,
							// barcode,
							// qr_code,
							notes,
						},
					},
					//2 done
					photo_list: {
						data: [
							photo ? ({doc: photo, is_default: !profile_pic}) : null,
							profile_pic ? ({doc: profile_pic, is_default: true}) : null,
						].filter(v => !!v),
					},
					//3 done
					responsible_person_id: pg_responsible_person && pg_responsible_person.id,
					//4 done
					doc_list: {
						data: [
							doc_pdf && {
								type: 'Vehicle Registration Certificate',
								doc: doc_pdf,
								desc: doc_pdf_desc,
								expiry: Dates.formatDateSQL(doc_pdf_expiry),
								title: 'Vehicle Registration Certificate'
							},
							doc_clearance_certificate && {
								type: 'Clearance Certificate',
								doc: doc_clearance_certificate,
								title: 'Clearance Certificate'
							},
							doc_procedure && {type: 'Work Procedure', doc: doc_procedure, title: 'Work Procedure'},
							doc_work_manual && {type: 'Work Manual', doc: doc_work_manual, title: 'Work Manual'},
						].filter(v => !!v),
					},
					//5 done
					purchase_info: purchase_info && (
							(purchase_info.vendor || vendor) ||
							(
								Dates.formatDateSQL(purchase_info.acquisition_date) ||
								Dates.formatDateSQL(acquisition_date)
							) ||
							(purchase_info.acquisition_value || acquisition_value) ||
							(
								Dates.formatDateSQL(purchase_info.warranty_expiry) ||
								Dates.formatDateSQL(warranty_expiry)
							) ||
							(purchase_info.reference_num || reference_num) ||
							(purchase_info.warranty_certificate || warranty_certificate)
						) &&
						{
							data: {
								vendor: purchase_info && purchase_info.vendor || vendor,
								acquisition_date: purchase_info && Dates.formatDateSQL(purchase_info.acquisition_date) || Dates.formatDateSQL(acquisition_date),
								acquisition_value: purchase_info && purchase_info.acquisition_value || acquisition_value,
								warranty_expiry: purchase_info && Dates.formatDateSQL(purchase_info.warranty_expiry) || Dates.formatDateSQL(warranty_expiry),
								reference_num: purchase_info && purchase_info.reference_num || reference_num,
								warranty_certificate: purchase_info && purchase_info.warranty_certificate || warranty_certificate,
							}
						},
					//6 done
					depreciation: depreciation && (
						depreciation.depreciation_method ||
						depreciation.asset_cost ||
						depreciation.salvage_value ||
						depreciation.depreciation_years ||
						depreciation.depreciation_factor ||
						depreciation.partial_year_depreciation
					) && {
						data: {
							depreciation_method: depreciation.depreciation_method === "Sum of the Year's Digits" ? "Sum of the Year`s Digits" : depreciation.depreciation_method,
							asset_cost: depreciation.asset_cost,
							salvage_value: depreciation.salvage_value,
							depreciation_years: depreciation.depreciation_years,
							depreciation_factor: depreciation.depreciation_factor,
							partial_year_depreciation: depreciation.partial_year_depreciation,
						}
					},
					//7 done
					// monitoring_plan_list: {
					// 	data: (monitoring_plan_list || []).map(({date, fuel_usage, working_hrs_or_km}) => ({
					// 		fuel_usage_list: {
					// 			data: [
					// 				{date: ,}
					// 			].filter(v => !!v)
					// 		},
					// 		working_distance_or_time_list: {
					// 			data: [
					// 				{}
					// 			].filter(v => !!v)},
					// 	})),
					// },
					//8 done
					maintenance_plan_list: maintenance_plan && ((maintenance_plan.list && !maintenance_plan.list.isEmpty()) || maintenance_plan.next_service_hrs_or_km) && {
						data: [
							{
								plan_list: {
									data: (maintenance_plan.list || []).map(({reason_for_service, service_date, service_hrs_or_km}) => ({
										reason_for_service,
										service_date: Dates.formatDateSQL(service_date),
										service_hrs_or_km,
									})),
								},
								next_service_hrs_or_km: maintenance_plan.next_service_hrs_or_km,
							}
						].filter(v => !!v),
					},
					//9 done
					calibration_record_list: calibration_record && ((calibration_record.list && !calibration_record.list.isEmpty()) || calibration_record.next_calibration_interval || Dates.formatDateSQL(calibration_record.next_calibration_date)) && {
						data: [
							{
								calibration_list: {
									data: (calibration_record.list || []).map((
										{
											calibrating_company,
											reference_standard,
											certificate_num,
											calibration_date
										}
									) => ({
										calibrating_company,
										reference_standard,
										certificate_num,
										calibration_date: Dates.formatDateSQL(calibration_date),
									})),
								},
								next_calibration_interval: calibration_record && calibration_record.next_calibration_interval,
								next_calibration_date: calibration_record && Dates.formatDateSQL(calibration_record.next_calibration_date),
							}
						].filter(v => !!v),
					},
					//10

					//11

				};

				console.log('insertAsset start', item)
				//save
				try {
					const res = await insertAsset(item);
					console.log('insertAsset end', res)
				} catch (e) {
					console.log(name, e);
				}
			}
		}
	}
	console.log('insertAssets done', list.length)
};
//</editor-fold>
