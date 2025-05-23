import React from "react";
import {observer} from 'mobx-react';
import {computed, observable, toJS} from 'mobx';
import {PDFDocument} from 'pdf-lib';
import {CircularProgress} from "@mui/material";

import Form from 'utils/Form';
import {Dates, ShouldUpdate} from 'utils/Utils';

import {AEditDialog, InputDialog} from 'components/dialogs';
import {Button, ClearableInput, SelectEmployeeInput} from 'components/inputs';
import {DocUploadOption, FormControls, Row} from 'components/FormComponents';

import style from "./EditDialog.lazy.css";
import {
    updateEmployeeContract,
    updateEmployeeContractDetails,
    updateEmployeeContractSalaryInfo
} from "mutations/update";
import {findByIdEmployeeContract} from "mutations/findById";

@observer
class EditDialog extends AEditDialog {
    pageKey = "EditContractDialog";
    className = "AEditEmployeeDocDialog";
    title = "Edit Contract";
    removeById = updateEmployeeContract;

    constructor(props) {
        super(props, style);
    }

    get findById() {
        const {props: {isNewEmployee}} = this;
        if (isNewEmployee) return;
        return findByIdEmployeeContract;
    }

    get topButtonsHiddenSave() {
        const {props: {isNewEmployee}} = this;
        if (isNewEmployee) return false;
        return true;
    }

    get topButtonsHiddenDelete() {
        const {props: {isNewEmployee}} = this;
        if (isNewEmployee) return true;
    }

