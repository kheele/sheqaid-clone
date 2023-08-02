// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import {ProfileField} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import {AProfileDialog} from 'components/dialogs';

import style from "./ProfileDialog.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ScheduledTask";
  
    constructor(props) {
        super(props, style);
    }

    title() {
        return "Scheduled Task";
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
            props: {onFormNext, onFormBack, onFormOpen},
            item, item: {
                id, data: {
                    group_name, group_key, performedAt, status
                }
            }
        } = this;
        
        return <FormControls>
            <Row 
                rendered  
                activeAlways
                idx={1}
                title="1. Scheduled Task Details" 
                onFormOpen={onFormOpen}>
                    <ProfileField name="group_name" placeholder="Group Name" defaultValue={group_name} className="col-lg-12"/>
                    <ProfileField name="group_key" placeholder="Group Key" defaultValue={group_key} className="col-lg-12"/>
                    <ProfileField name="id" placeholder="ID" defaultValue={id} className="col-lg-12"/>
                    <ProfileField name="performedAt" type="date" placeholder="Performed At" defaultValue={performedAt} className="col-lg-12"/>
                    <ProfileField name="status" placeholder="Status..." defaultValue={status} className="col-lg-12"/>
            </Row>
        </FormControls>;
    }
    // </editor-fold>

}

export default ProfileDialog;
