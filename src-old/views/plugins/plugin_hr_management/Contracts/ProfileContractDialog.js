import React from "react";
import {observer} from 'mobx-react';
import {AProfileDialog} from '../../../../components/dialogs';
import {UploadButton} from '../../../../components/inputs';
import {Slider} from '../../../../components/lists';

import {ContractDetails, SalaryInfo} from './ContractComponents';

import ProfilePDFReader from './printers/ProfilePDFReader';

import style from "./ProfileContractDialog.lazy.css";

@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfileContractDialog";
    className = "AProfileEmployeeDocDialog";
  
    constructor(props) {
        super(props, style);
    }

    title() {
        return "Contracts";
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
        const {data: {created_at, salary_info, contract_details, doc, job_profile_doc}} = item;
        let expiry, isTrial;
        if(contract_details) {
            const {expiry_date, end_of_trial_period} = contract_details;
            if(expiry_date) {
                expiry = expiry_date;
            } else if(end_of_trial_period) {
                expiry = end_of_trial_period;
                isTrial = true;
            }
        }
        
        return <div className="row item-wrapper padding-t-10 h-full">
            <label className="w-full margin-l-10 margin-r-10 margin-b-0 text-center">Contract Details</label>
            <div className="row margin-l-10 margin-r-10 row-details">
                <ContractDetails ref="contractDetailsTab" defaultValue={contract_details}/>
            </div>
            <hr className="margin-t-15 margin-l-10 margin-r-10 margin-b-15"/>
            <label className="w-full margin-l-10 margin-r-10 text-center">Salary Information</label>
            <div className="row margin-l-10 margin-r-10 row-details">
                <SalaryInfo ref="salaryInfoTab" defaultValue={salary_info}/>
            </div>
            <hr className="margin-t-15 margin-l-10 margin-r-10 margin-b-10"/>
            <label className="w-full margin-b-5 text-center">Contract Document Attachment</label>
            <div className="row margin-l-0 margin-r-0 row-doc sec-group">
                <UploadButton 
                    name="doc" 
                    defaultValue={doc}
                    buttonTitle="Contract Attachment" 
                    type={['PDF', 'Word', 'Image']}
                    showOnlyIcon 
                    readonly
                    className="ProfileField w-280 hor-center"
                />
            </div>
            <hr className="margin-t-15 margin-l-10 margin-r-10 margin-b-10"/>
            <label className="w-full margin-b-5 text-center">Job Profile Document Attachment</label>
            <div className="row margin-l-0 margin-r-0 row-doc sec-group">
                <UploadButton 
                    name="doc" 
                    defaultValue={job_profile_doc}
                    buttonTitle="Job Profile Attachment" 
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
                dialog, dialog: {renderProfileCover}
            },
            item: {
                id, data: {
                    fname, lname, 
                    optional_info, client, project, site, client_id, project_id, site_id,

                    docs: {
                        contract_list: {
                            list, ids, ids_by_expiry, latest, keys
                        }
                    }
                }
            }
        } = this;
        
        const activeId = dialog.extraProp('activeId');
        const index = activeId ? list.indexOfWithPredicate(item => item.id === activeId) : 0;
        
        console.log('index', activeId, ids.slice(), index)
        
        return <div className="controls-wrapper controls-sectioned">
            <div className="controls">
                {renderProfileCover(<React.Fragment>
                    <h3>{lname + ' ' + fname}</h3>
                    <h5>{list.length + ' Contracts'}</h5>
                </React.Fragment>)}
                <Slider 
                    name="contract-carousel" 
                    index={index}
                    renderer={this.renderItem} 
                    list={list} 
                    splitBy={1} 
                    colSize="col-lg-12" 
                    onClick={this.onClick}
                />
            </div>
            <ProfilePDFReader ref="pdfReader"/>
        </div>;
    }

}

export default ProfileDialog;
