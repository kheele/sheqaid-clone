import React from "react";
import {observer} from 'mobx-react';
import {computed, observable, toJS} from 'mobx';

import Form from 'utils/Form';
import {ANewDialog} from 'components/dialogs';
import {Button, ClearableInput, SelectEmployeeInput} from 'components/inputs';
import {DocUploadOption, FormControls, Row} from 'components/FormComponents';

import style from "./NewDialog.lazy.css";
import {insertEmployeeContract} from "mutations/create";

//<editor-fold desc="Dialog">
@observer
class NewDialog extends ANewDialog {
    pageKey = "NewContractDialog";
    className = "ANewEmployeeDocDialog";
    title = "Create Contract";

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return Controls;
    }
}

//</editor-fold>

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/employees/contracts/";

    @observable
    state = {
        index: 0,
    };

    constructor() {
        super();

        this.onNext = this.onNext.bind(this);

        this.form = new Form();
    }

    get onSetSignatureSettings() {
        const {props: {dialog: {props: {onSetSignatureSettings}}}} = this;
        return onSetSignatureSettings;
    }

    // </editor-fold>

    get embeddedEmployee() {
        const {props: {dialog: {props: {embeddedEmployee}}}} = this;
        return embeddedEmployee;
    }

    //</editor-fold>

    get isNewEmployee() {
        const {props: {dialog: {props: {isNewEmployee}}}} = this;
        return isNewEmployee;
    }

    //</editor-fold>

    get employeeItem() {
        return this.props.state.item;
    }

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

    //<editor-fold desc="onSubmit">
    onSubmit(e, btn, onSaved) {
        const {
            form,
            isNewEmployee,
            embeddedEmployee,
            refs: {contractDetailsTab, salaryInfoTab}
        } = this;

        if (!isNewEmployee && !embeddedEmployee) {
            if (!form.isValid('employee')) {
                infoDialog.open('Employee is required');
                return;
            }
        }

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

        if (isNewEmployee) {
            const data = {
                contractDetailsTab,
                salaryInfoTab,
                employee,
                doc,
                job_profile_doc,
            };

            console.log("res", data)
            onSaved && onSaved(data);
            infoDialog.open("Record added.");
            infoDialog.close(2000);
            this.props.close();
            return;
        }

        const data = {
            formData: {
                ...form.data,
                embeddedEmployee,
                contractDetailsFormData: contractDetailsTab.form.data,
                salaryInfoFormData: salaryInfoTab.form.data,
            },
        };

        console.log(data)

        btn.text("Saving...").disabled();
        progressDialog.open();
        insertEmployeeContract(data).then(employee_res => {
            console.log("res", employee_res)
            onSaved && onSaved(employee_res);
            infoDialog.open("Record successfully saved.");
            infoDialog.close(2000);
            this.props.close();
        }).finally(() => {
            btn.text("Save").enabled();
            setTimeout(() => progressDialog.close());
        });
    }

    // </editor-fold>

    //<editor-fold desc="render">
    render() {
        const {
            isNewEmployee,
            embeddedEmployee,
            onSetSignatureSettings,
            props: {onFormNext, onFormBack, onFormOpen, dialog: {props: {onRefs}}}
        } = this;

        let idx = !isNewEmployee && !embeddedEmployee ? 1 : 0;
        return <FormControls
            lazyLoad={false}
            form={this.form}
            onChange={this.form.onChange}
        >
            {!isNewEmployee && !embeddedEmployee && <Row
                rendered
                active
                idx={1}
                title='1. Employee'
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
            >
                <SelectEmployeeInput
                    name="employee"
                    placeholder="Employee..."
                    defaultValue={this.employeeItem}
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
                onFormBack={!isNewEmployee && !embeddedEmployee && onFormBack}
                onFormNext={onFormNext}
            >
                <ContractDetails
                    key='ContractDetails'
                    ref="contractDetailsTab"
                    embeddedEmployee={embeddedEmployee}
                    onRefs={onRefs}
                />
            </Row>
            <Row
                rendered
                idx={3}
                title={`${++idx}. Salary Information`}
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <SalaryInfo ref="salaryInfoTab"/>
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
                        activeAways
                        idx={4.1}
                        title={`${idx}.1. Contract Document Attachment`}
                        onFormOpen={onFormOpen}
                        onFormNext={onFormNext}
                    >
                        <DocUploadOption
                            name="doc"
                            plugin="plugin_hr_management"
                            module="Contracts"
                            type={['PDF', 'Word', 'Image']}
                            onChange={this.form.onChange}
                            addChangeOne={this.form.addChangeOne}
                        />
                    </Row>
                    <Row
                        rendered
                        activeAways
                        idx={4.2}
                        title={`${idx}.2. Job Profile Document Attachment`}
                        onFormOpen={onFormOpen}
                        onFormBack={onFormBack}
                    >
                        <DocUploadOption
                            name="job_profile_doc"
                            plugin="plugin_hr_management"
                            module="Contracts"
                            doc_type="Job Profile"
                            type={['PDF', 'Word', 'Image']}
                            onChange={this.form.onChange}
                            addChangeOne={this.form.addChangeOne}
                        />
                    </Row>
                </FormControls>
            </Row>
        </FormControls>;
    }

    //</editor-fold>
}

