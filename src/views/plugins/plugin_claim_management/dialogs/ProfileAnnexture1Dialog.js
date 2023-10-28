// <editor-fold defaultstate="collapsed" desc="import">
import React from "react";
import {observer} from 'mobx-react';
import {observable, computed} from 'mobx';

import {ProfileField} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import {AProfileDialog} from 'components/dialogs';

import style from "./ProfileAnnexture1Dialog.lazy.css";
import findByIdAnnexture1 from "../../../../mutations/all/COIDA/Annexture1/findByIdAnnexture1";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ProfileAnnexture1Dialog extends AProfileDialog {
    pageKey = "ProfileAnnexture1Dialog";
    findById = findByIdAnnexture1;

    constructor(props) {
        super(props, style);
    }

    title() {
        return "Annexture 1";
    }
    
    get topButtonsHiddenDelete() {
        return true;
    }

    get controls() {
        return  Controls;
    }
}
// </editor-fold>

@observer
class Controls extends React.Component {

    // <editor-fold defaultstate="collapsed" desc="fields">
    @observable
    state = {
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor() {
        super();
    }
    // </editor-fold>

    @computed get item() {
        return this.props.state.item;
    }

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        if (!this.item)
            return null;
        const {
            props: {
                onFormNext, onFormBack, onFormOpen,
                dialog: {renderProfileCover}
            },
            item: {
                id, data: {
                    // employee,

                    //A. Recording Of Incident
                    company_name,
//            affected_person,
                    id_num,
                    accident_date,
                    accident_time,
                    part_of_body_affected,
                    effect_on_person,
                    expected_period_of_disablement,
                    disease_desc,
                    process,
                    incident_reported_compensationcommissioner__provincial_director,
                    incident_reported_police,
                    saps_office,
                    saps_reference,
                    substance_exposed_to,

                    //B. Incident Investigation
                    investigator,
                    investigation_date,
                    investigator_designation,
                    incident_desc,
                    incident_cause,
                    steps_to_prevent_recurrence,
                    investigator_signature,
                    investigator_signature_date,

                    //C. Action Taken By Employer To Prevent The Recurrence Of Similar Incident
                    employer_preventative_action_for_recurrence_of_similar_incident,
                    employer_signature,
                    employer_signature_date,

                    //D. Remarks By Health & Safety Committee
                    health_and_safety_committee_remarks,
                    chairperson_of_health_and_safety_committee_signature,
                    chairperson_of_health_and_safety_committee_signature_date
                }
            }
        } = this;

        const employee = this.props.dialog.extraProp('employee');

        const {isContractor, isConsultant} = storage.is;
        return <FormControls>
                <Row 
                    rendered  
                    active
                    idx={1}
                    title="A. Recording Of Incident" 
                    onFormOpen={onFormOpen} 
                    onFormNext={onFormNext}
                >
                    <ProfileField name="company_name" title="Name of employer" value={company_name} className="col-lg-12"/>
                    <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">Affected Person</label>
                    <ProfileField name="affected_person" title="Affected Person" value={employee} renderer={v => v.full_name} className="col-lg-6 col-xs-12"/>
                    <ProfileField name="id_num" title="Affected Person ID No." value={id_num} className="col-lg-6 col-xs-12"/>
                    <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">Accident Date & Time</label>
                    <ProfileField name="accident_date" type="date" title="Accident Date" value={accident_date} className="col-lg-6 col-xs-12"/>
                    <ProfileField name="accident_time" title="Accident Time" value={accident_time} className="col-lg-6 col-xs-12"/>
                    <hr className="margin-v-5"/>
                    <ProfileField name="part_of_body_affected" title="Part of body affected" value={part_of_body_affected && part_of_body_affected.join(',')}  className="col-lg-12"/>
                    <ProfileField name="effect_on_person" title="Effect on person" value={effect_on_person && effect_on_person.join(',')} className="col-lg-12"/>
                    <ProfileField name="expected_period_of_disablement" title="Expected period of disablement" value={expected_period_of_disablement} className="col-lg-12"/>
                    <hr className="margin-v-5"/>
                    <ProfileField name="disease_desc" title="Description of occupational disease" value={disease_desc} className="col-lg-12"/>
                    <ProfileField name="process" title="Machine/process involved/type of work performed/exposure**" value={process} className="col-lg-12"/>
                    <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">Was the incident reported to:</label>
                    <ProfileField name="incident_reported_compensationcommissioner__provincial_director" title="a) the Compensation Commissioner and Provincial Director?" value={incident_reported_compensationcommissioner__provincial_director} className="col-lg-12"/>
                    <ProfileField name="incident_reported_police" title="b) the police?*" value={incident_reported_police} className="col-lg-12"/>
                    <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">SAPS office and reference</label>
                    <ProfileField name="saps_office" title="SAPS office" value={saps_office} className="col-lg-6 col-xs-12"/>
                    <ProfileField name="saps_reference" title="Reference" value={saps_reference} className="col-lg-6 col-xs-12"/>
                    <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">
                        * to be completed in case of a fatal incident<br/>
                        ** in case of a hazardous chemical substance, indicate substance exposed to
                    </label>
                    <ProfileField name="substance_exposed_to" title="Substance Exposed To" value={substance_exposed_to} className="col-lg-12"/>
                </Row>
                <Row 
                    rendered 
                    idx={2}
                    title="B. Incident Investigation" 
                    onFormOpen={onFormOpen} 
                    onFormBack={onFormBack} 
                    onFormNext={onFormNext}
                >
                    <ProfileField name="investigator" title="Investigator" value={investigator} renderer={v => v.full_name} className="col-lg-12"/>
                    <ProfileField name="investigation_date" type="date" title="Investigation Date" value={investigation_date} className="col-lg-12"/>
                    <ProfileField name="investigator_designation" title="Investigator Designation" value={investigator_designation} className="col-lg-12"/>
                    
                    <ProfileField name="incident_desc" title="Short description of incident" value={incident_desc} className="col-lg-12"/>
                    <ProfileField name="incident_cause" title="Suspected cause of incident" value={incident_cause} className="col-lg-12"/>
                    <ProfileField name="steps_to_prevent_recurrence" title="Recommended steps to prevent a recurrence" value={steps_to_prevent_recurrence} className="col-lg-12"/>
                    <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">Date & Signature of Investigator</label>
                    <ProfileField name="investigator_signature" type="signature" title="Signature of Investigator" value={investigator_signature} className="col-lg-6 col-xs-12"/>
                    <ProfileField name="investigator_signature_date" type="date" title="Signature Date" value={investigator_signature_date} className="col-lg-6 col-xs-12"/>
                </Row>
                <Row 
                    rendered 
                    idx={3}
                    title="C. Action Taken By Employer To Prevent The Recurrence Of Similar Incident" 
                    onFormOpen={onFormOpen} 
                    onFormBack={onFormBack} 
                    onFormNext={onFormNext}
                >
                    <ProfileField name="employer_preventative_action_for_recurrence_of_similar_incident" title="Action Taken By Employer To Prevent The Recurrence Of Similar Incident" value={employer_preventative_action_for_recurrence_of_similar_incident} className="col-lg-12"/>
                    <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">Date & Signature of Employer</label>
                    <ProfileField name="employer_signature" type="signature" title="Signature of Employer" value={employer_signature} className="col-lg-6 col-xs-12"/>
                    <ProfileField name="employer_signature_date" type="date" title="Signature Date" value={employer_signature_date} className="col-lg-6 col-xs-12"/>
                </Row>
                <Row 
                    rendered 
                    idx={4}
                    title="D. Remarks By Health & Safety Committee" 
                    onFormOpen={onFormOpen} 
                    onFormBack={onFormBack} 
                >
                    <ProfileField name="health_and_safety_committee_remarks" title="Remarks" value={health_and_safety_committee_remarks} className="col-lg-12"/>
                    <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">Date & Signature of Chairperson of Health and Safety Committee</label>
                    <ProfileField name="chairperson_of_health_and_safety_committee_signature" type="signature" title="Health and Safety Committee Chairperson Signature" value={chairperson_of_health_and_safety_committee_signature} className="col-lg-8 col-xs-12"/>
                    <ProfileField name="chairperson_of_health_and_safety_committee_signature_date" type="date" title="Signature Date" value={chairperson_of_health_and_safety_committee_signature_date} className="col-lg-4 col-xs-12"/>
                </Row>
        </FormControls>;
    }
    // </editor-fold>
}

export default ProfileAnnexture1Dialog;