    get controls() {
        return Controls;
    }
}

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/employees/contracts/";

    constructor() {
        super();

        this.onNext = this.onNext.bind(this);
        this.onFormSave = this.onFormSave.bind(this);

        this.onAddContractPDFPages = this.onAddContractPDFPages.bind(this);

        this.form = new Form();
    }

    get isNewEmployee() {
        const {props: {dialog: {props: {isNewEmployee}}}} = this;
        return isNewEmployee;
    }

    @computed
    get item() {
        return this.props.state.item;
    }

    //</editor-fold>

    async onAddContractPDFPages() {
        this.refs.inputDialog.open("Starting Page Number").then(pageNum => {
            if (!pageNum) return;
            if (pageNum.isEmpty()) {
                infoDialog.open('Starting Page Number is required');
                return;
            }
            if (isNaN(pageNum)) {
                infoDialog.open('Starting Page Number must be a number');
                return;
            }
            pageNum = parseInt(pageNum);
            if (pageNum <= 0) {
                infoDialog.open('Starting Page Number must be greater than 0');
                return;
            }
            pageNum--;

            electronDialog.showOpenDialogPDF().then(async res => {
                if (res) {
                    const {previewPath, path} = res;

                    let {
                        item, item: {id, data: {employee, doc}}
                    } = this;

                    progressDialog.open();
                    const mainPdfDocBytes = await fetch(doc.dlUrls[0]).then(res => res.arrayBuffer());
                    const mainPdfDoc = await PDFDocument.load(mainPdfDocBytes);

                    const newPdfDocBytes = await workers.emit("file-utils", "toArrayBuffer", path);
                    const newPdfDoc = await PDFDocument.load(newPdfDocBytes);

                    const pageLength = mainPdfDoc.getPages().length;
                    if (pageNum >= pageLength) {
                        pageNum = pageLength - 1;
                    }
                    const newPdfDocCopiedPages = await mainPdfDoc.copyPages(newPdfDoc, newPdfDoc.getPageIndices());
                    newPdfDocCopiedPages.forEach((newPdfPageCopy, n) => {
                        mainPdfDoc.insertPage(pageNum + n, newPdfPageCopy);
                    });

                    //            const pdfBytes = await mainPdfDoc.save();
                    const newBase64Src = await mainPdfDoc.saveAsBase64({dataUri: true});
//                    const newSrc = dataUriToUrl(newBase64Src);
//                    console.log('newSrc', newSrc)

                    workers.emit(this.path + "update/merge-doc", employee.id, this.item.id, {
                        doc,
                        base64: newBase64Src
                    }).then(res => {
                        if (res) {
                            infoDialog.open("Successfully added pages.");
                            infoDialog.close(2000);
                            const {doc, doc: {dlUrls}} = item.data;
                            doc.dlUrls = null;
                            setTimeout(() => {
                                doc.dlUrls = dlUrls;
                            });
                        } else {
                            infoDialog.open("Sorry, the pages couldn't be added. Please try again.");
                        }
                    }).finally(() => {
                        setTimeout(() => {
                            progressDialog.close();
                        }, 1000);
                    });
                }
            });
        });
    }

    // </editor-fold>

    //<editor-fold desc="onNext">
    onNext(e, btn) {
        const {
            form,
            isNewEmployee,
            embeddedEmployee,
            refs: {contractDetailsTab, salaryInfoTab}
        } = this;
        const {idx} = btn.props;
        if (idx === 1) {
            if (!isNewEmployee && !embeddedEmployee) {
                if (!form.isValid('employee')) {
                    infoDialog.open('Employee is required');
                    return;
                }
            }
        }
        if (idx === 2) {
            const contract_details = toNoneNullObject(contractDetailsTab.form.data);
            if (contract_details) {
                if (contractDetailsTab.form.isValid('expiry_date') && !contractDetailsTab.form.isValid('start_date')) {
                    infoDialog.open('Start Date is required');
                    return;
                }

                if (contractDetailsTab.form.isValid('start_time') && !contractDetailsTab.form.isValid('end_time')) {
                    infoDialog.open('Working End Time is required');
                    return;
                }
                if (contractDetailsTab.form.isValid('end_time') && !contractDetailsTab.form.isValid('start_time')) {
                    infoDialog.open('Working Start Time is required');
                    return;
                }
            }
        }
        if (idx === 3) {
            const salary_info = toNoneNullObject(salaryInfoTab.form.data);
            if (salary_info) {//payment_type,
                if (!salaryInfoTab.form.isValid('payment_type')) {
                    infoDialog.open('Payment Type is required');
                    return;
                }
                if (salaryInfoTab.form.get('payment_type') === 'Salary') {
                    if (!salaryInfoTab.form.isValid('salary_interval')) {
                        infoDialog.open('Salary Interval is required');
                        return;
                    }
                } else {//Wage
                    //                if (!salaryInfoTab.form.isValid('wage')) {
                    //                    infoDialog.open('Wage Type is required');
                    //                    return;
                    //                }
                }
            }
        }

        return true;
    }

    // </editor-fold>

    //<editor-fold desc="onFormSave">
    async onFormSave(e, btn) {
        const {
            form,
            isNewEmployee,
            item: {id, data: old_data},
            props: {dialog: {props: {embeddedEmployee}}},
            refs: {contractDetailsTab, salaryInfoTab},
        } = this;

        const {is: {isContractor}, loggedContractor} = storage;

        const onSubmit = (data, onSaved) => {
            if (Object.keys(data).isEmpty()) {
                infoDialog.open("Nothing changed!");
                return;
            }

            console.log(data)

            btn.text("Saving...").disabled();
            progressDialog.open();
            updateEmployeeContract({id: this.item.id, ...data}).then(res => {
                console.log("res", res)
                const res_data = res;
                onSaved && onSaved(res_data);
                infoDialog.open("Record successfully updated.");
                infoDialog.close(2000);
                // this.props.close();
            }).finally(() => {
                btn.text("Save").enabled();
                setTimeout(() => progressDialog.close());
            });
        };

        const onSubmitContractDetails = (data, onSaved) => {
            if (Object.keys(data).isEmpty()) {
                infoDialog.open("Nothing changed!");
                return;
            }

            console.log(data)

            btn.text("Saving...").disabled();
            progressDialog.open();
            updateEmployeeContractDetails({id: this.item.id, ...data}).then(res => {
                console.log("res", res)
                if (res === "EMAIL_DUP") {
                    infoDialog.open("An Employee with this email address already exist.");
                } else if (res === "PHONE_DUP") {
                    infoDialog.open("An Employee with this phone number address already exist.");
                } else {
                    infoDialog.open("Record successfully updated.");
                    infoDialog.close(2000);
                    // this.props.close();
                }
            }).finally(() => {
                btn.text("Save").enabled();
                setTimeout(() => progressDialog.close());
            });
        };

        const onSubmitSalaryInfo = (data, onSaved) => {
            if (Object.keys(data).isEmpty()) {
                infoDialog.open("Nothing changed!");
                return;
            }

            console.log(data)

            btn.text("Saving...").disabled();
            progressDialog.open();
            updateEmployeeContractSalaryInfo({id: this.item.id, ...data}).then(res => {
                console.log("res", res)
                if (res === "EMAIL_DUP") {
                    infoDialog.open("An Employee with this email address already exist.");
                } else if (res === "PHONE_DUP") {
                    infoDialog.open("An Employee with this phone number address already exist.");
                } else {
                    infoDialog.open("Record successfully updated.");
                    infoDialog.close(2000);
                    // this.props.close();
                }
            }).finally(() => {
                btn.text("Save").enabled();
                setTimeout(() => progressDialog.close());
            });
        };

        const {idx} = btn.props;

        if (idx === 1) {
            if (!isNewEmployee && !embeddedEmployee && !form.isValid('employee')) {
                infoDialog.open('Employee is required');
                return;
            }

            const {
                employee,
            } = form.data;

            const data = {};

            if (!embeddedEmployee) {
                ShouldUpdate.checkEmployee(data, old_data, employee, 'employee_id');
            }

            onSubmit(data);
            return;
        }

        if (idx === 2) {
            const {form} = contractDetailsTab;
            const contract_details = toNoneNullObject(form.data);
            if (contract_details) {
                if (form.isValid('expiry_date') && !form.isValid('start_date')) {
                    infoDialog.open('Start Date is required');
                    return;
                }

                if (form.isValid('start_time') && !form.isValid('end_time')) {
                    infoDialog.open('Working End Time is required');
                    return;
                }
                if (form.isValid('end_time') && !form.isValid('start_time')) {
                    infoDialog.open('Working Start Time is required');
                    return;
                }

                const {
                    contract_type,
                    start_date,
                    expiry_date,
                    end_of_trial_period,
                    start_time,
                    end_time,
                    daily_working_hours,
                    notes,
                } = contract_details;

                let data = {};

                const {contract_details: contract_details_list} = old_data;
                const [old_contract_details] = contract_details_list || [];

                if (old_contract_details) {
                    ShouldUpdate.check(data, old_contract_details, contract_type, 'contract_type');
                    ShouldUpdate.checkDate(data, old_contract_details, start_date, 'start_date');
                    ShouldUpdate.checkDate(data, old_contract_details, expiry_date, 'expiry_date');
                    ShouldUpdate.checkDate(data, old_contract_details, end_of_trial_period, 'end_of_trial_period');
                    ShouldUpdate.check(data, old_contract_details, start_time, 'start_time');
                    ShouldUpdate.check(data, old_contract_details, end_time, 'end_time');
                    ShouldUpdate.check(data, old_contract_details, daily_working_hours, 'daily_working_hours');
                    ShouldUpdate.check(data, old_contract_details, notes, 'notes');
                } else {
                    data = {
                        contract_type,
                        start_date: Dates.formatTimestampSQL(start_date),
                        expiry_date: Dates.formatTimestampSQL(expiry_date),
                        end_of_trial_period: Dates.formatTimestampSQL(end_of_trial_period),
                        start_time,
                        end_time,
                        daily_working_hours,
                        notes,
                    };
                }

                onSubmitContractDetails(data);
                return;
            }
        }

        if (idx === 3) {
            const {form} = salaryInfoTab;
            const salary_info = toNoneNullObject(form.data);
            if (salary_info) {//payment_type,
                if (!form.isValid('payment_type')) {
                    infoDialog.open('Payment Type is required');
                    return;
                }
                if (form.get('payment_type') === 'Salary') {
                    if (!form.isValid('salary_interval')) {
                        infoDialog.open('Salary Interval is required');
                        return;
                    }
                } else {//Wage
                    //                if (!form.isValid('wage')) {
                    //                    infoDialog.open('Wage Type is required');
                    //                    return;
                    //                }
                }

                const {
                    payment_type,
                    salary_interval,
                    salary,
                    wage,
                    deductible,//[{text, value}]
                } = salary_info;

                let data = {};

                const {salary_info: salary_info_list} = old_data;
                let [old_salary_info] = salary_info_list || [];

                if (old_salary_info) {
                    ShouldUpdate.check(data, old_salary_info, payment_type, 'payment_type');
                    ShouldUpdate.check(data, old_salary_info, salary_interval, 'salary_interval');
                    ShouldUpdate.check(data, old_salary_info, salary, 'salary');
                    ShouldUpdate.check(data, old_salary_info, wage, 'wage');
//            {list: toJS(list), total}
                    const old_deductible_list = old_salary_info.deductible_list || [];
                    old_deductible_list.sort();
                    const deductible_list = deductible ? deductible.list.filter(v => !!v && !!v.text && !!v.value) : [];
                    deductible_list.sort();
                    if (JSON.stringify(old_deductible_list) !== JSON.stringify(deductible_list)) {
                        data.deductible_list = deductible_list;
                    }
                } else {
                    const deductible_list = deductible ? deductible.list.filter(v => !!v && !!v.text && !!v.value) : [];

                    data = {
                        payment_type,
                        salary_interval,
                        salary,
                        wage,
                        deductible_list: {data: deductible_list},//[{text, value}]
                    };
                }

                onSubmitSalaryInfo(data);
                return;
            }
        }

        if (idx === 4.1) {
            const {
                doc,
            } = form.data;

            const data = {};

            ShouldUpdate.checkFile(data, old_data, doc, 'doc');

            onSubmit(data);
            return;
        }

        if (idx === 4.2) {
            const {
                job_profile_doc,
            } = form.data;

            const data = {};

            ShouldUpdate.checkFile(data, old_data, job_profile_doc, 'job_profile_doc');

            onSubmit(data);
            return;
        }

        return true;
    }

    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    onSubmit(e, btn, onSaved) {
        const {
            form,
            isNewEmployee,
            item: old_data,
            props: {dialog: {props: {embeddedEmployee}}},
            refs: {contractDetailsTab, salaryInfoTab},
        } = this;

        const contract_details = toNoneNullObject(contractDetailsTab.form.data);
        if (contract_details) {
            if (contractDetailsTab.form.isValid('expiry_date') && !contractDetailsTab.form.isValid('start_date')) {
                infoDialog.open('Start Date is required');
                return;
            }

            if (contractDetailsTab.form.isValid('start_time') && !contractDetailsTab.form.isValid('end_time')) {
                infoDialog.open('Working End Time is required');
                return;
            }
            if (contractDetailsTab.form.isValid('end_time') && !contractDetailsTab.form.isValid('start_time')) {
                infoDialog.open('Working Start Time is required');
                return;
            }
        }

        const salary_info = toNoneNullObject(salaryInfoTab.form.data);
        if (salary_info) {//payment_type,
            if (!salaryInfoTab.form.isValid('payment_type')) {
                infoDialog.open('Payment Type is required');
                return;
            }
            if (salaryInfoTab.form.get('payment_type') === 'Salary') {
                if (!salaryInfoTab.form.isValid('salary_interval')) {
                    infoDialog.open('Salary Interval is required');
                    return;
                }
            } else {//Wage
                //                if (!salaryInfoTab.form.isValid('wage')) {
                //                    infoDialog.open('Wage Type is required');
                //                    return;
                //                }
            }
        }

        console.log(form)
        const {
            employee,//
            doc,//
            job_profile_doc//
        } = form.data;

        const data = {
            contractDetailsFormData: contract_details,
            salaryInfoFormData: salary_info,
            employee,
            doc,
            job_profile_doc,
        };

        console.log("res", data)
        onSaved && onSaved(data);
        infoDialog.open("Record added.");
        infoDialog.close(2000);
        this.props.close();
    }

    render() {
        if (!this.item) {
            return <CircularProgress className="fixed-center"/>;
        }

        let {
            props: {
                onFormNext, onFormBack, onFormOpen,
                dialog: {props: {embeddedEmployee, isNewEmployee,}}
            },
            item, item: {
                id, data: {
                    created_at,
                    employee,
                    contract_details: contract_details_list = [], contractDetailsFormData,
                    salary_info: salary_info_list = [], salaryInfoFormData,
                    doc,
                    job_profile_doc,
                }
            }
        } = this;

        console.log('Contract', item);

        const contract_details = contractDetailsFormData || (contract_details_list && contract_details_list[0]);
        const salary_info = salaryInfoFormData || (salary_info_list && salary_info_list[0]);

        let idx = !isNewEmployee && !embeddedEmployee ? 1 : 0;
        return (<FormControls>
            {!isNewEmployee && !embeddedEmployee && <Row
                rendered
                active
                idx={1}
                title="1. Employee"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
                onFormSave={!isNewEmployee && this.onFormSave}
            >
                <SelectEmployeeInput
                    name="employee"
                    placeholder="Employee..."
                    defaultValue={employee}
                    className="col-lg-12 form-control"
                    onChange={this.form.onChange}
                />
            </Row>}
            <Row
                rendered
                active={isNewEmployee || embeddedEmployee}
                idx={2}
                title={`${++idx}. Contract Details`}
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
                onFormBack={!isNewEmployee && !embeddedEmployee && onFormBack}
                onFormSave={!isNewEmployee && this.onFormSave}
            >
                <ContractDetails
                    ref="contractDetailsTab"
                    defaultValue={contract_details}
                    embeddedEmployee={embeddedEmployee}
                />
            </Row>
            <Row
                rendered
                idx={3}
                title={`${++idx}. Salary Information`}
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
                onFormSave={!isNewEmployee && this.onFormSave}
            >
                <SalaryInfo ref="salaryInfoTab" defaultValue={salary_info}/>
            </Row>
            <Row
                rendered
                idx={4}
                title={`${++idx}. Contract Documents`}
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
            >
                <FormControls>
                    <Row
                        rendered
                        activeAlways
                        idx={4.1}
                        title={`${idx}.1. Contract Document Attachment`}
                        onFormSave={!isNewEmployee && this.onFormSave}
                    >
                        <DocUploadOption
                            name="doc"
                            plugin="plugin_hr_management"
                            module="Contracts"
                            type={['PDF', 'Word', 'Image']}
                            defaultValue={doc}
                            onChange={this.form.onChange}
                            addChangeOne={this.form.addChangeOne}
                        />
                    </Row>
                    <Row
                        rendered
                        activeAlways
                        idx={4.2}
                        title={`${idx}.2. Job Profile Document Attachment`}
                        onFormSave={!isNewEmployee && this.onFormSave}
                    >
                        <DocUploadOption
                            name="job_profile_doc"
                            plugin="plugin_hr_management"
                            module="Contracts"
                            doc_type="Job Profile"
                            type={['PDF', 'Word', 'Image']}
                            defaultValue={job_profile_doc}
                            onChange={this.form.onChange}
                            addChangeOne={this.form.addChangeOne}
                        />
                    </Row>
                </FormControls>
            </Row>
            <InputDialog ref="inputDialog"/>
        </FormControls>);
    }
}

