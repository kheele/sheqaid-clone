import React from "react";
import {observer} from 'mobx-react';
import {AProfileDialog} from '../../../../components/dialogs';
import {ProfileField, UploadButton} from '../../../../components/inputs';
import {NewEmployeeListTable} from '../../../../components/FormTableComponents';
import {Slider} from '../../../../components/lists';

import ProfilePDFReader from './printers/ProfilePDFReader';

import style from "./ProfileCounselingDialog.lazy.css";

@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfileCounselingDialog";
    className = "AProfileEmployeeDocDialog";
  
    constructor(props) {
        super(props, style);
    }

    title() {
        return "Counselings";
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
        const {
            data: {
                created_at, 
                employee, 
                responsible_person,
                //2
                types,
                reasons,
                incident_desc,
                corrective_actions,
                counselling_hrs_to_complete,
                expiry_date,
                witness_list,
                //3
                doc
            }
        } = item;
        
        return <div className="row item-wrapper padding-t-10 h-full">
            <label className="w-full margin-l-10 margin-r-10 margin-b-0 text-center">Counseling Details</label>
            <div className="row margin-l-10 margin-r-10 row-details">
                <ProfileField title="Responsible Person" name="responsible_person" value={responsible_person} renderer={v => (v.lname || v.data.lname) + ' ' + (v.fname || v.data.fname)} className="col-lg-12"/>
                <ProfileField title="Counseling Types" name="types" value={types} renderer={v => v.map(v => v).join(', ')} className="col-lg-12"/>
                <ProfileField title="Reasons For Counseling" name="reasons" value={reasons} renderer={v => v.map(v => v).join(', ')} className="col-lg-12"/>
                <ProfileField title="Description Of Incident" name="incident_desc" value={incident_desc} type="textarea" className="col-lg-12"/>
                <ProfileField title="Corrective Actions" name="corrective_actions" value={corrective_actions} type="textarea" className="col-lg-12"/>
                <ProfileField title="Counseling Hours To Complete" name="counselling_hrs_to_complete" value={counselling_hrs_to_complete} className="col-lg-6"/>
                <ProfileField title="Completion Date" name="expiry_date" type="date" value={expiry_date} className="col-lg-6"/>
                <UploadButton 
                    name="doc" 
                    defaultValue={doc}
                    buttonTitle="Counseling Attachment" 
                    type={['PDF', 'Word', 'Image']}
                    showOnlyIcon 
                    readonly
                    className="ProfileField col-lg-6 pull-left-3 margin-t-15 margin-b-15"
                />
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
                        counselling_list: {
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
                    <h5>{list.length + ' Counselings'}</h5>
                </React.Fragment>)} 
                <Slider 
                    name="counseling-carousel" 
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
