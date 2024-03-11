import {execWhen} from "utils/UtilsFuns";

const onChangeCategoryList = function (el, val) {
	execWhen(() => this.refs.sub_category_list).then(ref => {
		if (val) {
			!val.map && (val = [val]);
			ref.list = val.map(({data: {sub_category_list}}) => sub_category_list).reduce((a1, a2) => [...a1, ...a2], []);
		} else {
			ref.list = [];
		}
	});
}

const onChangeSectorList = function (el, val) {
	execWhen(() => this.refs.activity_list).then(ref => {
		if (val) {
			!val.map && (val = [val]);
			console.log('arr:', val.slice())
			ref.list = val.map(({data: {activity_list}}) => activity_list).reduce((a1, a2) => [...a1, ...a2], []);
		} else {
			ref.list = [];
		}
		
		if (!ref.list || ref.list.isEmpty()) {
			ref.hide();
		} else {
			ref.show();
		}
	});
}

const onChangePersonInjured = function (el, val) {
	execWhen(() => !!this.refs.person_injured).then(() => {
		const {
			person_injured: person_injured_ref,
			injured_person_dob: injured_person_dob_ref,
			injured_person_gender: injured_person_gender_ref
		} = this.refs;
		if (val) {
			let {sex, dob} = val.data || val;
			sex && injured_person_gender_ref.onChange({label: sex, value: sex});
			dob && injured_person_dob_ref.onChange(dob);
		} else {
			injured_person_dob_ref.reset();
			injured_person_gender_ref.reset();
		}
	});
}

const onChangeBodilyInjuryLocationList = function (el, val) {
	execWhen(() => this.refs.bodily_injury_location_list_pic).then(bodily_injury_location_list_pic => {
		bodily_injury_location_list_pic.setSelectedItems(val || []);
	});
}

const onHumanBodyPartsAdded = function (val) {
	execWhen(() => this.refs.bodily_injury_location_list).then(ref => {
		const {list} = ref;
		const selectedItem = list.find(({value: {data: {name}}}) => name === val);
		console.log('onHumanBodyPartsAdded selectedItem', selectedItem, val, list.slice());
		const selectedList = ref.value || [];
		selectedList.push(selectedItem);
		ref.value = selectedList;
	});
}

const onHumanBodyPartsRemoved = function (val) {
	execWhen(() => this.refs.bodily_injury_location_list).then(ref => {
		const selectedList = ref.value || [];
		selectedList.removeIf(({value: {data: {name}}}) => name === val);
		ref.value = selectedList;
	});
}

const onChangeConsequence = function (el, val) {
	execWhen(() => this.refs.likelihood && this.refs.risk_rating).then(() => {
		if (val) {
			const {likelihood: likelihood_ref, risk_rating} = this.refs;
			this.state.riskRatingSelected.consequence = val;
			if (likelihood_ref.hasValue) {
				this.state.riskRatingSelected.likelihood = likelihood_ref.value;
			}
		}
	});
}

const onChangeLikelihood = function (el, val) {
	execWhen(() => this.refs.consequence && this.refs.risk_rating).then(() => {
		if (val) {
			const {consequence: consequence_ref, risk_rating} = this.refs;
			this.state.riskRatingSelected.likelihood = val;
			if (consequence_ref.hasValue) {
				this.state.riskRatingSelected.consequence = consequence_ref.value;
			}
		}
	});
}

const onChangeRiskRating = function (el, val) {
	execWhen(() => this.refs.consequence && this.refs.likelihood).then(() => {
		if (val) {
			const {consequence: consequence_ref, likelihood: likelihood_ref} = this.refs;
			this.state.riskRatingSelected.consequence = val.consequence;
			this.state.riskRatingSelected.likelihood = val.likelihood;
			const consequence = this.state.lists.consequence.find(item => item.value === val.consequence);
			const likelihood = this.state.lists.likelihood.find(item => item.value === val.likelihood);
			consequence && consequence_ref.onChange(consequence);
			likelihood && likelihood_ref.onChange(likelihood);
		}
	});
}

const onChangeTestUndertaken = function (el, val) {
	execWhen(() => this.refs.test_type_list).then(test_type_list_ref => {
		if (val) {
			if (val === 'Yes') {
				test_type_list_ref.show();
			} else {
				test_type_list_ref.hide();
			}
		}
	});
}

