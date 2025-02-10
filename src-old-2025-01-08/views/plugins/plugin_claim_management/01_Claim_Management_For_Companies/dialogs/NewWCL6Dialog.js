// <editor-fold defaultstate="collapsed" desc="import">
import React from "react";
import {observer} from 'mobx-react';
import {observable, toJS} from 'mobx';

import Form from 'utils/Form';
import {Dates, execWhen, setDefaultVal, ShouldUpdate} from 'utils/Utils';

import {ClearableInput, DateRangeInput, SelectEmployeeInput} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import {ANewDialog} from 'components/dialogs';

import {OffAndLightDutyPeriodTable} from '../../dialogs/ClaimForms';

import style from "./NewWCL6Dialog.lazy.css";
import updateClaimsClient from "mutations/all/COIDA/ClaimsClient/updateClaimsClient";
import updateWCL6 from "mutations/all/COIDA/WCL6/updateWCL6";
import insertAnnexture1 from "mutations/all/COIDA/Annexture1/insertAnnexture1";
import insertWCL6 from "mutations/all/COIDA/WCL6/insertWCL6";
import findByIdWCL2 from "mutations/all/COIDA/WCL2/findByIdWCL2";
import findByIdWCL6 from "mutations/all/COIDA/WCL6/findByIdWCL6";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class NewWCL6Dialog extends ANewDialog {
    pageKey = "NewWCL6Dialog";
    title = "Create/Edit W.CI.6";

    constructor(props) {
        super(props, style);
    }

    //<editor-fold desc="convert_data">
    convert_data(_formData) {
        const {
            //
            totalFieldCount,
            totalFieldMax,

            //1. General Details
            claim_number,
            accident_date,

            //2. Employer Details
            company_name,
            company_str_addr,
            company_str_addr_code,

            //3. Employee Details
//            employee,
            id_num,
            employee_str_addr,
            employee_str_addr_code,

            //4. Accident Details
            periods_employee_off_duty,
            periods_employee_light_duty,
            employee_light_duty_available_and_offered,
            employee_perform_recommended_light_duty,
            employee_perform_recommended_light_duty_not_performed_reason,
            employee_perform_recommended_light_duty_performed_percentage,
            employee_still_in_your_employment,
            employee_left_my_service_date,
            employee_present_address,
            employee_receive_free_food_range,
            employee_receive_free_quarters_range,
            period_detained_in_hospital_range,

            //5. Employer's Declaration
            employer_signature,
            employer_signature_name,
            employer_signature_date
        } = _formData;

        return {
            totalFieldCount,
            totalFieldMax,
            //1. General Details
            claim_number,
            accident_date: Dates.formatDateSQL(accident_date),

            //2. Employer Details
            company_name,
            company_str_addr,
            company_str_addr_code,

            //3. Employee Details
//            employee,
            id_num,
            employee_str_addr,
            employee_str_addr_code,

            //4. Accident Details
            periods_employee_off_duty: periods_employee_off_duty && periods_employee_off_duty.map((
                {
                    date_from,
                    time_from,
                    date_to,
                    time_to,
                    amount,
                }
            ) => {
                return {
                    date_from: Dates.formatDateSQL(date_from),
                    time_from,
                    date_to: Dates.formatDateSQL(date_to),
                    time_to,
                    amount
                };
            }).slice(),
            periods_employee_light_duty: periods_employee_light_duty && periods_employee_light_duty.map((
                {
                    date_from,
                    time_from,
                    date_to,
                    time_to,
                    amount,
                }
            ) => {
                return {
                    date_from: Dates.formatDateSQL(date_from),
                    time_from,
                    date_to: Dates.formatDateSQL(date_to),
                    time_to,
                    amount
                };
            }).slice(),
            employee_light_duty_available_and_offered,
            employee_perform_recommended_light_duty,
            employee_perform_recommended_light_duty_not_performed_reason,
            employee_perform_recommended_light_duty_performed_percentage,
            employee_still_in_your_employment,
            employee_left_my_service_date: Dates.formatDateSQL(employee_left_my_service_date),
            employee_present_address,

            employee_receive_free_food_range: employee_receive_free_food_range && {
                date_from: Dates.formatDateSQL(employee_receive_free_food_range.start),
                date_to: Dates.formatDateSQL(employee_receive_free_food_range.end),
            } || null,
            employee_receive_free_quarters_range: employee_receive_free_quarters_range && {
                date_from: Dates.formatDateSQL(employee_receive_free_quarters_range.start),
                date_to: Dates.formatDateSQL(employee_receive_free_quarters_range.end),
            } || null,
            period_detained_in_hospital_range: period_detained_in_hospital_range && {
                date_from: Dates.formatDateSQL(period_detained_in_hospital_range.start),
                date_to: Dates.formatDateSQL(period_detained_in_hospital_range.end),
            } || null,

            //5. Employer's Declaration
            employer_signature: employer_signature && toJS(employer_signature),
            employer_signature_name,
            employer_signature_date: Dates.formatDateSQL(employer_signature_date)
        };
    }

    //</editor-fold>

    get controls() {
        return Controls;
    }
}

