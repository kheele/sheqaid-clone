import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from '../../../../../utils/Form';
import {Dates} from '../../../../../utils/Utils';
import {Button, ClearableInput} from '../../../../../components/inputs';
import {ATableSavable, Table, TBody, THead, TRow} from '../../../../../components/tables';
import ANewDialog from '../../../../../components/dialogs/ANewDialog';

import style from "./NewRemedialActionPlanDialog.lazy.css";

@observer
class NewRemedialActionPlanDialog extends ANewDialog {
    pageKey = "NewRemedialActionPlanDialog";
    title = "Create Incident Details And Remedial Action Plan";
    className = 'ANewTableFormDialog';

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return  Controls;
    }
}

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/08_Environmental_Aspects/incidents/remedial-action-plan/";

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

    constructor() {
        super();

        this.form = new Form();
    }

    onSubmit(e, btn, onSaved) {
        const {form} = this;
        
        if (!form.isValid('incident_desc')) {
            infoDialog.open('Incident Description is required');
            return;
        }
        if (!form.isValid('she_representative_signature')) {
            infoDialog.open('SHE Representative Signature is required');
            return;
        }
        if (!form.isValid('date')) {
            infoDialog.open('Date is required');
            return;
        }
      
        if (!form.isValid('incident_cause')) {
            infoDialog.open('Incident Cause is required');
            return;
        }
        if (!form.isValid('incident_direct_cause')) {
            infoDialog.open('Incident Direct Cause is required');
            return;
        }
        if (!form.isValid('incident_root_cause')) {
            infoDialog.open('Incident Root Cause is required');
            return;
        }
        
        if (!form.isValid('remedial_or_corrective_action_list')) {
            infoDialog.open('Remedial / Corrective Action is required');
            return;
        }
        
        if (!form.isValid('person_involved_name')) {
            infoDialog.open('Person Name is required');
            return;
        }
        if (!form.isValid('person_involved_signature')) {
            infoDialog.open('Person Signature is required');
            return;
        }
        if (!form.isValid('person_involved_signature_date')) {
            infoDialog.open('Date is required');
            return;
        }
        
        if (!form.isValid('she_department_name')) {
            infoDialog.open('Person Name is required');
            return;
        }
        if (!form.isValid('she_department_signature')) {
            infoDialog.open('Person Signature is required');
            return;
        }
        if (!form.isValid('she_department_signature_date')) {
            infoDialog.open('Date is required');
            return;
        }
        
        if (!form.isValid('she_committee_chairperson_name')) {
            infoDialog.open('Person Name is required');
            return;
        }
        if (!form.isValid('she_committee_chairperson_signature')) {
            infoDialog.open('Person Signature is required');
            return;
        }
        if (!form.isValid('she_committee_chairperson_signature_date')) {
            infoDialog.open('Date is required');
            return;
        }
        
        if (!form.isValid('management_name')) {
            infoDialog.open('Person Name is required');
            return;
        }
        if (!form.isValid('management_signature')) {
            infoDialog.open('Person Signature is required');
            return;
        }
        if (!form.isValid('management_signature_date')) {
            infoDialog.open('Date is required');
            return;
        }
                    
        if (!form.isValid('above_action_implemented_and_effective')) {
            infoDialog.open('The Above Action Was Implemented And Is Effective is required');
            return;
        }
        if (!form.isValid('proof_of_action_attached')) {
            infoDialog.open('Proof Of Action Attached is required');
            return;
        }
        if (!form.isValid('notes')) {
            infoDialog.open('Notes is required');
            return;
        }

        if (!form.isValid('is_there_possible_new_or_additional_risks_in_terms_of_safety')) {
            infoDialog.open('Is There Any Possible New / Additional Risks In Terms Of Safety is required');
            return;
        }
        if (!form.isValid('is_there_possible_new_or_additional_risks_in_terms_of_health')) {
            infoDialog.open('Is There Any Possible New / Additional Risks In Terms Of Health is required');
            return;
        }
        if (!form.isValid('is_there_possible_new_or_additional_risks_in_terms_of_environment')) {
            infoDialog.open('Is There Any Possible New / Additional Risks In Terms Of Environment is required');
            return;
        }
        if (!form.isValid('additional_hazards_or_risks_and_action_to_take_list')) {
            infoDialog.open('Indicate The Additional Hazards / Risks And Specify The Action To Be Taken is required');
            return;
        }
         
        if (!form.isValid('incident_assessor_name')) {
            infoDialog.open('Person Name is required');
            return;
        }
        if (!form.isValid('incident_assessor_signature')) {
            infoDialog.open('Person Signature is required');
            return;
        }
        if (!form.isValid('incident_assessor_signature_date')) {
            infoDialog.open('Date is required');
            return;
        }

        const {
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
        } = form.data;
        const data = {
            incident_desc, she_representative_signature: JSON.stringify(she_representative_signature), date: date.getTime(),
            incident_cause, incident_direct_cause, incident_root_cause,
            person_involved_name, person_involved_signature: JSON.stringify(person_involved_signature), person_involved_signature_date: person_involved_signature_date.getTime(),
            she_department_name, she_department_signature: JSON.stringify(she_department_signature), she_department_signature_date: she_department_signature_date.getTime(),
            she_committee_chairperson_name, she_committee_chairperson_signature: JSON.stringify(she_committee_chairperson_signature), she_committee_chairperson_signature_date: she_committee_chairperson_signature_date.getTime(),
            management_name, management_signature: JSON.stringify(management_signature), management_signature_date: management_signature_date.getTime(),
            above_action_implemented_and_effective, proof_of_action_attached, notes,
            is_there_possible_new_or_additional_risks_in_terms_of_safety, is_there_possible_new_or_additional_risks_in_terms_of_health, is_there_possible_new_or_additional_risks_in_terms_of_environment,
            incident_assessor_name, incident_assessor_signature: JSON.stringify(incident_assessor_signature), incident_assessor_signature_date: incident_assessor_signature_date.getTime()
        };
        data.remedial_or_corrective_action_list = remedial_or_corrective_action_list.map(val => {
            val.date_completed = val.date_completed.getTime();
            return val;
        });
        data.additional_hazards_or_risks_and_action_to_take_list = additional_hazards_or_risks_and_action_to_take_list.map(val => {
            val.date = val.date.getTime();
            return val;
        });
        console.log(data)

        btn.text("Saving...").disabled();
        neonBinding.events.emit(this.path + "create", data).then(res => {
            console.log("res", res)
            onSaved && onSaved(res);
            infoDialog.open("Record successfully saved.");
            infoDialog.close(2000);
            this.props.close();
        }).finally(() => {
            btn.text("Save").enabled();
        });
    }

    render() {
        return (<div className="controls-wrapper">
            <div className="controls">
                <div className="row">
                    <div className="row sec-group">
                        <ClearableInput name="incident_desc" type="textarea" placeholder="Incident Description" required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="she_representative_signature" type="signature" placeholder="SHE Representative Signature" required className="col-lg-9 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="date" type="date" placeholder="Date..." required className="col-lg-3 form-control" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row">
                    <label>Incident Cause</label>
                    <div className="row sec-group">
                        <ClearableInput name="incident_cause" type="select" placeholder="Incident Cause..." required className="col-lg-4 form-control" onChange={this.form.onChange} values={this.state.lists.incident_cause} returnValue/>
                        <ClearableInput name="incident_direct_cause" type="text" placeholder="Incident Direct Cause" required className="col-lg-4 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="incident_root_cause" type="text" placeholder="Incident Root Cause" required className="col-lg-4 form-control" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row">
                    <label>Remedial / Corrective Action</label>
                    <div className="row sec-group">
                        <RemedialOrCorrectiveActionTable name="remedial_or_corrective_action_list" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row">
                    <label>Person Involved In Incident</label>
                    <div className="row sec-group">
                        <ClearableInput name="person_involved_name" type="text" placeholder="Person Name" required className="col-lg-4 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="person_involved_signature" type="signature" placeholder="Person Signature" required className="col-lg-4 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="person_involved_signature_date" type="date" placeholder="Date" required className="col-lg-4 form-control" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row">
                    <label>SHE Department</label>
                    <div className="row sec-group">
                        <ClearableInput name="she_department_name" type="text" placeholder="Person Name" required className="col-lg-4 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="she_department_signature" type="signature" placeholder="Person Signature" required className="col-lg-4 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="she_department_signature_date" type="date" placeholder="Date" required className="col-lg-4 form-control" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row">
                    <label>SHE Committee Chairperson</label>
                    <div className="row sec-group">
                        <ClearableInput name="she_committee_chairperson_name" type="text" placeholder="Person Name" required className="col-lg-4 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="she_committee_chairperson_signature" type="signature" placeholder="Person Signature" required className="col-lg-4 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="she_committee_chairperson_signature_date" type="date" placeholder="Date" required className="col-lg-4 form-control" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row">
                    <label>Management</label>
                    <div className="row sec-group">
                        <ClearableInput name="management_name" type="text" placeholder="Person Name" required className="col-lg-4 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="management_signature" type="signature" placeholder="Person Signature" required className="col-lg-4 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="management_signature_date" type="date" placeholder="Date" required className="col-lg-4 form-control" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row">
                    <label>Risk Assessment Of Implemented Corrective Action - Closing The Loop</label>
                    <div className="row sec-group">
                        <ClearableInput name="above_action_implemented_and_effective" type="radio" placeholder="The Above Action Was Implemented And Is Effective" required className="col-lg-7 form-control" onChange={this.form.onChange} values={this.state.lists.above_action_implemented_and_effective}/>
                        <ClearableInput name="proof_of_action_attached" type="radio" placeholder="Proof Of Action Attached" required className="col-lg-5 form-control" onChange={this.form.onChange} values={this.state.lists.proof_of_action_attached}/>
                        <ClearableInput name="notes" type="textarea" placeholder="Notes" required className="col-lg-12 form-control" onChange={this.form.onChange}/>
        
                        <ClearableInput name="is_there_possible_new_or_additional_risks_in_terms_of_safety" type="radio" placeholder="Is There Any Possible New / Additional Risks In Terms Of Safety" required className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.is_there_possible_new_or_additional_risks_in_terms_of_safety}/>
                        <ClearableInput name="is_there_possible_new_or_additional_risks_in_terms_of_health" type="radio" placeholder="Is There Any Possible New / Additional Risks In Terms Of Health" required className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.is_there_possible_new_or_additional_risks_in_terms_of_health}/>
                        <ClearableInput name="is_there_possible_new_or_additional_risks_in_terms_of_environment" type="radio" placeholder="Is There Any Possible New / Additional Risks In Terms Of Environment" required className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.is_there_possible_new_or_additional_risks_in_terms_of_environment}/>
                    </div>
                    <hr />
                    <div className="row sec-group">
                        <IndicateAdditionalHazardsOrRisksAndSpecifyActionToTakeTable name="additional_hazards_or_risks_and_action_to_take_list" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row">
                    <label>Incident Assessor</label>
                    <div className="row sec-group">
                        <ClearableInput name="incident_assessor_name" type="text" placeholder="Person Name" required className="col-lg-4 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="incident_assessor_signature" type="signature" placeholder="Person Signature" required className="col-lg-4 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="incident_assessor_signature_date" type="date" placeholder="Date" required className="col-lg-4 form-control" onChange={this.form.onChange}/>
                    </div>
                </div>
            </div>
        </div>);
    }
}