const onChangeTestTypeList = function (el, val) {
	execWhen(() => this.refs.test_type_drug_undertaken && this.refs.test_type_alcohol_undertaken && this.refs.test_type_mobile_device_undertaken).then(() => {
		const {
			test_type_drug_undertaken: test_type_drug_undertaken_ref,
			test_type_alcohol_undertaken: test_type_alcohol_undertaken_ref,
			test_type_mobile_device_undertaken: test_type_mobile_device_undertaken_ref
		} = this.refs;
		if (val) {
			if (val.contains('Drug')) {
				test_type_drug_undertaken_ref.show();
			} else {
				test_type_drug_undertaken_ref.hide();
			}
			if (val.contains('Alcohol')) {
				test_type_alcohol_undertaken_ref.show();
			} else {
				test_type_alcohol_undertaken_ref.hide();
			}
			if (val.contains('Mobile Device')) {
				test_type_mobile_device_undertaken_ref.show();
			} else {
				test_type_mobile_device_undertaken_ref.hide();
			}
		} else {
			test_type_drug_undertaken_ref.hide();
			test_type_alcohol_undertaken_ref.hide();
			test_type_mobile_device_undertaken_ref.hide();
		}
	});
}

const onChangeIsPersonInjured = function (el, val) {
	execWhen(() => this.refs.injury_details_sec).then(ref => {
		if (val) {
			if (val === 'Yes') {
				ref.show();
			} else {
				ref.hide();
			}
		} else {
			ref.hide();
		}
	});
}

const onChangeIsVehicleIncident = function (el, val) {
	execWhen(() => this.refs.driver_details_sec && this.refs.vehicle_details_sec && this.refs.third_party_details_sec && this.refs.infringement_details_sec && this.refs.police_involvement_details_sec).then(() => {
		const {
			driver_details_sec: driver_details_sec_ref,
			vehicle_details_sec: vehicle_details_sec_ref,
			third_party_details_sec: third_party_details_sec_ref,
			infringement_details_sec: infringement_details_sec_ref,
			police_involvement_details_sec: police_involvement_details_sec_ref
		} = this.refs;
		if (val) {
			if (val === 'Yes') {
				driver_details_sec_ref.show();
				vehicle_details_sec_ref.show();
				third_party_details_sec_ref.show();
				infringement_details_sec_ref.show();
				police_involvement_details_sec_ref.show();
			} else {
				driver_details_sec_ref.hide();
				vehicle_details_sec_ref.hide();
				third_party_details_sec_ref.hide();
				infringement_details_sec_ref.hide();
				police_involvement_details_sec_ref.hide();
			}
		} else {
			driver_details_sec_ref.hide();
			vehicle_details_sec_ref.hide();
			third_party_details_sec_ref.hide();
			infringement_details_sec_ref.hide();
			police_involvement_details_sec_ref.hide();
		}
	});
}

const onChangeWas3rdPartyInvolved = function (el, val) {
	execWhen(() => this.refs.was_3rd_party_involved_sec).then(was_3rd_party_involved_sec_ref => {
		if (val) {
			if (val === 'Yes') {
				was_3rd_party_involved_sec_ref.show();
			} else {
				was_3rd_party_involved_sec_ref.hide();
			}
		} else {
			was_3rd_party_involved_sec_ref.hide();
		}
	});
}

const onChangeAre3rdPartyDetailsAvailable = function (el, val) {
	execWhen(() => this.refs.are_3rd_party_details_available_sec).then(are_3rd_party_details_available_sec_ref => {
		if (val) {
			if (val === 'Yes') {
				are_3rd_party_details_available_sec_ref.show();
			} else {
				are_3rd_party_details_available_sec_ref.hide();
			}
		} else {
			are_3rd_party_details_available_sec_ref.hide();
		}
	});
}

const onChangeDidDriverAdmitLiability = function (el, val) {
	execWhen(() => this.refs.did_driver_admit_liability_sec && this.refs.liability_admitted_to_name && this.refs.did_someone_else_admit_liability).then(() => {
		const {
			did_driver_admit_liability_sec: did_driver_admit_liability_sec_ref,
			liability_admitted_to_name: liability_admitted_to_name_ref,
			
			did_someone_else_admit_liability: did_someone_else_admit_liability_ref
		} = this.refs;
		if (val) {
			if (val === 'No') {
				did_driver_admit_liability_sec_ref.show();
				if (did_someone_else_admit_liability_ref && did_someone_else_admit_liability_ref.value === 'No') {
					liability_admitted_to_name_ref.hide();
				} else {
					liability_admitted_to_name_ref.show();
				}
			} else {
				did_driver_admit_liability_sec_ref.hide();
				liability_admitted_to_name_ref.hide();
			}
		} else {
			did_driver_admit_liability_sec_ref.hide();
			liability_admitted_to_name_ref.hide();
		}
	});
}

