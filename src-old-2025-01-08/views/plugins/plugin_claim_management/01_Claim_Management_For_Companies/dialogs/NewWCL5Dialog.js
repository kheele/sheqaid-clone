// <editor-fold defaultstate="collapsed" desc="import">
import React from "react";
import {observer} from 'mobx-react';
import {observable, toJS} from 'mobx';

import Form from 'utils/Form';
import {Dates, execWhen, setDefaultVal, ShouldUpdate} from 'utils/Utils';

import {ClearableInput, SelectEmployeeInput} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import {ANewDialog} from 'components/dialogs';

import {OperationOrProcedureOrTestCarriedOutAndDatesTable} from '../../dialogs/ClaimForms';

import style from "./NewWCL5Dialog.lazy.css";
import updateClaimsClient from "mutations/all/COIDA/ClaimsClient/updateClaimsClient";
import updateWCL5 from "mutations/all/COIDA/WCL5/updateWCL5";
import insertAnnexture1 from "mutations/all/COIDA/Annexture1/insertAnnexture1";
import insertWCL5 from "mutations/all/COIDA/WCL5/insertWCL5";
import updateWCL5Proxy from "mutations/all/COIDA/WCL5Proxy/updateWCL5Proxy";
import insertWCL5Proxy from "mutations/all/COIDA/WCL5Proxy/insertWCL5Proxy";
import findByIdWCL5 from "mutations/all/COIDA/WCL5/findByIdWCL5";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class NewWCL5Dialog extends ANewDialog {
    pageKey = "NewWCL5Dialog";
    title = "Create/Edit W.CI.5";

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

            //4. Medical Practitioner/Chiropractor Consultation Details
            operation_procedure_test_carried_out_and_dates,
            prognosis_and_further_treatment,
            employee_been_fit_normal_work_date,
            employee_likely_to_be_fit_normal_work_date,
            employee_condition_became_stabilised_yes_or_no,
            present_permanent_anatomical_defect_or_impairment,

            //5. Medical Practitioner/Chiropractor Declaration
            practioner_signature,
            practioner_signature_name,
            practioner_signature_date,
            practioner_addr,
            practioner_practice_num
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

            //4. Medical Practitioner/Chiropractor Consultation Details
            operation_procedure_test_carried_out_and_dates: operation_procedure_test_carried_out_and_dates && operation_procedure_test_carried_out_and_dates.map((
                {
                    desc,
                    date
                }
            ) => {
                return {desc, date: Dates.formatDateSQL(date)};
            }).slice(),
            prognosis_and_further_treatment,
            employee_been_fit_normal_work_date: Dates.formatDateSQL(employee_been_fit_normal_work_date),
            employee_likely_to_be_fit_normal_work_date: Dates.formatDateSQL(employee_likely_to_be_fit_normal_work_date),
            employee_condition_became_stabilised_yes_or_no,
            present_permanent_anatomical_defect_or_impairment,

            //5. Medical Practitioner/Chiropractor Declaration
            practioner_signature: practioner_signature && toJS(practioner_signature),
            practioner_signature_name,
            practioner_signature_date: Dates.formatDateSQL(practioner_signature_date),
            practioner_addr,
            practioner_practice_num
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
            employee_condition_became_stabilised_yes_or_no: ['Yes', 'No'].map(text => {
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
        dialog.setTitle(this.item ? 'Edit W.CI.5' : 'Create W.CI.5');

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

            //4. Medical Practitioner/Chiropractor Consultation Details
            setDefaultValue('operation_procedure_test_carried_out_and_dates');
            setDefaultValue('prognosis_and_further_treatment');
            setDefaultValue('employee_been_fit_normal_work_date');
            setDefaultValue('employee_likely_to_be_fit_normal_work_date');
            setDefaultValue('employee_condition_became_stabilised_yes_or_no');
            setDefaultValue('present_permanent_anatomical_defect_or_impairment');

            //5. Medical Practitioner/Chiropractor Declaration
            setDefaultValue('practioner_signature');
            setDefaultValue('practioner_signature_name');
            setDefaultValue('practioner_signature_date');
            setDefaultValue('practioner_addr');
            setDefaultValue('practioner_practice_num');
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
                infoDialog.open('ClaimsClient Number is required');
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

            //4. Medical Practitioner/Chiropractor Consultation Details
            operation_procedure_test_carried_out_and_dates,
            prognosis_and_further_treatment,
            employee_been_fit_normal_work_date,
            employee_likely_to_be_fit_normal_work_date,
            employee_condition_became_stabilised_yes_or_no,
            present_permanent_anatomical_defect_or_impairment,

            //5. Medical Practitioner/Chiropractor Declaration
            practioner_signature,
            practioner_signature_name,
            practioner_signature_date,
            practioner_addr,
            practioner_practice_num,
        } = form.data;

        if (isNew) {
            const data = {...form.data, totalFieldCount, totalFieldMax};
            console.log("res", data)

            if (claim && claim.id) {
                btn.text("Saving...").disabled();
                progressDialog.open();
                insertWCL5(convert_data(data)).then(res => {
                    if (res) {
                        return insertWCL5Proxy({claim_id: claim.id, wcl_5_id: res.id}).then(_ => res);
                    }
                }).then(res => res && findByIdWCL5(res.id)).then(res => {
                    console.log("res", res)
                    if (!res) {
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

            //4. Medical Practitioner/Chiropractor Consultation Details
            ShouldUpdate.check(data, old_data, operation_procedure_test_carried_out_and_dates, 'operation_procedure_test_carried_out_and_dates');
            ShouldUpdate.check(data, old_data, prognosis_and_further_treatment, 'prognosis_and_further_treatment');
            ShouldUpdate.checkDate(data, old_data, employee_been_fit_normal_work_date, 'employee_been_fit_normal_work_date');
            ShouldUpdate.checkDate(data, old_data, employee_likely_to_be_fit_normal_work_date, 'employee_likely_to_be_fit_normal_work_date');
            ShouldUpdate.check(data, old_data, employee_condition_became_stabilised_yes_or_no, 'employee_condition_became_stabilised_yes_or_no');
            ShouldUpdate.check(data, old_data, present_permanent_anatomical_defect_or_impairment, 'present_permanent_anatomical_defect_or_impairment');

            //5. Medical Practitioner/Chiropractor Declaration
            ShouldUpdate.checkSignature(data, old_data, practioner_signature, 'practioner_signature');
            ShouldUpdate.check(data, old_data, practioner_signature_name, 'practioner_signature_name');
            ShouldUpdate.checkDate(data, old_data, practioner_signature_date, 'practioner_signature_date');
            ShouldUpdate.check(data, old_data, practioner_addr, 'practioner_addr');
            ShouldUpdate.check(data, old_data, practioner_practice_num, 'practioner_practice_num');

            //external file
            ShouldUpdate.checkFile(data, old_data, wcl_4_external_doc, 'external_doc');

            if (Object.keys(data).isEmpty()) {
                infoDialog.open("Nothing changed!");
                return;
            }

            //count fields
            ShouldUpdate.check(data, old_data, totalFieldCount, 'totalFieldCount');
            ShouldUpdate.check(data, old_data, totalFieldMax, 'totalFieldMax');

            btn.text("Saving...").disabled();
            progressDialog.open();
            updateWCL5({id: this.item.id, ...data}).then(res => {
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
        if (!item) return true;
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
                    Postal Code</label>
                <ClearableInput ref="company_str_addr" name="company_str_addr" type="textarea"
                                placeholder="Street Address" className="col-lg-8 form-control"
                                onChange={this.form.onChange}/>
                <ClearableInput ref="company_str_addr_code" name="company_str_addr_code" type="text"
                                placeholder="Postal Code" footerDesc="For Street Address"
                                className="col-lg-4 form-control" onChange={this.form.onChange}/>
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
                    Postal Code</label>
                <ClearableInput ref="employee_str_addr" name="employee_str_addr" type="textarea"
                                placeholder="Street Address" className="col-lg-8 form-control"
                                onChange={this.form.onChange}/>
                <ClearableInput ref="employee_str_addr_code" name="employee_str_addr_code" type="text"
                                placeholder="Postal Code" footerDesc="For Street Address"
                                className="col-lg-4 form-control" onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                countFields
                idx={4}
                title="4. Medical Practitioner/Chiropractor Consultation Details"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">Describe any
                    operation(s)/procedure(s)/test(s) carried out and date(s)</label>
                <OperationOrProcedureOrTestCarriedOutAndDatesTable ref="operation_procedure_test_carried_out_and_dates"
                                                                   name="operation_procedure_test_carried_out_and_dates"
                                                                   className="col-lg-12" onChange={this.form.onChange}/>

                <ClearableInput ref="prognosis_and_further_treatment" name="prognosis_and_further_treatment"
                                type="textarea" placeholder="Prognosis and further treatment"
                                className="col-lg-12 form-control" onChange={this.form.onChange}/>

                <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">From what date has
                    the employee been fit for his/her normal work?</label>
                <ClearableInput ref="employee_been_fit_normal_work_date" name="employee_been_fit_normal_work_date"
                                type="date" placeholder="Date..." className="col-lg-12 form-control"
                                onChange={this.form.onChange}/>
                <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">On what date is
                    he/she likely to be fit for his/her normal work?</label>
                <ClearableInput ref="employee_likely_to_be_fit_normal_work_date"
                                name="employee_likely_to_be_fit_normal_work_date" type="date" placeholder="Date..."
                                className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">Employee's condition
                    stabilization</label>
                <ClearableInput ref="employee_condition_became_stabilised_yes_or_no"
                                name="employee_condition_became_stabilised_yes_or_no" type="radio" vertical
                                placeholder="Has the employee's condition become stabilised?"
                                className="col-lg-12 form-control" onChange={this.form.onChange}
                                values={this.state.lists.employee_condition_became_stabilised_yes_or_no} returnValue/>
                <ClearableInput ref="present_permanent_anatomical_defect_or_impairment"
                                name="present_permanent_anatomical_defect_or_impairment" type="textarea"
                                placeholder="If so, describe in detail any present permanent anatomical defect and/or impairment of function as a result of the accident"
                                footerDesc="(Loss of movement, if any, must be indicated in degrees at each specific joint)."
                                className="col-lg-12 form-control" onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                countFields
                idx={5}
                title="5. Medical Practitioner/Chiropractor Declaration"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
            >
                <label className="col-lg-12 margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">
                    I certify that I have by examination, satisfied myself that the injury(ies) of the employee is the
                    result of the accident.
                </label>

                <ClearableInput ref="practioner_signature" name="practioner_signature" type="signature"
                                placeholder="Medical Practitioner/Chiropractor Signature"
                                className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput ref="practioner_signature_name" name="practioner_signature_name" type="text"
                                placeholder="Name of Person Signing" className="col-lg-12 form-control"
                                onChange={this.form.onChange}/>
                <ClearableInput ref="practioner_signature_date" name="practioner_signature_date" type="date"
                                placeholder="Signature Date..." className="col-lg-12 form-control"
                                onChange={this.form.onChange}/>

                <hr/>

                <ClearableInput ref="practioner_addr" name="practioner_addr" type="textarea" placeholder="Address"
                                className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput ref="practioner_practice_num" name="practioner_practice_num" type="text"
                                placeholder="Practice Number" className="col-lg-12 form-control"
                                onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                activeAlways
                title="Contacts"
            >
                <p className="notice col-lg-12 padding-5 bg-f5f5f5 margin-b-5 font-size-13">N.B.: Progress reports must
                    be submitted on a monthly basis to the employer until the employee's condition has become stabilised
                    when a final medical report should be submitted</p>

                <p className="contact col-lg-12 padding-5 bg-f5f5f5 margin-b-5 font-size-13">Call Centre No.: 086 010
                    5350</p>
                <p className="contact col-lg-12 padding-5 bg-f5f5f5 margin-b-5 font-size-13">Fax No.: (012) 323-8627 /
                    (012) 323-6986</p>
                <p className="contact col-lg-12 padding-5 bg-f5f5f5 margin-b-5 font-size-13">E-Mail:
                    cf-info@labour.gov.za</p>
                <p className="contact col-lg-12 padding-5 bg-f5f5f5 -margin-b-5 font-size-13">Website:
                    www.labour.gov.za</p>
            </Row>
        </FormControls>;
    }

    // </editor-fold>
}

export default NewWCL5Dialog;