@observer
class RemedialOrCorrectiveActionTable extends ATableSavable {

    constructor(props) {
        super(props);
    }
    
    renderItem(n, onClick) {
        const item = this.state.list[n];
        if (item) {
            return <TRow key={"item-" + n} className="tr-readonly">
                <div className="td"><span>{item.remedial_or_corrective_plan}</span></div>
                <div className="td fixed-flex min-w-240"><span>{item.accountability}</span></div>
                <div className="td fixed-flex min-w-160"><span>{Dates.formatDate(item.date_completed)}</span></div>
                <div className="td fixed-flex min-w-60">
                    <Button idx={n} action="delete" className="btn btn-primary pull-right" onClick={onClick}>
			<i className="fa fa-times-circle"/>
                    </Button>
                </div>
            </TRow>;
        } else {
            return <TRow key="item-new">
                <div className="td">
                    <ClearableInput ref={this.onSetRef} name="remedial_or_corrective_plan" type="text" placeholder="Type here" required className="form-control" onChange={this.onChange}/>
                </div>
                <div className="td fixed-flex min-w-240">
                    <ClearableInput ref={this.onSetRef} name="accountability" type="text" placeholder="Type here" required className="form-control" onChange={this.onChange}/>
                </div>
                <div className="td fixed-flex min-w-160">
                    <ClearableInput ref={this.onSetRef} name="date_completed" type="date" placeholder="dd/mm/yyyy" required className="form-control" onChange={this.onChange}/>
                </div>
                <div className="td fixed-flex">
                    <Button idx={n} action="save" className="btn btn-primary pull-right" onClick={onClick}>
			<i className="fa fa-check"/>
                    </Button>
                </div>
            </TRow>;
        }
    }

