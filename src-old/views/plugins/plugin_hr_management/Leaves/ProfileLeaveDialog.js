import React from "react";
import {observer} from 'mobx-react';
import {AProfileDialog} from '../../../../components/dialogs';
import {ProfileField, UploadButton} from '../../../../components/inputs';
import {Slider} from '../../../../components/lists';

import ProfilePDFReader from './printers/ProfilePDFReader';

import style from "./ProfileLeaveDialog.lazy.css";

@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfileLeaveDialog";
    className = "AProfileEmployeeDocDialog";
  
    constructor(props) {
        super(props, style);
    }

    title() {
        return "Leaves";
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
        const {data: {created_at, doc, employee, type, due_to, date, expiry_date, days_booked, reason, employee_comments, notes}} = item;
        
        return <div className="row item-wrapper padding-t-10 h-full">
            <label className="w-full margin-l-10 margin-r-10 margin-b-0 text-center">Leave Details</label>
            <div className="row margin-l-10 margin-r-10 row-details">
                <ProfileField title="Leave Type" name="type" value={type} type="select" className="col-lg-6"/>
                <ProfileField title="Leave Due To" name="due_to" value={due_to} className="col-lg-6"/>
                <ProfileField title="Leave Start Date" name="date" type="date" value={date} className="col-lg-6"/>
                <ProfileField title="Leave Expiry Date" name="expiry_date" type="date" value={expiry_date} className="col-lg-6"/>
                <ProfileField title="No. Of Days Booked" name="days_booked" value={days_booked} className="col-lg-12"/>
                <ProfileField title="Reason Of Leave" name="reason" value={reason} type="textarea" className="col-lg-12"/>
                <ProfileField title="Employee's Comments" name="employee_comments" value={employee_comments} type="textarea" className="col-lg-12"/>
                <ProfileField title="Notes" name="notes" value={notes} type="textarea" className="col-lg-12"/>
                <UploadButton 
                    name="doc" 
                    defaultValue={doc}
                    buttonTitle="Proof Of Sick Note" 
                    type={['PDF', 'Word', 'Image']}
                    showOnlyIcon 
                    readonly
                    className="ProfileField col-lg-6 pull-left-3"
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
                        leave_list: {
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
                    <h5>{list.length + ' Leaves'}</h5>
                </React.Fragment>)} 
                <Slider 
                    name="leave-carousel" 
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
