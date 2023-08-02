import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from '../../../../utils/Form';
import {getGeocode} from '../../../../utils/Maps';
import {execWhen} from '../../../../utils/Utils';

import {
    ClearableInput,
    ProofUploadButton,
    SelectDepartmentInput,
    SelectEmployeeInput,
    SelectJobPositionInput
} from '../../../../components/inputs';
import {Row} from '../../../../components/FormComponents';

@observer
class NewDialogOptionalInfoTab extends React.Component {
    pageKey = "NewDialogOptionalInfoTab";
    
    @observable state = {
        lists: {
            provinces: ['Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal', 'Limpopo', 'Mpumalanga', 'North West', 'Northern Cape', 'Western Cape']
        }
    }

    constructor(props) {
        super(props);
                
        this.form = new Form();
        this.onChangeEmployee = this.onChangeEmployee.bind(this);
        this.form.addChangeOne("supervisor_name", this.onChangeEmployee);
    }
    
    componentDidMount() {
        execWhen(() => this.refs.living_addr_province).then(province_ref => {
            const {optional_info} = this.props;
            if(optional_info) {
                if(optional_info.living_addr_province) {
                    return;
                }
            }
            getGeocode().then(res => {
                const {region, country} = res;
                province_ref.onChange(region);
            }).catch(err => {
                console.error(err)
            });
        });
    }

    onChangeEmployee(el, val) {
        execWhen(() => this.refs.supervisor_phone && this.refs.supervisor_email).then(() => {
            const {
                supervisor_phone: supervisor_phone_ref, supervisor_email: supervisor_email_ref
            } = this.refs;
            if(val) {
                if(val.data) {
                    const {phone, email} = val.data;
                    phone && supervisor_phone_ref.onChange(phone);
                    email && supervisor_email_ref.onChange(email);
                }
            } else {
                supervisor_phone_ref.reset();
                supervisor_email_ref.reset();
            }
        });
    }
    
    render() {
        const {onFormNext, onFormBack, onFormOpen, optional_info} = this.props;
        
        let defaultDepartment, defaultJobPosition, defaultSupervisor;
        if(optional_info) {
            const {department, job_position, supervisor_name} = optional_info;
            if(department) {
                const {id, data, name} = department;
                defaultDepartment = {label: name || data.name, value: department};
            }
            if(job_position) {
                const {id, data, name} = job_position;
                defaultJobPosition = {label: name || data.name, value: job_position};
            }
            if(supervisor_name) {
                const {id, data, fname, lname} = supervisor_name;
                defaultSupervisor = {label: data ? (data.lname + ' ' + data.fname) : (lname + ' ' + fname), value: supervisor_name};
            }
        }
        
        const className = this.pageKey + "-tab" + (this.props.active ? ' active' : '');
        return <div id={this.pageKey + "-tab"} className={className}>
            <div className="controls-wrapper controls-sectioned">
                <div className="controls">
                    <Row 
                        active
                        rendered 
                        idx={4.1}
                        title="4.1. Employment Details" 
                        onFormOpen={onFormOpen} 
                        onFormNext={onFormNext}
                    >
                        <ClearableInput name="employment_date" type="date" placeholder="Date of Employment..." defaultValue={optional_info && optional_info.employment_date} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="employee_num" type="text" placeholder="Company No. / Employee ID" defaultValue={optional_info && optional_info.employee_num} className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <SelectDepartmentInput name="department" placeholder="Department..." defaultValue={defaultDepartment} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <SelectJobPositionInput name="job_position" placeholder="Job Position..." defaultValue={defaultJobPosition} required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    </Row>
                    <Row 
                        rendered 
                        idx={4.2}
                        title="4.2. Supervisor Details" 
                        onFormOpen={onFormOpen} 
                        onFormNext={onFormNext}
                        onFormBack={onFormBack} 
                    >
                        <SelectEmployeeInput name="supervisor_name" placeholder="Supervisor Name..." defaultValue={defaultSupervisor} className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <ClearableInput ref="supervisor_phone" name="supervisor_phone" type="text" placeholder="Supervisor Phone No." defaultValue={optional_info && optional_info.supervisor_phone} className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <ClearableInput ref="supervisor_email" name="supervisor_email" type="email" placeholder="Supervisor Email Address" defaultValue={optional_info && optional_info.supervisor_email} className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    </Row>
                    <Row 
                        rendered 
                        idx={4.3}
                        title="4.3. Living Address" 
                        onFormOpen={onFormOpen} 
                        onFormNext={onFormNext}
                        onFormBack={onFormBack} 
                    >
                        <ClearableInput name="living_addr_street" type="text" placeholder="Street Address" defaultValue={optional_info && optional_info.living_addr_street} required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="living_addr_local_area" type="text" placeholder="Local Area" defaultValue={optional_info && optional_info.living_addr_local_area} required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="living_addr_city" type="text" placeholder="City" defaultValue={optional_info && optional_info.living_addr_city} required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                        <ClearableInput ref="living_addr_province" name="living_addr_province" type="select" placeholder="Province..." defaultValue={optional_info && optional_info.living_addr_province} required className="col-lg-6 form-control" onChange={this.form.onChange} values={this.state.lists.provinces} returnValue/>
                        <ProofUploadButton name="living_addr_doc" buttonTitle="Upload Address (PDF/Image)" defaultValue={optional_info && optional_info.living_addr_doc} className="col-lg-12 margin-b-10 margin-r-10 min-h-870" onChange={this.form.onChange}/>
                    </Row>
                    <Row 
                        rendered 
                        idx={4.4}
                        title="4.4. Banking Details" 
                        onFormOpen={onFormOpen} 
                        onFormBack={onFormBack} 
                    >
                        <ClearableInput name="banking_name" type="text" placeholder="Bank Name" defaultValue={optional_info && optional_info.banking_name} required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="banking_branch" type="text" placeholder="Branch" defaultValue={optional_info && optional_info.banking_branch} required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="banking_branch_code" type="text" placeholder="Branch Code" defaultValue={optional_info && optional_info.banking_branch_code} required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="banking_account_num" type="number" placeholder="Account No." defaultValue={optional_info && optional_info.banking_account_num} required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                        <ProofUploadButton name="banking_doc" buttonTitle="Upload Banking Details (PDF/Image)" defaultValue={optional_info && optional_info.banking_doc} className="col-lg-12 margin-b-10 margin-r-10 min-h-870" onChange={this.form.onChange}/>
                    </Row>
                </div>
            </div>
        </div>
    }
}

export default NewDialogOptionalInfoTab;