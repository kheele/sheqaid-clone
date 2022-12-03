// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import style from "./EditIncidentDialog.lazy.css";
import StateLists from "./IncidentForms/StateLists";
import onSubmitEdit from "./IncidentForms/onSubmitEdit";
import onNext from "./IncidentForms/onNext";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from '../../../../../utils/Form';
import {execWhen} from '../../../../../utils/Utils';

import {AEditDialog} from '../../../../../components/dialogs';
import {editRender} from './IncidentForms';
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class EditDialog extends AEditDialog {
    pageKey = "EditIncidentDialog";
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
        this.onHumanBodyPartsAdded = this.onHumanBodyPartsAdded.bind(this);
        this.onHumanBodyPartsRemoved = this.onHumanBodyPartsRemoved.bind(this);

        this.form = new Form();
//        this.form.addChangeOne("type", this.onChangeType);//risk_rating
        this.form.addChangeOne("category_list", this.onChangeCategoryList.bind(this));
        this.form.addChangeOne("sector_list", this.onChangeSectorList.bind(this));
        this.form.addChangeOne("bodily_injury_location_list", this.onChangeBodilyInjuryLocationList.bind(this));
        this.form.addChangeOne("consequence", this.onChangeConsequence.bind(this));
        this.form.addChangeOne("likelihood", this.onChangeLikelihood.bind(this));
        this.form.addChangeOne("risk_rating", this.onChangeRiskRating.bind(this));
        this.form.addChangeOne("test_undertaken", this.onChangeTestUndertaken.bind(this));
        this.form.addChangeOne("test_type_list", this.onChangeTestTypeList.bind(this));
        this.form.addChangeOne("is_vehicle_incident", this.onChangeIsVehicleIncident.bind(this));
        this.form.addChangeOne("was_3rd_party_involved", this.onChangeWas3rdPartyInvolved.bind(this));
        this.form.addChangeOne("are_3rd_party_details_available", this.onChangeAre3rdPartyDetailsAvailable.bind(this));
        this.form.addChangeOne("did_driver_admit_liability", this.onChangeDidDriverAdmitLiability.bind(this));
        this.form.addChangeOne("did_someone_else_admit_liability", this.onChangedDidSomeoneElseAdmitLiability.bind(this));
        this.form.addChangeOne("is_infringement_issued", this.onChangeIsInfringementIssued.bind(this));
        this.form.addChangeOne("did_police_attend_scene", this.onChangeDidPoliceAttendScene.bind(this));
        this.form.addChangeOne("collision_reported_to_police_station", this.onChangeCollisionReportedToPoliceStation.bind(this));
        this.form.addChangeOne("have_charges_been_laid", this.onChangeHaveChargesBeenLaid.bind(this));
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onChange funs">
    onChangeCategoryList(el, val) {
        execWhen(() => this.refs.sub_category_list).then(ref => {
            if(val) {
                val.forEach((v) => {
                    const {[v]: list, options} = this.state.lists.sub_category_list;
                    if (list) {
                        options.clear();
                        options.push(...list);
                    }
                });
            } else {
                const {options} = this.state.lists.sub_category_list;
                options.clear();
            }
        });
    }

    onChangeSectorList(el, val) {
        execWhen(() => this.refs.activity_list).then(ref => {
            if(val) {
                val.forEach((v) => {
                    const {[v]: list, options} = this.state.lists.activity_list;
                    if (list) {
                        options.clear();
                        options.push(...list);
                    }
                });
            } else {
                const {options} = this.state.lists.activity_list;
                options.clear();
            }
        });
    }

    onChangeType(el, val) {
//        if (val) {
//            const {incident_type} = this.state.lists;
//            if (val === 'Incident' && !incident_type.contains("Personal Inquiry")) {
//                incident_type.insertAt(0, "Personal Inquiry");
//                incident_type.insertAt(1, "Security");
//                incident_type.insertAt(2, "Fire");
//                incident_type.insertAt(3, "Environment");
//            } else if (val === 'Accident') {
//                //["Personal Inquiry", "Security", "Fire", "Environment", "Property Damage", "Vehicle", "Plant"]
//                incident_type.remove("Personal Inquiry");
//                incident_type.remove("Security");
//                incident_type.remove("Fire");
//                incident_type.remove("Environment");
//            }
//        }
    }

    onChangeBodilyInjuryLocationList(el, val) {
        execWhen(() => this.refs.bodily_injury_location_list_pic).then(bodily_injury_location_list_pic => {
            bodily_injury_location_list_pic.setSelectedItems(val || []);
        });
    }

    onHumanBodyPartsAdded(val) {
        execWhen(() => this.refs.bodily_injury_location_list).then(ref => {
            const list = ref.value || [];
            list.push({label: val, value: val});
            ref.value = list;
        });
    }

    onHumanBodyPartsRemoved(val) {
        execWhen(() => this.refs.bodily_injury_location_list).then(ref => {
            const list = ref.value || [];
            list.removeIf(v => v.value === val);
            ref.value = list;
        });
    }

    onChangeConsequence(el, val) {
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

    onChangeLikelihood(el, val) {
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

    onChangeRiskRating(el, val) {
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

    onChangeTestUndertaken(el, val) {
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

    onChangeTestTypeList(el, val) {
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

    onChangeIsVehicleIncident(el, val) {
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

    onChangeWas3rdPartyInvolved(el, val) {
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

    onChangeAre3rdPartyDetailsAvailable(el, val) {
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

    onChangeDidDriverAdmitLiability(el, val) {
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

    onChangedDidSomeoneElseAdmitLiability(el, val) {
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

    onChangeIsInfringementIssued(el, val) {
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

    onChangeDidPoliceAttendScene(el, val) {
        execWhen(() => this.refs.did_police_attend_scene_sec && this.refs.have_charges_been_laid && this.refs.collision_reported_to_police_station).then(() => {
            const {
                did_police_attend_scene_sec: did_police_attend_scene_sec_ref,
                have_charges_been_laid: have_charges_been_laid_ref,

                collision_reported_to_police_station: collision_reported_to_police_station_ref,
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

    onChangeCollisionReportedToPoliceStation(el, val) {
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

    onChangeHaveChargesBeenLaid(el, val) {
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
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onNext">
    onNext(e, btn) {
        return onNext.call(this, e, btn);
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    onSubmit(e, btn, onSaved) {
        onSubmitEdit.call(this, e, btn, onSaved);
    }
    // </editor-fold>

    get item() {
        return this.props.state.item;
    }

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        return editRender.call(this);
    }

    // </editor-fold>
}

export default EditDialog;