import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';

import {Dates} from 'utils/Utils';
import {AProfileDialog} from 'components/dialogs';
import {ProfileField} from 'components/inputs';
import {ATableSavable, Table, TBody, THead, TRow} from 'components/tables';

import style from "./ProfileRemedialActionPlanDialog.lazy.css";

@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfileRemedialActionPlanDialog";

    constructor(props) {
        super(props, style);
    }

    title() {
        return "Incident Details And Remedial Action Plan";
    }

    get controls() {
        return  Controls;
    }
}

@observer
class Controls extends React.Component {

    @observable
    state = {
        lists: {
            incident_cause: ['Unsafe Acts/Conditions', 'Personal/Job Factors'],
            above_action_implemented_and_effective: [{text: 'Yes', value: 'Yes'}, {text: 'No', value: 'No'}],
            proof_of_action_attached: [{text: 'Yes', value: 'Yes'}, {text: 'No', value: 'No'}],

            is_there_possible_new_or_additional_risks_in_terms_of_safety: [{text: 'Yes', value: 'Yes'}, {text: 'No', value: 'No'}, {text: 'Uncertain', value: 'Uncertain'}],
            is_there_possible_new_or_additional_risks_in_terms_of_health: [{text: 'Yes', value: 'Yes'}, {text: 'No', value: 'No'}, {text: 'Uncertain', value: 'Uncertain'}],
            is_there_possible_new_or_additional_risks_in_terms_of_environment: [{text: 'Yes', value: 'Yes'}, {text: 'No', value: 'No'}, {text: 'Uncertain', value: 'Uncertain'}]
        }
    };
    
    constructor(props) {
        super(props);

        this.form = new Form();
    }

    get item() {
        return this.props.state.item;
    }

