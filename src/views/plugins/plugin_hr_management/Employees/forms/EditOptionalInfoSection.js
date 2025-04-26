import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import Form from 'utils/Form';
import {getGeocode} from 'utils/Maps';
import {execWhen, ShouldUpdate} from 'utils/Utils';

import {ClearableInput, SelectDepartmentInput, SelectEmployeeInput, SelectJobPositionInput} from 'components/inputs';
import {Row} from 'components/FormComponents';
import LivingAddressSection from "./LivingAddressSection";
import BankingDetailsSection from "./BankingDetailsSection";
import EmployeeProfileSettings from "utils/EmployeeProfileSettings";
import {updateEmployee} from "mutations/update";
import NextOfKinSection from "./NextOfKinSection";
import DependantSection from "./DependantSection";
import AEmployeeSection from "./profile_forms/AEmployeeSection";

@observer
class EditOptionalInfoSection extends AEmployeeSection {
    pageKey = "EditOptionalInfoSection";

    //<editor-fold desc="constructor">
    constructor(props) {
        super(props);

        this.form = new Form();
        this.form.addChangeOne("supervisor", this.onChangeEmployee.bind(this));
    }

    //</editor-fold>

    //<editor-fold desc="formData">
    get formData() {
        return this.form.data;
        // const {data} = this.form;
        // let {
        //     //
        //     employment_date,
        //     employment_num,
        //     department,
        //     job_position,
        //     //
        //     supervisor,
        //     supervisor_phone,
        //     supervisor_email,
        //     //
        //     living_address_list,
        //     //
        //     banking_detail_list,
        // } = data;
        //
        // return {
        //     //
        //     employment_date: Dates.formatDateSQL(employment_date),
        //     employment_num,
        //     job_position_id: job_position && job_position.id,
        //     department_id: department && department.id,
        //     //
        //     supervisor_id: supervisor && supervisor.id,
        //
        //     living_address_list: {
        //         data: (living_address_list || []).map((
        //             {
        //                 country,
        //                 zone,
        //                 city,
        //                 local_address,
        //                 street_address,
        //                 doc
        //             }
        //         ) => ({
        //             is_default: true,
        //             //1
        //             country_id: country.id,
        //             zone_id: zone.id,
        //             city_id: city.id,
        //             local_address,
        //             street_address,
        //             //2
        //             doc: doc && doc.path,
        //         }))
        //     },
        //     banking_detail_list: {
        //         data: (banking_detail_list || []).map(({name, branch, code, account_num, doc}) => ({
        //             is_default: true,
        //             //1
        //             name,
        //             branch,
        //             code,
        //             account_num,
        //             //2
        //             doc: doc && doc.path,
        //         }))
        //     },
        // }
    }

    @computed get itemData() {
        const {item} = this.props;
        return item && item.data || {};
    }

    //</editor-fold>

    onSubmit(btn) {
        const {
            formData,
            // itemData,
            props: {item: {id, data: old_data}},
        } = this;

        const {
            employment_date,
            employment_num,
            job_position,
            department,
            //
            supervisor,
        } = formData;

        const data = {};

        console.log('old_data', old_data);

        ShouldUpdate.checkDate(data, old_data, employment_date, 'employment_date');
        ShouldUpdate.check(data, old_data, employment_num, 'employment_num');
        ShouldUpdate.checkDepartment(data, old_data, department, 'department_id');
        ShouldUpdate.checkJobPosition(data, old_data, job_position, 'job_position_id');
        //
        ShouldUpdate.checkEmployee(data, old_data, supervisor, 'supervisor_id');
        if (supervisor) {
            // const {data: {phone, email}} = supervisor;
            // if (phone) {
            //     ShouldUpdate.check(data, old_data, supervisor_phone, 'supervisor_phone');
            // }
            // if (email) {
            //     ShouldUpdate.check(data, old_data, supervisor_email, 'supervisor_email');
            // }
        }

        if (Object.keys(data).isEmpty()) {
            infoDialog.open("Nothing changed!");
            return;
        }

        console.log(data)

        btn.text("Saving...").disabled();
        progressDialog.open();
        updateEmployee({id, ...data}).then(res => {
            console.log("res", res)
            if (!res) {
                infoDialog.open("An error occurred. Please try again.");
            } else {
                const res_data = res;
                // onSaved && onSaved(res_data);
                infoDialog.open("Record successfully updated.");
                infoDialog.close(2000);
                // this.props.close();
            }
        }).finally(() => {
            btn.text("Save").enabled();
            setTimeout(() => progressDialog.close());
        });
    }

    //</editor-fold>

