import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from '../../../../../utils/Form';

import {ClearableInput} from '../../../../../components/inputs';
import ANewDialog from '../../../../../components/dialogs/ANewDialog';

import style from "./NewEmergencyDrillReportDialog.lazy.css";

@observer
class NewEmergencyDrillReportDialog extends ANewDialog {
    pageKey = "NewEmergencyDrillReportDialog";
    title = "Create Emergency Drill Report";

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return  Controls;
    }
}

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/16_Emergency_Preparedness/emergency-drill/report/";

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

    constructor() {
        super();

        this.form = new Form();
        
        this.onChangeDrillTotalTime = this.onChangeDrillTotalTime.bind(this);
        this.form.addChangeMany(['drill_date', 'drill_start_time', 'drill_end_time'], this.onChangeDrillTotalTime);
    }
    
    onChangeDrillTotalTime(el, name, val) {
        const date = this.refs.drill_date;
        const start_time = this.refs.drill_start_time;
        const end_time = this.refs.drill_end_time;
        const total_time = this.refs.drill_total_time;
        if(date.hasValue && start_time.hasValue && end_time.hasValue) {
            const start = new Date(date.value.getTime());
            let st = start_time.value.split(':');
            start.setHours(parseInt(st[0]));
            start.setMinutes(parseInt(st[1]));
            const end = new Date(date.value.getTime());
            let et = end_time.value.split(':');
            end.setHours(parseInt(et[0]));
            end.setMinutes(parseInt(et[1]));
            
            function timeDiffCalc(dateFuture, dateNow) {
                let diffInMilliSeconds = Math.abs(dateFuture - dateNow) / 1000;

                // calculate days
                const days = Math.floor(diffInMilliSeconds / 86400);
                diffInMilliSeconds -= days * 86400;

                // calculate hours
                const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
                diffInMilliSeconds -= hours * 3600;

                // calculate minutes
                const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
                diffInMilliSeconds -= minutes * 60;

                let difference = (hours === 1) ? `${hours}hr` : `${hours}hrs`;
                if(minutes > 0) {
                    difference += ', ' + ((minutes === 1) ? `${minutes}min` : `${minutes}mins`); 
                }

                return difference;
            }
    
            let hrs = timeDiffCalc(end, start);
            console.log('hrs', hrs)
            total_time.setEditable(true);
            total_time.onChange(hrs);
            total_time.setEditable(false);
        }
    }

    onSubmit(e, btn, onSaved) {
        const {form} = this;

        if (!form.isValid('shift')) {
            infoDialog.open('Shift is required');
            return;
        }
        if (!form.isValid('drill_type')) {
            infoDialog.open('Type Of Drill is required');
            return;
        }
        
        if (!form.isValid('drill_date')) {
            infoDialog.open('Drill Date is required');
            return;
        }
        if (!form.isValid('drill_start_time')) {
            infoDialog.open('Drill Start Time is required');
            return;
        }
        if (!form.isValid('drill_end_time')) {
            infoDialog.open('Drill End Time is required');
            return;
        }
        if (!form.isValid('drill_total_time')) {
            infoDialog.open('Drill Total Time is required');
            return;
        }
        
        if (!form.isValid('alarm_worked_properly')) {
            infoDialog.open('Specify If Alarm Worked Properly');
            return;
        }
        if (!form.isValid('describe_what_happened_when_alarmed')) {
            infoDialog.open('Please Describe What Happened When Alarmed');
            return;
        }
        
        if (!form.isValid('all_areas_heard_alarm')) {
            infoDialog.open('Specify If All Areas Heard Alarm');
            return;
        } else if(form.get('all_areas_heard_alarm') === 'No') {
            if (!form.isValid('specify_if_not')) {
                infoDialog.open('Please Specify Incase Not Heard In Any Location');
                return;
            }
        }
        
        if (!form.isValid('people_evacuated_properly')) {
            infoDialog.open('Specify If People Evacuated Properly');
            return;
        }
        if (!form.isValid('describe_situation')) {
            infoDialog.open('Please Describe Situation');
            return;
        }
        
        if (!form.isValid('individuals_not_performed_properly')) {
            infoDialog.open('Specify If Is There Individual Who Are Not Performed Properly');
            return;
        }
        if (!form.isValid('personnel_name_for_further_training')) {
            infoDialog.open('Name Of The Personnel For Further Training is required');
            return;
        }
        
        if (!form.isValid('communication_between_chain')) {
            infoDialog.open('Communication Between Chain is required');
            return;
        }
        
        if (!form.isValid('observer_report_or_remarks_note')) {
            infoDialog.open('Observer Report / Remarks Note is required');
            return;
        }

        if (!form.isValid('signature')) {
            infoDialog.open('Signature is required');
            return;
        }
        if (!form.isValid('signature_date')) {
            infoDialog.open('Signature Date is required');
            return;
        }
        
        const {
            shift, drill_type, 
            drill_date, drill_start_time, drill_end_time, drill_total_time,
            alarm_worked_properly, describe_what_happened_when_alarmed,
            all_areas_heard_alarm, specify_if_not,
            people_evacuated_properly, describe_situation,
            individuals_not_performed_properly, personnel_name_for_further_training,
            communication_between_chain,
            observer_report_or_remarks_note,
            signature, signature_date
        } = form.data;
        const data = {
            shift, drill_type, 
            drill_date: drill_date.getTime(), drill_start_time, drill_end_time, drill_total_time,
            alarm_worked_properly, describe_what_happened_when_alarmed,
            all_areas_heard_alarm, /*specify_if_not,*/
            people_evacuated_properly, describe_situation,
            individuals_not_performed_properly, personnel_name_for_further_training,
            communication_between_chain,
            observer_report_or_remarks_note,
            signature: JSON.stringify(signature), signature_date: signature_date.getTime()
        };
        if (form.isValid('specify_if_not')) {
            data.specify_if_not = specify_if_not;
        }
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
                        <ClearableInput name="shift" type="text" placeholder="Shift" required className="col-lg-4 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="drill_type" type="select" placeholder="Type Of Drill..." required className="col-lg-4 form-control" onChange={this.form.onChange} values={this.state.lists.drill_type} add returnValue/>
                        <ClearableInput ref="drill_date" name="drill_date" type="date" placeholder="Drill Date..." required className="col-lg-4 form-control" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row">
                    <div className="row sec-group">
                        <ClearableInput ref="drill_start_time" name="drill_start_time" type="time" placeholder="Drill Start Time..." required className="col-lg-4 form-control" onChange={this.form.onChange}/>
                        <ClearableInput ref="drill_end_time" name="drill_end_time" type="time" placeholder="Drill End Time..." required className="col-lg-4 form-control" onChange={this.form.onChange}/>
                        <ClearableInput ref="drill_total_time" name="drill_total_time" type="text" placeholder="Drill Total Time" required isEditable={false} isClearable={false} className="col-lg-4 form-control" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row">
                    <div className="row sec-group">
                        <ClearableInput name="alarm_worked_properly" type="radio" placeholder="Alarm Worked Properly?" required className="col-lg-5 form-control" onChange={this.form.onChange} values={this.state.lists.alarm_worked_properly}/>
                        <ClearableInput name="describe_what_happened_when_alarmed" type="textarea" placeholder="Describe What Happened When Alarmed" required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row">
                    <div className="row sec-group">
                        <ClearableInput name="all_areas_heard_alarm" type="radio" placeholder="All Areas Heard Alarm?" required className="col-lg-5 form-control" onChange={this.form.onChange} values={this.state.lists.all_areas_heard_alarm}/>
                        <ClearableInput name="specify_if_not" type="textarea" placeholder="Specify Incase Not Heard In Any Location" required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row">
                    <div className="row sec-group">
                        <ClearableInput name="people_evacuated_properly" type="radio" placeholder="People Evacuated Properly?" required className="col-lg-6 form-control" onChange={this.form.onChange} values={this.state.lists.people_evacuated_properly}/>
                        <ClearableInput name="describe_situation" type="textarea" placeholder="Describe Situation" required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row">
                    <div className="row sec-group">
                        <ClearableInput name="individuals_not_performed_properly" type="radio" placeholder="Is There Individual Who Are Not Performed Properly?" required className="col-lg-8 form-control" onChange={this.form.onChange} values={this.state.lists.individuals_not_performed_properly}/>
                        <ClearableInput name="personnel_name_for_further_training" type="text" placeholder="Name Of The Personnel For Further Training" required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row">
                    <div className="row sec-group">
                        <ClearableInput name="communication_between_chain" type="textarea" placeholder="Communication Between Chain" required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row">
                    <div className="row sec-group">
                        <ClearableInput name="observer_report_or_remarks_note" type="textarea" placeholder="Observer Report / Remarks Note" required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row">
                    <div className="row sec-group">
                        <ClearableInput name="signature" type="signature" placeholder="Signature" required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="signature_date" type="date" placeholder="Signature Date..." required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                    </div>
                </div>
            </div>
        </div>);
    }
}
//calibration: date, specify next calibration date
export default NewEmergencyDrillReportDialog;
