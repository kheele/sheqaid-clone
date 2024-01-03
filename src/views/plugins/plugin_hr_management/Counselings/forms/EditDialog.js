import React from "react";
import {observer} from 'mobx-react';
import {observable, computed} from 'mobx';
import {CircularProgress} from "@mui/material";

import Form from 'utils/Form';
import {ShouldUpdate} from 'utils/Utils';

import {AEditDialog} from 'components/dialogs';
import {ClearableInput, SelectEmployeeInput, UploadButton} from 'components/inputs';
import {NewEmployeeListTable} from 'components/FormTableComponents';
import {FormControls, Row} from 'components/FormComponents';

import style from "./EditDialog.lazy.css";
import updateEmployeeCounselling from "mutations/all/EmployeeCounselling/updateEmployeeCounselling";
import findByIdEmployeeCounselling from "mutations/all/EmployeeCounselling/findByIdEmployeeCounselling";

@observer
class EditDialog extends AEditDialog {
    pageKey = "EditCounselingDialog";
    className = "AEditEmployeeDocDialog";
    title = "Edit Counseling";
    removeById = updateEmployeeCounselling;

    constructor(props) {
        super(props, style);
    }

    get findById() {
        const {props: {isNewEmployee}} = this;
        if (isNewEmployee) return;
        return findByIdEmployeeCounselling;
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
    path = "plugin_sheq_assist/employees/counselling/";

    @observable
    state = {
        lists: {
            types: [
                'Directive Counseling',
                'Nondirective Counseling',
                'Cooperative Counseling',
                'Participative Counseling',
                'Desensitization',
                'Catharsis',
                'Insight',
                'Developing the new patterns'
            ].map(label => {
                return {label, value: label};
            }),
            reasons: [
                'Attendance',
                'Behaviour / Teamwork',
                'Inappropriate Conduct',
                'Inappropriate Dress',
                'Safety Violation',
                'Sleeping On The Job',
                'Substandard Work',
                'Violence'
            ].map(label => {
                return {label, value: label};
            })
        }
    };

    constructor(props) {
        super(props);

        this.onNext = this.onNext.bind(this);

        this.form = new Form();
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

        return true;
    }

    onSubmit(e, btn, onSaved) {
        const {form, isNewEmployee, item: {data: old_data}, props: {dialog: {props: {embeddedEmployee}}}} = this;

        if (!isNewEmployee && !embeddedEmployee && !form.isValid('employee')) {
            infoDialog.open('Employee is required');
            return;
        }

        if (isNewEmployee) {
            console.log("res", form.data)
            onSaved && onSaved(form.data);
            infoDialog.open("Record added.");
            infoDialog.close(2000);
            this.props.close();
            return;
        }

        const {
            //1
            employee,
            responsible_person,
            //2
            types,
            reasons,
            incident_desc,
            corrective_actions,
            counselling_hrs_to_complete,
            expiry_date,
            witness_list,
            //3
            doc
        } = form.data;

        const data = {};

        //1
        if (!embeddedEmployee) {
            ShouldUpdate.checkEmployee(data, old_data, employee, 'employee_id');
        }
        ShouldUpdate.checkEmployee(data, old_data, responsible_person, 'responsible_person_id');
        //2
        ShouldUpdate.check(data, old_data, types, 'types');
        ShouldUpdate.check(data, old_data, reasons, 'reasons');
        ShouldUpdate.check(data, old_data, incident_desc, 'incident_desc');
        ShouldUpdate.check(data, old_data, corrective_actions, 'corrective_actions');
        ShouldUpdate.check(data, old_data, counselling_hrs_to_complete, 'counselling_hrs_to_complete');
        ShouldUpdate.checkDate(data, old_data, expiry_date, 'expiry_date');
        ShouldUpdate.checkWitnessList(data, old_data, witness_list, 'witness_list');
        //3
        ShouldUpdate.checkFile(data, old_data, doc, 'doc');

        if (Object.keys(data).isEmpty()) {
            infoDialog.open("Nothing changed!");
            return;
        }

        console.log(data)

        btn.text("Saving...").disabled();
        progressDialog.open();
        updateEmployeeCounselling({id: this.item.id, ...data}).then(res => {
            console.log("res", res)
            onSaved && onSaved(res);
            infoDialog.open("Record successfully updated.");
            infoDialog.close(2000);
            this.props.close();
        }).finally(() => {
            btn.text("Save").enabled();
            setTimeout(() => progressDialog.close());
        });
    }

    get isNewEmployee() {
        const {props: {dialog: {props: {isNewEmployee}}}} = this;
        return isNewEmployee;
    }

    @computed
    get item() {
        return this.props.state.item;
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
                    //1
                    employee,
                    responsible_person,
                    //2
                    types,
                    reasons,
                    incident_desc,
                    corrective_actions,
                    counselling_hrs_to_complete,
                    expiry_date,
                    witness_list,
                    //3
                    doc
                }
            }
        } = this;

        return (<FormControls>
            <Row
                active
                rendered
                idx={1}
                title="1. Employee & Responsible Person"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
            >
                {!isNewEmployee && !embeddedEmployee &&
                    <SelectEmployeeInput name="employee" placeholder="Employee..." defaultValue={employee}
                                         className="col-lg-12 form-control" onChange={this.form.onChange}/>}
                <SelectEmployeeInput name="responsible_person" placeholder="Responsible Person..."
                                     defaultValue={responsible_person} defaultUser className="col-lg-12 form-control"
                                     onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={2}
                title="2. Counseling Details"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
                onFormBack={onFormBack}
            >
                <ClearableInput name="types" type="select_multi" placeholder="Counseling Types..." defaultValue={types}
                                required className="col-lg-12 form-control" onChange={this.form.onChange}
                                values={this.state.lists.types} returnValue add/>
                <ClearableInput name="reasons" type="select_multi" placeholder="Reasons For Counseling..."
                                defaultValue={reasons} required className="col-lg-12 form-control"
                                onChange={this.form.onChange} values={this.state.lists.reasons} returnValue add/>
                <ClearableInput name="incident_desc" type="textarea" placeholder="Description Of Incident"
                                defaultValue={incident_desc} className="col-lg-12 form-control"
                                onChange={this.form.onChange}/>
                <ClearableInput name="corrective_actions" type="textarea" placeholder="Corrective Actions"
                                defaultValue={corrective_actions} className="col-lg-12 form-control"
                                onChange={this.form.onChange}/>
                <ClearableInput name="counselling_hrs_to_complete" type="number"
                                placeholder="Counseling Hours To Complete"
                                defaultValue={counselling_hrs_to_complete} className="col-lg-6 form-control"
                                onChange={this.form.onChange}/>
                <ClearableInput name="expiry_date" type="date" placeholder="Completion Date..."
                                defaultValue={expiry_date}
                                required className="col-lg-6 form-control" onChange={this.form.onChange}/>
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
            >
                <UploadButton
                    name="doc"
                    buttonTitle="Upload File (PDF, Word or Photo)"
                    type={['PDF', 'Word', 'Image']}
                    showOnlyIcon
                    defaultValue={doc}
                    className="col-lg-12"
                    onChange={this.form.onChange}
                />
            </Row>
        </FormControls>);
    }
}

export default EditDialog;
