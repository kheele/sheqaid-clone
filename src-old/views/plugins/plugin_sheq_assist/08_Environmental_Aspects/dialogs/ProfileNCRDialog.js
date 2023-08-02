import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from '../../../../../utils/Form';

import {Dates} from '../../../../../utils/Utils';
import {AProfileDialog} from '../../../../../components/dialogs';
import {ProfileField} from '../../../../../components/inputs';

import style from "./ProfileNCRDialog.lazy.css";

@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfileNCRDialog";

    constructor(props) {
        super(props, style);
    }

    title() {
        return "Non-Conformance Report";
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
            non_conformance_closed: [{text: 'Yes', value: 'Yes'}, {text: 'No', value: 'No'}]
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
                    non_conformance_num, date_recorded, identified_by, department_or_area,
                    non_conformance_desc,
                    non_conformance_cause,
                    proposed_corrective_actions_to_be_taken_to_prevent_recurrence,
                    author1_name, environmental_representative, date_of_action_to_be_completed_by, evidence,
                    author2_name, non_conformance_closed, date, further_info
                }
            }
        } = this;
        return <div className="controls-wrapper">
            <div className="controls">
                {renderProfileCover(<React.Fragment>
                    <h5>{'Created On ' + Dates.formatDate(created_at)}</h5>
                </React.Fragment>)}
                <div className="row">
                    <div className="row sec-group">
                        <ProfileField name="non_conformance_num" value={non_conformance_num} placeholder="Non-Conformance No." required className="col-lg-3" onChange={this.form.onChange}/>
                        <ProfileField name="date_recorded" value={date_recorded} type="date" placeholder="Date Recorded..." required className="col-lg-3" onChange={this.form.onChange}/>
                        <ProfileField name="identified_by" value={identified_by} placeholder="Identified By" required className="col-lg-3" onChange={this.form.onChange}/>
                        <ProfileField name="department_or_area" value={department_or_area} placeholder="Department / Area" required className="col-lg-3" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row">
                    <div className="row sec-group">
                        <ProfileField name="non_conformance_desc" value={non_conformance_desc} type="textarea" placeholder="Non-Conformance Description" required className="col-lg-12" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row">
                    <div className="row sec-group">
                        <ProfileField name="non_conformance_cause" value={non_conformance_cause} type="textarea" placeholder="Non-Conformance Cause" required className="col-lg-12" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row">
                    <div className="row sec-group">
                        <ProfileField name="proposed_corrective_actions_to_be_taken_to_prevent_recurrence" value={proposed_corrective_actions_to_be_taken_to_prevent_recurrence} type="textarea" placeholder="Proposed Corrective Actions To Be Taken To Prevent Recurrence" required className="col-lg-12" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row">
                    <label>Author 1</label>
                    <div className="row sec-group">
                        <ProfileField name="author1_name" value={author1_name} placeholder="Author Name" required className="col-lg-4" onChange={this.form.onChange}/>
                        <ProfileField name="environmental_representative" value={environmental_representative} placeholder="Environmental Representative" required className="col-lg-4" onChange={this.form.onChange}/>
                        <ProfileField name="date_of_action_to_be_completed_by" value={date_of_action_to_be_completed_by} type="date" placeholder="Date Of Action To Be Completed By" required className="col-lg-4" onChange={this.form.onChange}/>
                        <ProfileField name="evidence" value={evidence} type="textarea" placeholder="Evidence Provided To Demonstrate Closure Of Non-Conformance" required className="col-lg-12" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row">
                    <label>Author 2</label>
                    <div className="row sec-group">
                        <ProfileField name="author2_name" value={author2_name} placeholder="Author Name" required className="col-lg-4" onChange={this.form.onChange}/>
                        <ProfileField name="non_conformance_closed" value={non_conformance_closed} type="radio" placeholder="Non-Conformance Closed" required className="col-lg-4" onChange={this.form.onChange} values={this.state.lists.non_conformance_closed}/>
                        <ProfileField name="date" value={date} type="date" placeholder="Date" required className="col-lg-4" onChange={this.form.onChange}/>
                        <ProfileField name="further_info" value={further_info} type="textarea" placeholder="Further Information" required className="col-lg-12" onChange={this.form.onChange}/>
                    </div>
                </div>
            </div>
        </div>;
    }

}

export default ProfileDialog;
