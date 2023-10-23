// <editor-fold defaultstate="collapsed" desc="import">
import React from "react";
import {observer} from 'mobx-react';
import {observable, toJS} from 'mobx';

import Form from 'utils/Form';
import {Dates, execWhen, setDefaultVal, ShouldUpdate} from 'utils/Utils';

import {ClearableInput, SelectEmployeeInput} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import {ANewDialog} from 'components/dialogs';

import style from "./NewAnnexture1Dialog.lazy.css";
import updateAnnexture1 from "../../../../../mutations/all/COIDA/Annexture1/updateAnnexture1";
import updateClaimsClient from "../../../../../mutations/all/COIDA/ClaimsClient/updateClaimsClient";
import insertAnnexture1 from "../../../../../mutations/all/COIDA/Annexture1/insertAnnexture1";
import findByIdWCL2 from "../../../../../mutations/all/COIDA/WCL2/findByIdWCL2";
import findByIdAnnexture1 from "../../../../../mutations/all/COIDA/Annexture1/findByIdAnnexture1";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class NewAnnexture1Dialog extends ANewDialog {
    pageKey = "NewAnnexture1Dialog";
    title = "Create/Edit Annexture 1";

    constructor(props) {
        super(props, style);
    }

    //<editor-fold desc="convert_data">
    convert_data(formData) {
        const {
            //
            totalFieldCount,
            totalFieldMax,

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
        } = formData;

        return {
            totalFieldCount,
            totalFieldMax,
            //A. Recording Of Incident
            company_name,
//            affected_person,
            id_num,
            accident_date: Dates.formatDateSQL(accident_date),
            accident_time,
            part_of_body_affected: part_of_body_affected && part_of_body_affected.slice(),
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
            investigator_id: investigator && investigator.id,
            investigator_other: investigator && !investigator.id ? {data: investigator} : null,
            investigation_date: Dates.formatDateSQL(investigation_date),
            investigator_designation,
            incident_desc,
            incident_cause,
            steps_to_prevent_recurrence,
            investigator_signature: investigator_signature && toJS(investigator_signature),
            investigator_signature_date: Dates.formatDateSQL(investigator_signature_date),

            //C. Action Taken By Employer To Prevent The Recurrence Of Similar Incident
            employer_preventative_action_for_recurrence_of_similar_incident,
            employer_signature: employer_signature && toJS(employer_signature),
            employer_signature_date: Dates.formatDateSQL(employer_signature_date),

            //D. Remarks By Health & Safety Committee
            health_and_safety_committee_remarks,
            chairperson_of_health_and_safety_committee_signature: chairperson_of_health_and_safety_committee_signature && toJS(chairperson_of_health_and_safety_committee_signature),
            chairperson_of_health_and_safety_committee_signature_date: Dates.formatDateSQL(chairperson_of_health_and_safety_committee_signature_date),
        };
    }

    //</editor-fold>

    get controls() {
        return Controls;
    }
}

// </editor-fold>

@observer
class Controls extends React.Component {