    render() {
        return (<Table>
            <THead className="align-left">
                <div className="td">Remedial / Corrective Plan</div>
                <div className="td fixed-flex min-w-240">Accountability</div>
                <div className="td fixed-flex min-w-160">Date Completed</div>
                <div className="td fixed-flex"></div>
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
        if (item) {
            return <TRow key={"item-" + n} className="tr-readonly">
                <div className="td"><span>{item.hazards_or_risks}</span></div>
                <div className="td fixed-flex min-w-240"><span>{item.action_by}</span></div>
                <div className="td fixed-flex min-w-160"><span>{Dates.formatDate(item.date)}</span></div>
                <div className="td fixed-flex">
                    <Button idx={n} action="delete" className="btn btn-primary pull-right" onClick={onClick}>
			<i className="fa fa-times-circle"/>
                    </Button>
                </div>
            </TRow>;
        } else {
            return <TRow key="item-new">
                <div className="td">
                    <ClearableInput ref={this.onSetRef} name="hazards_or_risks" type="text" placeholder="Type here" required className="form-control" onChange={this.onChange}/>
                </div>
                <div className="td fixed-flex min-w-240">
                    <ClearableInput ref={this.onSetRef} name="action_by" type="text" placeholder="Type here" required className="form-control" onChange={this.onChange}/>
                </div>
                <div className="td fixed-flex min-w-160">
                    <ClearableInput ref={this.onSetRef} name="date" type="date" placeholder="dd/mm/yyyy" required className="form-control" onChange={this.onChange}/>
                </div>
                <div className="td fixed-flex">
                    <Button idx={n} action="save" className="btn btn-primary pull-right" onClick={onClick}>
			<i className="fa fa-check"/>
                    </Button>
                </div>
            </TRow>;
        }
    }

    render() {
        return (<Table>
            <THead className="align-left">
                <div className="td">Indicate The Additional Hazards / Risks And Specify The Action To Be Taken</div>
                <div className="td fixed-flex min-w-240">Action By</div>
                <div className="td fixed-flex min-w-160">Date</div>
                <div className="td fixed-flex"></div>
            </THead>
            <TBody ref="body" title="Additional Hazards / Risks And Specify The Action To Be Taken" renderItem={this.renderItem} onClick={this.onClick} state={this.state} onLoadList={this.onLoadList} disablePullToRefresh={true}/>
        </Table>);
    }
}

export default NewRemedialActionPlanDialog;