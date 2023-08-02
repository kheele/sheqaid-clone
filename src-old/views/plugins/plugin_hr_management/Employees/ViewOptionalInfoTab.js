import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {Row} from '../../../../components/FormComponents';
import {ProfileField, UploadButton} from '../../../../components/inputs';

@observer
class OptionalInfoTab extends React.Component {
    pageKey = "OptionalInfoTab";
    
    @observable
    state = {
    };

    constructor(props) {
        super(props);
    }
    
    render() {
        const {
            onFormNext, onFormBack, onFormOpen,
            item: {
                id, data: {
                    optional_info = {}
                }
            },
            idx
        } = this.props;
        
        const {
            employment_date, employee_num, department, job_position,
            supervisor_name, supervisor_phone, supervisor_email,
            living_addr_street, living_addr_local_area, living_addr_city, living_addr_province, living_addr_doc,
            banking_name, banking_branch, banking_branch_code, banking_account_num, banking_doc
        } = optional_info;
        
        const className = this.pageKey + "-tab" + (this.props.active ? ' active' : '');
        return <div id={this.pageKey + "-tab"} className={className}>
            <div className="controls-wrapper controls-sectioned">
                <div className="controls pos-relative">
                    <Row 
                        rendered 
                        idx={idx + ".1"} 
                        title={idx + ".1 Employment Details"}  
                        onFormOpen={onFormOpen} 
                        onFormNext={onFormNext}
                    >
                        <ProfileField name="employment_date" type="date" placeholder="Date of Employment" value={employment_date} required className="col-lg-6"/>
                        <ProfileField name="employee_num" placeholder="Company No. / Employee ID" value={employee_num} className="col-lg-6"/>
                        <ProfileField name="department" type="select" placeholder="Department" value={department} renderer={val => val.name || val.data.name} className="col-lg-6"/>
                        <ProfileField name="job_position" type="select" placeholder="Job Position" value={job_position} renderer={val => val.name || val.data.name} className="col-lg-6"/>
                    </Row>
                    <Row 
                        rendered 
                        idx={idx + ".2"} 
                        title={idx + ".2 Supervisor"}  
                        onFormOpen={onFormOpen} 
                        onFormBack={onFormBack} 
                        onFormNext={onFormNext}
                    >
                        <ProfileField name="supervisor_name" placeholder="Supervisor Name" value={supervisor_name} renderer={v => v.data ? (v.data.fname + ' ' + v.data.lname) : (v.fname + ' ' + v.lname)} className="col-lg-12"/>
                        <ProfileField name="supervisor_phone" placeholder="Supervisor Phone No." value={supervisor_phone} className="col-lg-6"/>
                        <ProfileField name="supervisor_email" type="email" placeholder="Supervisor Email Address" value={supervisor_email} className="col-lg-6"/>
                    </Row>
                    <Row 
                        rendered 
                        idx={idx + ".3"} 
                        title={idx + ".3 Living Address"}  
                        onFormOpen={onFormOpen} 
                        onFormBack={onFormBack} 
                        onFormNext={onFormNext}
                    >
                        <ProfileField name="living_addr_street" placeholder="Street Address" value={living_addr_street} required className="col-lg-6"/>
                        <ProfileField name="living_addr_local_area" placeholder="Local Area" value={living_addr_local_area} required className="col-lg-6"/>
                        <ProfileField name="living_addr_city" placeholder="City" value={living_addr_city} required className="col-lg-6"/>
                        <ProfileField name="living_addr_province" placeholder="Province" value={living_addr_province} required className="col-lg-6"/>
                        <UploadButton 
                            name="living_addr_doc" 
                            defaultValue={living_addr_doc}
                            buttonTitle="Address" 
                            type={['PDF', 'Word', 'Image']}
                            showOnlyIcon 
                            readonly
                            className="ProfileField col-lg-6 pull-left-3"
                        />
                    </Row>
                    <Row 
                        rendered 
                        idx={idx + ".4"} 
                        title={idx + ".4 Banking Details"}  
                        onFormOpen={onFormOpen} 
                        onFormBack={onFormBack} 
                    >
                        <ProfileField name="banking_name" placeholder="Bank Name" value={banking_name} required className="col-lg-6"/>
                        <ProfileField name="banking_branch" placeholder="Branch" value={banking_branch} required className="col-lg-6"/>
                        <ProfileField name="banking_branch_code" placeholder="Branch Code" value={banking_branch_code} required className="col-lg-6"/>
                        <ProfileField name="banking_account_num" type="number" placeholder="Account No." value={banking_account_num} required className="col-lg-6"/>
                        <UploadButton 
                            name="banking_doc" 
                            defaultValue={banking_doc}
                            buttonTitle="Banking Details" 
                            type={['PDF', 'Word', 'Image']}
                            showOnlyIcon 
                            readonly
                            className="ProfileField col-lg-6 pull-left-3"
                        />
                    </Row>
                </div>
            </div>
        </div>
    }
}

export default OptionalInfoTab;