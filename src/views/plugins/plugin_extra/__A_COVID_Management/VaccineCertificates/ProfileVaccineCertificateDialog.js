import React from "react";
import {observer} from 'mobx-react';
import {AProfileDialog} from '../../../../../components/dialogs';
import {ProfileField, UploadButton} from '../../../../../components/inputs';
import {Slider} from '../../../../../components/lists';

import ProfilePDFReader from './printers/ProfilePDFReader';

import style from "./ProfileVaccineCertificateDialog.lazy.css";

@observer
class ProfileVaccineCertificateDialog extends AProfileDialog {
    pageKey = "ProfileVaccineCertificateDialog";
    className = "AProfileEmployeeDocDialog";
  
    constructor(props) {
        super(props, style);
    }

    title() {
        return "Vaccine Certificates";
    }
    
    onSaveAsPDF(e, btn) {
        this.refs.controls.onSaveAsPDF(e, btn);
    }
    
    get topButtonsHiddenDelete() {
        return true;
    }

    get controls() {
        return  Controls;
    }
}

@observer
class Controls extends React.Component {
    
    constructor(props) {
        super(props);
        
        this.renderItem = this.renderItem.bind(this);
    }
    
    // <editor-fold defaultstate="collapsed" desc="onSaveAsPDF">
    onSaveAsPDF(e, btn) {
        this.refs.pdfReader.open(this.item);
    }
    // </editor-fold>
    
    renderItem(item, n, onClick) {
        const {
            props: {
                onFormNext, onFormBack, onFormOpen
            }
        } = this;
        const {data: {created_at, vaccinated, doc}} = item;
        
        return <div className="row item-wrapper margin-l-20 margin-r-20 padding-t-10 h-full">
            <label className="w-full margin-l-10 margin-r-10 margin-b-0 text-center">Vaccine Certificate Details</label>
            <div className="row margin-l-10 margin-r-10 row-details">
                <ProfileField title="Vaccinated?" name="vaccinated" value={vaccinated} className="col-lg-6"/>
            </div>
            <hr className="margin-t-5 margin-l-10 margin-r-10 margin-b-10"/>
            <label className="w-full margin-0 text-center">Document</label>
            <div className="row margin-l-0 margin-r-0 margin-b-15 row-doc sec-group">
                <UploadButton 
                    name="doc" 
                    defaultValue={doc}
                    buttonTitle="Vaccine Certificate Attachment" 
                    type={['PDF', 'Word', 'Image']}
                    showOnlyIcon 
                    readonly
                    className="ProfileField w-280 hor-center"
                />
            </div>
        </div>;
    }
    
    get item() {
        return this.props.state.item;
    }

    render() {
        if (!this.item)
            return null;
        const {
            props: {
                dialog: {renderProfileCover}
            },
            item: {
                id, data: {
                    fname, lname, 
                    optional_info, client, project, site, client_id, project_id, site_id,

                    employee_vaccine_list, sub_collection_keys: {
                        employee_vaccine_list: {latest, id: ids}
                    }
                }
            }
        } = this;
        
        const last = employee_vaccine_list[latest.id];
        const {created_at, vaccinated, expiry_date} = last;
        
        let list = Object.keys(employee_vaccine_list).map(id => {
            return {id, expiry_date: employee_vaccine_list[id].expiry_date || null};
        });
        list.sortBy('expiry_date', 'desc');
//        console.log('employees', list.map(({id, expiry_date}) => {
//            return Dates.formatDate(expiry_date);
//        }))
        list = list.map(({id, expiry_date}) => {
            return {id, data: employee_vaccine_list[id]};
        });
        
        return <div className="controls-wrapper">
            <div className="controls">
                {renderProfileCover(<React.Fragment>
                    <h3>{lname + ' ' + fname}</h3>
                    <h5>{ids.length + ' Vaccine Certificates'}</h5>
                </React.Fragment>)}
                <Slider name="certificate-carousel" renderer={this.renderItem} list={list} splitBy={1} colSize="col-lg-12" onClick={this.onClick}/>
            </div>
            <ProfilePDFReader ref="pdfReader"/>
        </div>;
    }

}

export default ProfileVaccineCertificateDialog;
