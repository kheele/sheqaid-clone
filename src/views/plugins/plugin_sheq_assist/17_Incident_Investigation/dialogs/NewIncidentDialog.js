// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';

import ANewDialog from 'components/dialogs/ANewDialog';

import onSubmitCreate from "./IncidentForms/onSubmitCreate";
import {newRender} from './IncidentForms';
import style from "./NewIncidentDialog.lazy.css";
import StateLists from "./IncidentForms/StateLists";
import * as OnChangeFuns from "./IncidentForms/OnChangeFuns";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class NewDialog extends ANewDialog {
	pageKey = "NewIncidentDialog";
	title = "Incident";

	constructor(props) {
		super(props, style);
	}

	get controls() {
		return Controls;
	}
}

// </editor-fold>

@observer
class Controls extends React.Component {
	path = "plugin_sheq_assist/17_Incident_Investigation/";

	// <editor-fold defaultstate="collapsed" desc="state">
	@observable
	state = {
		lists: StateLists,
		riskRatingSelected: {
			consequence: null,
			likelihood: null
		}
	};
	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="constructor">
	constructor() {
		super();

		this.onNext = this.onNext.bind(this);

//        this.onAddEvidence = this.onAddEvidence.bind(this);
//        this.onRemoveEvidence = this.onRemoveEvidence.bind(this);
//        this.renderEvidenceItem = this.renderEvidenceItem.bind(this);
//        this.onLoadEvidencePlaceholderList = this.onLoadEvidencePlaceholderList.bind(this);
//        
//        this.onChangeType = this.onChangeType.bind(this);

		const {
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
			onChangeIsVehicleIncident,
			onChangeWas3rdPartyInvolved,
			onChangeAre3rdPartyDetailsAvailable,
			onChangeDidDriverAdmitLiability,
			onChangedDidSomeoneElseAdmitLiability,
			onChangeIsInfringementIssued,
			onChangeDidPoliceAttendScene,
			onChangeCollisionReportedToPoliceStation,
			onChangeHaveChargesBeenLaid,
		} = OnChangeFuns;

		this.form = new Form();
		this.form.addChangeOne("category_list", onChangeCategoryList.bind(this));
		this.form.addChangeOne("sector_list", onChangeSectorList.bind(this));
		this.form.addChangeOne("person_injured", onChangePersonInjured.bind(this));
		this.form.addChangeOne("bodily_injury_location_list", onChangeBodilyInjuryLocationList.bind(this));
		this.form.addChangeOne("consequence", onChangeConsequence.bind(this));
		this.form.addChangeOne("likelihood", onChangeLikelihood.bind(this));
		this.form.addChangeOne("risk_rating", onChangeRiskRating.bind(this));
		this.form.addChangeOne("test_undertaken", onChangeTestUndertaken.bind(this));
		this.form.addChangeOne("test_type_list", onChangeTestTypeList.bind(this));
		this.form.addChangeOne("is_vehicle_incident", onChangeIsVehicleIncident.bind(this));
		this.form.addChangeOne("was_3rd_party_involved", onChangeWas3rdPartyInvolved.bind(this));
		this.form.addChangeOne("are_3rd_party_details_available", onChangeAre3rdPartyDetailsAvailable.bind(this));
		this.form.addChangeOne("did_driver_admit_liability", onChangeDidDriverAdmitLiability.bind(this));
		this.form.addChangeOne("did_someone_else_admit_liability", onChangedDidSomeoneElseAdmitLiability.bind(this));
		this.form.addChangeOne("is_infringement_issued", onChangeIsInfringementIssued.bind(this));
		this.form.addChangeOne("did_police_attend_scene", onChangeDidPoliceAttendScene.bind(this));
		this.form.addChangeOne("collision_reported_to_police_station", onChangeCollisionReportedToPoliceStation.bind(this));
		this.form.addChangeOne("have_charges_been_laid", onChangeHaveChargesBeenLaid.bind(this));
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="onNext">
	onNext(e, btn) {
		return onNext.call(this, e, btn);
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="onSubmit">
	onSubmit(e, btn, onSaved) {
		onSubmitCreate.call(this, e, btn, onSaved);
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="render">
	render() {
		return newRender.call(this);
	}

	// </editor-fold>
}

export default NewDialog;