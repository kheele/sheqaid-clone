// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {CircularProgress} from '@material-ui/core';
import {computed, observable} from 'mobx';

import Form from 'utils/Form';
import {ProfileField} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import {AProfileDialog} from 'components/dialogs';

import {EmployeeDetailsPanel, NewHighRiskContactsTable} from './ComponentsScreening';

import style from "./ProfilePositiveDialog.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfilePositiveDialog";

    constructor(props) {
        super(props, style);
    }

    title() {
        return "Positive Case";
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
        high_risk_contacts_num: null
    };
    
    constructor(props) {
        super(props);

        this.form = new Form();
    }

    async componentWillMount() {
        if(this.item) {
            const {employee: {id}, high_risk_contacts_num} = this.item.data;
            this.state.high_risk_contacts_num = high_risk_contacts_num;
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
            item, item: {id, data: {
                    business_id, employee_id, employee, sex, age, date, province, district, industry, job_category,
                    test_type, test_date, symptom_positive, high_risk_contacts_num, high_risk_contacts_list = [], vulnerability_status, positive_test_result_action, exposure_info,
                    reporting_action_del, reporting_action_coid, reporting_action_dmre,
                    illness_start_date, illness_type, illness_end_date,
                    client, project, site
            }}
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
                <ProfileField name="project" placeholder="Project" value={project} renderer={v => v.name || v.data.name} required className="col-lg-6"/>
                <ProfileField name="site" placeholder="Site" value={site} renderer={v => v.name || v.data.name} required className="col-lg-6"/>
            </Row>}
            {!showOnlyTable && <Row 
                rendered 
                idx={idx++}
                title={idx + ". Employee Details"}
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
                onFormNext={onFormNext}
            >
                <ProfileField ref="employee" name="employee" value={employee} renderer={v => v.fname + ' ' + v.lname} placeholder="Employee" required className="col-lg-12"/>
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
                title={idx + ". Positive Case Details"}
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
                onFormNext={onFormNext}
            >
                {!showOnlyTable && <React.Fragment>
                    <ProfileField name="date" type="date" value={date} placeholder="Date" required className="col-lg-12"/>
                    <ProfileField name="business_id" value={business_id} placeholder="Business ID" required className="col-lg-12"/>
                    <hr className="margin-0"/>
                </React.Fragment>}
                <ProfileField name="test_type" value={test_type} placeholder="Test Type" required className="col-lg-6"/>
                <ProfileField name="test_date" type="date" value={test_date} placeholder="Date Of Test" required className="col-lg-6"/>
                <ProfileField name="symptom_positive" value={symptom_positive} placeholder="Symptom Positive" required className="col-lg-6"/>
                <ProfileField name="vulnerability_status" type="radio" value={vulnerability_status} placeholder="Vulnerability Present" required className="col-lg-6"/>
                <ProfileField name="positive_test_result_action" value={positive_test_result_action} placeholder="Positive Test Result Action" required className="col-lg-12"/>
                <ProfileField name="exposure_info" value={exposure_info} placeholder="Exposure Information" required className="col-lg-12"/>
                
                <hr className="margin-0"/>
                <ProfileField name="illness_start_date" value={illness_start_date} placeholder="Illness Start Date" required className="col-lg-6"/>
                <ProfileField name="illness_end_date" value={illness_end_date} placeholder="Illness End Date" required className="col-lg-6"/>
                <ProfileField name="illness_type" value={illness_type} placeholder="Illness Type" required className="col-lg-12"/>
                
                <hr className="margin-0"/>    
                <ProfileField name="reporting_action_del" value={reporting_action_del} placeholder="Reporting Action (DEL)" footerDesc="DEL = Department of Employment and Labour" required className="col-lg-12"/>
                <ProfileField name="reporting_action_coid" value={reporting_action_coid} placeholder="Reporting Action (COID)" footerDesc="COID = " required className="col-lg-12"/>
                <ProfileField name="reporting_action_dmre" value={reporting_action_dmre} placeholder="Reporting Action (DMRE)" footerDesc="DMRE = " required className="col-lg-12"/>
            </Row>
            <Row 
                rendered 
                idx={idx++}
                title={idx + ". High Risk Contacts Details"}
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
            >
                <ProfileField name="high_risk_contacts_num" type="number" value={high_risk_contacts_num} placeholder="Number of High Risk Contacts" required className="col-lg-12"/>
                <hr className="margin-0"/>
                <NewHighRiskContactsTable name="high_risk_contacts_list" state={this.state} defaultValue={high_risk_contacts_list} readonly/>
            </Row>
        </FormControls>;
    }

}

export default ProfileDialog;
