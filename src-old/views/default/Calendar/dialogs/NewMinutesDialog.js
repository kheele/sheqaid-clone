import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from '../../../../utils/Form';
import {Dates} from '../../../../utils/Utils';

import {Document, TinyMCE} from '../../../../components/documents';

import {ClearableInput, SelectMeetingInput,} from '../../../../components/inputs';
import ANewDialog from '../../../../components/dialogs/ANewDialog';

import style from "./NewMinutesDialog.lazy.css";

@observer
class NewMinutesDialog extends ANewDialog {
    pageKey = "NewMinutesDialog";
    title = "Add Minutes";

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return  Controls;
    }
}

@observer
class Controls extends React.Component {
    path = "plugin_common_modules/calendar/minutes/";

    @observable
    state = {
        lists: {
            types: [{value: "Upload", text: "Upload Document", checked: false}, {value: "Type", text: "Type Document", checked: false}]
        },
        doc: null,
        showTinyMCE: false,
        selectedMeeting: null
    };

    constructor(props) {
        super(props);

        this.onChangeType = this.onChangeType.bind(this);
        this.onChangeMeeting = this.onChangeMeeting.bind(this);

        this.form = new Form();
        this.form.addChangeOne("type", this.onChangeType);
        this.form.addChangeOne("meeting", this.onChangeMeeting);
    }

    onChangeType(el, val) {
        if (val) {
            if (val === 'Upload') {
                this.state.showTinyMCE = false;
                electronDialog.showOpenDialogPDF().then(res => {
                    console.log(res);
                    this.state.doc = res;
                    if (!res) {
                        this.refs.type.reset();
                    }
                });
            } else if (val === 'Type') {
                console.log('here')
                this.state.showTinyMCE = true;
                this.state.doc = null;
            }
        } else {
            this.state.showTinyMCE = false;
            this.state.doc = null;
        }
    }

    onChangeMeeting(el, val) {
        this.state.selectedMeeting = val;
    }

    onSubmit(e, btn, onSaved) {
        const {form} = this;

        if (!form.isValid('meeting')) {
            infoDialog.open('Please Select Meeting');
            return;
        }
        if (!form.isValid('type')) {
            infoDialog.open('Minutes Document Type is required');
            return;
        }
        if (form.get("type") === 'Type' && !form.isValid('document')) {
            infoDialog.open('Document is required (Please type)');
            return;
        } else if (form.get("type") === 'Upload' && !this.state.doc) {
            infoDialog.open('Document is required (Please upload)');
            return;
        }

        const {meeting, type, document} = form.data;
        const data = {meeting_id: meeting.id, type, document};
        if (form.get("type") === 'Upload') {
            data.document = this.state.doc.path;
        }
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
        const {onFormNext, onFormBack, onFormOpen, meetingType} = this.props;
        return <div className="controls-wrapper">
            <div className="controls">
                <div className="row">
                    <label>{this.props.meetingType} Meeting Minutes</label>
                    <div className="row sec-group">
                        <SelectMeetingInput name="meeting" placeholder="Select Meeting (Agenda)..." meetingType={meetingType} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    </div>
                </div>
                <SelectedMeeting state={this.state}/>
                <div className="row">
                    <label>Participants</label>
                    <div className="row sec-group">
                        <Participants state={this.state}/>
                    </div>
                </div>
                <div className="row">
                    <ClearableInput ref="type" name="type" type="radio" placeholder="Minutes Document Type" className="form-control" onChange={this.form.onChange} values={this.state.lists.types}/>
                    <Document state={this.state}/>
                    <TinyMCE state={this.state} name="document" onChange={this.form.onChange}/>
                </div>
            </div>
        </div>;
    }
}

@observer
class SelectedMeeting extends React.Component {

    render() {
        const {selectedMeeting} = this.props.state;
        if(!selectedMeeting) {
            return null;
        }
        const {id, data:{title, start, end, allDay, participants}} = selectedMeeting;
        return <div className="row">
            <label>Selected Meeting</label>
            <div className="row sec-group">
                <div className="col-lg-4 form-control">Agenda: {title}</div>
                <div className="col-lg-4 form-control">Start: {Dates.formatDateTime(start)}</div>
                <div className="col-lg-4 form-control">End: {Dates.formatDateTime(end)}</div>
            </div>
        </div>;
    }
}

@observer
class Participants extends React.Component {

    render() {
        const {selectedMeeting} = this.props.state;
        if(!selectedMeeting) {
            return <p>No meeting selected</p>;
        }
        const {id, data:{title, start, end, allDay, participants}} = selectedMeeting;
        return <React.Fragment>
            {participants.join(', ')}
        </React.Fragment>;
    }
}

export default NewMinutesDialog;