@observer
class ContractDetails extends React.Component {

    @observable
    state = {
        lists: {
            contract_type: ['Fixed Term', 'Permanent'].map(text => {
                return {text, value: text};
            })
        }
    };

    constructor(props) {
        super(props);
        this.form = new Form();
    }

    get defaultStartDate() {
        const {defaultValue, embeddedEmployee, onRefs} = this.props;
        let start_date;
        if (embeddedEmployee) {
            const {employment_date} = embeddedEmployee.data || embeddedEmployee;
            start_date = defaultValue && defaultValue.start_date || employment_date;
        } else {
            start_date = defaultValue && defaultValue.start_date;
        }
        if (!start_date && onRefs) {
            const {optionalInfoSection} = onRefs();
            if (optionalInfoSection) {
                start_date = optionalInfoSection.formData.employment_date;
            }
        }
        return start_date;
    }

    render() {
        const {defaultValue, embeddedEmployee} = this.props;
        const {defaultStartDate} = this;

        return <>
            <label className="margin-b-0 w-full">Contract Terms</label>
            <ClearableInput name="contract_type" type="radio" placeholder="Contract Type"
                            defaultValue={defaultValue && defaultValue.contract_type} vertical
                            className="col-lg-12 form-control" onChange={this.form.onChange}
                            values={this.state.lists.contract_type} returnValue/>
            <ClearableInput name="start_date" type="date" placeholder="Start Date..."
                            defaultValue={defaultStartDate}
                            className="col-lg-6 form-control"
                            onChange={this.form.onChange}/>
            <ClearableInput name="expiry_date" type="date" placeholder="End Date..."
                            defaultValue={defaultValue && defaultValue.expiry_date} className="col-lg-6 form-control"
                            onChange={this.form.onChange}/>
            <ClearableInput name="end_of_trial_period" type="date" placeholder="End Of Trial Period..."
                            defaultValue={defaultValue && defaultValue.end_of_trial_period}
                            className="col-lg-6 form-control"
                            onChange={this.form.onChange}/>
            <hr className="margin-b-10"/>
            <label className="margin-b-10 w-full">Working Schedule</label>
            <ClearableInput name="start_time" type="time" placeholder="Start Time"
                            defaultValue={defaultValue && defaultValue.start_time} className="col-lg-6 form-control"
                            onChange={this.form.onChange}/>
            <ClearableInput name="end_time" type="time" placeholder="End Time"
                            defaultValue={defaultValue && defaultValue.end_time} className="col-lg-6 form-control"
                            onChange={this.form.onChange}/>
            <ClearableInput name="daily_working_hours" type="number" placeholder="Daily Working Hours"
                            defaultValue={(defaultValue && defaultValue.daily_working_hours) || 8}
                            className="col-lg-6 form-control" onChange={this.form.onChange}/>
            <hr className="margin-b-10"/>
            <label className="margin-b-0 w-full">Notes</label>
            <ClearableInput name="notes" type="textarea" placeholder="Notes"
                            defaultValue={defaultValue && defaultValue.notes}
                            className="col-lg-12 form-control" onChange={this.form.onChange}/>
        </>;
    }
}

