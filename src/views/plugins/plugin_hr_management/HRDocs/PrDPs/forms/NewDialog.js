import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';

import {ClearableInput, SelectEmployeeInput, UploadButton} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import ANewDialog from 'components/dialogs/ANewDialog';

import style from "./NewDialog.lazy.css";
import {Dates} from "utils/Dates";
import {insertEmployeeDocDocumentPrDP} from "mutations/create";

@observer
class NewDialog extends ANewDialog {
    pageKey = "NewPrDPDialog";
    className = "ANewEmployeeDocDialog";
    title = "Create PrDP";

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return Controls;
    }
}

@observer
class Controls extends React.Component {
    @observable
    state = {};

    constructor(props) {
        super(props);

        this.onNext = this.onNext.bind(this);

        this.form = new Form();
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

    onNext(e, btn) {
        const {form, isNewEmployee, embeddedEmployee} = this;
        const {idx} = btn.props;
        if (idx === 1) {
            if (!isNewEmployee && !embeddedEmployee && !form.isValid('employee')) {
                infoDialog.open('Employee is required');
                return;
            }
        }
        if (idx === 2) {
            if (!form.isValid('expiry_date')) {
                infoDialog.open('Expiry Date is required');
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
        if (!form.isValid('expiry_date')) {
            infoDialog.open('Expiry Date is required');
            return;
        }
        if (!form.isValid('doc')) {
            infoDialog.open('Please Upload PrDP');
            return;
        }

        if (isNewEmployee) {
            console.log("res", form.data)
            onSaved && onSaved({...form.data, type: "PrDP"});
            infoDialog.open("Record added.");
            infoDialog.close(2000);
            this.props.close();
            return;
        }

        const {
            employee,//
            expiry_date, doc
        } = form.data;
        const data = {
            employee_id: (embeddedEmployee || employee).id,
            doc,
            type: "PrDP",
            expiry_date: Dates.formatTimestampSQL(expiry_date),
        };

        console.log(data)

        btn.text("Saving...").disabled();
        progressDialog.open();
        insertEmployeeDocDocumentPrDP(data).then(employee_res => {
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

    render() {
        const {isNewEmployee, embeddedEmployee, props: {onFormNext, onFormBack, onFormOpen}} = this;

        let idx = !isNewEmployee && !embeddedEmployee ? 1 : 0;
        return <FormControls>
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
                title={`${++idx}. PrDP Details`}
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
                onFormBack={!isNewEmployee && !embeddedEmployee && onFormBack}
            >
                <ClearableInput name="expiry_date" type="date" placeholder="Expiry Date..." required
                                className="col-lg-12 form-control" onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={3}
                title={`${++idx}. Document`}
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
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
        </FormControls>;
    }
}

export default NewDialog;
