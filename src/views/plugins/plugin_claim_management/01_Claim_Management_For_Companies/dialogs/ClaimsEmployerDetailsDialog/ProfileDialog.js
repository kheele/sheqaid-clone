// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';
import {CircularProgress} from "@mui/material";

import {AProfileDialog} from 'components/dialogs';
import {ProfileField} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';

import style from "./ProfileDialog.lazy.css";
import findByIdClaimsEmployerDetails
    from "mutations/all/COIDA/ClaimsEmployerDetails/findByIdClaimsEmployerDetails";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfileClaimsEmployerDetailsDialog";
    findById = findByIdClaimsEmployerDetails;
  
    constructor(props) {
        super(props, style);
    }

    title() {
        return "Employer Details";
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
    
    // <editor-fold defaultstate="collapsed" desc="state">
    @observable
    state = {
        item: null,
    };
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);
    }
    // </editor-fold>
    
    @computed get item() {
        return this.state.item;
    }
    
    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        if (!this.item) {
            return <CircularProgress className="fixed-center"/>;
        }
        
        const {
            props: {
                onFormNext, onFormBack, onFormOpen, 
                dialog: {renderProfileCover}
            },
            item: {
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
        return <FormControls>
            {isConsultant && <Row 
                rendered  
                countFields
                active
                idx={0}
                title="Company" 
                onFormOpen={onFormOpen} 
                onFormNext={onFormNext}
            >
                <ProfileField ref="client" name="client" title="Company" value={client} renderer={v => v.name || v.data.name} className="col-lg-12"/>
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
                <ProfileField ref="company_name" name="company_name" title="Compensation Commissioner Registered Name" value={company_name} className="col-lg-12"/>
                <ProfileField ref="company_reg_num" name="company_reg_num" title="Compensation Commissioner Registration Number" value={company_reg_num} className="col-lg-12"/>
                <ProfileField ref="company_contact_person" name="company_contact_person" title="Contact Person" value={company_contact_person} renderer={v => `${v.lname || v.data.lname} ${v.fname || v.data.fname}`} className="col-lg-12"/>
                <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">Street Address & Postal Code</label>
                <ProfileField ref="company_str_addr_code" name="company_str_addr_code" title="Postal Code" value={company_str_addr_code} footerDesc="For Street Address" className="col-lg-4"/>
                <ProfileField ref="company_str_addr" name="company_str_addr" type="textarea" title="Street Address" value={company_str_addr} className="col-lg-8"/>
                <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">Postal Address & Postal Code</label>
                <ProfileField ref="company_postal_addr_code" name="company_postal_addr_code" title="Postal Code" value={company_postal_addr_code} footerDesc="For Postal Address" className="col-lg-4"/>
                <ProfileField ref="company_postal_addr" name="company_postal_addr" type="textarea" title="Postal Address" value={company_postal_addr} className="col-lg-8"/>
                <hr />
                <ProfileField ref="company_tel_code" name="company_tel_code" title="Tel Code" value={company_tel_code} className="col-lg-4"/>
                <ProfileField ref="company_tel_num" name="company_tel_num" title="Tel Number" value={company_tel_num} className="col-lg-8"/>
                <ProfileField ref="company_fax_code" name="company_fax_code" title="Fax Code" value={company_fax_code} className="col-lg-4"/>
                <ProfileField ref="company_fax_num" name="company_fax_num" title="Fax Number" value={company_fax_num} className="col-lg-8"/>
                <ProfileField ref="company_email" name="company_email" type="email" title="Email Address" value={company_email} className="col-lg-12"/>
                <ProfileField ref="company_location" name="company_location" title="Situation of Business/Farm" value={company_location} className="col-lg-12"/>
                <ProfileField ref="company_nature" name="company_nature" title="Nature of Business, Trade or Industry" value={company_nature} className="col-lg-12"/>
            </Row>
        </FormControls>;
    }
    // </editor-fold>

}

export default ProfileDialog;