@observer
class SalaryInfo extends React.Component {

    @observable
    state = {
        lists: {
            payment_types: [{text: 'Salary (Fixed Payment)', value: 'Salary', checked: false}, {
                text: 'Hourly Wage',
                value: 'Wage',
                checked: false
            }]
        },
        isSalary: false,
        isWage: false
    };

    constructor(props) {
        super(props);

        this.onChangePaymentType = this.onChangePaymentType.bind(this);

        this.form = new Form();
        this.form.addChangeOne("payment_type", this.onChangePaymentType);
    }

    onChangePaymentType(el, val) {
        this.state.isSalary = val === "Salary";
        this.state.isWage = val === "Wage";
    }

    render() {
        const {defaultValue} = this.props;
        return <>
            <ClearableInput name="payment_type" type="radio" placeholder="Payment Type"
                            defaultValue={defaultValue && defaultValue.payment_type} className="col-lg-12 form-control"
                            onChange={this.form.onChange} values={this.state.lists.payment_types}/>
            <SalaryField state={this.state} defaultValue={defaultValue} onSalaryChange={this.form.onChange}
                         onSalaryIntervalChange={this.form.onChange}/>
            <WageField state={this.state} defaultValue={defaultValue} onChange={this.form.onChange}/>
            <Deductibles defaultValue={defaultValue && defaultValue.deductible} onChange={this.form.onChange}/>
        </>;
    }
}