const onChangedDidSomeoneElseAdmitLiability = function (el, val) {
	execWhen(() => this.refs.someone_else_admit_liability_name && this.refs.liability_admitted_to_name && this.refs.did_driver_admit_liability).then(() => {
		const {
			someone_else_admit_liability_name: someone_else_admit_liability_name_ref,
			liability_admitted_to_name: liability_admitted_to_name_ref,
			
			did_driver_admit_liability: did_driver_admit_liability_ref
		} = this.refs;
		if (val) {
			if (val === 'Yes') {
				someone_else_admit_liability_name_ref.show();
				liability_admitted_to_name_ref.hide();
			} else {
				someone_else_admit_liability_name_ref.hide();
				liability_admitted_to_name_ref.show();
				if (did_driver_admit_liability_ref.value === 'Yes') {
					liability_admitted_to_name_ref.hide();
				} else {
					liability_admitted_to_name_ref.show();
				}
			}
		} else {
			someone_else_admit_liability_name_ref.hide();
			liability_admitted_to_name_ref.hide();
		}
	});
}

const onChangeIsInfringementIssued = function (el, val) {
	execWhen(() => this.refs.is_infringement_issued_sec).then(is_infringement_issued_sec_ref => {
		if (val) {
			if (val === 'Yes') {
				is_infringement_issued_sec_ref.show();
			} else {
				is_infringement_issued_sec_ref.hide();
			}
		} else {
			is_infringement_issued_sec_ref.hide();
		}
	});
}

const onChangeDidPoliceAttendScene = function (el, val) {
	execWhen(() => this.refs.did_police_attend_scene_sec && this.refs.have_charges_been_laid && this.refs.collision_reported_to_police_station).then(() => {
		const {
			did_police_attend_scene_sec: did_police_attend_scene_sec_ref,
			have_charges_been_laid: have_charges_been_laid_ref,
			
			collision_reported_to_police_station: collision_reported_to_police_station_ref
		} = this.refs;
		if (val) {
			if (val === 'Yes') {
				did_police_attend_scene_sec_ref.show();
			} else {
				did_police_attend_scene_sec_ref.hide();
			}
			if (val === 'Yes' || collision_reported_to_police_station_ref.value === 'Yes') {
				have_charges_been_laid_ref.show();
			} else {
				have_charges_been_laid_ref.hide();
			}
			return;
		} else {
			did_police_attend_scene_sec_ref.hide();
		}
		if (collision_reported_to_police_station_ref.value !== 'Yes') {
			have_charges_been_laid_ref.hide();
		}
	});
}

const onChangeCollisionReportedToPoliceStation = function (el, val) {
	execWhen(() => this.refs.have_charges_been_laid && this.refs.did_police_attend_scene).then(() => {
		const {
			have_charges_been_laid: have_charges_been_laid_ref,
			
			did_police_attend_scene: did_police_attend_scene_ref
		} = this.refs;
		if (val) {
			if (val === 'Yes' || did_police_attend_scene_ref.value === 'Yes') {
				have_charges_been_laid_ref.show();
			} else {
				have_charges_been_laid_ref.hide();
			}
		} else if (did_police_attend_scene_ref.value !== 'Yes') {
			have_charges_been_laid_ref.hide();
		}
	});
}

const onChangeHaveChargesBeenLaid = function (el, val) {
	execWhen(() => this.refs.have_charges_been_laid_sec).then(have_charges_been_laid_sec_ref => {
		if (val) {
			if (val === 'Yes') {
				have_charges_been_laid_sec_ref.show();
			} else {
				have_charges_been_laid_sec_ref.hide();
			}
		} else {
			have_charges_been_laid_sec_ref.hide();
		}
	});
}

export {
	
	// <editor-fold defaultstate="collapsed" desc="onChange funs">
	onChangeCategoryList,
	onChangeSectorList,
	
	onChangePersonInjured,
	
	onChangeBodilyInjuryLocationList,
	
	onHumanBodyPartsAdded,
	
	onHumanBodyPartsRemoved,
	
	onChangeConsequence,
	
	onChangeLikelihood,
	
	onChangeRiskRating,
	
	onChangeTestUndertaken,
	
	onChangeTestTypeList,
	
	onChangeIsPersonInjured,
	
	onChangeIsVehicleIncident,
	
	onChangeWas3rdPartyInvolved,
	
	onChangeAre3rdPartyDetailsAvailable,
	
	onChangeDidDriverAdmitLiability,
	
	onChangedDidSomeoneElseAdmitLiability,
	
	onChangeIsInfringementIssued,
	
	onChangeDidPoliceAttendScene,
	
	onChangeCollisionReportedToPoliceStation,
	
	onChangeHaveChargesBeenLaid,
	// </editor-fold>
	
};

// // </editor-fold>
