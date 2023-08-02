// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';
import {execWhen, ShouldUpdate} from 'utils/Utils';

import {ClearableInput, SelectClientInput, SelectEmployeeInput} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import {AEditDialog} from 'components/dialogs';

import style from "./EditClaimsEmployerDetailsDialog.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class EditDialog extends AEditDialog {
    pageKey = "EditClaimsEmployerDetailsDialog";
    title = "Edit Employer Details";

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return  Controls;
    }
}
// </editor-fold>

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/COIDA_Management/claims/client/employer-details/";

    // <editor-fold defaultstate="collapsed" desc="fields">
    @observable
    state = {
        lists: {
        }
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor() {
        super();

        this.onNext = this.onNext.bind(this);
        
        this.form = new Form();
        this.form.addChangeOne("client", this.onChangeClient.bind(this));
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onChange funs">
    onChangeClient(el, val) {
        execWhen(() => this.refs.company_name).then(company_name_ref => {
            if(val) {
                let {name} = val.data;
                company_name_ref.onChange(name);
            }
        });
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onNext">
    onNext(e, btn) {
        const {form} = this;
        const {idx} = btn.props;
        const {isContractor, isConsultant} = storage.is;
        if(idx === 0) {
            if (isConsultant && !form.isValid('client')) {
                infoDialog.open('Company is required');
                return;
            }
        }
                
        return true;
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    onSubmit(e, btn, onSaved) {
        const {form, item: {data: old_data}} = this;
        const {isContractor, isConsultant} = storage.is;
          
        if (isConsultant && !form.isValid('client')) {
            infoDialog.open('Company is required');
            return;
        }
        
        if (!form.isValid('company_name')) {
            infoDialog.open('Compensation Commissioner Registered Name is required');
            return;
        }

        const {
            client,
            company_name,
            company_reg_num,
            company_contact_person,
            company_str_addr,
            company_str_addr_code,
            company_postal_addr,
            company_postal_addr_code,
            company_tel_code,
            company_tel_num,
            company_fax_code,
            company_fax_num,
            company_email,
            company_location,
            company_nature,
        } = form.data;
        
        const data = {};
        
        ShouldUpdate.checkClient(data, old_data, client);
        
        ShouldUpdate.check(data, old_data, company_name, 'company_name');
        ShouldUpdate.check(data, old_data, company_reg_num, 'company_reg_num');
        ShouldUpdate.checkEmployee_deprecated(data, old_data, company_contact_person, 'company_contact_person');
        ShouldUpdate.check(data, old_data, company_str_addr, 'company_str_addr');
        ShouldUpdate.check(data, old_data, company_str_addr_code, 'company_str_addr_code');
        ShouldUpdate.check(data, old_data, company_postal_addr, 'company_postal_addr');
        ShouldUpdate.check(data, old_data, company_postal_addr_code, 'company_postal_addr_code');
        ShouldUpdate.check(data, old_data, company_tel_code, 'company_tel_code');
        ShouldUpdate.check(data, old_data, company_tel_num, 'company_tel_num');
        ShouldUpdate.check(data, old_data, company_fax_code, 'company_fax_code');
        ShouldUpdate.check(data, old_data, company_fax_num, 'company_fax_num');
        ShouldUpdate.check(data, old_data, company_email, 'company_email');
        ShouldUpdate.check(data, old_data, company_location, 'company_location');
        ShouldUpdate.check(data, old_data, company_nature, 'company_nature');
        
        if(Object.keys(data).isEmpty()){
            infoDialog.open("Nothing changed!");
            return;
        }
        
        console.log(data)

        btn.text("Saving...").disabled();
        neonBinding.events.emit(this.path + "update", this.item.id, data).then(res => {
            console.log("res", res)
            if(res === "ERROR") {
                infoDialog.open("An error occurred. Please try again.");
            } else {
                onSaved && onSaved(res);
                infoDialog.open("Record successfully updated.");
                this.props.close();
            }
            infoDialog.close(2000);
        }).finally(() => {
            btn.text("Save").enabled();
        });
    }
    // </editor-fold>

    get item() {
        return this.props.state.item;
    }

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        if (!this.item)
            return null;
        let {
            props: {
                onFormNext, onFormBack, onFormOpen, 
                dialog: {renderProfileCover}
            },
            item, item: {
                id, data: {
                    created_at, 
                    client,
                    company_name,
                    company_reg_num,
                    company_contact_person,
                    company_str_addr,
                    company_str_addr_code,
                    company_postal_addr,
                    company_postal_addr_code,
                    company_tel_code,
                    company_tel_num,
                    company_fax_code,
                    company_fax_num,
                    company_email,
                    company_location,
                    company_nature,
                }
            }
        } = this;
        
        const {isContractor, isConsultant} = storage.is;
        return <FormControls
            onChange={this.form.onChange}
        >
            {isConsultant && <Row 
                rendered  
                countFields
                active
                idx={0}
                title="Company" 
                onFormOpen={onFormOpen} 
                onFormNext={onFormNext}
            >
                <SelectClientInput ref="client" name="client" placeholder="Company..." defaultValue={RenderUtils.selectedClient.call(this)} required className="col-lg-12 form-control"/>
            </Row>}
            <Row 
                rendered  
                countFields
                active={!isConsultant}
                idx={1}
                title="Employer Details"
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
            >
                <ClearableInput ref="company_name" name="company_name" type="text" placeholder="Compensation Commissioner Registered Name" defaultValue={company_name} className="col-lg-12 form-control"/>
                <ClearableInput ref="company_reg_num" name="company_reg_num" type="text" placeholder="Compensation Commissioner Registration Number" defaultValue={company_reg_num} className="col-lg-12 form-control"/>
                <SelectEmployeeInput ref="company_contact_person" name="company_contact_person" placeholder="Contact Person..." defaultValue={company_contact_person} required className="col-lg-12 form-control"/>
                <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">Street Address & Postal Code</label>
                <ClearableInput ref="company_str_addr" name="company_str_addr" type="textarea" placeholder="Street Address" defaultValue={company_str_addr} className="col-lg-8 form-control"/>
                <ClearableInput ref="company_str_addr_code" name="company_str_addr_code" type="text" placeholder="Postal Code" defaultValue={company_str_addr_code} footerDesc="For Street Address" className="col-lg-4 form-control"/>
                <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">Postal Address & Postal Code</label>
                <ClearableInput ref="company_postal_addr" name="company_postal_addr" type="textarea" placeholder="Postal Address" defaultValue={company_postal_addr} className="col-lg-8 form-control"/>
                <ClearableInput ref="company_postal_addr_code" name="company_postal_addr_code" type="text" placeholder="Postal Code" defaultValue={company_postal_addr_code} footerDesc="For Postal Address" className="col-lg-4 form-control"/>
                <hr />
                <ClearableInput ref="company_tel_code" name="company_tel_code" type="text" placeholder="Tel Code" defaultValue={company_tel_code} className="col-lg-4 form-control"/>
                <ClearableInput ref="company_tel_num" name="company_tel_num" type="text" placeholder="Tel Number" defaultValue={company_tel_num} className="col-lg-8 form-control"/>
                <ClearableInput ref="company_fax_code" name="company_fax_code" type="text" placeholder="Fax Code" defaultValue={company_fax_code} className="col-lg-4 form-control"/>
                <ClearableInput ref="company_fax_num" name="company_fax_num" type="text" placeholder="Fax Number" defaultValue={company_fax_num} className="col-lg-8 form-control"/>
                <ClearableInput ref="company_email" name="company_email" type="email" placeholder="Email Address" defaultValue={company_email} className="col-lg-12 form-control"/>
                <ClearableInput ref="company_location" name="company_location" type="text" placeholder="Situation of Business/Farm" defaultValue={company_location} className="col-lg-12 form-control"/>
                <ClearableInput ref="company_nature" name="company_nature" type="text" placeholder="Nature of Business, Trade or Industry" defaultValue={company_nature} className="col-lg-12 form-control"/>
            </Row>
        </FormControls>;
    }
    // </editor-fold>
}

export default EditDialog;