@observer
class SalaryField extends React.Component {

    @observable
    state = {
        lists: {
            salary_intervals: [
                {text: 'Weekly', value: 'Weekly', checked: false},
                {text: 'Bi-Weekly', value: 'Bi-Weekly', checked: false},
                {text: 'Monthly', value: 'Monthly', checked: false}
            ]
        }
    };

    render() {
        const {defaultValue, onSalaryChange, onSalaryIntervalChange, state: {isSalary}} = this.props;
        return !!isSalary && <>
            <ClearableInput name="salary_interval" type="radio" placeholder="Salary Interval"
                            defaultValue={defaultValue && defaultValue.salary_interval}
                            className="col-lg-12 form-control"
                            onChange={onSalaryIntervalChange} values={this.state.lists.salary_intervals}/>
            <ClearableInput name="salary" type="number" placeholder="Salary"
                            defaultValue={defaultValue && defaultValue.salary} className="col-lg-12 form-control"
                            onChange={onSalaryChange}/>
        </>;
    }
}

@observer
class WageField extends React.Component {

    render() {
        const {defaultValue, onChange, state: {isWage}} = this.props;
        return !!isWage &&
            <ClearableInput name="wage" type="number" placeholder="Wage"
                            defaultValue={defaultValue && defaultValue.wage}
                            className="col-lg-12 form-control" onChange={onChange}/>;
    }
}

