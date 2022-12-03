import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from '../../../../../utils/Form';
import {Dates, execWhen} from '../../../../../utils/Utils';

import {TinyMCE} from '../../../../../components/documents';

import {
    SelectClientInput,
    SelectMeetingInput,
    SelectProjectInput,
    SelectSiteInput,
    UploadButton
} from '../../../../../components/inputs';
import {FormControls, Row} from '../../../../../components/FormComponents';
import ANewDialog from '../../../../../components/dialogs/ANewDialog';
import {NewEmployeeListTable} from '../../../../../components/FormTableComponents';

import style from "./NewMinutesDialog.lazy.css";

@observer
class NewMinutesDialog extends ANewDialog {
    pageKey = "NewMinutesDialog";
    title = "Create Meeting Minutes";

    constructor(props) {
        super(props, style);
        if(props.title) {
            this.title = props.title;
        }
    }

    get controls() {
        return  Controls;
    }
}

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/calendar/minutes/";

    @observable
    state = {
        selectedMeeting: null
    };

    constructor(props) {
        super(props);
        
        this.onNext = this.onNext.bind(this);

        this.form = new Form();
        this.form.addChangeOne("meeting", this.onChangeMeeting.bind(this));
    }

    onChangeMeeting(el, val) {
        this.state.selectedMeeting = val;
        if(val && !isString(val)) {
            execWhen(() => this.refs.participants).then(ref => {
                const {id, data:{title, start, end, participants = []}} = val;
                ref.list = participants;
            });
        }
    }

    // <editor-fold defaultstate="collapsed" desc="onNext">
    onNext(e, btn) {
        const {form} = this;
        const {idx} = btn.props;
        const {isConsultant} = storage.is;
        if(idx === 0) {
            if (isConsultant && !form.isValid('client')) {
                infoDialog.open('Company is required');
                return;
            }
        }
        if(idx === 1) {
            if (!form.isValid('meeting')) {
                infoDialog.open('Meeting (Agenda) is required');
                return;
            }
        }
        
        return true;
    }
    // </editor-fold>
    
    onSubmit(e, btn, onSaved) {
        const {form} = this;
        const {isConsultant} = storage.is;

        if (isConsultant && !form.isValid('client')) {
            infoDialog.open('Company is required');
            return;
        }
        if (!form.isValid('meeting')) {
            infoDialog.open('Meeting (Agenda) is required');
            return;
        }

        const {
            client, project, site, 
            //
            meeting, participants, details, doc
        } = form.data;
        const data = {client: {id: client.id, name: client.data.name}};
        
        //0 
        if(project) {
            const {id, data: _data, name} = project;
            data.project = {id, name: name || _data.name};
        }
        if(site) {
            const {id, data: _data, name} = site;
            data.site = {id, name: name || _data.name};
        } 
        
        if (isString(meeting)) {
            data.meeting = meeting;
        } else {
            data.meeting = {id: meeting.id, title: meeting.data.title, meeting_type: meeting.data.meeting_type};
        }
        if (participants) {
            data.participants = participants;
        }
        if (details) {
            data.details = details;
        }
        if (doc) {
            data.doc = doc.path;
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
        const {onFormNext, onFormBack, onFormOpen, meetingType} = this.props;
        const {isConsultant} = storage.is;
        return <FormControls>
            <Row 
                rendered  
                active
                idx={0}
                title="Company / Project / Site" 
                onFormOpen={onFormOpen} 
                onFormNext={onFormNext}
            >
                {isConsultant && <SelectClientInput name="client" placeholder="Company..." required className="col-lg-12 form-control" onChange={this.form.onChange}/>}
                <SelectProjectInput name="project" placeholder="Project..." required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <SelectSiteInput name="site" placeholder="Site..." required className="col-lg-12 form-control" onChange={this.form.onChange}/>
            </Row>
            <Row 
                rendered 
                idx={1}
                title="1. Meeting (Agenda)" 
                onFormOpen={onFormOpen} 
                onFormNext={onFormNext}  
                onFormBack={onFormBack} 
            >
                <SelectMeetingInput name="meeting" placeholder="Meeting (Agenda)..." meetingType={meetingType} required className="col-lg-12 form-control" onChange={this.form.onChange} add/>
                <SelectedMeeting state={this.state}/>
            </Row>
            <Row 
                rendered 
                idx={2}
                title="2. Participants" 
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}   
                onFormBack={onFormBack} 
            >
                <NewEmployeeListTable ref="participants" name="participants" onChange={this.form.onChange}/>
            </Row>
            <Row 
                rendered 
                idx={3}
                title="3. Minutes Details" 
                onFormOpen={onFormOpen} 
                onFormNext={onFormNext}  
                onFormBack={onFormBack} 
            >
                <TinyMCE name="details" height={300} open onChange={this.form.onChange}/>
            </Row>
            <Row 
                rendered 
                idx={4}
                title="4. Minutes Document" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
            >
                <UploadButton 
                    name="doc" 
                    type={['PDF', 'Word']} 
                    buttonTitle='Upload PDF/Word' 
                    showOnlyIcon 
                    className="col-lg-6 hor-center"
                    onChange={this.form.onChange}
                />
            </Row>
        </FormControls>;
    }
}

@observer
class SelectedMeeting extends React.Component {

    render() {
        const {selectedMeeting} = this.props.state;
        if(!selectedMeeting || isString(selectedMeeting)) {
            return null;
        }
        const {id, data:{title, start, end, participants}} = selectedMeeting;
        return <div className="row">
            <label>Selected Meeting</label>
            <div className="row sec-group">
                <div className="col-lg-3 form-control">Agenda: {title}</div>
                <div className="col-lg-3 form-control">Date: {Dates.formatDate(start)}</div>
                <div className="col-lg-3 form-control">Start: {Dates.formatTimeExcSec(start)}</div>
                <div className="col-lg-3 form-control">End: {Dates.formatTimeExcSec(end)}</div>
            </div>
        </div>;
    }
}

export default NewMinutesDialog;
