import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';

import {ClearableInput} from 'components/inputs';
import ANewDialog from 'components/dialogs/ANewDialog';

import style from "./NewNCRDialog.lazy.css";

@observer
class NewNCRDialog extends ANewDialog {
    pageKey = "NewNCRDialog";
    title = "Create Non-Conformance Report";

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return  Controls;
    }
}

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/08_Environmental_Aspects/ncr/";

    @observable
    state = {
        lists: {
            non_conformance_closed: [{text: 'Yes', value: 'Yes'}, {text: 'No', value: 'No'}]
        }
    };

    constructor() {
        super();

        this.form = new Form();
    }

    onSubmit(e, btn, onSaved) {
        const {form} = this;

        if (!form.isValid('non_conformance_num')) {
            infoDialog.open('Non-Conformance No. is required');
            return;
        }
        if (!form.isValid('date_recorded')) {
            infoDialog.open('Date Recorded is required');
            return;
        }
        if (!form.isValid('identified_by')) {
            infoDialog.open('Identified By is required');
            return;
        }
        if (!form.isValid('department_or_area')) {
            infoDialog.open('Department / Area is required');
            return;
        }
        
        if (!form.isValid('non_conformance_desc')) {
            infoDialog.open('Non-Conformance Description is required');
            return;
        }
        
        if (!form.isValid('non_conformance_cause')) {
            infoDialog.open('Non-Conformance Cause is required');
            return;
        }
        
        if (!form.isValid('proposed_corrective_actions_to_be_taken_to_prevent_recurrence')) {
            infoDialog.open('Proposed Corrective Actions To Be Taken To Prevent Recurrence is required');
            return;
        }
        
        if (!form.isValid('author1_name')) {
            infoDialog.open('Author 1 Name is required');
            return;
        }
        if (!form.isValid('environmental_representative')) {
            infoDialog.open('Environmental Representative is required');
            return;
        }
        if (!form.isValid('date_of_action_to_be_completed_by')) {
            infoDialog.open('Date Of Action To Be Completed By is required');
            return;
        }
        if (!form.isValid('evidence')) {
            infoDialog.open('Evidence Provided To Demonstrate Closure Of Non-Conformance is required');
            return;
        }
        
        if (!form.isValid('author2_name')) {
            infoDialog.open('Author 2 Name is required');
            return;
        }
        if (!form.isValid('non_conformance_closed')) {
            infoDialog.open('Verify If Non-Conformance Is Closed Or Not');
            return;
        }
        if (!form.isValid('date')) {
            infoDialog.open('Author 2 Date is required');
            return;
        }
        if (!form.isValid('further_info')) {
            infoDialog.open('Author 2 Further Info is required');
            return;
        }

        const {
            non_conformance_num, date_recorded, identified_by, department_or_area,
            non_conformance_desc,
            non_conformance_cause,
            proposed_corrective_actions_to_be_taken_to_prevent_recurrence,
            author1_name, environmental_representative, date_of_action_to_be_completed_by, evidence,
            author2_name, non_conformance_closed, date, further_info
        } = form.data;
        const data = {
            non_conformance_num, date_recorded: date_recorded.getTime(), identified_by, department_or_area,
            non_conformance_desc,
            non_conformance_cause,
            proposed_corrective_actions_to_be_taken_to_prevent_recurrence,
            author1_name, environmental_representative, date_of_action_to_be_completed_by: date_of_action_to_be_completed_by.getTime(), evidence,
            author2_name, non_conformance_closed, date: date.getTime(), further_info
        };
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
                        <ClearableInput name="non_conformance_num" type="text" placeholder="Non-Conformance No." required className="col-lg-3 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="date_recorded" type="date" placeholder="Date Recorded..." required className="col-lg-3 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="identified_by" type="text" placeholder="Identified By" required className="col-lg-3 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="department_or_area" type="text" placeholder="Department / Area" required className="col-lg-3 form-control" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row">
                    <div className="row sec-group">
                        <ClearableInput name="non_conformance_desc" type="textarea" placeholder="Non-Conformance Description" required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row">
                    <div className="row sec-group">
                        <ClearableInput name="non_conformance_cause" type="textarea" placeholder="Non-Conformance Cause" required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row">
                    <div className="row sec-group">
                        <ClearableInput name="proposed_corrective_actions_to_be_taken_to_prevent_recurrence" type="textarea" placeholder="Proposed Corrective Actions To Be Taken To Prevent Recurrence" required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row">
                    <label>Author 1</label>
                    <div className="row sec-group">
                        <ClearableInput name="author1_name" type="text" placeholder="Author Name" required className="col-lg-4 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="environmental_representative" type="text" placeholder="Environmental Representative" required className="col-lg-4 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="date_of_action_to_be_completed_by" type="date" placeholder="Date Of Action To Be Completed By" required className="col-lg-4 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="evidence" type="textarea" placeholder="Evidence Provided To Demonstrate Closure Of Non-Conformance" required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row">
                    <label>Author 2</label>
                    <div className="row sec-group">
                        <ClearableInput name="author2_name" type="text" placeholder="Author Name" required className="col-lg-4 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="non_conformance_closed" type="radio" placeholder="Non-Conformance Closed" required className="col-lg-4 form-control" onChange={this.form.onChange} values={this.state.lists.non_conformance_closed}/>
                        <ClearableInput name="date" type="date" placeholder="Date" required className="col-lg-4 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="further_info" type="textarea" placeholder="Further Information" required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    </div>
                </div>
            </div>
        </div>);
    }
}

export default NewNCRDialog;
