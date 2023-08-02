import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {Dates} from '../../../../../utils/Utils';
import {TinyMCE} from '../../../../../components/documents';
import {AProfileDialog} from '../../../../../components/dialogs';
import {ProfileField, UploadButton} from '../../../../../components/inputs';
import {NewEmployeeListTable} from '../../../../../components/FormTableComponents';
import {FormControls, Row} from '../../../../../components/FormComponents';

import style from "./ProfileMinutesDialog.lazy.css";

@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfileMinutesDialog";

    constructor(props) {
        super(props, style);
    }

    title() {
        return this.props.title;
    }

    get controls() {
        return  Controls;
    }
}

@observer
class Controls extends React.Component {

    @observable state = {
        selectedMeeting: null
    };
    
    constructor(props) {
        super(props);
    }
    
    componentDidMount() {
        const {item: {data: {meeting}}, props: {dialog: {props: {meetingType}}}} = this;
        if(!isString(meeting)) {
            let path = 'plugin_sheq_assist/06_Communication_And_Participation/';
            path += meetingType === 'Safety' ? 'safety-meeting/' : 'management-meeting/';
            neonBinding.events.emit(path + "find_by_id", meeting.id).then(res => {
                (res && !res.isEmpty()) && (this.state.selectedMeeting = res[0]);
            }).catch(e => {
                console.log(e)
            });
        }
    }

    get item() {
        return this.props.state.item;
    }

    render() {
        if (!this.item)
            return null;
        const {
            props: {
                dialog: {onFormNext, onFormBack, onFormOpen, renderProfileCover}
            },
            item: {
                id, data: {
                    created_at,
                    //
                    client, project, site,
                    //
                    meeting, details, participants, doc
                }
            }
        } = this;

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
                {isConsultant && <ProfileField title="Company" value={client} renderer={v => v.name || v.data.name} className="col-lg-12"/>}
                <ProfileField title="Project" value={project} renderer={v => v.name || v.data.name} className="col-lg-12"/>
                <ProfileField title="Site" value={site} renderer={v => v.name || v.data.name} className="col-lg-12"/>
            </Row>
            <Row 
                rendered 
                idx={1}
                title="1. Meeting (Agenda)" 
                onFormOpen={onFormOpen} 
                onFormNext={onFormNext}  
                onFormBack={onFormBack} 
            >
                {isString(meeting) && <ProfileField name="meeting" value={meeting} placeholder="Agenda / Title" required className="col-lg-12"/>}
                <SelectedMeeting state={state}/>
            </Row>
            <Row 
                rendered 
                idx={2}
                title="2. Participants" 
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}   
                onFormBack={onFormBack} 
            >
                <NewEmployeeListTable ref="participants" name="participants" defaultValue={participants} readonly onChange={this.form.onChange}/>
            </Row>
            <Row 
                rendered 
                idx={3}
                title="3. Minutes Details" 
                onFormOpen={onFormOpen} 
                onFormNext={onFormNext}  
                onFormBack={onFormBack} 
            >
                <TinyMCE name="details" defaultValue={details} height={300} open readonly onChange={this.form.onChange}/>
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
                    defaultValue={doc}
                    readonly
                    className="col-lg-6 hor-center"
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
            <label className="hor-center">Meeting</label>
            <div className="row sec-group">
                <div className="col-lg-3 form-control">Agenda: {title}</div>
                <div className="col-lg-3 form-control">Date: {Dates.formatDate(start)}</div>
                <div className="col-lg-3 form-control">Start: {Dates.formatTimeExcSec(start)}</div>
                <div className="col-lg-3 form-control">End: {Dates.formatTimeExcSec(end)}</div>
            </div>
        </div>;
    }
}

export default ProfileDialog;
