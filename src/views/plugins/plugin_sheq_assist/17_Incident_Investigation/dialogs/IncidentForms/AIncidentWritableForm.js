import React from "react";
import * as OnChangeFuns from "./OnChangeFuns";
import StateLists from "./StateLists";
import {observer} from "mobx-react";
import {observable} from "mobx";

import Form from 'utils/Form';

@observer
class Controls extends React.Component {

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

        this.onHumanBodyPartsAdded = onHumanBodyPartsAdded.bind(this);
        this.onHumanBodyPartsRemoved = onHumanBodyPartsRemoved.bind(this);

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

}

export default Controls;