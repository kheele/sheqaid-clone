import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';

import {
    ClearableInput,
    SelectEmployeeInput,
    UploadButton
} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import ANewDialog from 'components/dialogs/ANewDialog';

import style from "./NewDialog.lazy.css";
import {Dates} from "utils/Dates";
import insertEmployeeLicense from "mutations/all/EmployeeLicense/insertEmployeeLicense";

@observer
class NewDialog extends ANewDialog {
    pageKey = "NewLicenseDialog";
    className = "ANewEmployeeDocDialog";
    title = "Create License";

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return  Controls;
    }
}

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/employees/licenses/";
    @observable
    state = {
    };

    constructor(props) {
        super(props);
        
        this.onNext = this.onNext.bind(this);
        
        this.form = new Form();
    }

    onNext(e, btn) {
        const {form, isNewEmployee} = this;
        const {idx} = btn.props;
        if(idx === 1) {
            if (!isNewEmployee && !form.isValid('employee')) {
                infoDialog.open('Employee is required');
                return;
            }
            if (!form.isValid('expiry_date')) {
                infoDialog.open('Expiry Date is required');
                return;
            }
        }
        if(idx === 2) {
            if (!form.isValid('doc')) {
                infoDialog.open('Please Upload License');
                return;
            }
        }
        
        return true;
    }
    
    onSubmit(e, btn, onSaved) {
        const {form, isNewEmployee} = this;

        if (!isNewEmployee && !form.isValid('employee')) {
            infoDialog.open('Employee is required');
            return;
        }
        if (!form.isValid('expiry_date')) {
            infoDialog.open('Expiry Date is required');
            return;
        }
        if (!form.isValid('doc')) {
            infoDialog.open('Please Upload License');
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
            employee,//
            date, expiry_date, notes, doc
        } = form.data;
        const data = {
            employee_id: employee.id,
            doc: doc && doc.path,

            date: Dates.formatTimestampSQL(date),
            expiry_date: Dates.formatTimestampSQL(expiry_date),
            notes,
        };

        console.log(data)

        btn.text("Saving...").disabled();
        progressDialog.open();
        insertEmployeeLicense(data).then(employee_res => {
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

    get employeeItem() {
        return this.props.state.item;
    }

    render() {
        const {isNewEmployee, props: {onFormNext, onFormBack, onFormOpen}} = this;

        return <FormControls>
            <Row
                rendered
                active
                idx={1}
                title="1. License Details "
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
            >
                {!isNewEmployee && <SelectEmployeeInput name="employee" placeholder="Employee..." defaultValue={this.employeeItem} className="col-lg-12 form-control" onChange={this.form.onChange}/>}
                <ClearableInput name="date" type="date" placeholder="Date..." required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="expiry_date" type="date" placeholder="Expiry Date..." required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="notes" type="textarea" placeholder="Notes" className="col-lg-12 form-control" onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={2}
                title="2. Document"
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
