// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import style from "./EditIncidentDialog.lazy.css";
import {observer} from 'mobx-react';
import {observable, computed} from 'mobx';
import {CircularProgress} from "@mui/material";

import {ShouldUpdate, toDataURI} from 'utils/Utils';

import {AEditDialog} from 'components/dialogs';
import {editRender} from './IncidentForms';
import updateIncident from "mutations/all/Incident/updateIncident";
import updateIncidentSeverity from "mutations/all/Incident/IncidentSeverity/updateIncidentSeverity";
import insertIncidentSeverity from "mutations/all/Incident/IncidentSeverity/insertIncidentSeverity";
import updateIncidentDocument from "mutations/all/Incident/IncidentDocument/updateIncidentDocument";
import insertIncidentDocument from "mutations/all/Incident/IncidentDocument/insertIncidentDocument";
import {
	insertProxyIncidentActivity,
	insertProxyIncidentCategory,
	insertProxyIncidentDistribution,
	insertProxyIncidentInjuryList,
	insertProxyIncidentPersonInvolved,
	insertProxyIncidentSector,
	insertProxyIncidentSubCategory,
	insertProxyIncidentWitness,
} from "mutations/all/Proxy/insertProxy";
import {
	updateProxyIncidentActivity,
	updateProxyIncidentCategory,
	updateProxyIncidentDistribution,
	updateProxyIncidentInjuryList,
	updateProxyIncidentPersonInvolved,
	updateProxyIncidentSector,
	updateProxyIncidentSubCategory,
	updateProxyIncidentWitness,
} from "mutations/all/Proxy/updateProxy";
import updateIncidentTestType from "mutations/all/Incident/IncidentTestType/updateIncidentTestType";
import insertIncidentTestType from "mutations/all/Incident/IncidentTestType/insertIncidentTestType";
import AIncidentWritableForm from "./IncidentForms/AIncidentWritableForm";
import findByIdIncident from "mutations/all/Incident/findByIdIncident";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class EditDialog extends AEditDialog {
	pageKey = "EditIncidentDialog";
	title = "Edit Incident";
	findById = findByIdIncident;
	removeById = updateIncident;

	constructor(props) {
		super(props, style);
	}

	get topButtonsHiddenSave() {
		return true;
	}

	get controls() {
		return Controls;
	}
}

// </editor-fold>

@observer
class Controls extends AIncidentWritableForm {

	// <editor-fold defaultstate="collapsed" desc="constructor">
	constructor() {
		super();

		// this.onNext = this.onNext.bind(this);
		this.onFormSave = this.onFormSave.bind(this);
	}
	// </editor-fold>

	// // <editor-fold defaultstate="collapsed" desc="onNext">
	// onNext(e, btn) {
	// 	return onNext.call(this, e, btn);
	// }
	//
	// // </editor-fold>