//<editor-fold desc="DocOptionWrapper">

//</editor-fold>

//<editor-fold desc="ContractDetails">
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
        const {embeddedEmployee, onRefs} = this.props;
        let start_date;
        if (embeddedEmployee) {
            const {employment_date} = embeddedEmployee.data || embeddedEmployee;
            start_date = employment_date;
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
        const {embeddedEmployee, onRefs} = this.props;
        const {defaultStartDate} = this;

        return <>
            <label className="margin-b-0 w-full">Contract Terms</label>
            <ClearableInput name="contract_type" type="radio" placeholder="Contract Type" vertical
                            className="col-lg-12 form-control" onChange={this.form.onChange}
                            values={this.state.lists.contract_type} returnValue/>
            <ClearableInput name="start_date" type="date" placeholder="Start Date..."
                            defaultValue={defaultStartDate}
                            className="col-lg-6 form-control"
                            onChange={this.form.onChange}/>
            <ClearableInput name="expiry_date" type="date" placeholder="End Date..." className="col-lg-6 form-control"
                            onChange={this.form.onChange}/>
            <ClearableInput name="end_of_trial_period" type="date" placeholder="End Of Trial Period..."
                            className="col-lg-6 form-control" onChange={this.form.onChange}/>
            <hr className="margin-b-10"/>
            <label className="margin-b-10 w-full">Working Schedule</label>
            <ClearableInput name="start_time" type="time" placeholder="Start Time" className="col-lg-6 form-control"
                            onChange={this.form.onChange}/>
            <ClearableInput name="end_time" type="time" placeholder="End Time" className="col-lg-6 form-control"
                            onChange={this.form.onChange}/>
            <ClearableInput name="daily_working_hours" type="number" placeholder="Daily Working Hours"
                            className="col-lg-6 form-control" defaultValue="8" onChange={this.form.onChange}/>
            <hr className="margin-b-10"/>
            <label className="margin-b-0 w-full">Notes</label>
            <ClearableInput name="notes" type="textarea" placeholder="Notes" className="col-lg-12 form-control"
                            onChange={this.form.onChange}/>
        </>;
    }
}

//</editor-fold>

//<editor-fold desc="SalaryInfo">
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
        return <>
            <ClearableInput name="payment_type" type="radio" placeholder="Payment Type"
                            className="col-lg-12 form-control"
                            onChange={this.form.onChange} values={this.state.lists.payment_types}/>
            <SalaryField state={this.state} onSalaryChange={this.form.onChange}
                         onSalaryIntervalChange={this.form.onChange}/>
            <WageField state={this.state} onChange={this.form.onChange}/>
            <Deductibles onChange={this.form.onChange}/>
        </>;
    }
}

//</editor-fold>

//<editor-fold desc="SalaryField">
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
        const {onSalaryChange, onSalaryIntervalChange, state: {isSalary}} = this.props;
        return !!isSalary && <React.Fragment>
            <ClearableInput name="salary_interval" type="radio" placeholder="Salary Interval"
                            className="col-lg-12 form-control" onChange={onSalaryIntervalChange}
                            values={this.state.lists.salary_intervals}/>
            <ClearableInput name="salary" type="number" placeholder="Salary" className="col-lg-12 form-control"
                            onChange={onSalaryChange}/>
        </React.Fragment>;
    }
}

//</editor-fold>

//<editor-fold desc="WageField">
@observer
class WageField extends React.Component {

    render() {
        const {onChange, state: {isWage}} = this.props;
        return !!isWage &&
            <ClearableInput name="wage" type="number" placeholder="Wage" className="col-lg-12 form-control"
                            onChange={onChange}/>;
    }
}

//</editor-fold>

//<editor-fold desc="Deductibles">
@observer
class Deductibles extends React.Component {

    @observable
    state = {
        list: []
    };

    constructor(props) {
        super(props);

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
        return <React.Fragment>
            <hr className="margin-r-10"/>
            <label className="hor-center margin-b-0">Deductibles</label>
            <div className="row margin-l-0 margin-r-10">
                {this.list.map((item, n) => <Deductible idx={n} item={item} list={this.list}/>)}
            </div>
            <hr className="hor-center w-100"/>
            <label className="hor-center margin-b-15">Deductibles Total : R {this.calculate}</label>
            <Button className="btn btn-primary hor-center margin-b-10" text="Add Deductible" onClick={this.onAdd}/>
        </React.Fragment>;
    }
}

//</editor-fold>

//<editor-fold desc="Deductible">
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
        return <div className="row margin-l-0 margin-r-0 margin-t-15 margin-b-5 flex">
            <ClearableInput name="text" type="text" placeholder="Deductible Title"
                            className="col-lg-6 no-border-r no-border-radius-r form-control"
                            onChange={this.form.onChange}/>
            <ClearableInput name="value" type="number" placeholder="Deductible Value"
                            className="col-lg-6 no-border-radius pull-right form-control"
                            onChange={this.form.onChange}/>
            <Button className="btn btn-primary fa fa-remove fixed-flex min-w-40 no-border-radius-l"
                    onClick={this.onRemove}/>
        </div>;
    }
}

//</editor-fold>

export default NewDialog;
