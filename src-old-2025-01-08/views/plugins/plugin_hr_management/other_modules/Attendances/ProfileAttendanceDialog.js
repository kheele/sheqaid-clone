// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {AProfileDialog} from 'components/dialogs';
import {ProfileField} from 'components/inputs';
import {Row} from 'components/FormComponents';

import {NewAttendanceTable} from './AttendanceComponents';

import style from "./ProfileAttendanceDialog.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfileAttendanceDialog";
    className = "AProfileEmployeeDocDialog FormAttendanceDialog";
  
    constructor(props) {
        super(props, style);
    }

    title() {
        return "Attendance";
    }
    
    get topButtonsHiddenDelete() {
        return true;
    }

    get controls() {
        return  Controls;
    }
}
// </editor-fold>

@observer
class Controls extends React.Component {
    
    constructor(props) {
        super(props);
    }
    
    get item() {
        return this.props.state.item;
    }

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        if (!this.item)
            return null;
        const {
            props: {
                onFormNext, onFormBack, onFormOpen, 
                dialog: {renderProfileCover}
            },
            item, item: {
                id, data: {
                    created_at,
                    date, 
                    date_split, 
                    day,
                    attendance_list,
                    attendance_list_keys,
                    team,
                    supervisor,
                    supervisor_signature, 
                    manager_signature,
                    client, project, site, client_id, project_id, site_id
                }
            }
        } = this;
        
        const {isSupervisor} = storage.is;
        
        return <div className="controls-wrapper controls-sectioned">
            <div className="controls">
                {renderProfileCover(<React.Fragment>
                    <h3>{team.data.name}</h3>
                </React.Fragment>)} 
                {!isSupervisor && <Row 
                    active
                    rendered 
                    idx={0}
                    title="Company / Project / Site" 
                    onFormOpen={onFormOpen} 
                    onFormNext={onFormNext}
                >
                    <ProfileField title="Company" name="client" value={client} renderer={v => v.data.name} className="col-lg-12"/>
                    <ProfileField title="Project" name="project" value={project} renderer={v => v.data.name} className="col-lg-6"/>
                    <ProfileField title="Site" name="site" value={site} renderer={v => v.data.name} className="col-lg-6"/>
                </Row>}
                <Row 
                    active={isSupervisor}
                    rendered 
                    idx={1}
                    title="1. Date / Day Details" 
                    onFormOpen={onFormOpen}  
                    onFormNext={onFormNext}
                    onFormBack={onFormBack} 
                >
                    <ProfileField title="Date" name="date" type="date" value={date} className="col-lg-6"/>
                    <ProfileField title="Day" name="day" value={day} className="col-lg-6"/>
                </Row>
                <Row 
                    rendered 
                    idx={2}
                    title="2. Department/Team & Attendance Details" 
                    onFormOpen={onFormOpen} 
                    onFormBack={onFormBack} 
                >
                    <NewAttendanceTable ref="newAttendanceTable" name="attendance_list" item={item} readonly/>
                    <hr className="pull-left margin-0 margin-t-10 margin-b-10"/>
                    <ProfileField title="Supervisor Signature" name="supervisor_signature" value={supervisor_signature} type="signature" className="col-lg-6"/>
                    <ProfileField title="Manager Signature" name="manager_signature" value={manager_signature} type="signature" className="col-lg-6"/>
                </Row>
            </div>
        </div>;
    }
    // </editor-fold>

}

export default ProfileDialog;
