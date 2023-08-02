// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import {Dates} from 'utils/Utils';
import {AProfileDialog} from 'components/dialogs';
import {ProfileField} from 'components/inputs';
import {Row} from 'components/FormComponents';
import {NewEmployeeListTable, NewPPEItemListTable} from 'components/FormTableComponents';

import style from "./ProfileTeamDialog.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfileTeamDialog";
  
    constructor(props) {
        super(props, style);
    }

    title() {
        return "Team";
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
                    supervisor, 
                    name, status,
                    //
                    list, 
                    //
                    ppe_list
                }
            }
        } = this;
        
        return <div className="controls-wrapper controls-sectioned">
            <div className="controls">
                {renderProfileCover(<React.Fragment>
                    <h3>{name + ' (Team)'}</h3>
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
                    <ProfileField title="Project" value={project} renderer={v => v.name || v.data.name} className="col-lg-12"/>
                    <ProfileField title="Site" value={site} renderer={v => v.name || v.data.name} className="col-lg-12"/>
                </Row>
                <Row 
                    rendered 
                    idx={1}
                    title="Team Details" 
                    onFormOpen={onFormOpen}  
                    onFormNext={onFormNext}
                    onFormBack={onFormBack} 
                >
                    <ProfileField title="Supervisor" value={supervisor} renderer={v => (v.lname || v.data.lname) + " " + (v.fname || v.data.fname)} className="col-lg-12"/>
                    <ProfileField title="Team Name" value={name} className="col-lg-12"/>
                    <ProfileField title="Status" value={status} className="col-lg-12"/>
                </Row>
                <Row 
                    rendered 
                    idx={2}
                    title="2. Team Members" 
                    onFormOpen={onFormOpen}  
                    onFormNext={onFormNext}
                    onFormBack={onFormBack} 
                >
                    <NewEmployeeListTable name="list" defaultValue={[...(list || [])]} readonly/>
                </Row>
                <Row 
                    rendered 
                    idx={3}
                    title="3. PPE Required" 
                    onFormOpen={onFormOpen}  
                    onFormBack={onFormBack} 
                >
                    <NewPPEItemListTable name="ppe_list" defaultValue={[...(ppe_list || [])]} readonly/>
                </Row>
            </div>
        </div>;
    }
    // </editor-fold>

}

export default ProfileDialog;
