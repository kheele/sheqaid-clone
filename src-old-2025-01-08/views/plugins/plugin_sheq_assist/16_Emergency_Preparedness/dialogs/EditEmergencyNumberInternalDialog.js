import React from "react";
import {observer} from 'mobx-react';

import Form from 'utils/Form';
import {ShouldUpdate} from 'utils/Utils';

import {ClearableInput} from 'components/inputs';
import ANewDialog from 'components/dialogs/ANewDialog';

import style from "./EditEmergencyNumberInternalDialog.lazy.css";

@observer
class EditEmergencyNumberInternalDialog extends ANewDialog {
    path = "plugin_sheq_assist/emergency-management/emergency-numbers/";
    pageKey = "EditEmergencyNumberInternalDialog";
    title = "Edit Internal Emergency Number";

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return  Controls;
    }
}

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/16_Emergency_Preparedness/emergency-numbers/internal/";

    constructor() {
        super();

        this.form = new Form();
    }

    onSubmit(e, btn, onSaved) {
        const {form, item: {data: old_data}} = this;

        if (!form.isValid('name')) {
            infoDialog.open('Name is required');
            return;
        }
        if (!form.isValid('contacts')) {
            infoDialog.open('Contact No. is required');
            return;
        }

        const {name, designation, contacts} = form.data;
        const data = {};
        
        ShouldUpdate.check(data, old_data, name, 'name');
        ShouldUpdate.check(data, old_data, designation, 'designation');
        ShouldUpdate.check(data, old_data, contacts, 'contacts');
        
        if(Object.keys(data).isEmpty()){
            infoDialog.open("Nothing changed!");
            return;
        }
        
        console.log(data)

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
                    name, designation, contacts
                }
            }
        } = this;
        return (<div className="controls-wrapper">
            <div className="controls">
                <div className="row">
                    <div className="row sec-group">
                        <ClearableInput name="name" type="text" placeholder="Name" defaultValue={name} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="designation" type="text" placeholder="Designation" defaultValue={designation} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="contacts" type="text" placeholder="Contact No." defaultValue={contacts} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    </div>
                </div>
            </div>
        </div>);
    }
}

export default EditEmergencyNumberInternalDialog;
