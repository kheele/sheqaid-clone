// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';
import {CircularProgress} from "@mui/material";

import Form from 'utils/Form';
import {ShouldUpdate} from 'utils/Utils';

import {AEditDialog} from 'components/dialogs';
import {ClearableInput, SelectClientInput} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';

import style from "./EditLeaveTypeDialog.lazy.css";
import {findByIdEmployeeLeaveType} from "mutations/findById";
import {updateEmployeeLeaveType} from "mutations/update";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class EditDialog extends AEditDialog {
    pageKey = "EditLeaveTypeDialog";
    title = "Edit Leave Type";
    findById = findByIdEmployeeLeaveType;
    removeById = updateEmployeeLeaveType;
    onUpdate = updateEmployeeLeaveType;

    constructor(props) {
        super(props, style);
    }

    get topButtonsHiddenSave() {
        return true;
    }

    get controls() {
        return Controls;
    }
}

// </editor-fold>

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/employees/ppe/";

    // <editor-fold defaultstate="collapsed" desc="fields">
    @observable state = {
        lists: {
            duration_type: [{text: "Years", value: "Years", checked: false}, {
                text: "Months",
                value: "Months",
                checked: false
            }, {text: 'Weeks', value: 'Weeks', checked: false}, {text: 'Days', value: 'Days', checked: false}]
        }, duration_type: null
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor() {
        super();

        this.onNext = this.onNext.bind(this);
        this.onFormSave = this.onFormSave.bind(this);

        this.form = new Form();
    }

    // </editor-fold>

    @computed get item() {
        return this.props.state.item;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onNext">
    onNext(e, btn) {
        const {form} = this;
        const {idx} = btn.props;
        if (idx === 0) {
            if (!form.isValid('client')) {
                infoDialog.open('Company is required');
                return;
            }
        }

        return true;
    }

    // </editor-fold>

    //<editor-fold desc="onFormSave">
    async onFormSave(e, btn) {
        const {
            form, item: {id, data: old_data},
            props: {dialog: {onProcessUpdateOrgs}},
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
            updateEmployeeLeaveType({id: this.item.id, ...data}).then(res => {
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
        if (idx === 0) {
            return onProcessUpdateOrgs(btn);
        }

        if (idx === 1) {
            if (!form.isValid('name')) {
                infoDialog.open('Name is required');
                return;
            }

            const {
                name,
                desc,
            } = form.data;

            const data = {};
            ShouldUpdate.check(data, old_data, name, 'name');
            ShouldUpdate.check(data, old_data, desc, 'desc');

            onSubmit(data);
            return;
        }

        return true;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        if (!this.item) {
            return <CircularProgress className="fixed-center"/>;
        }

        let {
            props: {
                onFormNext, onFormBack, onFormOpen, dialog: {renderProfileCover}
            }, item: {
                id, data: {
                    created_at, client, name, desc,
                }
            }
        } = this;

        const {isConsultant, isNoProjects} = storage.is;
        return (<FormControls>
            {!isNoProjects && <Row
                active
                rendered
                idx={0}
                title="Company"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
                onFormSave={this.onFormSave}
            >
                <SelectClientInput name="client" placeholder="Company..." defaultValue={client}
                                   className="col-lg-12 form-control" onChange={this.form.onChange}/>
            </Row>}
            <Row
                rendered
                active={isNoProjects}
                idx={1}
                title="1. Leave Type Details"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormSave={this.onFormSave}
            >
                <ClearableInput
                    name="name"
                    type="text"
                    defaultValue={name}
                    placeholder="Name"
                    className="col-lg-12 form-control"
                    onChange={this.form.onChange}
                />
                <ClearableInput
                    name="desc"
                    type="textarea"
                    defaultValue={desc}
                    placeholder="Description"
                    className="col-lg-12 form-control"
                    onChange={this.form.onChange}
                />
            </Row>
        </FormControls>);
    }

    // </editor-fold>
}

export default EditDialog;
//288