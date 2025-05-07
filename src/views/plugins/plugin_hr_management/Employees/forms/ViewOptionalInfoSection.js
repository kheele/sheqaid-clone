import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {Row} from 'components/FormComponents';
import {ProfileField,} from 'components/inputs';
import LivingAddressSection from "./LivingAddressSection";
import BankingDetailsSection from "./BankingDetailsSection";
import NextOfKinSection from "./NextOfKinSection";
import DependantSection from "./DependantSection";
import EmployeeProfileSettings from "utils/EmployeeProfileSettings";
import AEmployeeSection from "./profile_forms/AEmployeeSection";

@observer
class ViewOptionalInfoSection extends AEmployeeSection {
    pageKey = "ViewOptionalInfoSection";

    @observable
    state = {};

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
                employment_date, employment_num,
            }
        } = item;

        const className = this.pageKey + "-tab" + (this.props.active ? ' active' : '');
        return <div id={this.pageKey + "-tab"} className={`${className} -margin-l-10 -margin-t-5 -margin-b-10`}>
            <div className="controls-wrapper controls-sectioned">
                <div className="controls pos-relative">
                    <Row
                        ref="employmentDetails"
                        rendered
                        idx={parseFloat(idx + ".1").toFixed(1)}
                        title={idx + ".1 Employment Details"}
                        onFormOpen={onFormOpen}
                        onFormNext={onFormNext}
                    >
                        <ProfileField name="employment_date" type="date" placeholder="Date of Employment"
                                      value={employment_date} className="col-lg-6"/>
                        <ProfileField name="employment_num" placeholder="Company No. / Employee ID"
                                      value={employment_num} className="col-lg-6"/>
                        <ProfileField name="department" type="select" placeholder="Department" value={department}
                                      renderer={val => val.name} className="col-lg-6"/>
                        <ProfileField name="job_position" type="select" placeholder="Job Position" value={job_position}
                                      renderer={val => val.name} className="col-lg-6"/>
                    </Row>
                    <Row
                        ref="supervisorDetails"
                        rendered
                        idx={parseFloat(idx + ".2").toFixed(1)}
                        title={idx + ".2 Supervisor Details"}
                        onFormOpen={onFormOpen}
                        onFormBack={onFormBack}
                        onFormNext={onFormNext}
                    >
                        <ProfileField name="supervisor" placeholder="Supervisor Name" value={supervisor}
                                      renderer={v => `${v.lname} ${v.fname}`} className="col-lg-12"/>
                        <ProfileField name="supervisor_phone" placeholder="Supervisor Phone No."
                                      value={supervisor && supervisor.phone} className="col-lg-6"/>
                        <ProfileField name="supervisor_email" type="email" placeholder="Supervisor Email Address"
                                      value={supervisor && supervisor.email} className="col-lg-6"/>
                    </Row>
                    {EmployeeProfileSettings.isEmployeeLivingAddressViewers(item) && <Row
                        ref="residentialAddress"
                        rendered
                        idx={parseFloat(idx + ".3").toFixed(1)}
                        title={idx + ".3 Residential Address"}
                        sectionClassName="h-440 -margin-l-10 -margin-t-5 -margin-b-10 w-full-calc-add-20"
                        onFormOpen={onFormOpen}
                        onFormBack={onFormBack}
                        onFormNext={onFormNext}
                    >
                        <LivingAddressSection item={item} isEmbedded/>
                    </Row>}
                    {EmployeeProfileSettings.isEmployeeBankingDetailsViewers(item) && <Row
                        ref="bankingDetails"
                        rendered
                        idx={parseFloat(idx + ".4").toFixed(1)}
                        title={idx + ".4 Banking Details"}
                        sectionClassName="h-370 -margin-l-10 -margin-t-5 -margin-b-10 w-full-calc-add-20"
                        onFormOpen={onFormOpen}
                        onFormNext={onFormNext}
                        onFormBack={onFormBack}
                    >
                        <BankingDetailsSection item={item} isEmbedded/>
                    </Row>}
                    {EmployeeProfileSettings.isValidEmployeeNextOfKinViewers(item) && <Row
                        ref="next_of_kins"
                        rendered
                        idx={parseFloat(idx + ".5").toFixed(1)}
                        title={idx + ".5 Next Of Kin"}
                        sectionClassName="h-380 -margin-l-10 -margin-t-5 -margin-b-10 w-full-calc-add-20"
                        onFormOpen={onFormOpen}
                        onFormNext={onFormNext}
                        onFormBack={onFormBack}
                    >
                        <NextOfKinSection item={item} isEmbedded/>
                    </Row>}
                    {EmployeeProfileSettings.isValidEmployeeDependantsViewers(item) && <Row
                        ref="dependants"
                        rendered
                        idx={parseFloat(idx + ".6").toFixed(1)}
                        title={idx + ".6 Dependant(s)"}
                        sectionClassName="h-300 -margin-l-10 -margin-t-5 -margin-b-10 w-full-calc-add-20"
                        onFormOpen={onFormOpen}
                        onFormBack={onFormBack}
                    >
                        <DependantSection item={item} isEmbedded/>
                    </Row>}
                </div>
            </div>
        </div>
    }
}

export default ViewOptionalInfoSection;
