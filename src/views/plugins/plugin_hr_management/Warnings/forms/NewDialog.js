import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';
import {Dates, execWhen} from 'utils/Utils';

import {ANewDialog} from 'components/dialogs';
import {ClearableInput, Button, Clickable, SelectEmployeeInput, UploadButton} from 'components/inputs';
import {FormControls, NavButtons, Row} from 'components/FormComponents';
import {NewEmployeeListTable} from 'components/FormTableComponents';
import {mapPersonDetails} from 'utils/ArrayMapperUtils';

import style from "./NewDialog.lazy.css";
import {SignatureListRow} from "components/SignatureComponents";
import insertEmployeeWarning from "mutations/all/EmployeeWarning/insertEmployeeWarning";

@observer
class NewDialog extends ANewDialog {
    pageKey = "NewWarningDialog";
    className = "ANewEmployeeDocDialog";
    title = "Create Warning";

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return  Controls;
    }
}

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/employees/warnings/";

    @observable
    state = {
        lists: {
            warning_types: ['Verbal', 'Written', 'Final']
        }
    };

    constructor() {
        super();

        this.onNext = this.onNext.bind(this);
        this.onAddSignatures = this.onAddSignatures.bind(this);
        
        this.form = new Form();
        this.form.addChangeOne("date", this.onChangeDate.bind(this));
    }
    
    onChangeDate(el, val) {
        execWhen(() => this.refs.expiry_date).then(() => {
            const {
                expiry_date: expiry_date_ref
            } = this.refs;
            if(val) {
                expiry_date_ref && expiry_date_ref.onChange(val.addYears(1));
            }
        });
    }

    onAddSignatures() {

    }

    onNext(e, btn) {
        const {form, isNewEmployee, embeddedEmployee} = this;
        const {idx} = btn.props;
        if(idx === 1) {
            if (!isNewEmployee && !embeddedEmployee && !form.isValid('employee')) {
                infoDialog.open('Employee is required');
                return;
            }
        }
        if(idx === 2) {
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

    onSubmit(e, btn, onSaved) {
        const {form, isNewEmployee, embeddedEmployee} = this;

        if (!isNewEmployee && !embeddedEmployee && !form.isValid('employee')) {
            infoDialog.open('Employee is required');
            return;
        }
        if (!form.isValid('type')) {
            infoDialog.open('Warning Type is required');
            return;
        }
        if (!form.isValid('date')) {
            infoDialog.open('Warning Date is required');
            return;
        }

        if(isNewEmployee) {
            console.log("res", form.data)
            onSaved && onSaved(form.data);
            infoDialog.open("Record added.");
            infoDialog.close(2000);
            this.props.close();
            return;
        }

        const {
            employee, //
            issued_by,//
            type,//
            date,//
            expiry_date, //
            details,//
            employee_comments,//
            notes,//
            witness_list,//
            doc//
        } = form.data;
        const data = {
            employee_id: (embeddedEmployee || employee).id,
            doc: doc && doc.path,

            date: Dates.formatTimestampSQL(date),
            details,
            employee_comments,
            expiry_date: Dates.formatTimestampSQL(expiry_date),
            issued_by_id: issued_by && issued_by.id,
            notes,
            type,
            witness_list: {
                data: (witness_list || []).filter(v => !!v).map(({other_person, employee}) => {
                    if (other_person) {
                        delete other_person.id;
                        if (other_person.job_position) {
                            other_person.job_position_id = other_person.job_position.id;
                            delete other_person.job_position;
                        }
                    }
                    return {
                        witness_id: employee && employee.id,
                        witness_external: other_person && {
                            data: other_person
                        } || null,
                    };
                }),
            },
        };

        console.log(data)

        btn.text("Saving...").disabled();
        progressDialog.open();
        insertEmployeeWarning(data).then(employee_res => {
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

    get onSetSignatureSettings() {
        const {props: {dialog: {props: {onSetSignatureSettings}}}} = this;
        return onSetSignatureSettings;
    }

    get embeddedEmployee() {
        const {props: {dialog: {props: {embeddedEmployee}}}} = this;
        return embeddedEmployee;
    }

    get isNewEmployee() {
        const {props: {dialog: {props: {isNewEmployee}}}} = this;
        return isNewEmployee;
    }

    get employeeItem() {
        return this.props.state.item;
    }

    render() {
        const {isNewEmployee, embeddedEmployee, onSetSignatureSettings, props:{onFormNext, onFormBack, onFormOpen}} = this;

        return <FormControls>
            <Row
                rendered
                active
                idx={1}
                title="1. Employee & Person Issuing Warning"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
            >
                {!isNewEmployee && !embeddedEmployee && <SelectEmployeeInput name="employee" placeholder="Employee..." defaultValue={this.employeeItem} className="col-lg-12 form-control" onChange={this.form.onChange}/>}
                <SelectEmployeeInput name="issued_by" placeholder="Warning Issued By..." defaultUser className="col-lg-12 form-control" onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={2}
                title="2. Warning Details"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <ClearableInput name="type" type="select" placeholder="Warning Type..." className="col-lg-4 form-control" onChange={this.form.onChange} values={this.state.lists.warning_types} returnValue/>
                <ClearableInput ref="date" name="date" type="date" placeholder="Warning Date..." required className="col-lg-4 form-control" onChange={this.form.onChange}/>
                <ClearableInput ref="expiry_date" name="expiry_date" type="date" placeholder="Warning Expiry Date..." required className="col-lg-4 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="details" type="textarea" placeholder="Details Of Misconduct" required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="employee_comments" type="textarea" placeholder="Employee's Comments" required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="notes" type="textarea" placeholder="Notes" required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <label className="col-lg-12 margin-0 margin-t-10 padding-0 padding-b-0">Witness List</label>
                <NewEmployeeListTable name="witness_list" onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={3}
                title="3. Document"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <UploadButton
                    name="doc"
                    buttonTitle="Upload File (PDF, Word or Photo)"
                    type={['PDF', 'Word', 'Image']}
                    showOnlyIcon
                    className="col-lg-12"
                    onChange={this.form.onChange}
                />
            </Row>
            <SignatureListRow
                idx={4}
                pluginKey="HR"
                module="Warnings"
                onSetSignatureSettings={onSetSignatureSettings}
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
            >

            </SignatureListRow>
        </FormControls>;
    }
}

export default NewDialog;
