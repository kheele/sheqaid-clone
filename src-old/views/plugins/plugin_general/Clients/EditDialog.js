import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from '../../../../utils/Form';
import {ShouldUpdate} from "../../../../utils/Utils";
import {ClearableInput, ProfilePic} from '../../../../components/inputs';
import {FormControls, Row} from '../../../../components/FormComponents';

import {AEditDialog} from '../../../../components/dialogs';
import style from "./EditDialog.lazy.css";

@observer
class EditDialog extends AEditDialog {
    pageKey = "Client";
    className = 'ANewTableFormDialog';

    constructor(props) {
        super(props, style);
    }

    get title() {
        return "Edit Company";
    }

    get controls() {
        return Controls;
    }
}

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/clients/";
    @observable
    state = {
        lists: {
            sector_list: ['Chemicals', 'Construction', 'Fire Management', 'Harvesting', 'Manufacturing', 'Mining', 'Silviculture', 'Transport', 'Other'].map(value => {
                return {value, text: value, checked: false};
            }),
        },
    };

    constructor(props) {
        super(props);
        
        this.onUploaded = this.onUploaded.bind(this);
        
        this.form = new Form();
    }
    
    onUploaded(path) {
        this.item.data.profile_pic = path;
    }
    
    onSubmit(e, btn, onSaved) {
        const {form, item: {data: old_data}} = this;

        if (!form.isValid('name')) {
            infoDialog.open('Company Name is required');
            return;
        }
        
        const {name, business_id, phone, email, address, profile_pic, sector_list} = form.data;
        const data = {};

        ShouldUpdate.check(data, old_data, name, 'name');
        ShouldUpdate.check(data, old_data, business_id, 'business_id');
        ShouldUpdate.check(data, old_data, phone, 'phone');
        ShouldUpdate.check(data, old_data, email, 'email');
        ShouldUpdate.check(data, old_data, address, 'address');
        ShouldUpdate.checkFile(data, old_data, profile_pic, 'profile_pic');
        ShouldUpdate.checkBox(data, old_data, sector_list, 'sector_list');
        
        if(Object.keys(data).isEmpty()){
            infoDialog.open("Nothing changed!");
            return;
        }
        
        console.log(data)

        btn.text("Saving...").disabled();
        neonBinding.events.emit(this.path + "update", this.item.id, data).then(res => {
            console.log("res", res)
            onSaved && onSaved(data);
            storage.update.updateClient(this.item.id, data);
            
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
            props: {
                onFormNext, onFormBack, onFormOpen,
                dialog: {renderProfileCover}
            },
             item, item: {
                id, data: {
                    created_at, profile_pic, name, business_id, phone, email, address, sector_list
                }
            }
        } = this;
        
        return <FormControls onChange={this.form.onChange}>
            <Row 
                activeAlways
                rendered 
                idx={1}
                title="Company Details"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}>
                    <ProfilePic name="profile_pic" path={this.path + "upload/profile-pic"} id={item.id} profilePic={profile_pic} onUploaded={this.onUploaded}/>
                    <ClearableInput name="name" type="text" placeholder="Company Name" defaultValue={name} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <ClearableInput name="business_id" type="text" placeholder="Company Business ID" defaultValue={business_id} desc="This is required for COVID-19 data submission purposes. You will receive Business ID when registering your business for COVID-19 data submission on https://www.nioh.ac.za/ website" required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <ClearableInput name="phone" type="text" placeholder="Contact No." defaultValue={phone} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <ClearableInput name="email" type="text" placeholder="Email Address" defaultValue={email} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <ClearableInput name="address" type="textarea" placeholder="Company Address" defaultValue={address} className="col-lg-12 form-control" onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={2}
                title="Sector(s)"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}>
                <ClearableInput name="sector_list" type="checkbox" placeholder="Sector(s)" defaultValue={sector_list}
                                vertical={3} className="col-lg-12 form-control" onChange={this.form.onChange}
                                values={this.state.lists.sector_list} returnValue/>
            </Row>
        </FormControls>;
    }
}

export default EditDialog;