	//<editor-fold desc="onFormSave">
	async onFormSave(e, btn) {
		const {
			form,
			item: {id, data: old_data},
			refs: {}
		} = this;

		const onSubmit = (data, onProgress) => {
			if (Object.keys(data).isEmpty()) {
				infoDialog.open("Nothing changed!");
				return;
			}

			console.log(data)

			if (!onProgress) {
				btn.text("Saving...").disabled();
				progressDialog.open();
			}
			return updateIncident({id: this.item.id, ...data}).then(res => {
				console.log("res", res)
				infoDialog.open("Record successfully updated.");
				infoDialog.close(2000);
				// this.props.close();
				return true;
			}).finally(() => {
				btn.text("Save").enabled();
				setTimeout(() => progressDialog.close());
			});
		};

		const {idx} = btn.props;
		if (idx === 0) {
			const {isConsultant} = storage.is;
			if (isConsultant && !form.isValid('client')) {
				infoDialog.open('Company is required');
				return;
			}

			const {
				site, project, client,
			} = form.data;

			const data = {};
			ShouldUpdate.checkClient(data, old_data, client);
			ShouldUpdate.checkProject(data, old_data, project);
			ShouldUpdate.checkSite(data, old_data, site);

			onSubmit(data);
			return;
		}

		//to test: fix new file
		if (idx === 1) {
			// if (!form.isValid('group')) {
			// 	infoDialog.open('First Name is required');
			// 	return;
			// }

			const {
				//1
				group,
				short_desc,
				desc,
				location,
				exact_location,
				document_list,
			} = form.data;

			const data = {};

			ShouldUpdate.check(data, old_data, group, 'group');
			ShouldUpdate.check(data, old_data, short_desc, 'short_desc');
			ShouldUpdate.check(data, old_data, desc, 'desc');
			ShouldUpdate.check(data, old_data, location, 'location');
			ShouldUpdate.check(data, old_data, exact_location, 'exact_location');
			ShouldUpdate.checkFileList(data, old_data, document_list, 'document_list');

			if (Object.keys(data).isEmpty()) {
				infoDialog.open("Nothing changed!");
				return;
			}

			console.log(data)

			let onProgress;
			if (data.document_list) {
				onProgress = true;
				const {document_list} = data;
				delete data.document_list;

				btn.text("Saving...").disabled();
				progressDialog.open();

				const res = await Promise.all(document_list.map(async item => {
					if (item.id) {
						if (item.doc.path) {
							return updateIncidentDocument({id: item.id, doc: {path: await toDataURI(item.doc.path)}});
						}
					} else {
						return insertIncidentDocument({incident_id: this.item.id, doc: {path: await toDataURI(item.path)}});
					}
				}));
				if (Object.keys(data).isEmpty()) {
					console.log("res", res)
					// onSaved && onSaved(res);
					infoDialog.open("Record successfully updated.");
					infoDialog.close(2000);
					// this.props.close();

					btn.text("Save").enabled();
					setTimeout(() => progressDialog.close());
					return;
				}
			}

			if (Object.keys(data).isEmpty()) {
				infoDialog.open("Nothing changed!");
				return;
			}

			onSubmit(data, onProgress);
			return;
		}

		if (idx === 2) {
			const {
				//2
				incident_date,
				incident_time,
				date_reported,
				time_reported,
				time_shift,
			} = form.data;
			const data = {};

			ShouldUpdate.checkDate(data, old_data, incident_date, 'incident_date');
			ShouldUpdate.check(data, old_data, incident_time, 'incident_time');
			ShouldUpdate.checkDate(data, old_data, date_reported, 'date_reported');
			ShouldUpdate.check(data, old_data, time_reported, 'time_reported');
			ShouldUpdate.check(data, old_data, time_shift, 'time_shift');

			onSubmit(data);
			return;
		}

		//to test
		if (idx === 3) {
			if (!form.isValid('category_list') || form.get('category_list').isEmpty()) {
				infoDialog.open('Incident Category is required');
				return;
			}

			const {
				//3
				category_list,
				sub_category_list,
			} = form.data;
			const data = {};

			ShouldUpdate.checkListToJS(data, old_data, category_list, 'category_list');
			ShouldUpdate.checkListToJS(data, old_data, sub_category_list, 'sub_category_list');

			if (Object.keys(data).isEmpty()) {
				infoDialog.open("Nothing changed!");
				return;
			}

			btn.text("Saving...").disabled();
			progressDialog.open();

			const res1 = await Promise.all(category_list.map(async v => {
				const {incident_id, category_id, category} = v;
				const attrs = {};
				if (category && category.id !== category_id) {
					attrs.new_category_id = category.id;
				}
				if (Object.keys(attrs).isNotEmpty()) {
					attrs.category_id = category_id;
					attrs.incident_id = this.item.id;
					return updateProxyIncidentCategory(attrs);
				}
				if (!category_id && category) {
					return insertProxyIncidentCategory({
						incident_id: this.item.id,
						category_id: category.id,
					});
				}
			}));
			
			const res2 = await Promise.all(sub_category_list.map(async v => {
				const {id, incident_id, sub_category_id, sub_category} = v;
				const attrs = {};
				if (sub_category && sub_category.id !== sub_category_id) {
					attrs.new_sub_category_id = sub_category.id;
				}
				if (Object.keys(attrs).isNotEmpty()) {
					attrs.sub_category_id = sub_category_id;
					attrs.incident_id = this.item.id;
					return updateProxyIncidentSubCategory(attrs);
				}
				if (!sub_category_id && sub_category) {
					return insertProxyIncidentSubCategory({
						incident_id: this.item.id,
						sub_category_id: sub_category.id,
					});
				}
			}));
			
			console.log("res", res1, res2)
			// onSaved && onSaved(res);
			infoDialog.open("Record successfully updated.");
			infoDialog.close(2000);
			// this.props.close();

			btn.text("Save").enabled();
			setTimeout(() => progressDialog.close());
		}

		//to test
		if (idx === 4) {
			const {
				//4
				sector_list,
				activity_list,
			} = form.data;
			const data = {};

			ShouldUpdate.checkListToJS(data, old_data, sector_list, 'sector_list');
			ShouldUpdate.checkListToJS(data, old_data, activity_list, 'activity_list');

			if (Object.keys(data).isEmpty()) {
				infoDialog.open("Nothing changed!");
				return;
			}

			btn.text("Saving...").disabled();
			progressDialog.open();

			const res = await Promise.all([
				Promise.all(sector_list.map(async v => {
					const {id, incident_id, sector_id, sector} = v;
					if (id) {
						const attrs = {};
						if (sector && sector.id !== sector_id) {
							attrs.sector_id = sector.id;
						}
						if (Object.keys(attrs).isEmpty()) {
							return;
						}
						attrs.id = id;
						return updateProxyIncidentSector(attrs);
					} else {
						const {sector} = v;
						return insertProxyIncidentSector({
							incident_id: this.item.id,
							sector_id: sector.id,
						});
					}
				})),
				Promise.all(activity_list.map(async v => {
					const {id, incident_id, activity_id, activity} = v;
					if (id) {
						const attrs = {};
						if (activity && activity.id !== activity_id) {
							attrs.activity_id = activity.id;
						}
						if (Object.keys(attrs).isEmpty()) {
							return;
						}
						attrs.id = id;
						return updateProxyIncidentActivity(attrs);
					} else {
						const {activity} = v;
						return insertProxyIncidentActivity({
							incident_id: this.item.id,
							activity_id: activity.id,
						});
					}
				})),
			]);

			console.log("res", res)
			// onSaved && onSaved(res);
			infoDialog.open("Record successfully updated.");
			infoDialog.close(2000);
			// this.props.close();

			btn.text("Save").enabled();
			setTimeout(() => progressDialog.close());
		}

		//to test: fix new other person
		if (idx === 5.1) {
			const {
				//5.1
				person_involved_list,
			} = form.data;
			const data = {};

			ShouldUpdate.checkListToJS(data, old_data, person_involved_list, 'person_involved_list');

			if (Object.keys(data).isEmpty()) {
				infoDialog.open("Nothing changed!");
				return;
			}

			btn.text("Saving...").disabled();
			progressDialog.open();

			const res = await Promise.all(person_involved_list.map(async v => {
				const {
					id,
					incident_id,
					person_involved_id,
					person_involved_other_id,
					person_involved,
					person_involved_other
				} = v;
				if (id) {
					const attrs = {};
					if (person_involved && person_involved.id !== person_involved_id) {
						attrs.person_involved_id = person_involved.id;
					}
					if (person_involved_other) {
						if (!person_involved_other.id) {
							attrs.person_involved_other = person_involved_other;
						} else if (person_involved_other.id !== person_involved_other_id) {
							attrs.person_involved_other_id = person_involved_other.id;
						}
					}
					if (Object.keys(attrs).isEmpty()) {
						return;
					}
					attrs.id = id;
					attrs.incident_id = this.item.id;
					return updateProxyIncidentPersonInvolved(attrs);
				} else {
					const {person_involved_other, person_involved} = v;
					return insertProxyIncidentPersonInvolved({
						incident_id: this.item.id,
						person_involved_id: person_involved && person_involved.id,
						person_involved_other,
					});
				}
			}));
			console.log("res", res)
			// onSaved && onSaved(res);
			infoDialog.open("Record successfully updated.");
			infoDialog.close(2000);
			// this.props.close();

			btn.text("Save").enabled();
			setTimeout(() => progressDialog.close());
		}

		//to test: fix new other person
		if (idx === 5.2) {
			// if (!form.isValid('person_reporting')) {
			// 	infoDialog.open('Person Reporting the Incident is required');
			// 	return;
			// }
			const {
				//5.2
				person_reporting,
			} = form.data;
			const data = {};

			ShouldUpdate.checkEmployee(data, old_data, person_reporting, 'person_reporting');

			onSubmit(data);
			return;
		}

		//to test: fix new other person
		if (idx === 5.3) {
			// if (!form.isValid('person_reported_to')) {
			// 	infoDialog.open('Person Reported To is required');
			// 	return;
			// }
			const {
				//5.3
				person_reported_to,
			} = form.data;
			const data = {};

			ShouldUpdate.checkEmployee(data, old_data, person_reported_to, 'person_reported_to');

			onSubmit(data);
			return;
		}

		//to test: fix new other person
		if (idx === 5.4) {
			const {
				//5.4
				witness_list,
			} = form.data;
			const data = {};

			ShouldUpdate.checkListToJS(data, old_data, witness_list, 'witness_list');

			if (Object.keys(data).isEmpty()) {
				infoDialog.open("Nothing changed!");
				return;
			}

			btn.text("Saving...").disabled();
			progressDialog.open();

			const res = await Promise.all(witness_list.map(async v => {
				const {id, incident_id, witness_id, witness_other_id, witness, witness_other} = v;
				if (id) {
					const attrs = {};
					if (witness && witness.id !== witness_id) {
						attrs.witness_id = witness.id;
					}
					if (witness_other) {
						if (!witness_other.id) {
							attrs.witness_other = witness_other;
						} else if (witness_other.id !== witness_other_id) {
							attrs.witness_other_id = witness_other.id;
						}
					}
					if (Object.keys(attrs).isEmpty()) {
						return;
					}
					attrs.id = id;
					attrs.incident_id = this.item.id;
					return updateProxyIncidentWitness(attrs);
				} else {
					const {witness_other, witness} = v;
					return insertProxyIncidentWitness({
						incident_id: this.item.id,
						witness_id: witness && witness.id,
						witness_other,
					});
				}
			}));
			console.log("res", res)
			// onSaved && onSaved(res);
			infoDialog.open("Record successfully updated.");
			infoDialog.close(2000);
			// this.props.close();

			btn.text("Save").enabled();
			setTimeout(() => progressDialog.close());
		}

		//to test: fix new other person
		if (idx === 5.5) {
			const {
				//5.5
				distribution_list,
			} = form.data;
			const data = {};

			ShouldUpdate.checkListToJS(data, old_data, distribution_list, 'distribution_list');

			if (Object.keys(data).isEmpty()) {
				infoDialog.open("Nothing changed!");
				return;
			}

			btn.text("Saving...").disabled();
			progressDialog.open();

			const res = await Promise.all(distribution_list.map(async v => {
				const {id, incident_id, employee_id, other_person_id, employee, other_person} = v;
				if (id) {
					const attrs = {};
					if (employee && employee.id !== employee_id) {
						attrs.employee_id = employee.id;
					}
					if (other_person) {
						if (!other_person.id) {
							attrs.other_person = other_person;
						} else if (other_person.id !== other_person_id) {
							attrs.other_person_id = other_person.id;
						}
					}
					if (Object.keys(attrs).isEmpty()) {
						return;
					}
					attrs.id = id;
					attrs.incident_id = this.item.id;
					return updateProxyIncidentDistribution(attrs);
				} else {
					const {other_person, employee} = v;
					return insertProxyIncidentDistribution({
						incident_id: this.item.id,
						employee_id: employee && employee.id,
						other_person,
					});
				}
			}));
			console.log("res", res)
			// onSaved && onSaved(res);
			infoDialog.open("Record successfully updated.");
			infoDialog.close(2000);
			// this.props.close();

			btn.text("Save").enabled();
			setTimeout(() => progressDialog.close());
		}
		
		if (idx === 6) {
			const {
				//6
				vehicle_list = [],
			} = old_data;
			const old_vehicle_details = (vehicle_list || [])[0] || {};
			
			const {
				id: vehicle_details_id,
			} = old_vehicle_details;
			const {
				//6
				is_vehicle_incident,
				is_infringement_issued,
				did_police_attend_scene,
				collision_reported_to_police_station,
				have_charges_been_laid,
				driver,
				driver_dob,
				driver_gender,
				address,
				email,
				phone,
				licence_num,
				licence_expiry,
				licence_years,
				vehicle_make,
				vehicle_model,
				vehicle_year,
				vehicle_color,
				vehicle_reg_num,
				vehicle_fleet_num,
				vehicle_reg_date,
				vehicle_trip_type,
				vehicle_load_type,
				was_3rd_party_involved,
				are_3rd_party_details_available,
				third_party_fname,
				third_party_lname,
				third_party_address,
				third_party_email,
				third_party_phone,
				did_driver_admit_liability,
				did_someone_else_admit_liability,
				someone_else_admit_liability_name,
				liability_admitted_to_name,
				third_party_opinion,
				third_party_document_list,
				penalty_num,
				issuing_authority,
				issuing_officer,
				type_of_breach,
				addressee_issued_to_name,
				addressee_name_or_entity,
				addressee_amount,
				addressee_due_date,
				ref_or_report_num,
				officer_name,
				officer_station,
				nature_of_charges,
				who_laid_charges,
				who_were_nature_charges_laid_against,
			} = form.data;
			const data = {};
			
			ShouldUpdate.check(data, old_data, is_vehicle_incident, 'is_vehicle_incident');
			ShouldUpdate.checkEmployee(data, old_vehicle_details, driver, 'driver');
			ShouldUpdate.checkDate(data, old_vehicle_details, driver_dob, 'driver_dob');
			ShouldUpdate.check(data, old_vehicle_details, driver_gender, 'driver_gender');
			ShouldUpdate.check(data, old_vehicle_details, address, 'address');
			ShouldUpdate.check(data, old_vehicle_details, email, 'email');
			ShouldUpdate.check(data, old_vehicle_details, phone, 'phone');
			ShouldUpdate.check(data, old_vehicle_details, licence_num, 'licence_num');
			ShouldUpdate.checkDate(data, old_vehicle_details, licence_expiry, 'licence_expiry');
			ShouldUpdate.check(data, old_vehicle_details, licence_years, 'licence_years');
			
			ShouldUpdate.check(data, old_vehicle_details, vehicle_make, 'vehicle_make');
			ShouldUpdate.check(data, old_vehicle_details, vehicle_model, 'vehicle_model');
			ShouldUpdate.check(data, old_vehicle_details, vehicle_year, 'vehicle_year');
			ShouldUpdate.check(data, old_vehicle_details, vehicle_color, 'vehicle_color');
			ShouldUpdate.check(data, old_vehicle_details, vehicle_reg_num, 'vehicle_reg_num');
			ShouldUpdate.check(data, old_vehicle_details, vehicle_fleet_num, 'vehicle_fleet_num');
			ShouldUpdate.check(data, old_vehicle_details, vehicle_reg_date, 'vehicle_reg_date');
			ShouldUpdate.check(data, old_vehicle_details, vehicle_trip_type, 'vehicle_trip_type');
			ShouldUpdate.check(data, old_vehicle_details, vehicle_load_type, 'vehicle_load_type');
			
			ShouldUpdate.check(data, old_vehicle_details, was_3rd_party_involved, 'was_3rd_party_involved');
			ShouldUpdate.check(data, old_vehicle_details, are_3rd_party_details_available, 'are_3rd_party_details_available');
			ShouldUpdate.check(data, old_vehicle_details, third_party_fname, 'third_party_fname');
			ShouldUpdate.check(data, old_vehicle_details, third_party_lname, 'third_party_lname');
			ShouldUpdate.check(data, old_vehicle_details, third_party_address, 'third_party_address');
			ShouldUpdate.check(data, old_vehicle_details, third_party_email, 'third_party_email');
			ShouldUpdate.check(data, old_vehicle_details, third_party_phone, 'third_party_phone');
			ShouldUpdate.check(data, old_vehicle_details, did_driver_admit_liability, 'did_driver_admit_liability');
			ShouldUpdate.check(data, old_vehicle_details, did_someone_else_admit_liability, 'did_someone_else_admit_liability');
			ShouldUpdate.check(data, old_vehicle_details, someone_else_admit_liability_name, 'someone_else_admit_liability_name');
			ShouldUpdate.check(data, old_vehicle_details, liability_admitted_to_name, 'liability_admitted_to_name');
			ShouldUpdate.check(data, old_vehicle_details, third_party_opinion, 'third_party_opinion');
			ShouldUpdate.checkFileList(data, old_vehicle_details, third_party_document_list, 'third_party_document_list');
			
			ShouldUpdate.check(data, old_vehicle_details, is_infringement_issued, 'is_infringement_issued');
			ShouldUpdate.check(data, old_vehicle_details, penalty_num, 'penalty_num');
			ShouldUpdate.check(data, old_vehicle_details, issuing_authority, 'issuing_authority');
			ShouldUpdate.check(data, old_vehicle_details, issuing_officer, 'issuing_officer');
			ShouldUpdate.check(data, old_vehicle_details, type_of_breach, 'type_of_breach');
			ShouldUpdate.check(data, old_vehicle_details, addressee_issued_to_name, 'addressee_issued_to_name');
			ShouldUpdate.check(data, old_vehicle_details, addressee_name_or_entity, 'addressee_name_or_entity');
			ShouldUpdate.check(data, old_vehicle_details, addressee_amount, 'addressee_amount');
			ShouldUpdate.checkDate(data, old_vehicle_details, addressee_due_date, 'addressee_due_date');
			ShouldUpdate.check(data, old_vehicle_details, did_police_attend_scene, 'did_police_attend_scene');
			ShouldUpdate.check(data, old_vehicle_details, ref_or_report_num, 'ref_or_report_num');
			ShouldUpdate.check(data, old_vehicle_details, officer_name, 'officer_name');
			ShouldUpdate.check(data, old_vehicle_details, officer_station, 'officer_station');
			ShouldUpdate.check(data, old_vehicle_details, collision_reported_to_police_station, 'collision_reported_to_police_station');
			ShouldUpdate.check(data, old_vehicle_details, have_charges_been_laid, 'have_charges_been_laid');
			ShouldUpdate.check(data, old_vehicle_details, nature_of_charges, 'nature_of_charges');
			ShouldUpdate.check(data, old_vehicle_details, who_laid_charges, 'who_laid_charges');
			ShouldUpdate.check(data, old_vehicle_details, who_were_nature_charges_laid_against, 'who_were_nature_charges_laid_against');
			
			if (Object.keys(data).isEmpty()) {
				infoDialog.open("Nothing changed!");
				return;
			}
			
			console.log(data)
			
			if (vehicle_details_id) {
				let onProgress;
				
				if (data.third_party_document_list) {
					onProgress = true;
					const {third_party_document_list} = data;
					delete data.third_party_document_list;
					
					btn.text("Saving...").disabled();3
					progressDialog.open();
					
					const res = await Promise.all(third_party_document_list.map(async v => {
						const {id, incident_id, name} = v;
						if (id) {
							const attrs = {name};
							attrs.id = id;
							return updateIncidentTestType(attrs);
						} else {
							const {name} = v;
							return insertIncidentTestType({
								incident_id: this.item.id,
								name,
							});
						}
					}));
					if (Object.keys(data).isEmpty()) {
						console.log("res", res)
						// onSaved && onSaved(res);
						infoDialog.open("Record successfully updated.");
						infoDialog.close(2000);
						
						btn.text("Save").enabled();
						setTimeout(() => progressDialog.close());
						return;
					}
				}
				
				if (Object.keys(data).isEmpty()) {
					infoDialog.open("Nothing changed!");
					return;
				}
				
				//submit edit vehicle details
			} else {
				if (data.third_party_document_list) {
					data.third_party_document_list = {
						data: third_party_document_list,
					};
				}
				//submit save vehicle details
			}
			
			return;
		}

		//to test
		if (idx === 7) {
			const {
				//7
				is_person_injured,
				person_injured,
				person_injured_other,
				injured_person_dob,
				injured_person_gender,
				nature_of_injury_list,
				bodily_injury_location_list,
				injury_mechanism_list,
				injury_desc,
			} = form.data;
			const data = {};

			ShouldUpdate.check(data, old_data, is_person_injured, 'is_person_injured');
			ShouldUpdate.checkEmployee(data, old_data, person_injured, 'person_injured');
			// ShouldUpdate.checkEmployee(data, old_data, person_injured_other, 'person_injured_other');
			ShouldUpdate.checkDate(data, old_data, injured_person_dob, 'injured_person_dob');
			ShouldUpdate.check(data, old_data, injured_person_gender, 'injured_person_gender');
			ShouldUpdate.checkListToJS(data, old_data, nature_of_injury_list, 'nature_of_injury_list');
			ShouldUpdate.checkListToJS(data, old_data, bodily_injury_location_list, 'bodily_injury_location_list');
			ShouldUpdate.checkListToJS(data, old_data, injury_mechanism_list, 'injury_mechanism_list');
			ShouldUpdate.check(data, old_data, injury_desc, 'injury_desc');

			if (Object.keys(data).isEmpty()) {
				infoDialog.open("Nothing changed!");
				return;
			}

			console.log(data)

			let onProgress;
			if (data.nature_of_injury_list || data.bodily_injury_location_list || data.nature_of_injury_list) {
				onProgress = true;
				const {nature_of_injury_list, bodily_injury_location_list, injury_mechanism_list} = data;
				delete data.nature_of_injury_list;
				delete data.bodily_injury_location_list;
				delete data.injury_mechanism_list;

				btn.text("Saving...").disabled();
				progressDialog.open();

				const res = await Promise.all([
					...(nature_of_injury_list || []),
					...(bodily_injury_location_list || []),
					...(injury_mechanism_list || []),
				].map(async v => {
					const {id, incident_id, injury_id, injury} = v;
					const attrs = {};
					if (injury && injury.id !== injury_id) {
						attrs.new_injury_id = injury.id;
					}
					if (Object.keys(attrs).isNotEmpty()) {
						attrs.injury_id = injury_id;
						attrs.incident_id = this.item.id;
						return updateProxyIncidentInjuryList(attrs);
					}
					if (!injury_id && injury) {
						return insertProxyIncidentInjuryList({
							incident_id: this.item.id,
							injury_id: injury.id,
						});
					}
				}));
				if (Object.keys(data).isEmpty()) {
					console.log("res", res)
					// onSaved && onSaved(res);
					infoDialog.open("Record successfully updated.");
					infoDialog.close(2000);

					btn.text("Save").enabled();
					setTimeout(() => progressDialog.close());
					return;
				}
			}

			if (Object.keys(data).isEmpty()) {
				infoDialog.open("Nothing changed!");
				return;
			}

			onSubmit(data, onProgress);
			return;
		}

		//to test
		if (idx === 8) {
			const {
				//8
				test_undertaken,
				test_type_list,
				test_type_drug_undertaken,
				test_type_alcohol_undertaken,
				test_type_mobile_device_undertaken,
			} = form.data;

			const data = {};

			ShouldUpdate.check(data, old_data, test_undertaken, 'test_undertaken');
			ShouldUpdate.checkListToJS(data, old_data, test_type_list, 'test_type_list');
			ShouldUpdate.check(data, old_data, test_type_drug_undertaken, 'test_type_drug_undertaken');
			ShouldUpdate.check(data, old_data, test_type_alcohol_undertaken, 'test_type_alcohol_undertaken');
			ShouldUpdate.check(data, old_data, test_type_mobile_device_undertaken, 'test_type_mobile_device_undertaken');

			if (Object.keys(data).isEmpty()) {
				infoDialog.open("Nothing changed!");
				return;
			}

			console.log(data)

			let onProgress;
			if (data.test_type_list) {
				onProgress = true;
				const {test_type_list} = data;
				delete data.test_type_list;

				btn.text("Saving...").disabled();
				progressDialog.open();

				const res = await Promise.all(test_type_list.map(async v => {
					const {id, incident_id, name} = v;
					if (id) {
						const attrs = {name};
						attrs.id = id;
						return updateIncidentTestType(attrs);
					} else {
						const {name} = v;
						return insertIncidentTestType({
							incident_id: this.item.id,
							name,
						});
					}
				}));
				if (Object.keys(data).isEmpty()) {
					console.log("res", res)
					// onSaved && onSaved(res);
					infoDialog.open("Record successfully updated.");
					infoDialog.close(2000);

					btn.text("Save").enabled();
					setTimeout(() => progressDialog.close());
					return;
				}
			}

			if (Object.keys(data).isEmpty()) {
				infoDialog.open("Nothing changed!");
				return;
			}

			onSubmit(data, onProgress);
			return;
		}

		if (idx === 9) {
			const {
				//7.4
				severity: old_severity = {},
			} = old_data;
			const {
				//7.4
				consequence,
				likelihood,
			} = form.data;
			const data = {};

			ShouldUpdate.check(data, old_severity, consequence, 'consequence');
			ShouldUpdate.check(data, old_severity, likelihood, 'likelihood');

			if (Object.keys(data).isEmpty()) {
				infoDialog.open("Nothing changed!");
				return;
			}

			console.log(data)

			if (old_severity.id) {
				btn.text("Saving...").disabled();
				progressDialog.open();
				updateIncidentSeverity({id: old_severity.id, ...data}).then(res => {
					console.log("res", res)
					// onSaved && onSaved(res);
					infoDialog.open("Record successfully updated.");
					infoDialog.close(2000);
					// this.props.close();
				}).finally(() => {
					btn.text("Save").enabled();
					setTimeout(() => progressDialog.close());
				});
			} else {
				btn.text("Saving...").disabled();
				progressDialog.open();
				const res = await insertIncidentSeverity({consequence, likelihood,});
				if (res) {
					onSubmit({severity_id: res.id}, true);
				}
			}

			return;
		}

		return true;
	}

	//</editor-fold>

	// <editor-fold defaultstate="collapsed" desc="onSubmit">
	// onSubmit(e, btn, onSaved) {
	// 	onSubmitEdit.call(this, e, btn, onSaved);
	// }

	// </editor-fold>

	@computed get item() {
		return this.props.state.item;
	}

	// <editor-fold defaultstate="collapsed" desc="render">
	render() {
		if (!this.item) {
			return <CircularProgress className="fixed-center"/>;
		}
		return editRender.call(this);
	}

	// </editor-fold>
}

export default EditDialog;
