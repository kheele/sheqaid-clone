import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {Row} from 'components/FormComponents';
import {ProfileField,} from 'components/inputs';
import LivingAddressSection from "./LivingAddressSection";
import BankingDetailsSection from "./BankingDetailsSection";

@observer
class ViewOptionalInfoSection extends React.Component {
    pageKey = "ViewOptionalInfoSection";
    
    @observable
    state = {
    };

    //<editor-fold desc="constructor">
    constructor(props) {
        super(props);
    }
    //</editor-fold>

    render() {
        const {onFormNext, onFormBack, onFormOpen, item, idx} = this.props;

        const {
            id,
            data: {
                department, job_position, supervisor,
                employment_date, employee_num,
            }
        } = item;
        
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
                        <ProfileField name="employment_date" type="date" placeholder="Date of Employment" value={employment_date} className="col-lg-6"/>
                        <ProfileField name="employee_num" placeholder="Company No. / Employee ID" value={employee_num} className="col-lg-6"/>
                        <ProfileField name="department" type="select" placeholder="Department" value={department} renderer={val => val.name} className="col-lg-6"/>
                        <ProfileField name="job_position" type="select" placeholder="Job Position" value={job_position} renderer={val => val.name} className="col-lg-6"/>
                    </Row>
                    <Row 
                        rendered 
                        idx={idx + ".2"} 
                        title={idx + ".2 Supervisor Details"}
                        onFormOpen={onFormOpen} 
                        onFormBack={onFormBack} 
                        onFormNext={onFormNext}
                    >
                        <ProfileField name="supervisor" placeholder="Supervisor Name" value={supervisor} renderer={v => `${v.lname} ${v.fname}`} className="col-lg-12"/>
                        <ProfileField name="supervisor_phone" placeholder="Supervisor Phone No." value={supervisor && supervisor.phone} className="col-lg-6"/>
                        <ProfileField name="supervisor_email" type="email" placeholder="Supervisor Email Address" value={supervisor && supervisor.email} className="col-lg-6"/>
                    </Row>
                    <Row 
                        rendered 
                        idx={idx + ".3"} 
                        title={idx + ".3 Living Address"}
                        sectionClassName="h-440 -margin-l-10 -margin-t-5 -margin-b-10 w-full-calc-add-20"
                        onFormOpen={onFormOpen} 
                        onFormBack={onFormBack} 
                        onFormNext={onFormNext}
                    >
	                    <LivingAddressSection item={item} isEmbedded/>
                    </Row>
                    <Row 
                        rendered 
                        idx={idx + ".4"} 
                        title={idx + ".4 Banking Details"}
                        sectionClassName="h-370 -margin-l-10 -margin-t-5 -margin-b-10 w-full-calc-add-20"
                        onFormOpen={onFormOpen} 
                        onFormBack={onFormBack} 
                    >
	                    <BankingDetailsSection item={item} isEmbedded/>
                    </Row>
                </div>
            </div>
        </div>
    }
}

export default ViewOptionalInfoSection;