@observer
class Deductibles extends React.Component {

    @observable
    state = {
        list: []
    };

    constructor(props) {
        super(props);

        const {defaultValue} = props;
        if (defaultValue && defaultValue.list) {
            this.state.list = [...defaultValue.list];
        }
        this.onAdd = this.onAdd.bind(this);
    }

    @computed
    get list() {
        return this.state.list;
    }

    @computed
    get calculate() {
        const {onChange} = this.props;
        const {list} = this;
        const l = list.filter(({text, value}) => text && value).map(({value}) => value);
        const total = l.reduce((n1, n2) => n1 + n2, 0);
        onChange({list: toJS(list), total}, "deductible", this);
        return total;
    }

    onAdd(e, btn) {
        this.state.list.push({
            text: null,
            value: null
        });
    }

    render() {
        return <>
            <hr className="margin-r-10"/>
            <label className="hor-center margin-b-0">Deductibles</label>
            <div className="row margin-l-0 margin-r-10">
                {this.list.map((item, n) => <Deductible idx={n} item={item} list={this.list}/>)}
            </div>
            <hr className="hor-center w-100"/>
            <label className="hor-center margin-b-15">Deductibles Total : R {this.calculate}</label>
            <Button className="btn btn-primary hor-center margin-b-10" text="Add Deductible" onClick={this.onAdd}/>
        </>;
    }
}

