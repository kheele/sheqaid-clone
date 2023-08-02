import React from "react";
import {observer} from 'mobx-react';
import {AProfileDialog} from 'components/dialogs';
import {ProfileField, UploadButton} from 'components/inputs';
import {Slider} from 'components/lists';

import style from "./ProfileAppointmentDialog.lazy.css";

@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfileAppointmentDialog";
    className = "AProfileEmployeeDocDialog";
  
    constructor(props) {
        super(props, style);
    }

    title() {
        return "Job Appointments";
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
    
    renderItem(item, n, onClick) {
        const {
            props: {
                onFormNext, onFormBack, onFormOpen
            }
        } = this;
        const {data: {created_at, employee, date, expiry_date, notes, doc}} = item;
        
        return <div className="row item-wrapper padding-t-10 h-full">
            <label className="block padding-5 margin-l-10 margin-r-10 margin-b-0 text-center">Job Appointment Details</label>
            <div className="row margin-l-10 margin-r-10 row-details">
                <ProfileField title="Date" name="date" type="date" value={date} className="col-lg-6 col-xs-12"/>
                <ProfileField title="Expiry Date" name="expiry_date" type="date" value={expiry_date} className="col-lg-6 col-xs-12"/>
            </div>
            <hr className="margin-t-5 margin-l-10 margin-r-10 margin-b-5"/>
            <label className="block padding-5 margin-l-10 margin-r-10 margin-b-0 text-center">Notes</label>
            <div className="row margin-l-0 margin-r-0 row-doc sec-group">
                <div className="col-lg-12 document-preview margin-t-10" dangerouslySetInnerHTML={{__html: notes || 'N/A'}}/>
            </div>
            <hr className="margin-t-5 margin-l-10 margin-r-10 margin-b-5"/>
            <label className="block padding-5 margin-l-10 margin-r-10 margin-b-0 text-center">Document</label>
            <div className="row margin-l-0 margin-r-0 row-doc padding-t-5 padding-b-5 sec-group">
                <UploadButton 
                    name="doc" 
                    defaultValue={doc}
                    buttonTitle="Document" 
                    type={['PDF', 'Word', 'Image']}
                    showOnlyIcon 
                    readonly
                    className="col-lg-6 col-xs-12 hor-center"
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
                onFormNext, onFormBack, onFormOpen, 
                dialog: {renderProfileCover}
            },
            item: {
                id, data: {
                    fname, lname, 
                    optional_info, client, project, site, client_id, project_id, site_id,

                    employee_job_appointment_list, sub_collection_keys: {
                        employee_job_appointment_list: {latest, id: ids}
                    }
                }
            }
        } = this;
        
        const last = employee_job_appointment_list[latest.id];
        const {created_at, employee, date, expiry_date, notes, doc} = last;
        
        let list = Object.keys(employee_job_appointment_list).map(id => {
            return {id, expiry_date: employee_job_appointment_list[id].expiry_date || null};
        });
        list.sortBy('expiry_date', 'desc');
//        const l = list.map(({id, expiry_date}) => {
//            return Dates.formatDate(expiry_date);
//        });
//        console.log('employees test', l)
        list = list.map(({id, expiry_date}) => {
            return {id, data: employee_job_appointment_list[id]};
        });
        
        return <div className="controls-wrapper controls-sectioned">
            <div className="controls">
                {renderProfileCover(<React.Fragment>
                    <h3>{lname + ' ' + fname}</h3>
                    <h5>{ids.length + ' Job Appointments'}</h5>
                </React.Fragment>)} 
                <Slider name="job-appointment-carousel" renderer={this.renderItem} list={list} splitBy={1} colSize="col-lg-12" onClick={this.onClick}/>
            </div>
        </div>;
    }

}

export default ProfileDialog;
