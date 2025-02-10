import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';
import {ClearableInput} from 'components/inputs';
import ANewDialog from 'components/dialogs/ANewDialog';

import style from "./NewMeetingDialog.lazy.css";

@observer
class NewMeetingDialog extends ANewDialog {
    pageKey = "NewMeetingDialog";
    title = "Schedule Meeting";

    constructor(props) {
        super(props, style);
        
        this.title = props.title;
    }
    
    get controls() {
        return Controls;
    }
}

@observer
class Controls extends React.Component {
    path;
    
    @observable
    state = {
        lists: {

        }
    };

    constructor(props) {
        super(props);
        this.path = props.path;

        this.form = new Form();
    }

    onSubmit(e, btn, onSaved) {
        const {form} = this;

        if (!form.isValid('title')) {
            infoDialog.open('Agenda is required');
            return;
        }
        if (!form.isValid('date_from')) {
            infoDialog.open('Date From is required');
            return;
        } else if(!form.isValid('date_to')){
            if (!form.isValid('time_from')) {
                infoDialog.open('Time From is required');
                return;
            }
            if (!form.isValid('time_to')) {
                infoDialog.open('Time To is required');
                return;
            }
        }
        if (!form.isValid('participants')) {
            infoDialog.open('Participants are required');
            return;
        }

        const {title, date_from, date_to, time_from, time_to, participants} = form.data;
        const data = {title};
        
        data.start = date_from;
        if(time_from) {
            const time_from_parts = time_from.split(":");
            data.start.setHours(parseInt(time_from_parts[0]));
            data.start.setMinutes(parseInt(time_from_parts[1]));
        }
        if(date_to) {
            data.end = date_to;
        } else {
            data.end = date_from;
        }
        if(time_to) {
            const time_to_parts = time_to.split(":");
            data.end.setHours(parseInt(time_to_parts[0]));
            data.end.setMinutes(parseInt(time_to_parts[1]));
        }
        data.start = data.start.getTime();
        data.end = data.end.getTime();
        
        data.participants = participants.map(val => val.value);
        console.log(data)

        btn.text("Saving...").disabled();
        neonBinding.events.emit(this.path + "create", data).then(res => {
            console.log("res", res)
            onSaved && onSaved(res);
            infoDialog.open("Record successfully saved.");
            setTimeout(function () {
                infoDialog.close();
            }.bind(this), 2000);
        }).finally(() => {
            btn.text("Save").enabled();
        });
    }

    render() {
        return (<div className="controls-wrapper">
            <div className="controls">
                <div className="row">
                    <div className="row sec-group">
                        <ClearableInput name="title" type="text" placeholder="Agenda" required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="date_from" type="date" placeholder="Date From..." required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="date_to" type="date" placeholder="Date To..." required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="time_from" type="time" placeholder="Time From" required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="time_to" type="time" placeholder="Time To" required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row">
                    <label>Invite Participants</label>
                    <div className="row sec-group">
                        <ClearableInput name="participants" type="select_multi" placeholder="Participants Email Addresses..." required className="col-lg-12 form-control" onChange={this.form.onChange} add/>
                    </div>
                </div>
            </div>
        </div>);
    }
}

export default NewMeetingDialog;