@observer
class Deductible extends React.Component {

    constructor(props) {
        super(props);

        this.onRemove = this.onRemove.bind(this);

        this.form = new Form();
        this.onChangeText = this.onChangeText.bind(this);
        this.onChangeValue = this.onChangeValue.bind(this);
        this.form.addChangeOne("text", this.onChangeText);
        this.form.addChangeOne("value", this.onChangeValue);
    }

    onChangeText(el, val) {
        this.props.item.text = val;
    }

    onChangeValue(el, val) {
        this.props.item.value = val;
    }

    onRemove(e, btn) {
        const {idx, list} = this.props;
        list.removeAt(idx);
    }

    render() {
        const {text, value} = this.props.item;
        return <div className="row margin-l-0 margin-r-0 margin-t-15 margin-b-5 flex">
            <ClearableInput name="text" type="text" placeholder="Deductible Title" defaultValue={text}
                            className="col-lg-6 no-border-r no-border-radius-r form-control"
                            onChange={this.form.onChange}/>
            <ClearableInput name="value" type="number" placeholder="Deductible Value" defaultValue={value}
                            className="col-lg-6 no-border-radius pull-right form-control"
                            onChange={this.form.onChange}/>
            <Button className="btn btn-primary fa fa-remove fixed-flex min-w-40 no-border-radius-l"
                    onClick={this.onRemove}/>
        </div>;
    }
}

export default EditDialog;