    //<editor-fold desc="componentDidMount">
    componentDidMount() {
        execWhen(() => this.refs.living_addr_country &&
            this.refs.living_addr_province &&
            this.refs.living_addr_city
        ).then(() => {
            const {
                living_addr_country: country_ref,
                living_addr_province: province_ref,
                living_addr_city: city_ref,
            } = this.refs;
            const {
                item: {
                    data: {living_address_list}
                }
            } = this.props;
            if (living_address_list && living_address_list.anyMatch) {
                if (living_address_list.anyMatch(v => v.zone)) {
                    return;
                }
            }
            getGeocode().then(res => {
                const {city, region, country} = res;
                country_ref.onChange(country);
                province_ref.onChange(region);
                city_ref.onChange(city);
            }).catch(err => {
                console.error(err)
            });
        });
    }

    //<editor-fold desc="onChangeEmployee">
    onChangeEmployee(el, val) {
        execWhen(() => this.refs.supervisorDetailsContacts).then(supervisorDetailsContacts => {
            if (val && val.data) {
                supervisorDetailsContacts.supervisor = val;
                return;
            }
            supervisorDetailsContacts.supervisor = null;
        });
    }

    //<editor-fold desc="render">
    render() {
        const {onFormNext, onFormBack, onFormOpen, onFormSave, item, idx} = this.props;

        let {
            id,
            department, job_position, supervisor,
            employment_date, employment_num,
        } = (item && item.data) || {};

        const isNewEmployee = !id;

        const className = this.pageKey + "-tab" + (this.props.active ? ' active' : '');
        return <div id={this.pageKey + "-tab"} className={className}>
            <div className="controls-wrapper controls-sectioned">
                <div className="controls">
                    <Row
                        ref="employmentDetails"
                        active
                        rendered
                        idx={parseFloat(idx + ".1").toFixed(1)}
                        title={idx + ".1 Employment Details"}
                        onFormOpen={onFormOpen}
                        onFormNext={onFormNext}
                        onFormSave={onFormSave}
                    >
                        <ClearableInput name="employment_date" type="date" placeholder="Date of Employment..."
                                        defaultValue={employment_date} required className="col-lg-12 form-control"
                                        onChange={this.form.onChange}/>
                        <ClearableInput name="employment_num" type="text" placeholder="Company No. / Employee ID"
                                        defaultValue={employment_num} className="col-lg-12 form-control"
                                        onChange={this.form.onChange}/>
                        <SelectDepartmentInput name="department" placeholder="Department..." defaultValue={department}
                                               className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <SelectJobPositionInput name="job_position" placeholder="Job Position..."
                                                defaultValue={job_position} className="col-lg-12 form-control"
                                                onChange={this.form.onChange}/>
                    </Row>
                    <Row
                        ref="supervisorDetails"
                        rendered
                        idx={parseFloat(idx + ".2").toFixed(1)}
                        title={idx + ".2 Supervisor Details"}
                        onFormOpen={onFormOpen}
                        onFormNext={onFormNext}
                        onFormBack={onFormBack}
                        onFormSave={onFormSave}
                    >
                        <SelectEmployeeInput name="supervisor" placeholder="Supervisor Name..."
                                             defaultValue={supervisor} className="col-lg-12 form-control"
                                             onChange={this.form.onChange}/>
                        <SupervisorDetails ref="supervisorDetailsContacts" onChange={this.form.onChange}/>
                    </Row>
                    {EmployeeProfileSettings.isEmployeeLivingAddressViewers(item) && <Row
                        ref="residentialAddress"
                        rendered
                        idx={parseFloat(idx + ".3").toFixed(1)}
                        title={idx + ".3 Residential Address"}
                        sectionClassName="h-440 -margin-l-10 -margin-t-5 -margin-b-10 w-full-calc-add-20"
                        onFormOpen={onFormOpen}
                        onFormNext={onFormNext}
                        onFormBack={onFormBack}
                    >
                        <LivingAddressSection item={item} isNewEmployee={isNewEmployee} isEmbedded
                                              onChange={this.form.onChange}/>
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
                        <BankingDetailsSection item={item} isNewEmployee={isNewEmployee} isEmbedded
                                               onChange={this.form.onChange}/>
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
                        <NextOfKinSection item={item} isNewEmployee={isNewEmployee} isEmbedded
                                          onChange={this.form.onChange}/>
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
                        <DependantSection item={item} isNewEmployee={isNewEmployee} isEmbedded
                                          onChange={this.form.onChange}/>
                    </Row>}
                </div>
            </div>
        </div>
    }

    //</editor-fold>
}


@observer
class SupervisorDetails extends React.Component {
    @observable supervisor = null;

    render() {
        const {supervisor} = this;
        const {onChange} = this.props;

        const {phone, email} = (supervisor || {}).data || {};

        return <>
            <ClearableInput key={new Date().getTime() + 1} name="supervisor_phone" type="text"
                            placeholder="Supervisor Phone No." defaultValue={phone}
                            className="col-lg-12 form-control" onChange={onChange}/>
            <ClearableInput key={new Date().getTime() + 2} name="supervisor_email" type="email"
                            placeholder="Supervisor Email Address"
                            defaultValue={email} className="col-lg-12 form-control"
                            onChange={onChange}/>
        </>;
    }
}

export default EditOptionalInfoSection;
