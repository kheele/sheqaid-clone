// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {CircularProgress} from '@material-ui/core';
import {computed, observable} from 'mobx';

import Form from 'utils/Form';
import {AProfileDialog} from 'components/dialogs';
import {ProfileField} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';

import {EmployeeDetailsPanel, NewVulnerableQuestionsTable} from './ComponentsScreening';

import style from "./ProfileVulnerableDialog.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfileVulnerableDialog";

    constructor(props) {
        super(props, style);
    }

    title() {
        return "Vulnerability Case";
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

    @observable
    state = {
        employee: null,
        vulnerability_status: null
    };
    
    constructor(props) {
        super(props);

        this.form = new Form();
    }

    async componentWillMount() {
        if(this.item) {
            const {employee: {id}, vulnerability_status} = this.item.data;
            this.state.vulnerability_status = vulnerability_status;
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
    
        const {onFormNext, onFormBack, onFormOpen} = this.props;
        const {showOnlyTable} = this;
        
        const {
            props: {dialog: {renderProfileCover}},
            item, item: {
                id, data: {
                    created_at,
                    employee, 
                    employee_id, date, sex, age, province, district, industry, job_category, vulnerability_status,
                    checklist,
                    business_id,
                    client, project, site
                }
            }
        } = this;
        
        const {isConsultant, isEmployee, hasProjects} = storage.is;
        
        let idx = 0;
        return <FormControls>
            {hasProjects && !showOnlyTable && <Row
                rendered  
                active
                idx={idx}
                title="Company / Project / Site" 
                onFormOpen={onFormOpen} 
                onFormNext={onFormNext}
            >
                {isConsultant && <ProfileField name="client" placeholder="Company" value={client} renderer={v => v.name || v.data.name} required className="col-lg-12"/>}
                <ProfileField name="project" placeholder="Project" value={project} renderer={v => v.name || v.data.name} required className="col-lg-12"/>
                <ProfileField name="site" placeholder="Site" value={site} renderer={v => v.name || v.data.name} required className="col-lg-12"/>
            </Row>}
            {!showOnlyTable && <Row 
                rendered 
                idx={idx++}
                title={idx + ". Employee Details"}
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
                onFormNext={onFormNext}
            >
                <ProfileField ref="employee" name="employee" value={employee} renderer={v => (v.fname || v.data.fname) + ' ' + (v.lname || v.data.lname)} placeholder="Employee" required className="col-lg-12"/>
                <ProfileField ref="employee_id" name="employee_id" value={employee_id}  placeholder="Employee ID" required className="col-lg-12"/>
                <ProfileField name="sex" value={sex} placeholder="Gender" required className="col-lg-6"/>
                <ProfileField name="age" type="number" value={age} placeholder="Age (Years)" required className="col-lg-6"/>
            </Row>}
            {showOnlyTable && <Row 
                rendered  
                active
                idx={idx++}
                title={idx + ". Employee Details"}
                onFormOpen={onFormOpen} 
                onFormNext={onFormNext}
            >
                <EmployeeDetailsPanel item={this.item}/>
            </Row>}
            <Row 
                rendered 
                idx={idx++}
                title={idx + ". Location, Job Category & Industry"}
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
                onFormNext={onFormNext}
            >
                <ProfileField name="province" value={province} placeholder="Province" required className="col-lg-12"/>
                <ProfileField name="district" value={district} placeholder="District" required className="col-lg-12"/>
                <ProfileField name="job_category" value={job_category} renderer={v => (v.data ? v.data.name : v.name || v)} placeholder="Job Category" required className="col-lg-12"/>
                <ProfileField name="industry" value={industry} placeholder="Industry" required className="col-lg-12"/>
            </Row>
            <Row 
                rendered 
                idx={idx++}
                title={idx + ". Vulnerability Details"}
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
            >
                {!showOnlyTable && <React.Fragment>
                    <ProfileField name="date" type="date" value={date} placeholder="Date" required className="col-lg-12"/>
                    <ProfileField name="business_id" value={business_id} placeholder="Business ID" required className="col-lg-12"/>
                    <hr className="margin-0 margin-v-5 pull-left"/>
                </React.Fragment>}
                <ProfileField name="vulnerability_status" type="radio" value={vulnerability_status} placeholder="Vulnerability Status" required className="col-lg-12"/>
                {vulnerability_status === "Yes" && <hr className="margin-0 margin-t-5 pull-left"/>}
                {vulnerability_status === "Yes" && <NewVulnerableQuestionsTable ref="newQuestionsTable" name="list" state={this.state} defaultValue={checklist} readonly/>}
            </Row>
        </FormControls>;
    }

}

export default ProfileDialog;
