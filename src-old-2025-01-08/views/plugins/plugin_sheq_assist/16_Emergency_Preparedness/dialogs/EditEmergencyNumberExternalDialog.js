import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';
import {ShouldUpdate} from 'utils/Utils';

import {ClearableInput} from 'components/inputs';
import {AEditDialog} from 'components/dialogs';

import style from "./EditEmergencyNumberExternalDialog.lazy.css";

@observer
class EditEmergencyNumberExternalDialog extends AEditDialog {
    path = "plugin_sheq_assist/emergency-management/emergency-numbers/";
    pageKey = "EditEmergencyNumberExternalDialog";
    title = "Edit External Emergency Number";

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return  Controls;
    }
}

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/16_Emergency_Preparedness/emergency-numbers/external/";
    
    @observable state = {
        lists: {
            org_name: ['Ambulance', 'Hospital', 'Police', 'Fire Fighting']
        }
    };

    constructor() {
        super();

        this.form = new Form();
    }

    onSubmit(e, btn, onSaved) {
        const {form, item: {data: old_data}} = this;

        if (!form.isValid('org_name')) {
            infoDialog.open('Organization is required');
            return;
        }
        if (!form.isValid('contacts')) {
            infoDialog.open('Contact No. is required');
            return;
        }

        const {org_name, area, contacts} = form.data;
        const data = {};
        
        ShouldUpdate.check(data, old_data, org_name, 'org_name');
        ShouldUpdate.check(data, old_data, area, 'area');
        ShouldUpdate.check(data, old_data, contacts, 'contacts');
        
        if(Object.keys(data).isEmpty()){
            infoDialog.open("Nothing changed!");
            return;
        }

        btn.text("Saving...").disabled();
        neonBinding.events.emit(this.path + "update", this.item.id, data).then(res => {
            console.log("res", res)
            onSaved && onSaved(data);
            infoDialog.open("Record successfully updated.");
            infoDialog.close(2000);
            this.props.close();
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
            props: {dialog: {renderProfileCover}},
             item, item: {
                id, data: {
                    created_at,
                    org_name, area, contacts
                }
            }
        } = this;
        
        return (<div className="controls-wrapper">
            <div className="controls">
                <div className="row">
                    <div className="row sec-group">
                        <ClearableInput name="org_name" type="select" placeholder="Organization..." defaultValue={org_name} required className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.org_name} add returnValue/>
                        <ClearableInput name="area" type="text" placeholder="Area" defaultValue={area} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="contacts" type="text" placeholder="Contact No." defaultValue={contacts} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    </div>
                </div>
            </div>
        </div>);
    }
}

export default EditEmergencyNumberExternalDialog;
