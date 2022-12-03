import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from '../../../../../utils/Form';

import {Dates} from '../../../../../utils/Utils';
import {AProfileDialog} from '../../../../../components/dialogs';
import {ProfileField} from '../../../../../components/inputs';

import style from "./ProfileEmergencyDrillReportDialog.lazy.css";

@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfileEmergencyDrillReportDialog";

    constructor(props) {
        super(props, style);
    }

    title() {
        return "Emergency Drill Report";
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
            drill_type: ['Fire', 'Fall Down', 'Spillage', 'Gas Leakage'],
            alarm_worked_properly: [{value: "Yes", text: "Yes", checked: false}, {value: "No", text: "No", checked: false}],
            all_areas_heard_alarm: [{value: "Yes", text: "Yes", checked: false}, {value: "No", text: "No", checked: false}],
            individuals_not_performed_properly: [{value: "Yes", text: "Yes", checked: false}, {value: "No", text: "No", checked: false}],
            people_evacuated_properly: [{value: "Yes", text: "Yes", checked: false}, {value: "No", text: "No", checked: false}]
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
                    shift, drill_type, 
                    drill_date, drill_start_time, drill_end_time, drill_total_time,
                    alarm_worked_properly, describe_what_happened_when_alarmed,
                    all_areas_heard_alarm, specify_if_not,
                    people_evacuated_properly, describe_situation,
                    individuals_not_performed_properly, personnel_name_for_further_training,
                    communication_between_chain,
                    observer_report_or_remarks_note,
                    signature, signature_date
                }
            }
        } = this;

        return <div className="controls-wrapper">
            <div className="controls">
                {renderProfileCover(<React.Fragment>
                    <h3>{drill_type}</h3>
                    <h5>{'Created On ' + Dates.formatDate(created_at)}</h5>
                </React.Fragment>)}
                <div className="row">
                    <ProfileField name="shift" placeholder="Shift" value={shift} required className="col-lg-4" onChange={this.form.onChange}/>
                    <ProfileField name="drill_type" type="select" value={drill_type} placeholder="Type Of Drill" required className="col-lg-4" onChange={this.form.onChange} values={this.state.lists.drill_type} add/>
                    <ProfileField name="drill_date" value={drill_date} type="date" placeholder="Drill Date" required className="col-lg-4" onChange={this.form.onChange}/>
                </div>
                <div className="row">
                    <ProfileField name="drill_start_time" value={drill_start_time} type="time" placeholder="Drill Start Time" required className="col-lg-4" onChange={this.form.onChange}/>
                    <ProfileField name="drill_end_time" value={drill_end_time} type="time" placeholder="Drill End Time" required className="col-lg-4" onChange={this.form.onChange}/>
                    <ProfileField name="drill_total_time" value={drill_total_time} placeholder="Drill Total Time" required className="col-lg-4" onChange={this.form.onChange}/>
                </div>
                <div className="row">
                    <ProfileField name="alarm_worked_properly" value={alarm_worked_properly} type="radio" placeholder="Alarm Worked Properly?" required className="col-lg-12" onChange={this.form.onChange} values={this.state.lists.alarm_worked_properly}/>
                    <ProfileField name="describe_what_happened_when_alarmed" value={describe_what_happened_when_alarmed} type="textarea" placeholder="Describe What Happened When Alarmed" required className="col-lg-12" onChange={this.form.onChange}/>
                </div>
                <div className="row">
                    <ProfileField name="all_areas_heard_alarm" value={all_areas_heard_alarm} type="radio" placeholder="All Areas Heard Alarm?" required className="col-lg-12" onChange={this.form.onChange} values={this.state.lists.all_areas_heard_alarm}/>
                    <ProfileField name="specify_if_not" value={specify_if_not} type="textarea" placeholder="Specify Incase Not Heard In Any Location" required className="col-lg-12" onChange={this.form.onChange}/>
                </div>
                <div className="row">
                    <ProfileField name="people_evacuated_properly" value={people_evacuated_properly} type="radio" placeholder="People Evacuated Properly?" required className="col-lg-12" onChange={this.form.onChange} values={this.state.lists.people_evacuated_properly}/>
                    <ProfileField name="describe_situation" value={describe_situation} type="textarea" placeholder="Describe Situation" required className="col-lg-12" onChange={this.form.onChange}/>
                </div>
                <div className="row">
                    <ProfileField name="individuals_not_performed_properly" value={individuals_not_performed_properly} type="radio" placeholder="Is There Individual Who Are Not Performed Properly?" required className="col-lg-12" onChange={this.form.onChange} values={this.state.lists.individuals_not_performed_properly}/>
                    <ProfileField name="personnel_name_for_further_training" value={personnel_name_for_further_training} placeholder="Name Of The Personnel For Further Training" required className="col-lg-12" onChange={this.form.onChange}/>
                </div>
                <div className="row">
                    <ProfileField name="communication_between_chain" value={communication_between_chain} type="textarea" placeholder="Communication Between Chain" required className="col-lg-12" onChange={this.form.onChange}/>
                </div>
                <div className="row">
                    <ProfileField name="observer_report_or_remarks_note" value={observer_report_or_remarks_note} type="textarea" placeholder="Observer Report / Remarks Note" required className="col-lg-12" onChange={this.form.onChange}/>
                </div>
                <div className="row">
                    <ProfileField name="signature" value={signature} type="signature" placeholder="Signature" className="hor-center min-h-140 signature" required onChange={this.form.onChange}/>
                    <ProfileField name="signature_date" value={signature_date} type="date" placeholder="Signature Date" className="hor-center" required onChange={this.form.onChange}/>
                </div>
            </div>
        </div>;
    }

}

export default ProfileDialog;
