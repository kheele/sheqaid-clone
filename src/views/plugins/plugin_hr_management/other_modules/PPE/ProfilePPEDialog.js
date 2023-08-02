// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import {Dates} from 'utils/Utils';
import {AProfileDialog} from 'components/dialogs';
import {ProfileField, UploadButton} from 'components/inputs';
import {
    NewDepartmentListTable,
    NewJobPositionListTable,
    NewTeamListTable
} from 'components/FormTableComponents';
import {Row} from 'components/FormComponents';

import style from "./ProfilePPEDialog.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfilePPEDialog";
  
    constructor(props) {
        super(props, style);
    }

    title() {
        return "PPE Item";
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
    
    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);
    }
    // </editor-fold>
    
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
            item: {
                id, data: {
                    created_at, 
                    site, project, client, 
                    name, unit, qty_received, qty_issued, qty_in_stock, duration_type, duration_value, notes, profile_pic,
                    team_list = [],
                    department_list = [],
                    job_position_list = []
                }
            }
        } = this;
        
        return <div className="controls-wrapper controls-sectioned">
            <div className="controls">
                {renderProfileCover(<React.Fragment>
                    <h3>{name + ' (PPE Item)'}</h3>
                    {created_at && <h5>{'Create On ' + Dates.formatDate(created_at)}</h5>}
                </React.Fragment>)} 
                <Row 
                    active
                    rendered 
                    idx={0}
                    title="Company / Project / Site" 
                    onFormOpen={onFormOpen} 
                    onFormNext={onFormNext}
                >
                    <ProfileField title="Company" value={client} renderer={v => v.name || v.data.name} className="col-lg-12"/>
                    <ProfileField title="Project" value={project} renderer={v => v.name || v.data.name} className="col-lg-6"/>
                    <ProfileField title="Site" value={site} renderer={v => v.name || v.data.name} className="col-lg-6"/>
                </Row>
                <Row 
                    rendered 
                    idx={1}
                    title="1. Item Details" 
                    onFormOpen={onFormOpen}  
                    onFormNext={onFormNext}
                    onFormBack={onFormBack} 
                >
                    <ProfileField title="Item Description" value={name} className="col-lg-12"/>
                    <ProfileField title="Item Unit" value={unit} className="col-lg-12"/>
                    <ProfileField title="Quantity Received" value={qty_received} className="col-lg-4"/>
                    <ProfileField title="Quantity Issued" value={qty_issued} className="col-lg-4"/>
                    <ProfileField title="Quantity In Stock" value={qty_in_stock} className="col-lg-4"/>
                    <ProfileField title="Duration" value={(duration_value && duration_type) || null} renderer={() => duration_value + '' + duration_type} className="col-lg-12"/>
                    <ProfileField title="Notes" value={notes} className="col-lg-12"/>
                    <UploadButton 
                        name="profile_pic" 
                        defaultValue={profile_pic}
                        buttonTitle="PPE Item Photo" 
                        type={['Photo']}
                        showOnlyIcon 
                        readonly
                        className="col-lg-6 col-xs-12 hor-center"
                    />
                </Row>
                <Row 
                    rendered 
                    idx={2}
                    title="2. Teams / Departments / Job Positions" 
                    onFormOpen={onFormOpen}  
                    onFormBack={onFormBack} 
                >
                    <NewTeamListTable name="team_list" defaultValue={team_list} title="Team(s)" readonly/>
                    <hr className="pull-left margin-t-5 margin-b-15"/>
                    <NewDepartmentListTable name="department_list" defaultValue={department_list} title="Department(s)" readonly/>
                    <hr className="pull-left margin-t-5 margin-b-15"/>
                    <NewJobPositionListTable name="job_position_list" defaultValue={job_position_list} title="Job Position(s)" readonly/>
                </Row>
            </div>
        </div>;
    }
    // </editor-fold>

}

export default ProfileDialog;