// </editor-fold>

@observer
class Controls extends React.Component {

    // <editor-fold defaultstate="collapsed" desc="fields">
    @observable
    state = {
        lists: {
            employee_light_duty_available_and_offered: ['Yes', 'No'].map(text => {
                return {value: text, text, checked: false};
            }),
            employee_perform_recommended_light_duty: ['Yes', 'No'].map(text => {
                return {value: text, text, checked: false};
            }),
            employee_still_in_your_employment: ['Yes', 'No'].map(text => {
                return {value: text, text, checked: false};
            })
        },
        countFields: {}
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor() {
        super();

        this.onNext = this.onNext.bind(this);

        this.onCountFields = this.onCountFields.bind(this);

        this.form = new Form();
        this.form.addChangeOne("employee", this.onChangeEmployee.bind(this));
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="mounts">
    componentDidMount() {
        const setDefaultValue = setDefaultVal.bind(this);

        const {dialog} = this.props;
        dialog.setTitle(this.item ? 'Edit W.CI.6' : 'Create W.CI.6');

        const employer_details = dialog.extraProp('employer_details');
        const employee = dialog.extraProp('employee');
        const claim_number = dialog.extraProp('claim_number');
        const accident_date = dialog.extraProp('accident_date');

        //1. General Details
        setDefaultValue('claim_number', () => claim_number);
        setDefaultValue('accident_date', () => accident_date);

        //2. Employer Details
        if (employer_details) {
            const {data: {company_name}} = employer_details;
            setDefaultValue('company_name', (v) => v || company_name);
        } else {
            setDefaultValue('company_name');
        }

        //3. Employee Details
        setDefaultValue('employee', () => {
            if (!employee) return false;
            const {lname, fname, data} = employee;
            return {label: `${lname || data.lname} ${fname || data.fname}`, value: employee};
        });
        setDefaultValue('id_num', (id_num) => id_num || (employee && employee.data && employee.data.id_num));

        const setEmployerDetails = employer_details => {
            const {
                data: {
                    company_str_addr,
                    company_str_addr_code
                }
            } = employer_details;

            setDefaultValue('company_str_addr', (v) => v || company_str_addr);
            setDefaultValue('company_str_addr_code', (v) => v || company_str_addr_code);
        };

        if (this.item) {
            //2. Employer Details
            if (employer_details) {
                setEmployerDetails(employer_details);
            } else {
                setDefaultValue('company_str_addr');
                setDefaultValue('company_str_addr_code');
            }

            //3. Employee Details
            setDefaultValue('employee_str_addr');
            setDefaultValue('employee_str_addr_code');

            //4. Accident Details
            setDefaultValue('periods_employee_off_duty');
            setDefaultValue('periods_employee_light_duty');
            setDefaultValue('employee_light_duty_available_and_offered');
            setDefaultValue('employee_perform_recommended_light_duty');
            setDefaultValue('employee_perform_recommended_light_duty_not_performed_reason');
            setDefaultValue('employee_perform_recommended_light_duty_performed_percentage');
            setDefaultValue('employee_still_in_your_employment');
            setDefaultValue('employee_left_my_service_date');
            setDefaultValue('employee_present_address');
            setDefaultValue('employee_receive_free_food_range');
            setDefaultValue('employee_receive_free_quarters_range');
            setDefaultValue('period_detained_in_hospital_range');

            //5. Employer's Declaration
            setDefaultValue('employer_signature');
            setDefaultValue('employer_signature_name');
            setDefaultValue('employer_signature_date');
        } else {
            if (employer_details) {
                setEmployerDetails(employer_details);
            }
        }
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onChange funs">
    onCountFields({count, max}, idx) {
        const {state: {countFields}} = this;
        countFields[idx] = {count, max};
    }

    onChangeEmployee(el, val) {
        execWhen(() => this.refs.id_num).then(id_num_ref => {
            if (val) {
                let {id_num} = val.data;
                id_num && id_num_ref.onChange(id_num);
            }
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onNext">
    onNext(e, btn) {
        const {form} = this;
        const {idx} = btn.props;
        if (idx === 1) {
            if (!form.isValid('claim_number')) {
                infoDialog.open('Claim Number is required');
                return;
            }
            if (!form.isValid('accident_date')) {
                infoDialog.open('Date of Accident is required');
                return;
            }
        }
        if (idx === 2) {
            if (!form.isValid('company_name')) {
                infoDialog.open('Name of employer is required');
                return;
            }
            if (!form.isValid('company_str_addr')) {
                infoDialog.open('Employer Street Address is required');
                return;
            }
            if (!form.isValid('company_str_addr_code')) {
                infoDialog.open('Employer Postal Code is required');
                return;
            }
        }
        if (idx === 3) {
            if (!form.isValid('employee')) {
                infoDialog.open('Employee is required');
                return;
            }
            if (!form.isValid('id_num')) {
                infoDialog.open('Employee Identity Number is required');
                return;
            }
            if (!form.isValid('employee_str_addr')) {
                infoDialog.open('Employee Street Address is required');
                return;
            }
            if (!form.isValid('employee_str_addr_code')) {
                infoDialog.open('Employee Postal Code is required');
                return;
            }
        }
        if (idx === 4) {
        }
        if (idx === 5) {
        }

        return true;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    onSubmit(e, btn, onSaved) {
        const {form, isNew, claim, convert_data, totalFieldCount, totalFieldMax} = this;

        const {
            //1. General Details
            claim_number,
            accident_date,

            //2. Employer Details
            company_name,
            company_str_addr,
            company_str_addr_code,

            //3. Employee Details
//            employee,
            id_num,
            employee_str_addr,
            employee_str_addr_code,

            //4. Accident Details
            periods_employee_off_duty,
            periods_employee_light_duty,
            employee_light_duty_available_and_offered,
            employee_perform_recommended_light_duty,
            employee_perform_recommended_light_duty_not_performed_reason,
            employee_perform_recommended_light_duty_performed_percentage,
            employee_still_in_your_employment,
            employee_left_my_service_date,
            employee_present_address,
            employee_receive_free_food_range,
            employee_receive_free_quarters_range,
            period_detained_in_hospital_range,

            //5. Employer's Declaration
            employer_signature,
            employer_signature_name,
            employer_signature_date
        } = form.data;

        if (isNew) {
            const data = {...form.data, totalFieldCount, totalFieldMax};
            console.log("res", data)

            if (claim && claim.id) {
                btn.text("Saving...").disabled();
                progressDialog.open();
                insertWCL6(convert_data(data)).then(res => {
                    if(res) {
                        return updateClaimsClient({id: claim.id, wcl_6_id: res.id}).then(_ => res)
                    }
                }).
                then(res => res && findByIdWCL6(res.id)).
                then(res => {
                    console.log("res", res)
                    if(!res) {
                        return infoDialog.open("Record couldn't be updated. Please try again.");
                    }

                    onSaved && onSaved(res.data);
                    infoDialog.open("Record successfully updated.");
                    infoDialog.close(2000);
                    this.props.close();
                }).finally(() => {
                    btn.text("Save").enabled();
                    setTimeout(() => progressDialog.close())
                });
            } else {
                onSaved(data);
                this.props.close();
            }
        } else {
            const {data: old_data} = this.item;
            const data = {};

            //1. General Details
            ShouldUpdate.check(data, old_data, claim_number, 'claim_number');
            ShouldUpdate.checkDate(data, old_data, accident_date, 'accident_date');

            //2. Employer Details
            ShouldUpdate.check(data, old_data, company_name, 'company_name');
            ShouldUpdate.check(data, old_data, company_str_addr, 'company_str_addr');
            ShouldUpdate.check(data, old_data, company_str_addr_code, 'company_str_addr_code');

            //3. Employee Details
            //employee,
            ShouldUpdate.check(data, old_data, id_num, 'id_num');
            ShouldUpdate.check(data, old_data, employee_str_addr, 'employee_str_addr');
            ShouldUpdate.check(data, old_data, employee_str_addr_code, 'employee_str_addr_code');

            //4. Accident Details
            ShouldUpdate.checkListToJS(data, old_data, periods_employee_off_duty, 'periods_employee_off_duty');
            ShouldUpdate.checkListToJS(data, old_data, periods_employee_light_duty, 'periods_employee_light_duty');
            ShouldUpdate.check(data, old_data, employee_light_duty_available_and_offered, 'employee_light_duty_available_and_offered');
            ShouldUpdate.check(data, old_data, employee_perform_recommended_light_duty, 'employee_perform_recommended_light_duty');
            ShouldUpdate.check(data, old_data, employee_perform_recommended_light_duty_not_performed_reason, 'employee_perform_recommended_light_duty_not_performed_reason');
            ShouldUpdate.check(data, old_data, employee_perform_recommended_light_duty_performed_percentage, 'employee_perform_recommended_light_duty_performed_percentage');
            ShouldUpdate.check(data, old_data, employee_still_in_your_employment, 'employee_still_in_your_employment');
            ShouldUpdate.checkDate(data, old_data, employee_left_my_service_date, 'employee_left_my_service_date');
            ShouldUpdate.check(data, old_data, employee_present_address, 'employee_present_address');
            if (employee_receive_free_food_range) {
                const {start, end} = employee_receive_free_food_range;
                const new_employee_receive_free_food_range = {};
                const {employee_receive_free_food_range: old_employee_receive_free_food_range} = old_data;
                ShouldUpdate.checkDate(new_employee_receive_free_food_range, old_employee_receive_free_food_range, start, 'date_from');
                ShouldUpdate.checkDate(new_employee_receive_free_food_range, old_employee_receive_free_food_range, end, 'date_to');
                if (!Object.keys(new_employee_receive_free_food_range).isEmpty()) {
                    data.employee_receive_free_food_range = new_employee_receive_free_food_range;
                }
            }
            if (employee_receive_free_quarters_range) {
                const {start, end} = employee_receive_free_quarters_range;
                const new_employee_receive_free_quarters_range = {};
                const {employee_receive_free_quarters_range: old_employee_receive_free_quarters_range} = old_data;
                ShouldUpdate.checkDate(new_employee_receive_free_quarters_range, old_employee_receive_free_quarters_range, start, 'date_from');
                ShouldUpdate.checkDate(new_employee_receive_free_quarters_range, old_employee_receive_free_quarters_range, end, 'date_to');
                if (!Object.keys(new_employee_receive_free_quarters_range).isEmpty()) {
                    data.employee_receive_free_quarters_range = new_employee_receive_free_quarters_range;
                }
            }
            if (period_detained_in_hospital_range) {
                const {start, end} = period_detained_in_hospital_range;
                const new_period_detained_in_hospital_range = {};
                const {period_detained_in_hospital_range: old_period_detained_in_hospital_range} = old_data;
                ShouldUpdate.checkDate(new_period_detained_in_hospital_range, old_period_detained_in_hospital_range, start, 'date_from');
                ShouldUpdate.checkDate(new_period_detained_in_hospital_range, old_period_detained_in_hospital_range, end, 'date_to');
                if (!Object.keys(new_period_detained_in_hospital_range).isEmpty()) {
                    data.period_detained_in_hospital_range = new_period_detained_in_hospital_range;
                }
            }

            //5. Employer's Declaration
            ShouldUpdate.checkSignature(data, old_data, employer_signature, 'employer_signature');
            ShouldUpdate.check(data, old_data, employer_signature_name, 'employer_signature_name');
            ShouldUpdate.checkDate(data, old_data, employer_signature_date, 'employer_signature_date');

            if (Object.keys(data).isEmpty()) {
                infoDialog.open("Nothing changed!");
                return;
            }

            //count fields
            ShouldUpdate.check(data, old_data, totalFieldCount, 'totalFieldCount');
            ShouldUpdate.check(data, old_data, totalFieldMax, 'totalFieldMax');

            btn.text("Saving...").disabled();
            progressDialog.open();
            updateWCL6({id: this.item.id, ...data}).then(res => {
                console.log("res", res)
                onSaved && onSaved(res);
                infoDialog.open("Record successfully updated.");
                infoDialog.close(2000);
                this.props.close();
            }).finally(() => {
                btn.text("Save").enabled();
                setTimeout(() => progressDialog.close())
            });
        }
    }

    // </editor-fold>

    get totalFieldCount() {
        const {state: {countFields}} = this;
        const totalCount = Object.values(countFields).map(({count, max}) => count).reduce((n1, n2) => n1 + n2, 0);
        return totalCount;
    }

    get totalFieldMax() {
        const {state: {countFields}} = this;
        const totalMax = Object.values(countFields).map(({count, max}) => max).reduce((n1, n2) => n1 + n2, 0);
        return totalMax;
    }

    get convert_data() {
        const {dialog} = this.props;
        return dialog.convert_data;
    }

    get claim() {
        const {dialog} = this.props;
        return dialog.extraProp('item');
    }

    get isNew() {
        const {item} = this;
        if(!item) return true;
        return !item.id;
    }

    get item() {
        return this.props.state.item;
    }

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {props: {onFormNext, onFormBack, onFormOpen}} = this;
        const {isContractor, isConsultant} = storage.is;
        return <FormControls onChange={this.form.onChange} onCountFields={this.onCountFields}>
            <Row
                rendered
                countFields
                active
                idx={1}
                title="1. General Details"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <ClearableInput ref="claim_number" name="claim_number" type="text" placeholder="Claim Number"
                                className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput ref="accident_date" name="accident_date" type="date" placeholder="Date of Accident..."
                                className="col-lg-12 form-control" onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                countFields
                idx={2}
                title="2. Employer Details"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <ClearableInput ref="company_name" name="company_name" type="text" placeholder="Name of employer"
                                className="col-lg-12 form-control" onChange={this.form.onChange}/>

                <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">Street Address &
                    Postal
                    Code</label>
                <ClearableInput ref="company_str_addr" name="company_str_addr" type="textarea"
                                placeholder="Street Address"
                                className="col-lg-8 form-control" onChange={this.form.onChange}/>
                <ClearableInput ref="company_str_addr_code" name="company_str_addr_code" type="text"
                                placeholder="Postal Code"
                                footerDesc="For Street Address" className="col-lg-4 form-control"
                                onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                countFields
                idx={3}
                title="3. Employee Details"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <SelectEmployeeInput ref="employee" name="employee" placeholder="Employee..." required
                                     className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput ref="id_num" name="id_num" type="text" placeholder="Identity Number" required
                                className="col-lg-12 form-control" onChange={this.form.onChange}/>

                <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">Street Address &
                    Postal
                    Code</label>
                <ClearableInput ref="employee_str_addr" name="employee_str_addr" type="textarea"
                                placeholder="Street Address"
                                className="col-lg-8 form-control" onChange={this.form.onChange}/>
                <ClearableInput ref="employee_str_addr_code" name="employee_str_addr_code" type="text"
                                placeholder="Postal Code"
                                footerDesc="For Street Address" className="col-lg-4 form-control"
                                onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                countFields
                idx={4}
                title="4. Accident Details"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <label className="col-lg-12 margin-0 margin-t-0 padding-5 bg-f5f5f5 font-size-13">
                    State the period(s) the employee was off duty or performing light duty
                </label>
                <OffAndLightDutyPeriodTable ref="periods_employee_off_duty" name="periods_employee_off_duty"
                                            desc="PERIOD(S) OFF DUTY" className="col-lg-12 form-control"
                                            onChange={this.form.onChange}/>
                <OffAndLightDutyPeriodTable ref="periods_employee_light_duty" name="periods_employee_light_duty"
                                            desc="PERIOD(S) PERFORMING LIGHT DUTY" className="col-lg-12 form-control"
                                            onChange={this.form.onChange}/>

                <hr/>
                <ClearableInput ref="employee_light_duty_available_and_offered"
                                name="employee_light_duty_available_and_offered"
                                type="radio" placeholder="Was light duty available and offered to the employee?"
                                vertical
                                required className="col-lg-12 form-control" onChange={this.form.onChange}
                                values={this.state.lists.employee_light_duty_available_and_offered} returnValue/>
                <label className="col-lg-12 margin-0 margin-t-0 padding-5 bg-f5f5f5 font-size-13">
                    Did the employee perform recommended light duty? If not, give reason.
                </label>
                <ClearableInput ref="employee_perform_recommended_light_duty"
                                name="employee_perform_recommended_light_duty"
                                type="radio" placeholder="Did the employee perform recommended light duty?" vertical
                                required
                                className="col-lg-12 form-control" onChange={this.form.onChange}
                                values={this.state.lists.employee_perform_recommended_light_duty} returnValue/>
                <ClearableInput ref="employee_perform_recommended_light_duty_not_performed_reason"
                                name="employee_perform_recommended_light_duty_not_performed_reason" type="textarea"
                                placeholder="If recommended light duty not performed, give reason"
                                className="col-lg-12 min-h-60 form-control" onChange={this.form.onChange}/>
                <ClearableInput ref="employee_perform_recommended_light_duty_performed_percentage"
                                name="employee_perform_recommended_light_duty_performed_percentage" type="textarea"
                                placeholder="If yes, what percentage of normal was the light duty performed worth to the company e.g. 20%, 40%, etc. or indicate the rate of earnings paid whilst performing light duty."
                                className="col-lg-12 min-h-60 form-control" onChange={this.form.onChange}/>
                <hr/>
                <ClearableInput ref="employee_still_in_your_employment" name="employee_still_in_your_employment"
                                type="radio"
                                placeholder="Is the employee still in your employment?" vertical required
                                className="col-lg-12 form-control" onChange={this.form.onChange}
                                values={this.state.lists.employee_still_in_your_employment} returnValue/>

                <hr/>
                <ClearableInput ref="employee_left_my_service_date" name="employee_left_my_service_date" type="date"
                                placeholder="Date employee left my service..." className="col-lg-12 form-control"
                                onChange={this.form.onChange}/>
                <ClearableInput ref="employee_present_address" name="employee_present_address" type="textarea"
                                placeholder="Employee's present address" className="col-lg-12 min-h-60 form-control"
                                onChange={this.form.onChange}/>

                <label className="col-lg-12 margin-0 margin-t-0 padding-5 bg-f5f5f5 font-size-13">
                    Did the employee receive free food and/or quarters from you during the period(s) mentioned in
                    paragraph 1
                    above? If so, state the period(s) hereunder at paragraphs (a) and/or (b).
                </label>
                <DateRangeInput name="employee_receive_free_food_range" className="col-lg-12 form-control" vertical
                                placeholder="Food" onChange={this.form.onChange}>
                    <label className="min-w-65">From</label>
                    <label className="min-w-50">To</label>
                </DateRangeInput>
                <DateRangeInput name="employee_receive_free_quarters_range" className="col-lg-12 form-control" vertical
                                placeholder="Quarters" onChange={this.form.onChange}>
                    <label className="min-w-65">From</label>
                    <label className="min-w-50">To</label>
                </DateRangeInput>
                <hr/>
                <DateRangeInput name="period_detained_in_hospital_range" className="col-lg-12 form-control" vertical
                                placeholder="Period detained in hospital" onChange={this.form.onChange}>
                    <label className="min-w-65">From</label>
                    <label className="min-w-50">To</label>
                </DateRangeInput>
            </Row>
            <Row
                rendered
                countFields
                idx={5}
                title="5. Employer's Declaration"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
            >
                <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">
                    I hereby declare that the particulars furnished in the foregoing report are true and correct.
                </label>

                <ClearableInput ref="employer_signature" name="employer_signature" type="signature"
                                placeholder="Employer's Signature" className="col-lg-12 form-control"
                                onChange={this.form.onChange}/>
                <ClearableInput ref="employer_signature_name" name="employer_signature_name" type="text"
                                placeholder="Name of Person Signing" className="col-lg-12 form-control"
                                onChange={this.form.onChange}/>
                <ClearableInput ref="employer_signature_date" name="employer_signature_date" type="date"
                                placeholder="Signature Date..." className="col-lg-12 form-control"
                                onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                activeAlways
                title="Contacts"
            >
                <p className="contact col-lg-12 padding-5 bg-f5f5f5 margin-b-5 font-size-13">Call Centre No.: 086 010
                    5350</p>
                <p className="contact col-lg-12 padding-5 bg-f5f5f5 margin-b-5 font-size-13">Fax No.: (012) 323-8627 /
                    (012)
                    323-6986</p>
                <p className="contact col-lg-12 padding-5 bg-f5f5f5 margin-b-5 font-size-13">E-Mail:
                    cf-info@labour.gov.za</p>
                <p className="contact col-lg-12 padding-5 bg-f5f5f5 -margin-b-5 font-size-13">Website:
                    www.labour.gov.za</p>
            </Row>
        </FormControls>;
    }

    // </editor-fold>
}

export default NewWCL6Dialog;
