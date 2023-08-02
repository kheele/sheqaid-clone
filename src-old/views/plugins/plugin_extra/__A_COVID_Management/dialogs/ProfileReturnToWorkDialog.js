import React from "react";
import {observer} from 'mobx-react';
import {CircularProgress} from '@material-ui/core';
import {computed, observable} from 'mobx';

import Form from '../../../../../utils/Form';
import {AProfileDialog} from '../../../../../components/dialogs';
import {ProfileField, ProfilePic} from '../../../../../components/inputs';

import style from "./ProfileReturnToWorkDialog.lazy.css";

@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfileReturnToWorkDialog";

    constructor(props) {
        super(props, style);
    }

    title() {
        return "Return To Work Case";
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

    @observable
    state = {
        employee: null
    };
    
    constructor(props) {
        super(props);

        this.form = new Form();
    }

    async componentWillMount() {
        if(this.item) {
            const {employee: {id}} = this.item.data;
            this.state.employee = await window.neonBinding.events.emit('plugin_sheq_assist/employees/find_by_id', id);
        }
    }
    
    @computed get employee() {
        return this.state.employee;
    }
    
    get item() {
        return this.props.state.item;
    }
    
    render() {
        if (!this.item || !this.employee)
            return <div className="fixed-center">
            <CircularProgress/><br />Loading...
        </div>;
        const {
            props: {dialog: {renderProfileCover}},
            item, item: {id, data: {
                    created_at,
                    employee, 
                    employee_id, business_id, date, sex, age, province, district, job_category,
                    hospitalised, outcome, outcome_date, return_to_work_date, return_to_work_fitness,
                    hospital_type, admission_date, compensation_claim, percentage_disablement, claim_ref_num,
                    client, project, site
            }}
        } = this;
        
        const {isConsultant, isHasProjects} = storage.is;
        
        return <div className="controls-wrapper">
            <div className="controls">
                {renderProfileCover(<React.Fragment>
                    <ProfilePic profilePic="employees" id={employee.id} readonly className="x60 hor-center margin-b-5"/>
                    <h3>{employee.lname + " " + employee.fname}</h3>
                </React.Fragment>)}
                {isHasProjects && <div className="row SelectSiteConfirmInputs">
                    <label className="margin-b-0">Location</label>
                    <div className="row sec-group">
                        {isConsultant && <ProfileField name="client" placeholder="Company" value={client} renderer={v => v.name || v.data.name} required className="col-lg-12"/>}
                        <ProfileField name="project" placeholder="Project" value={project} renderer={v => v.name || v.data.name} required className="col-lg-6"/>
                        <ProfileField name="site" placeholder="Site" value={site} renderer={v => v.name || v.data.name} required className="col-lg-6"/>
                    </div>
                </div>}
                <div className="row">
                    <label className="margin-b-0">Return To Work Case Details</label>
                    <div className="row sec-group">
                        <ProfileField ref="employee" name="employee" value={employee} renderer={v => v.fname + ' ' + v.lname} placeholder="Employee" required className="col-lg-6"/>
                        <ProfileField ref="employee_id" name="employee_id" value={employee_id}  placeholder="Employee ID" required className="col-lg-6"/>
                    </div>
                    <div className="row sec-group">
                        <ProfileField name="date" type="date" value={date} placeholder="Date" required className="col-lg-6"/>
                        <ProfileField name="business_id" value={business_id} placeholder="Business ID" required className="col-lg-6"/>
                    </div>
                    <div className="row sec-group">
                        <ProfileField name="sex" value={sex} placeholder="Gender" required className="col-lg-6"/>
                        <ProfileField name="age" value={age} placeholder="Age (Years)" required className="col-lg-6"/>
                    </div>
                    <div className="row sec-group">
                        <ProfileField name="province" value={province} placeholder="Province" required className="col-lg-6"/>
                        <ProfileField name="district" value={district} placeholder="District" required className="col-lg-6"/>
                    </div>
                    <div className="row sec-group">
                        <ProfileField name="job_category" value={job_category} renderer={v => (v.data ? v.data.name : v.name || v)} placeholder="Job Category" required className="col-lg-12"/>
                    </div>
                    <div className="row sec-group">
                        <ProfileField name="hospitalised" value={hospitalised} placeholder="Hospitalised" required className="col-lg-8 pull-left-2"/>
                    </div>
                    <div className="row sec-group">
                        <ProfileField ref="hospital_type" name="hospital_type" value={hospital_type} placeholder="Hospital Type" footerDesc='Fill this field only when "Hospitalised" is "Yes"' required isEditable={false} className="col-lg-6"/>
                        <ProfileField ref="admission_date" name="admission_date" value={admission_date} type="date" placeholder="Date Of Admission" footerDesc='Fill this field only when "Hospitalised" is "Yes"' required isEditable={false} className="col-lg-6"/>
                    </div>
                    <div className="row sec-group">
                        <ProfileField name="outcome" placeholder="Outcome" value={outcome}/>
                        <ProfileField name="outcome_date" type="date" value={outcome_date} placeholder="Date Of Outcome" required/>
                    </div>
                    <div className="row sec-group">
                        <ProfileField name="return_to_work_date" type="date" value={return_to_work_date} placeholder="Return To Work Date" required className="col-lg-6"/>
                        <ProfileField name="return_to_work_fitness" value={return_to_work_fitness} placeholder="Return To Work Fitness" required className="col-lg-6"/>
                    </div>
                    <div className="row sec-group">
                        <ProfileField name="compensation_claim" value={compensation_claim} placeholder="Compensation Claim" required className="col-lg-8 pull-left-2"/>
                    </div>
                    <div className="row sec-group">
                        <ProfileField name="percentage_disablement" value={percentage_disablement} placeholder="% Disablement" footerDesc="If it's 30%, type 30" className="col-lg-6"/>
                        <ProfileField name="claim_ref_num" value={claim_ref_num} placeholder="Claim Reference No." className="col-lg-6"/>
                    </div>
               </div>
            </div>
        </div>;
    }

}

export default ProfileDialog;
