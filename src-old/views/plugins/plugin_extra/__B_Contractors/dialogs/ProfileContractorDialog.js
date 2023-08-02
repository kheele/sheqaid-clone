import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import {Permissions} from '../../../../../utils/Utils';

import {AProfileDialog} from '../../../../../components/dialogs';
import {ProfileField} from '../../../../../components/inputs';
import {FormControls, Row} from '../../../../../components/FormComponents';
import {NewSiteListTable} from '../../../../../components/FormTableComponents';

import EditContractorDialog from './EditContractorDialog.js';

import style from "./ProfileContractorDialog.lazy.css";

@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfileContractorDialog";
  
    constructor(props) {
        super(props, style);
    }

    title() {
        return "Contractor";
    }
    
    onEdit(evt, btn) {
        this.refs.controls.onEdit(evt, btn);
    }
    
    get topButtonsHiddenDelete() {
        const {user} = storage.loggedUser;
        const {permissions_modules} = user.data;
        const permissions_mod = (permissions_modules || []).find(v => v.key === "__B_Contractors");
        if(!Permissions.allowRemove(permissions_mod)) {
            return true;
        }
        
        return false;
    }
    
    get topButtonsHiddenEdit() {
        if(this.props.isRemoved) {
            return true;
        }
        const {user} = storage.loggedUser;
        const {permissions_modules} = user.data;
        const permissions_mod = (permissions_modules || []).find(v => v.key === "__B_Contractors");
        if(!Permissions.allowEdit(permissions_mod)) {
            return true;
        }
        
        return false;
    }

    get controls() {
        return  Controls;
    }
}

@observer
class Controls extends React.Component {
    
    @observable
    state = {
    };
    
    constructor(props) {
        super(props);
    }
    
    onEdit(evt, btn) {
        this.refs.editDialog.open(this.item);
    }

    get item() {
        return this.props.state.item;
    }

    render() {
        if (!this.item)
            return null;
        const {
            props: {
                onFormNext, onFormBack, onFormOpen,
                dialog: {renderProfileCover}
            },
            item, item: {
                id, data: {created_at, name, username, inc_contractor_pack, site_list}
            }
        } = this;
        
        const {isHasProjects} = storage.is;
        
        console.log(this.item)
        
        return <FormControls>
            <Row 
                rendered  
                active
                idx={1}
                title="1. Employer Details" 
                onFormOpen={onFormOpen} 
                onFormNext={isHasProjects && onFormNext}
            >
                <ProfileField title="Contractor Name" name="name" value={name} className="col-lg-12"/>
                <ProfileField title="Email Address" name="username" value={username} className="col-lg-12"/>
                <ProfileField title="Include Contractor's Pack" name="inc_contractor_pack" value={inc_contractor_pack} className="col-lg-12"/>
            </Row>
            {isHasProjects && <Row 
                rendered 
                idx={2}
                title="2. Site(s)" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack}
            >
                <NewSiteListTable name="site_list" defaultValue={site_list} readonly/>
            </Row>}
            <EditContractorDialog ref="editDialog"/>
        </FormControls>;
    }

}

export default ProfileDialog;