    // <editor-fold defaultstate="collapsed" desc="fields">
    @observable
    state = {
        lists: {
            part_of_body_affected: ['Head or Neck', 'Eye', 'Trunk', 'Finger', 'Hand', 'Arm', 'Foot', 'Leg', 'Internal', 'Multiple'].map(text => {
                return {value: text, text, checked: false};
            }),
            effect_on_person: ['Sprains or strains', 'Contusion or wounds', 'Fractures', 'Burns', 'Amputation', 'Electric shock', 'Asphyxiation', 'Unconsciousness', 'Poisoning', 'Occupational Disease'].map(text => {
                return {value: text, text, checked: false};
            }),
            expected_period_of_disablement: ['0-13 days', '2-4 weeks', '>4-16 weeks', '>16-52 weeks', '>52 weeks or permanent disablement', 'Killed'].map(text => {
                return {value: text, text, checked: false};
            }),
            incident_reported_compensationcommissioner__provincial_director: ['Yes', 'No'].map(text => {
                return {value: text, text, checked: false};
            }),
            incident_reported_police: ['Yes', 'No'].map(text => {
                return {value: text, text, checked: false};
            }),
        },
        countFields: {}
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor() {
        super();

        this.onNext = this.onNext.bind(this);

        this.onCountFields = this.onCountFields.bind(this);

        this.form = new Form();
        this.form.addChangeOne("affected_person", this.onChangeAffectedPerson.bind(this));
        this.form.addChangeOne("investigator", this.onChangeInvestigator.bind(this));
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="mounts">
    componentDidMount() {
        const setDefaultValue = setDefaultVal.bind(this);

        const {dialog, execWhen} = this.props;
        dialog.setTitle(this.item ? 'Edit Annexture 1' : 'Create Annexture 1');

        const employer_details = dialog.extraProp('employer_details');
        const employee = dialog.extraProp('employee');
        const accident_date = dialog.extraProp('accident_date');

        //A. Recording Of Incident
        if (employer_details) {
            const {data: {company_name}} = employer_details;
            setDefaultValue('company_name', (v) => v || company_name);
        } else {
            setDefaultValue('company_name');
        }
        setDefaultValue('affected_person', () => {
            if (!employee) return false;
            const {lname, fname, data} = employee;
            return {label: `${lname || data.lname} ${fname || data.fname}`, value: employee};
        });
        setDefaultValue('id_num', (id_num) => id_num || (employee && employee.data && employee.data.id_num));
        setDefaultValue('accident_date', () => accident_date);

        if (this.item) {
            //A. Recording Of Incident
            setDefaultValue('accident_time');
            setDefaultValue('part_of_body_affected');
            setDefaultValue('effect_on_person');
            setDefaultValue('expected_period_of_disablement');
            setDefaultValue('disease_desc');
            setDefaultValue('process');
            setDefaultValue('incident_reported_compensationcommissioner__provincial_director');
            setDefaultValue('incident_reported_police');
            setDefaultValue('saps_office');
            setDefaultValue('saps_reference');
            setDefaultValue('substance_exposed_to');

            //B. Incident Investigation
            setDefaultValue('investigator');
            setDefaultValue('investigation_date');
            setDefaultValue('investigator_designation');
            setDefaultValue('incident_desc');
            setDefaultValue('incident_cause');
            setDefaultValue('steps_to_prevent_recurrence');
            setDefaultValue('investigator_signature');
            setDefaultValue('investigator_signature_date');

            //C. Action Taken By Employer To Prevent The Recurrence Of Similar Incident
            setDefaultValue('employer_preventative_action_for_recurrence_of_similar_incident');
            setDefaultValue('employer_signature');
            setDefaultValue('employer_signature_date');

            //D. Remarks By Health & Safety Committee
            setDefaultValue('health_and_safety_committee_remarks');
            setDefaultValue('chairperson_of_health_and_safety_committee_signature');
            setDefaultValue('chairperson_of_health_and_safety_committee_signature_date');
        }
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onChange funs">
    onCountFields({count, max}, idx) {
        const {state: {countFields}} = this;
        countFields[idx] = {count, max};
    }

    onChangeAffectedPerson(el, val) {
        execWhen(() => this.refs.id_num).then(id_num_ref => {
            if (val) {
                let {id_num} = val.data;
                id_num && id_num_ref.onChange(id_num);
            }
        });
    }

    onChangeInvestigator(el, val) {
        execWhen(() => this.refs.investigator_designation).then(investigator_designation_ref => {
            if (val) {
                let {optional_info} = val.data;
                if (optional_info) {
                    const {job_position} = optional_info;
                    job_position && investigator_designation_ref.onChange({
                        label: job_position.name,
                        value: job_position
                    });
                }
            }
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onNext">
    onNext(e, btn) {
        const {form} = this;
        const {idx} = btn.props;
        if (idx === 1) {
            if (!form.isValid('company_name')) {
                infoDialog.open('Name of employer is required');
                return;
            }
            if (!form.isValid('affected_person')) {
                infoDialog.open('Affected Person is required');
                return;
            }
            if (!form.isValid('id_num')) {
                infoDialog.open('Affected Person ID No. is required');
                return;
            }
            if (!form.isValid('accident_date')) {
                infoDialog.open('Accident Date is required');
                return;
            }
            if (!form.isValid('accident_time')) {
                infoDialog.open('Accident Time is required');
                return;
            }
        }
        if (idx === 2) {
        }
        if (idx === 3) {
        }
        if (idx === 4) {
        }

        return true;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    onSubmit(e, btn, onSaved) {
        const {form, isNew, claim, convert_data, totalFieldCount, totalFieldMax} = this;

        const {
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
        } = form.data;

        if (isNew) {
            const data = {...form.data, totalFieldCount, totalFieldMax};
            console.log("res", data)

            if (claim && claim.id) {
                btn.text("Saving...").disabled();
                progressDialog.open();
                insertAnnexture1(convert_data(data)).then(res => {
                    if(res) {
                        return updateClaimsClient({id: claim.id, annexture_1_id: res.id}).then(_ => res)
                    }
                }).
                then(res => res && findByIdAnnexture1(res.id)).
                then(res => {
                    console.log("res", res)
                    if(!res) {
                        return infoDialog.open("Record couldn't be updated. Please try again.");
                    }

                    onSaved && onSaved(res.data);
                    infoDialog.open("Record successfully updated.");
                    infoDialog.close(2000);
                    this.props.close();
                }).finally(() => {
                    btn.text("Save").enabled();
                    setTimeout(() => progressDialog.close())
                });
            } else {
                onSaved(data);
                this.props.close();
            }
        } else {
            const {data: old_data} = this.item;
            const data = {};

            //A. Recording Of Incident
            ShouldUpdate.check(data, old_data, company_name, 'company_name');
//            ShouldUpdate.checkEmployee(data, old_data, affected_person, 'affected_person');
            ShouldUpdate.check(data, old_data, id_num, 'id_num');
            ShouldUpdate.checkDate(data, old_data, accident_date, 'accident_date');
            ShouldUpdate.check(data, old_data, accident_time, 'accident_time');
            ShouldUpdate.checkBox(data, old_data, part_of_body_affected, 'part_of_body_affected');
            ShouldUpdate.checkBox(data, old_data, effect_on_person, 'effect_on_person');
            ShouldUpdate.check(data, old_data, expected_period_of_disablement, 'expected_period_of_disablement');
            ShouldUpdate.check(data, old_data, disease_desc, 'disease_desc');
            ShouldUpdate.check(data, old_data, process, 'process');
            ShouldUpdate.check(data, old_data, incident_reported_compensationcommissioner__provincial_director, 'incident_reported_compensationcommissioner__provincial_director');
            ShouldUpdate.check(data, old_data, incident_reported_police, 'incident_reported_police');
            ShouldUpdate.check(data, old_data, saps_office, 'saps_office');
            ShouldUpdate.check(data, old_data, saps_reference, 'saps_reference');
            ShouldUpdate.check(data, old_data, substance_exposed_to, 'substance_exposed_to');

            //B. Incident Investigation
            ShouldUpdate.checkEmployee(data, old_data, investigator, 'investigator');
            ShouldUpdate.checkDate(data, old_data, investigation_date, 'investigation_date');
            ShouldUpdate.check(data, old_data, investigator_designation, 'investigator_designation');
            ShouldUpdate.check(data, old_data, incident_desc, 'incident_desc');
            ShouldUpdate.check(data, old_data, incident_cause, 'incident_cause');
            ShouldUpdate.check(data, old_data, steps_to_prevent_recurrence, 'steps_to_prevent_recurrence');
            ShouldUpdate.checkSignature(data, old_data, investigator_signature, 'investigator_signature');
            ShouldUpdate.checkDate(data, old_data, investigator_signature_date, 'investigator_signature_date');

            //C. Action Taken By Employer To Prevent The Recurrence Of Similar Incident
            ShouldUpdate.check(data, old_data, employer_preventative_action_for_recurrence_of_similar_incident, 'employer_preventative_action_for_recurrence_of_similar_incident');
            ShouldUpdate.checkSignature(data, old_data, employer_signature, 'employer_signature');
            ShouldUpdate.checkDate(data, old_data, employer_signature_date, 'employer_signature_date');

            //D. Remarks By Health & Safety Committee
            ShouldUpdate.check(data, old_data, health_and_safety_committee_remarks, 'health_and_safety_committee_remarks');
            ShouldUpdate.checkSignature(data, old_data, chairperson_of_health_and_safety_committee_signature, 'chairperson_of_health_and_safety_committee_signature');
            ShouldUpdate.checkDate(data, old_data, chairperson_of_health_and_safety_committee_signature_date, 'chairperson_of_health_and_safety_committee_signature_date');

            if (Object.keys(data).isEmpty()) {
                infoDialog.open("Nothing changed!");
                return;
            }

            //count fields
            ShouldUpdate.check(data, old_data, totalFieldCount, 'annexture_1_field_count');
            ShouldUpdate.check(data, old_data, totalFieldMax, 'annexture_1_field_max');

            btn.text("Saving...").disabled();
            progressDialog.open();
            updateAnnexture1({id: this.item.id, ...data}).then(res => {
                console.log("res", res)
                onSaved && onSaved(res);
                infoDialog.open("Record successfully updated.");
                infoDialog.close(2000);
                this.props.close();
            }).finally(() => {
                btn.text("Save").enabled();
                setTimeout(() => progressDialog.close())
            });
        }
    }

    // </editor-fold>

    get totalFieldCount() {
        const {state: {countFields}} = this;
        const totalCount = Object.values(countFields).map(({count, max}) => count).reduce((n1, n2) => n1 + n2, 0);
        return totalCount;
    }

    get totalFieldMax() {
        const {state: {countFields}} = this;
        const totalMax = Object.values(countFields).map(({count, max}) => max).reduce((n1, n2) => n1 + n2, 0);
        return totalMax;
    }

    get convert_data() {
        const {dialog} = this.props;
        return dialog.convert_data;
    }

    get claim() {
        const {dialog} = this.props;
        return dialog.extraProp('item');
    }

    get isNew() {
        const {item} = this;
        if(!item) return true;
        return !item.id;
    }

    get item() {
        return this.props.state.item;
    }

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {props: {onFormNext, onFormBack, onFormOpen}} = this;
        const {isContractor, isConsultant} = storage.is;
        return <FormControls onChange={this.form.onChange} onCountFields={this.onCountFields}>
            <Row
                rendered
                countFields
                active
                idx={1}
                title="A. Recording Of Incident"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
            >
                <ClearableInput ref="company_name" name="company_name" type="text" placeholder="Name of employer"
                                className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">Affected
                    Person</label>
                <SelectEmployeeInput ref="affected_person" name="affected_person" placeholder="Affected Person..."
                                     required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput ref="id_num" name="id_num" type="text" placeholder="Affected Person ID No." required
                                className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">Accident Date &
                    Time</label>
                <ClearableInput ref="accident_date" name="accident_date" type="date" placeholder="Accident Date..."
                                className="col-lg-6 col-xs-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput ref="accident_time" name="accident_time" type="time" placeholder="Accident Time..."
                                className="col-lg-6 col-xs-12 form-control" onChange={this.form.onChange}/>
                <hr/>
                <ClearableInput ref="part_of_body_affected" name="part_of_body_affected" type="checkbox"
                                placeholder="Part of body affected" vertical className="col-lg-12 form-control"
                                onChange={this.form.onChange} values={this.state.lists.part_of_body_affected}
                                returnValue/>
                <ClearableInput ref="effect_on_person" name="effect_on_person" type="checkbox"
                                placeholder="Effect on person" vertical className="col-lg-12 form-control"
                                onChange={this.form.onChange} values={this.state.lists.effect_on_person} returnValue/>
                <ClearableInput ref="expected_period_of_disablement" name="expected_period_of_disablement" type="radio"
                                placeholder="Expected period of disablement" vertical className="col-lg-12 form-control"
                                onChange={this.form.onChange} values={this.state.lists.expected_period_of_disablement}
                                returnValue/>
                <hr/>
                <ClearableInput ref="disease_desc" name="disease_desc" type="textarea"
                                placeholder="Description of occupational disease"
                                className="col-lg-12 min-h-60 form-control" onChange={this.form.onChange}/>
                <ClearableInput ref="process" name="process" type="textarea"
                                placeholder="Machine/process involved/type of work performed/exposure**"
                                className="col-lg-12 min-h-60 form-control" onChange={this.form.onChange}/>
                <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">Was the incident
                    reported to:</label>
                <ClearableInput ref="incident_reported_compensationcommissioner__provincial_director"
                                name="incident_reported_compensationcommissioner__provincial_director" type="radio"
                                placeholder="a) the Compensation Commissioner and Provincial Director?" vertical
                                className="col-lg-12 form-control" onChange={this.form.onChange}
                                values={this.state.lists.incident_reported_compensationcommissioner__provincial_director}
                                returnValue/>
                <ClearableInput ref="incident_reported_police" name="incident_reported_police" type="radio"
                                placeholder="b) the police?*" vertical className="col-lg-12 form-control"
                                onChange={this.form.onChange} values={this.state.lists.incident_reported_police}
                                returnValue/>
                <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">SAPS office and reference</label>
                <ClearableInput ref="saps_office" name="saps_office" type="text" placeholder="SAPS office"
                                className="col-lg-6 col-xs-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput ref="saps_reference" name="saps_reference" type="text" placeholder="Reference"
                                className="col-lg-6 col-xs-12 form-control" onChange={this.form.onChange}/>
                <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">
                    * to be completed in case of a fatal incident<br/>
                    ** in case of a hazardous chemical substance, indicate substance exposed to
                </label>
                <ClearableInput ref="substance_exposed_to" name="substance_exposed_to" type="text"
                                placeholder="Substance Exposed To" className="col-lg-12 form-control"
                                onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                countFields
                idx={2}
                title="B. Incident Investigation"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <SelectEmployeeInput ref="investigator" name="investigator" placeholder="Investigator..." required
                                     className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput ref="investigation_date" name="investigation_date" type="date"
                                placeholder="Investigation Date..." className="col-lg-12 form-control"
                                onChange={this.form.onChange}/>
                <ClearableInput ref="investigator_designation" name="investigator_designation" type="text"
                                placeholder="Investigator Designation" className="col-lg-12 form-control"
                                onChange={this.form.onChange}/>

                <ClearableInput ref="incident_desc" name="incident_desc" type="textarea"
                                placeholder="Short description of incident" className="col-lg-12 min-h-60 form-control"
                                onChange={this.form.onChange}/>
                <ClearableInput ref="incident_cause" name="incident_cause" type="textarea"
                                placeholder="Suspected cause of incident" className="col-lg-12 min-h-60 form-control"
                                onChange={this.form.onChange}/>
                <ClearableInput ref="steps_to_prevent_recurrence" name="steps_to_prevent_recurrence" type="textarea"
                                placeholder="Recommended steps to prevent a recurrence"
                                className="col-lg-12 min-h-60 form-control" onChange={this.form.onChange}/>
                <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">Date & Signature of
                    Investigator</label>
                <ClearableInput ref="investigator_signature" name="investigator_signature" type="signature"
                                placeholder="Signature of Investigator" className="col-lg-6 col-xs-12 form-control"
                                onChange={this.form.onChange}/>
                <ClearableInput ref="investigator_signature_date" name="investigator_signature_date" type="date"
                                placeholder="Signature Date..." className="col-lg-6 col-xs-12 form-control"
                                onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                countFields
                idx={3}
                title="C. Action Taken By Employer To Prevent The Recurrence Of Similar Incident"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <ClearableInput ref="employer_preventative_action_for_recurrence_of_similar_incident"
                                name="employer_preventative_action_for_recurrence_of_similar_incident" type="textarea"
                                placeholder="Action Taken By Employer To Prevent The Recurrence Of Similar Incident"
                                className="col-lg-12 min-h-60 form-control" onChange={this.form.onChange}/>
                <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">Date & Signature of
                    Employer</label>
                <ClearableInput ref="employer_signature" name="employer_signature" type="signature"
                                placeholder="Signature of Employer" className="col-lg-6 col-xs-12 form-control"
                                onChange={this.form.onChange}/>
                <ClearableInput ref="employer_signature_date" name="employer_signature_date" type="date"
                                placeholder="Signature Date..." className="col-lg-6 col-xs-12 form-control"
                                onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                countFields
                idx={4}
                title="D. Remarks By Health & Safety Committee"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
            >
                <ClearableInput ref="health_and_safety_committee_remarks" name="health_and_safety_committee_remarks"
                                type="textarea" placeholder="Remarks" className="col-lg-12 min-h-60 form-control"
                                onChange={this.form.onChange}/>
                <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">Date & Signature of
                    Chairperson of Health and Safety Committee</label>
                <ClearableInput ref="chairperson_of_health_and_safety_committee_signature"
                                name="chairperson_of_health_and_safety_committee_signature" type="signature"
                                placeholder="Health and Safety Committee Chairperson Signature"
                                className="col-lg-8 col-xs-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput ref="chairperson_of_health_and_safety_committee_signature_date"
                                name="chairperson_of_health_and_safety_committee_signature_date" type="date"
                                placeholder="Signature Date..." className="col-lg-4 col-xs-12 form-control"
                                onChange={this.form.onChange}/>
            </Row>
        </FormControls>;
    }

    // </editor-fold>
}

export default NewAnnexture1Dialog;