    render() {
        if (!this.item)
            return null;
        const {
            props: {dialog: {renderProfileCover}},
            item: {
                id, data: {
                    created_at, 
                    incident_desc, she_representative_signature, date,
                    incident_cause, incident_direct_cause, incident_root_cause,
                    remedial_or_corrective_action_list,
                    person_involved_name, person_involved_signature, person_involved_signature_date,
                    she_department_name, she_department_signature, she_department_signature_date,
                    she_committee_chairperson_name, she_committee_chairperson_signature, she_committee_chairperson_signature_date,
                    management_name, management_signature, management_signature_date,
                    above_action_implemented_and_effective, proof_of_action_attached, notes,
                    is_there_possible_new_or_additional_risks_in_terms_of_safety, is_there_possible_new_or_additional_risks_in_terms_of_health, is_there_possible_new_or_additional_risks_in_terms_of_environment, additional_hazards_or_risks_and_action_to_take_list,
                    incident_assessor_name, incident_assessor_signature, incident_assessor_signature_date
                }
            }
        } = this;
        return <div className="controls-wrapper">
            <div className="controls">
                {renderProfileCover(<React.Fragment>
                    <h5>{'Created On ' + Dates.formatDate(created_at)}</h5>
                </React.Fragment>)}
                <div className="row">
                    <ProfileField name="incident_desc" value={incident_desc} type="textarea" placeholder="Incident Description" required className="col-lg-12" onChange={this.form.onChange}/>
                    <ProfileField name="she_representative_signature" value={she_representative_signature} type="signature" placeholder="SHE Representative Signature" required className="col-lg-12" onChange={this.form.onChange}/>
                    <ProfileField name="date" value={date} type="date" placeholder="Date" required className="col-lg-12" onChange={this.form.onChange}/>
                </div>
                <div className="row">
                    <label className="col-lg-12 text-center">Incident Cause</label>
                    <ProfileField name="incident_cause" value={incident_cause} type="select" placeholder="Incident Cause" required className="col-lg-4" onChange={this.form.onChange} values={this.state.lists.incident_cause}/>
                    <ProfileField name="incident_direct_cause" value={incident_direct_cause} placeholder="Incident Direct Cause" required className="col-lg-4" onChange={this.form.onChange}/>
                    <ProfileField name="incident_root_cause" value={incident_root_cause} placeholder="Incident Root Cause" required className="col-lg-4" onChange={this.form.onChange}/>
                </div>
                <div className="row">
                    <label className="col-lg-12 text-center">Remedial / Corrective Action</label>
                    <RemedialOrCorrectiveActionTable name="remedial_or_corrective_action_list" defaultValue={remedial_or_corrective_action_list} onChange={this.form.onChange}/>
                </div>
                <div className="row">
                    <label className="col-lg-12 text-center">Person Involved In Incident</label>
                    <ProfileField name="person_involved_name" value={person_involved_name} placeholder="Person Name" required className="col-lg-12" onChange={this.form.onChange}/>
                    <ProfileField name="person_involved_signature" value={person_involved_signature} type="signature" placeholder="Person Signature" required className="col-lg-12" onChange={this.form.onChange}/>
                    <ProfileField name="person_involved_signature_date" value={person_involved_signature_date} type="date" placeholder="Date" required className="col-lg-12" onChange={this.form.onChange}/>
                </div>
                <div className="row">
                    <label className="col-lg-12 text-center">SHE Department</label>
                    <ProfileField name="she_department_name" value={she_department_name} placeholder="Person Name" required className="col-lg-12" onChange={this.form.onChange}/>
                    <ProfileField name="she_department_signature" value={she_department_signature} type="signature" placeholder="Person Signature" required className="col-lg-12" onChange={this.form.onChange}/>
                    <ProfileField name="she_department_signature_date" value={she_department_signature_date} type="date" placeholder="Date" required className="col-lg-12" onChange={this.form.onChange}/>
                </div>
                <div className="row">
                    <label className="col-lg-12 text-center">SHE Committee Chairperson</label>
                    <ProfileField name="she_committee_chairperson_name" value={she_committee_chairperson_name} placeholder="Person Name" required className="col-lg-12" onChange={this.form.onChange}/>
                    <ProfileField name="she_committee_chairperson_signature" value={she_committee_chairperson_signature} type="signature" placeholder="Person Signature" required className="col-lg-12" onChange={this.form.onChange}/>
                    <ProfileField name="she_committee_chairperson_signature_date" value={she_committee_chairperson_signature_date} type="date" placeholder="Date" required className="col-lg-12" onChange={this.form.onChange}/>
                </div>
                <div className="row">
                    <label className="col-lg-12 text-center">Management</label>
                    <ProfileField name="management_name" value={management_name} placeholder="Person Name" required className="col-lg-12" onChange={this.form.onChange}/>
                    <ProfileField name="management_signature" value={management_signature} type="signature" placeholder="Person Signature" required className="col-lg-12" onChange={this.form.onChange}/>
                    <ProfileField name="management_signature_date" value={management_signature_date} type="date" placeholder="Date" required className="col-lg-12" onChange={this.form.onChange}/>
                </div>
                <div className="row">
                    <label className="col-lg-12 text-center">Risk Assessment Of Implemented Corrective Action - Closing The Loop</label>
                    <ProfileField name="above_action_implemented_and_effective" value={above_action_implemented_and_effective} type="radio" placeholder="The Above Action Was Implemented And Is Effective" required onChange={this.form.onChange} values={this.state.lists.above_action_implemented_and_effective}/>
                    <ProfileField name="proof_of_action_attached" value={proof_of_action_attached} type="radio" placeholder="Proof Of Action Attached" required onChange={this.form.onChange} values={this.state.lists.proof_of_action_attached}/>
                    <ProfileField name="notes" value={notes} type="textarea" placeholder="Notes" required className="col-lg-12" onChange={this.form.onChange}/>
        
                    <ProfileField name="is_there_possible_new_or_additional_risks_in_terms_of_safety" value={is_there_possible_new_or_additional_risks_in_terms_of_safety} type="radio" placeholder="Is There Any Possible New / Additional Risks In Terms Of Safety" required className="col-lg-12" onChange={this.form.onChange} values={this.state.lists.is_there_possible_new_or_additional_risks_in_terms_of_safety}/>
                    <ProfileField name="is_there_possible_new_or_additional_risks_in_terms_of_health" value={is_there_possible_new_or_additional_risks_in_terms_of_health} type="radio" placeholder="Is There Any Possible New / Additional Risks In Terms Of Health" required className="col-lg-12" onChange={this.form.onChange} values={this.state.lists.is_there_possible_new_or_additional_risks_in_terms_of_health}/>
                    <ProfileField name="is_there_possible_new_or_additional_risks_in_terms_of_environment" value={is_there_possible_new_or_additional_risks_in_terms_of_environment} type="radio" placeholder="Is There Any Possible New / Additional Risks In Terms Of Environment" required className="col-lg-12" onChange={this.form.onChange} values={this.state.lists.is_there_possible_new_or_additional_risks_in_terms_of_environment}/>
                    <hr />
                    <IndicateAdditionalHazardsOrRisksAndSpecifyActionToTakeTable name="additional_hazards_or_risks_and_action_to_take_list" defaultValue={additional_hazards_or_risks_and_action_to_take_list} onChange={this.form.onChange}/>
                </div>
                <div className="row">
                    <label className="col-lg-12 text-center">Incident Assessor</label>
                    <ProfileField name="incident_assessor_name" value={incident_assessor_name} placeholder="Person Name" required className="col-lg-12" onChange={this.form.onChange}/>
                    <ProfileField name="incident_assessor_signature" value={incident_assessor_signature} type="signature" placeholder="Person Signature" required className="col-lg-12" onChange={this.form.onChange}/>
                    <ProfileField name="incident_assessor_signature_date" value={incident_assessor_signature_date} type="date" placeholder="Date" required className="col-lg-12" onChange={this.form.onChange}/>
                </div>
            </div>
        </div>;
    }

}

