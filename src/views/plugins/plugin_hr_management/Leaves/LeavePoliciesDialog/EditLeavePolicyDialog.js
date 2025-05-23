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

import style from "./EditLeavePolicyDialog.lazy.css";
import {findByIdEmployeeLeavePolicy} from "mutations/findById";
import {updateEmployeeLeavePolicy} from "mutations/update";
import SelectLeaveTypeInput from "../../../../../components/inputs/SelectLeaveTypeInput";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class EditDialog extends AEditDialog {
    pageKey = "EditLeavePolicyDialog";
    title = "Edit Leave Policy";
    findById = findByIdEmployeeLeavePolicy;
    removeById = updateEmployeeLeavePolicy;
    onUpdate = updateEmployeeLeavePolicy;

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

    // <editor-fold defaultstate="collapsed" desc="fields">
    @observable
    state = {};
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
            updateEmployeeLeavePolicy({id: this.item.id, ...data}).then(res => {
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
            if (!form.isValid('leave_type')) {
                infoDialog.open('Leave Type is required');
                return;
            }

            const {
                leave_type,
                default_days_allowed,
                max_carryover_years,
                accrual_period_start,
                accrual_period_end,
            } = form.data;

            const data = {};
            ShouldUpdate.checkLeaveType(data, old_data, leave_type, 'leave_type_id');
            ShouldUpdate.check(data, old_data, default_days_allowed, 'default_days_allowed');
            ShouldUpdate.check(data, old_data, max_carryover_years, 'max_carryover_years');
            ShouldUpdate.checkDate(data, old_data, accrual_period_start, 'accrual_period_start');
            ShouldUpdate.checkDate(data, old_data, accrual_period_end, 'accrual_period_end');

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
                onFormNext, onFormBack, onFormOpen,
                dialog: {renderProfileCover}
            },
            item: {
                id, data: {
                    created_at,
                    client,
                    leave_type,
                    default_days_allowed,
                    max_carryover_years,
                    accrual_period_start,
                    accrual_period_end,
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
                title="1. Leave Policy Details"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormSave={this.onFormSave}
            >
                <SelectLeaveTypeInput
                    name="leave_type"
                    defaultValue={leave_type}
                    placeholder="Leave Type..."
                    className="col-lg-12 form-control"
                    onChange={this.form.onChange}
                />
                <ClearableInput
                    name="default_days_allowed"
                    type="number"
                    defaultValue={default_days_allowed || 0}
                    placeholder="Default Days Allocated"
                    className="col-lg-12 form-control"
                    onChange={this.form.onChange}
                />
                <ClearableInput
                    name="max_carryover_years"
                    type="number"
                    defaultValue={max_carryover_years || 3}
                    placeholder="Max. Years To Carry Over"
                    className="col-lg-12 form-control"
                    onChange={this.form.onChange}
                />
                <ClearableInput
                    name="accrual_period_start"
                    type="date"
                    defaultValue={accrual_period_start}
                    placeholder="Accrual Period Start Date"
                    className="col-lg-12 form-control"
                    onChange={this.form.onChange}
                />
                <ClearableInput
                    name="accrual_period_end"
                    type="date"
                    defaultValue={accrual_period_end}
                    placeholder="Accrual Period End Date"
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