import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';
import {CircularProgress} from "@mui/material";

import Form from 'utils/Form';
import {ShouldUpdate} from 'utils/Utils';

import {AEditDialog} from 'components/dialogs';
import {ClearableInput, SelectEmployeeInput, UploadButton} from 'components/inputs';
import {NewEmployeeListTable} from 'components/FormTableComponents';
import {FormControls, Row} from 'components/FormComponents';

import style from "./EditDialog.lazy.css";
import {updateEmployeeCounselling} from "mutations/update";
import {findByIdEmployeeCounselling} from "mutations/findById";

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
        this.onFormSave = this.onFormSave.bind(this);

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

    onNext(e, btn) {
        const {form, isNewEmployee, embeddedEmployee} = this;
        const {idx} = btn.props;
        if (idx === 1) {
            if (!isNewEmployee && !embeddedEmployee && !form.isValid('employee')) {
                infoDialog.open('Employee is required');
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
            updateEmployeeCounselling({id: this.item.id, ...data}).then(res => {
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
                responsible_person,
            } = form.data;

            const data = {};

            if (!embeddedEmployee) {
                ShouldUpdate.checkEmployee(data, old_data, employee, 'employee_id');
            }
            ShouldUpdate.checkEmployee(data, old_data, responsible_person, 'responsible_person_id');

            onSubmit(data);
            return;
        }

        if (idx === 2) {
            const {
                //2
                types,
                reasons,
                incident_desc,
                corrective_actions,
                counselling_hrs_to_complete,
                expiry_date,
                witness_list,
            } = form.data;

            let data = {};

            ShouldUpdate.check(data, old_data, types, 'types');
            ShouldUpdate.check(data, old_data, reasons, 'reasons');
            ShouldUpdate.check(data, old_data, incident_desc, 'incident_desc');
            ShouldUpdate.check(data, old_data, corrective_actions, 'corrective_actions');
            ShouldUpdate.check(data, old_data, counselling_hrs_to_complete, 'counselling_hrs_to_complete');
            ShouldUpdate.checkDate(data, old_data, expiry_date, 'expiry_date');
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

        if (isNewEmployee) {
            console.log("res", form.data)
            onSaved && onSaved(form.data);
            infoDialog.open("Record added.");
            infoDialog.close(2000);
            this.props.close();
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
                onFormSave={!isNewEmployee && this.onFormSave}
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
                onFormSave={!isNewEmployee && this.onFormSave}
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
                onFormSave={!isNewEmployee && this.onFormSave}
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
