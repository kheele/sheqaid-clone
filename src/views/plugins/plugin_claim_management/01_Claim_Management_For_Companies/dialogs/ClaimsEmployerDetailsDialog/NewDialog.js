// <editor-fold defaultstate="collapsed" desc="import">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';
import {execWhen} from 'utils/Utils';

import {ClearableInput, SelectClientInput, SelectEmployeeInput} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import {ANewDialog} from 'components/dialogs';

import style from "./NewDialog.lazy.css";
import insertClaimsEmployerDetails
    from "mutations/all/COIDA/ClaimsEmployerDetails/insertClaimsEmployerDetails";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class NewDialog extends ANewDialog {
    pageKey = "NewDialog";
    title = "Create Employer Details";

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
                let {name, data} = val;
                company_name_ref.onChange(name || data.name);
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
        const {form} = this;
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
        
        const data = {
            client_id: client && client.id,
            company_name,
            company_reg_num,
            company_contact_person_id: company_contact_person && company_contact_person.id ? company_contact_person.id : null,
            company_contact_person_other: company_contact_person && !company_contact_person.id ? {data: company_contact_person} : null,
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
        };
        
        console.log(data)

        btn.text("Saving...").disabled();
        progressDialog.open();
        insertClaimsEmployerDetails(data).then(res => {
            console.log("res", res)
            onSaved && onSaved(res);
            infoDialog.open("Record successfully saved.");
            infoDialog.close(2000);
            this.props.close();
        }).finally(() => {
            btn.text("Save").enabled();
            setTimeout(() => progressDialog.close());
        });
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {props: {onFormNext, onFormBack, onFormOpen}} = this;
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
                <SelectClientInput ref="client" name="client" placeholder="Company..." required className="col-lg-12 form-control"/>
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
                <ClearableInput ref="company_name" name="company_name" type="text" placeholder="Compensation Commissioner Registered Name" className="col-lg-12 form-control"/>
                <ClearableInput ref="company_reg_num" name="company_reg_num" type="text" placeholder="Compensation Commissioner Registration Number" className="col-lg-12 form-control"/>
                <SelectEmployeeInput ref="company_contact_person" name="company_contact_person" placeholder="Contact Person..." required className="col-lg-12 form-control"/>
                <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">Street Address & Postal Code</label>
                <ClearableInput ref="company_str_addr" name="company_str_addr" type="textarea" placeholder="Street Address" className="col-lg-8 form-control"/>
                <ClearableInput ref="company_str_addr_code" name="company_str_addr_code" type="text" placeholder="Postal Code" footerDesc="For Street Address" className="col-lg-4 form-control"/>
                <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">Postal Address & Postal Code</label>
                <ClearableInput ref="company_postal_addr" name="company_postal_addr" type="textarea" placeholder="Postal Address" className="col-lg-8 form-control"/>
                <ClearableInput ref="company_postal_addr_code" name="company_postal_addr_code" type="text" placeholder="Postal Code" footerDesc="For Postal Address" className="col-lg-4 form-control"/>
                <hr />
                <ClearableInput ref="company_tel_code" name="company_tel_code" type="text" placeholder="Tel Code" className="col-lg-4 form-control"/>
                <ClearableInput ref="company_tel_num" name="company_tel_num" type="text" placeholder="Tel Number" className="col-lg-8 form-control"/>
                <ClearableInput ref="company_fax_code" name="company_fax_code" type="text" placeholder="Fax Code" className="col-lg-4 form-control"/>
                <ClearableInput ref="company_fax_num" name="company_fax_num" type="text" placeholder="Fax Number" className="col-lg-8 form-control"/>
                <ClearableInput ref="company_email" name="company_email" type="email" placeholder="Email Address" className="col-lg-12 form-control"/>
                <ClearableInput ref="company_location" name="company_location" type="text" placeholder="Situation of Business/Farm" className="col-lg-12 form-control"/>
                <ClearableInput ref="company_nature" name="company_nature" type="text" placeholder="Nature of Business, Trade or Industry" className="col-lg-12 form-control"/>
            </Row>
        </FormControls>;
    }
    // </editor-fold>
}

export default NewDialog;
