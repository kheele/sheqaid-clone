// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import Form from 'utils/Form';

import {ProfileField} from 'components/inputs';
import {NewModuleListTable} from 'components/FormTableComponents';
import {FormControls, Row} from 'components/FormComponents';
import {AProfileDialog} from 'components/dialogs';

import style from "./ProfileDialog.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ModuleGroup";
  
    constructor(props) {
        super(props, style);
    }

    title() {
        return "Module Group";
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
        
        this.form = new Form();
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
                    title, key, desc, modules = [], status, app
                }
            }
        } = this;
        
        return <FormControls>
            <Row 
                rendered  
                active
                idx={1}
                title="1. Module Group Details" 
                onFormOpen={onFormOpen} 
                onFormNext={onFormNext}>
                    <ProfileField name="name" type="text" placeholder="Group Name" value={title} className="col-lg-12"/>
                    <ProfileField name="key" type="text" placeholder="Group Key" value={key} className="col-lg-12"/>
                    <ProfileField name="desc" type="text" placeholder="Description" value={desc} className="col-lg-12"/>
                    <ProfileField name="status" type="text" placeholder="Status" value={status} className="col-lg-12"/>
                    <ProfileField name="app" type="text" placeholder="Application" value={app} className="col-lg-12"/>
            </Row>
            <Row 
                rendered 
                idx={2}
                title="2. Module Details"
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack}>
                <NewModuleListTable name="modules" defaultValue={modules} readonly/>
            </Row>
        </FormControls>;
    }
    // </editor-fold>

}

export default ProfileDialog;
