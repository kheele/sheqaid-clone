import React from "react";
import {observer} from 'mobx-react';
import {AProfileDialog} from '../../../../components/dialogs';
import {ProfileField, UploadButton} from '../../../../components/inputs';
import {NewEmployeeListTable} from '../../../../components/FormTableComponents';
import {Slider} from '../../../../components/lists';

import ProfilePDFReader from './printers/ProfilePDFReader';

import style from "./ProfileWarningDialog.lazy.css";

@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfileWarningDialog";
    className = "AProfileEmployeeDocDialog";
  
    constructor(props) {
        super(props, style);
    }

    title() {
        return "Warnings";
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
        const {data: {created_at, issued_by, type, date, expiry_date, details, employee_comments, notes, witness_list, doc}} = item;
        
        return <div className="row item-wrapper padding-t-10 h-full">
            <label className="w-full margin-l-10 margin-r-10 margin-b-0 text-center">Warning Details</label>
            <div className="row margin-l-10 margin-r-10 row-details">
                <ProfileField title="Warning Type" name="type" value={type} type="select" className="col-lg-4"/>
                <ProfileField title="Warning Date" name="date" type="date" value={date} className="col-lg-4"/>
                <ProfileField title="Warning Expiry Date" name="expiry_date" type="date" value={expiry_date} className="col-lg-4"/>
                <ProfileField title="Warning Issued By" name="issued_by" value={issued_by} renderer={v => v.lname + ' ' + v.fname} type="select" className="col-lg-6"/>
                <UploadButton 
                    name="doc" 
                    defaultValue={doc}
                    buttonTitle="Warning Attachment" 
                    type={['PDF', 'Word', 'Image']}
                    showOnlyIcon 
                    readonly
                    className="ProfileField col-lg-6"
                />
                <ProfileField title="Details Of Misconduct" name="details" value={details} type="textarea" className="col-lg-12"/>
                <ProfileField title="Employee's Comments" name="employee_comments" value={employee_comments} type="textarea" className="col-lg-12"/>
                <ProfileField title="Notes" name="notes" value={notes} type="textarea" className="col-lg-12"/>
                <label className="col-lg-12 margin-0 margin-t-10 padding-0 padding-b-0">Witness List</label>
                <NewEmployeeListTable name="witness_list" defaultValue={witness_list || []} readonly/>
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
                        warning_list: {
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
                    <h5>{list.length + ' Warnings'}</h5>
                </React.Fragment>)} 
                <Slider 
                    name="warning-carousel" 
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