@observer
class RemedialOrCorrectiveActionTable extends ATableSavable {
    
    constructor(props) {
        super(props);
    }

    renderItem(n, onClick) {
        const item = this.state.list[n];
        return <TRow key={"item-" + n} className="tr-readonly">
            <div className="td"><span>{item.remedial_or_corrective_plan}</span></div>
            <div className="td fixed-flex min-w-240"><span>{item.accountability}</span></div>
            <div className="td fixed-flex min-w-160"><span>{Dates.formatDate(item.date_completed)}</span></div>
        </TRow>;
    }

    render() {
        return (<Table>
            <THead className="align-left">
                <div className="td">Remedial / Corrective Plan</div>
                <div className="td fixed-flex min-w-240">Accountability</div>
                <div className="td fixed-flex min-w-160">Date Completed</div>
            </THead>
            <TBody ref="body" title="Remedial / Corrective Plan" renderItem={this.renderItem} onClick={this.onClick} state={this.state} onLoadList={this.onLoadList} disablePullToRefresh={true}/>
        </Table>);
    }
}

@observer
class IndicateAdditionalHazardsOrRisksAndSpecifyActionToTakeTable extends ATableSavable {

    constructor(props) {
        super(props);
    }
    
    renderItem(n, onClick) {
        const item = this.state.list[n];
        return <TRow key={"item-" + n} className="tr-readonly">
            <div className="td"><span>{item.hazards_or_risks}</span></div>
            <div className="td fixed-flex min-w-240"><span>{item.action_by}</span></div>
            <div className="td fixed-flex min-w-160"><span>{Dates.formatDate(item.date)}</span></div>
        </TRow>;
    }

    render() {
        return (<Table>
            <THead className="align-left">
                <div className="td">Indicate The Additional Hazards / Risks And Specify The Action To Be Taken</div>
                <div className="td fixed-flex min-w-240">Action By</div>
                <div className="td fixed-flex min-w-160">Date</div>
            </THead>
            <TBody ref="body" title="Additional Hazards / Risks And Specify The Action To Be Taken" renderItem={this.renderItem} onClick={this.onClick} state={this.state} onLoadList={this.onLoadList} disablePullToRefresh={true}/>
        </Table>);
    }
}

export default ProfileDialog;
