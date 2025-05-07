import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';
import {CircularProgress} from "@mui/material";

import Form from 'utils/Form';
import {execWhen, ShouldUpdate} from 'utils/Utils';

import {AEditDialog} from 'components/dialogs';
import {ClearableInput, SelectEmployeeInput} from 'components/inputs';
import {DocUploadOption, FormControls, Row} from 'components/FormComponents';
import {NewEmployeeListTable} from 'components/FormTableComponents';

import style from "./EditDialog.lazy.css";
import {updateEmployeeWarning} from "mutations/update";
import {findByIdEmployeeWarning} from "mutations/findById";

@observer
class EditDialog extends AEditDialog {
    pageKey = "EditWarningDialog";
    className = "AEditEmployeeDocDialog";
    title = "Edit Warning";
    removeById = updateEmployeeWarning;

    constructor(props) {
        super(props, style);
    }

    get findById() {
        const {props: {isNewEmployee}} = this;
        if (isNewEmployee) return;
        return findByIdEmployeeWarning;
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
    path = "plugin_sheq_assist/employees/warnings/";

    @observable
    state = {
        lists: {
            warning_types: ['Verbal', 'Written', 'Final', 'Work Termination'],
            category_of_misconduct: {
                Verbal: [
                    "Poor work performance, poor quality of work, low output/productivity",
                    "Failure to maintain machine or vehicle for which employee is responsible",
                    "Wasteful use of Company material and resources including stationery, electricity and water",
                    "Absence from work station without good reason",
                    "Late for work or leaving work early without good reason",
                    "Failure to notify manager during any period of absence",
                    "Breach of rule prescribed for good order, health or discipline",
                    "Consuming food or beverages in unauthorised areas",
                    "Smoking in non-smoking areas",
                    "Littering",
                    "Gambling or playing cards on Company property"
                ],
                Written: [
                    "Sleeping on duty",
                    "Careless damage to equipment or materials",
                    "Careless operation of equipment",
                    "Failure to use protective clothing and/or equipment when required to do so",
                    "Excessive personal use of Company telephones, email or internet",
                    "Not observing health, safety or security regulations",
                    "Absence from work 1–2 days without reason",
                    "Disrespectful behaviour or use of insulting language or signs",
                    "Failure to report in and out on commencement and ceasing of work"
                ],
                Final: [
                    "Absence from work for 3-4 days without reason",
                    "Absence on the day/shift before or after a public holiday without permission",
                    "Wilful disregard of rules relating to Company vehicles or equipment",
                    "Failure to carry out Company health and safety policies and procedures",
                    "Use of Company internet for accessing or distributing offensive material or information",
                    "Reckless or negligent driving on Company premises",
                    "Injury to another through carelessness or negligence",
                    "Abusive, aggressive, offensive and/or insulting language",
                    "Under the influence of alcohol or drugs at work",
                    "Unauthorised consumption of alcohol or administration of drugs (non-medicinal) on Company premises",
                    "Smoking where it is hazardous to do so",
                    "Receiving undeclared money or gifts from clients or suppliers",
                    "Unwelcome promotion of any religious, political or ethical dogma in the workplace"
                ],
                'Work Termination': [
                    "Refusal to work/ Refusal to obey a lawful and reasonable work instruction",
                    "Abuse of sick leave, altering or submitting fraudulently obtained medical certificate",
                    "Gross incompetence",
                    "Gross insubordination/serious disrespect",
                    "Wilful damage to, wilful neglect of, or destruction of Company property, tools, machinery etc.",
                    "Negligence when operating machinery and causing potential danger to others or to self",
                    "Assault, threat of assault or attempted assault",
                    "Unauthorised possession of a firearm or other dangerous weapon at work or on Company premises",
                    "Intimidation or incitement to violence",
                    "Discrimination or intimidation based on race, sex, creed, political beliefs, sexual orientation or the like",
                    "Harassment (including sexual harassment)",
                    "Bribery or attempted bribery",
                    "Theft of Company property or the property of colleagues",
                    "Unauthorised possession of Company property or the property of colleagues",
                    "Fraudulent timekeeping, including clocking in or out on a colleague’s clock card or allowing another to clock in or out on one’s own clock card",
                    "Misrepresentation of particulars on application for employment",
                    "Any action intended to defraud the Company",
                    "Wilfully making false reports or entering false returns or entries on Company documents or to management",
                    "Divulging confidential information to unauthorised persons relating to Company operations",
                    "Bringing the Company into disrepute by words or actions",
                    "Undertaking work with another firm or private work which is in direct competition with the Company without permission",
                    "Having financial or other interests in the business of a supplier, client, competitor or any business which might be construed as being a conflict of interest with the Company without written authorisation",
                    "Not declaring a financial or other interest of a close family member in the business of a supplier, client, competitor or any business which might be construed as being a conflict of interest with the Company",
                    "Desertion or absence from work without permission or good reason for five or more working days",
                    "Being found guilty of a criminal act which, in law, would be grounds for dismissal"
                ],
            },
        },
        type: null,
    };

    constructor() {
        super();

        this.onNext = this.onNext.bind(this);
        this.onFormSave = this.onFormSave.bind(this);

        this.form = new Form();
        this.form.addChangeOne("date", this.onChangeDate.bind(this));
        this.form.addChangeOne("type", this.onChangeType.bind(this));
    }

    get isNewEmployee() {
        const {props: {dialog: {props: {isNewEmployee}}}} = this;
        return isNewEmployee;
    }

    @computed
    get item() {
        return this.props.state.item;
    }

    onChangeDate(el, val) {
        this.props.execWhen(() => this.refs.expiry_date).then(() => {
            const {
                expiry_date: expiry_date_ref
            } = this.refs;
            if (val) {
                expiry_date_ref && expiry_date_ref.onChange(val.addYears(1));
            }
        });
    }

    onChangeType(el, val) {
        this.state.type = val;
        execWhen(() => this.refs.category_of_misconduct).then(ref => {
            if (val) {
                ref.list = this.state.lists.category_of_misconduct[val];
            }
        });
    }

    onNext(e, btn) {
        const {form, isNewEmployee, props: {dialog: {props: {embeddedEmployee}}}} = this;
        const {idx} = btn.props;
        if (idx === 1) {
            if (!isNewEmployee && !embeddedEmployee && !form.isValid('employee')) {
                infoDialog.open('Employee is required');
                return;
            }
        }
        if (idx === 2) {
            if (!form.isValid('type')) {
                infoDialog.open('Warning Type is required');
                return;
            }
            if (!form.isValid('date')) {
                infoDialog.open('Warning Date is required');
                return;
            }
        }

        return true;
    }

    //<editor-fold desc="onFormSave">
    async onFormSave(e, btn) {
        const {
            form,
            isNewEmployee,
            item: {id, data: old_data},
            props: {dialog: {props: {embeddedEmployee}}},
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
            updateEmployeeWarning({id: this.item.id, ...data}).then(res => {
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

        const {idx} = btn.props;

        if (idx === 1) {
            if (!isNewEmployee && !embeddedEmployee && !form.isValid('employee')) {
                infoDialog.open('Employee is required');
                return;
            }

            const {
                employee,
                issued_by,
            } = form.data;

            const data = {};

            if (!embeddedEmployee) {
                ShouldUpdate.checkEmployee(data, old_data, employee, 'employee_id');
            }
            ShouldUpdate.checkEmployee(data, old_data, issued_by, 'issued_by_id');

            onSubmit(data);
            return;
        }

        if (idx === 2) {
            if (!form.isValid('type')) {
                infoDialog.open('Warning Type is required');
                return;
            }
            if (!form.isValid('date')) {
                infoDialog.open('Warning Date is required');
                return;
            }

            const {
                type,
                category_of_misconduct,
                date,
                expiry_date,
                details,
                employee_comments,
                notes,
                witness_list,
            } = form.data;

            const data = {};

            ShouldUpdate.check(data, old_data, type, 'type');
            ShouldUpdate.check(data, old_data, category_of_misconduct, 'category_of_misconduct');
            ShouldUpdate.checkDate(data, old_data, date, 'date');
            ShouldUpdate.checkDate(data, old_data, expiry_date, 'expiry_date');
            ShouldUpdate.check(data, old_data, details, 'details');
            ShouldUpdate.check(data, old_data, employee_comments, 'employee_comments');
            ShouldUpdate.check(data, old_data, notes, 'notes');
            ShouldUpdate.checkWitnessList(data, old_data, witness_list, 'witness_list');

            onSubmit(data);
            return;
        }

        if (idx === 3) {
            const {
                doc,
            } = form.data;

            const data = {};

            ShouldUpdate.checkFile(data, old_data, doc, 'doc');

            onSubmit(data);
            return;
        }

        return true;
    }

    onSubmit(e, btn, onSaved) {
        const {form, isNewEmployee, item: {data: old_data}, props: {dialog: {props: {embeddedEmployee}}}} = this;

        if (!isNewEmployee && !embeddedEmployee && !form.isValid('employee')) {
            infoDialog.open('Employee is required');
            return;
        }
        //
        if (!form.isValid('type')) {
            infoDialog.open('Warning Type is required');
            return;
        }
        if (!form.isValid('date')) {
            infoDialog.open('Warning Date is required');
            return;
        }

        console.log("res", form.data)
        onSaved && onSaved(form.data);
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
                    issued_by,
                    type,
                    category_of_misconduct,
                    date,
                    expiry_date,
                    details,
                    employee_comments,
                    notes,
                    witness_list,
                    doc
                }
            }
        } = this;

        return <FormControls>
            <Row
                rendered
                active
                idx={1}
                title="1. Employee & Person Issuing Warning"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
                onFormSave={!isNewEmployee && this.onFormSave}
            >
                {!isNewEmployee && !embeddedEmployee &&
                    <SelectEmployeeInput name="employee" placeholder="Employee..." defaultValue={employee}
                                         className="col-lg-12 form-control" onChange={this.form.onChange}/>}
                <SelectEmployeeInput name="issued_by" placeholder="Warning Issued By..."
                                     defaultValue={issued_by} defaultUser className="col-lg-12 form-control"
                                     onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={2}
                title="2. Warning Details"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
                onFormSave={!isNewEmployee && this.onFormSave}
            >
                <ClearableInput name="type" type="select" placeholder="Warning Type..." defaultValue={type}
                                className="col-lg-12 form-control" onChange={this.form.onChange}
                                values={this.state.lists.warning_types} returnValue/>
                <CategoryOfMisconductWrapper defaultValue={category_of_misconduct} state={this.state}
                                             onChange={this.form.onChange}/>
                <ClearableInput name="details" type="textarea" placeholder="Details Of Misconduct"
                                defaultValue={details} required className="col-lg-12 form-control"
                                onChange={this.form.onChange}/>
                <ClearableInput name="employee_comments" type="textarea" placeholder="Employee's Comments"
                                defaultValue={employee_comments} required className="col-lg-12 form-control"
                                onChange={this.form.onChange}/>
                <ClearableInput name="notes" type="textarea" placeholder="Notes" defaultValue={notes} required
                                className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput ref="date" name="date" type="date" placeholder="Warning Date..."
                                defaultValue={date || new Date()} required className="col-lg-6 form-control"
                                onChange={this.form.onChange}/>
                <ClearableInput ref="expiry_date" name="expiry_date" type="date"
                                placeholder="Warning Expiry Date..." defaultValue={expiry_date} required
                                className="col-lg-6 form-control" onChange={this.form.onChange}/>
                <label className="col-lg-12 margin-0 margin-t-10 padding-0 padding-b-0">Witness List</label>
                <NewEmployeeListTable name="witness_list" defaultValue={[...(witness_list || []), null]}
                                      onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={3}
                title="3. Document"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormSave={!isNewEmployee && this.onFormSave}
            >
                <DocUploadOption
                    name="doc"
                    plugin="plugin_hr_management"
                    module="Warnings"
                    type={['PDF', 'Word', 'Image']}
                    defaultValue={doc}
                    onChange={this.form.onChange}
                    addChangeOne={this.form.addChangeOne}
                />
            </Row>
        </FormControls>;
    }
}

@observer
class CategoryOfMisconductWrapper extends React.Component {
    @computed get category_of_misconduct() {
        const {state} = this.props;
        return state.lists.category_of_misconduct[state.type] || [];
    }

    render() {
        const {defaultValue, onChange} = this.props;

        return (
            <ClearableInput
                key={new Date().getTime()}
                name="category_of_misconduct"
                type="select"
                placeholder="Category of Misconduct..."
                defaultValue={defaultValue}
                className="col-lg-12 form-control"
                onChange={onChange}
                values={this.category_of_misconduct}
                returnValue
            />
        )
    }
}

export default EditDialog;
