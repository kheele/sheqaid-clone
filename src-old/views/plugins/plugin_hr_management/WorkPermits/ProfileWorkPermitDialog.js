import React from "react";
import {observer} from 'mobx-react';
import {AProfileDialog} from '../../../../components/dialogs';
import {ProfileField, UploadButton} from '../../../../components/inputs';
import {Slider} from '../../../../components/lists';

import ProfilePDFReader from './printers/ProfilePDFReader';

import style from "./ProfileWorkPermitDialog.lazy.css";

@observer
class ProfileWorkPermitDialog extends AProfileDialog {
    pageKey = "ProfileWorkPermitDialog";
    className = "AProfileEmployeeDocDialog";
  
    constructor(props) {
        super(props, style);
    }

    title() {
        return "Work Permits";
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
        const {data: {created_at, date, expiry_date, notes, doc}} = item;
        
        return <div className="row item-wrapper margin-l-20 margin-r-20 padding-t-10 h-full">
            <label className="w-full margin-l-10 margin-r-10 margin-b-0 text-center">Work Permit Details</label>
            <div className="row margin-l-10 margin-r-10 row-details">
                <ProfileField title="Date" name="date" type="date" value={date} className="col-lg-6"/>
                <ProfileField title="Expiry Date" name="expiry_date" type="date" value={expiry_date} className="col-lg-6"/>
                <ProfileField title="Notes" name="notes" value={notes} className="col-lg-12"/>
            </div>
            <hr className="margin-t-5 margin-l-10 margin-r-10 margin-b-10"/>
            <label className="w-full margin-0 text-center">Document</label>
            <div className="row margin-l-0 margin-r-0 margin-b-15 row-doc sec-group">
                <UploadButton 
                    name="doc" 
                    defaultValue={doc}
                    buttonTitle="Work Permit Attachment" 
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
                        work_permit_list: {
                            list, ids, ids_by_expiry, latest, keys
                        }
                    }
                }
            }
        } = this;
        
        const activeId = dialog.extraProp('activeId');
        const index = activeId ? list.indexOfWithPredicate(item => item.id === activeId) : 0;
        
        console.log('index', activeId, ids.slice(), index)
        
        return <div className="controls-wrapper">
            <div className="controls">
                {renderProfileCover(<React.Fragment>
                    <h3>{lname + ' ' + fname}</h3>
                    <h5>{list.length + ' Work Permit'}</h5>
                </React.Fragment>)}
                <Slider 
                    name="work-permit-carousel" 
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

export default ProfileWorkPermitDialog;
