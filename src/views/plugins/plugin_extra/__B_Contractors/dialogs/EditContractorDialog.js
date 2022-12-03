import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from '../../../../../utils/Form';

import {Permissions, ShouldUpdate} from '../../../../../utils/Utils';
import {ClearableInput, SelectClientInput, SelectProjectInput} from '../../../../../components/inputs';
import {FormControls, Row} from '../../../../../components/FormComponents';
import {NewSiteListTable} from '../../../../../components/FormTableComponents';
import {AEditDialog} from '../../../../../components/dialogs';

import style from "./EditContractorDialog.lazy.css";

@observer
class EditDialog extends AEditDialog {
    pageKey = "EditContractorDialog";
    title = "Edit Contractor";

    constructor(props) {
        super(props, style);
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

    get controls() {
        return  Controls;
    }
}

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/contractors/";
    @observable
    state = {
        lists: {
            inc_contractor_pack: [
                {text: 'Yes', value: 'Yes', checked: false}, 
                {text: 'No', value: 'No', checked: false}
            ]
        }
    };
    
    constructor() {
        super();
        
        this.onNext = this.onNext.bind(this);
        
        this.form = new Form();
    }

    onNext(e, btn) {
        const {form} = this;
        const {idx} = btn.props;
        if(idx === 1) {
            if (!form.isValid('name')) {
                infoDialog.open('Contractor Name is required');
                return;
            }
            if (!form.isValid('username')) {
                infoDialog.open('Email Address is required');
                return;
            } else if (!form.get('username').isEmailAddress()) {
                infoDialog.open('Email Address is not valid');
                return;
            }
            if (!form.isValid('inc_contractor_pack')) {
                infoDialog.open("Include Contractor's Pack is required");
                return;
            }
        }
        
        return true;
    }

    onSubmit(e, btn, onSaved) {
        const {form, item: {data: old_data}} = this;

        const {isHasProjects} = storage.is;
        
        //1
        if (!form.isValid('name')) {
            infoDialog.open('Contractor Name is required');
            return;
        }
        if (!form.isValid('username')) {
            infoDialog.open('Email Address is required');
            return;
        } else if (!form.get('username').isEmailAddress()) {
            infoDialog.open('Email Address is not valid');
            return;
        }
        if (!form.isValid('inc_contractor_pack')) {
            infoDialog.open("Include Contractor's Pack is required");
            return;
        }
           
        //2
        if(isHasProjects) {
            if (!form.isValid('site_list') || form.get('site_list').isEmpty()) {
                infoDialog.open('At least one Site is required');
                return;
            }
        }
        
        const {
            //1
            name, username, inc_contractor_pack, site_list
        } = form.data;
        const data = {};       
        
        ShouldUpdate.check(data, old_data, name, 'name');
        ShouldUpdate.check(data, old_data, username, 'username'); 
        ShouldUpdate.checkBox(data, old_data, inc_contractor_pack, 'inc_contractor_pack');
        
        if(isHasProjects) {
            ShouldUpdate.checkSiteList(data, old_data, site_list, 'site_list'); 
        }
        
        if(Object.keys(data).isEmpty()){
            infoDialog.open("Nothing changed!");
            return;
        }
        
        console.log(data)

        btn.text("Saving...").disabled();
        neonBinding.events.emit(this.path + "update", this.item.id, data).then(res => {
            console.log("res", res)
            if (res === "EMAIL_DUP") {
                infoDialog.open("Contractor with this email address already exist.");
            } else {
                onSaved && onSaved(res);
                infoDialog.open("Record successfully updated.");
                infoDialog.close(2000);
                this.props.close();
            }
        }).finally(() => {
            btn.text("Save").enabled();
        });
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
        
        const {isConsultant, isHasProjects} = storage.is;
        
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
                <ClearableInput name="name" placeholder="Contractor Name" defaultValue={name} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="username" type="email" placeholder="Email Address" defaultValue={username} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="inc_contractor_pack" type="radio"  placeholder="Include Contractor's Pack" defaultValue={inc_contractor_pack} required className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.inc_contractor_pack} returnValue/>
            </Row>
            {isHasProjects && <Row 
                rendered 
                idx={2}
                title="2. Add/Remove Site(s)" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack}
            >
                {isConsultant && <SelectClientInput name="client" placeholder="Company..." required className="col-lg-12 form-control" onChange={this.form.onChange}/>}
                <SelectProjectInput name="project" placeholder="Project..." required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <NewSiteListTable name="site_list" defaultValue={[...site_list, null]} onChange={this.form.onChange}/>
            </Row>}
        </FormControls>;
    }
}

export default EditDialog;
