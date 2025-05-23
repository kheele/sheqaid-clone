// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';
import {CircularProgress} from "@mui/material";

import Form from 'utils/Form';
import {ShouldUpdate} from 'utils/Utils';

import {AEditDialog} from 'components/dialogs';
import {ClearableInput} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';

import style from "./EditLeaveAllocationDialog.lazy.css";
import {findByIdEmployeeLeaveAllocation} from "mutations/findById";
import {updateEmployeeLeaveAllocation} from "mutations/update";
import SelectLeaveTypeInput from "components/inputs/SelectLeaveTypeInput";
import SelectEmployeeInput from "components/inputs/SelectEmployeeInput";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class EditDialog extends AEditDialog {
    pageKey = "EditLeaveAllocationDialog";
    title = "Edit Leave Allocation";
    removeById = updateEmployeeLeaveAllocation;
    onUpdate = updateEmployeeLeaveAllocation;

    constructor(props) {
        super(props, style);
    }

    get findById() {
        const {props: {isNewEmployee}} = this;
        if (isNewEmployee) return;
        return findByIdEmployeeLeaveAllocation;
    }

    get topButtonsHiddenDelete() {
        const {props: {isNewEmployee}} = this;
        if (isNewEmployee) return true;
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
        if (idx === 1) {
            if (!form.isValid('employee')) {
                infoDialog.open('Employee is required');
                return;
            }
        }

        return true;
    }

    // </editor-fold>

    //<editor-fold desc="onFormSave">
    async onFormSave(e, btn) {
        const {
            form,
            item: {id, data: old_data},
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
            updateEmployeeLeaveAllocation({id: this.item.id, ...data}).then(res => {
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
            if (!form.isValid('employee')) {
                infoDialog.open('Employee is required');
                return;
            }

            const {
                employee
            } = form.data;

            const data = {};
            ShouldUpdate.checkEmployee(data, old_data, employee, 'employee_id');

            onSubmit(data);
            return;
        }

        if (idx === 2) {
            if (!form.isValid('leave_type')) {
                infoDialog.open('Leave Type is required');
                return;
            }
            if (!form.isValid('year')) {
                infoDialog.open('Year is required');
                return;
            }

            const {
                leave_type,
                days_allocated,
                days_used,
                days_carried_over,
                days_accrued,
                last_accrual_date,
                carryover_expiry_date,
                year,
            } = form.data;

            const data = {};
            ShouldUpdate.checkLeaveType(data, old_data, leave_type, 'leave_type_id');
            ShouldUpdate.check(data, old_data, days_allocated, 'days_allocated');
            ShouldUpdate.check(data, old_data, days_used, 'days_used');
            ShouldUpdate.check(data, old_data, days_carried_over, 'days_carried_over');
            ShouldUpdate.check(data, old_data, days_accrued, 'days_accrued');
            ShouldUpdate.checkDate(data, old_data, last_accrual_date, 'last_accrual_date');
            ShouldUpdate.checkDate(data, old_data, carryover_expiry_date, 'carryover_expiry_date');
            ShouldUpdate.check(data, old_data, year, 'year');

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
                dialog: {props: {embeddedEmployee, isNewEmployee,}}
            },
            item: {
                id, data: {
                    client,
                    employee,
                    leave_type,
                    days_allocated,
                    days_used,
                    days_carried_over,
                    days_accrued,
                    last_accrual_date,
                    carryover_expiry_date,
                    year,
                }
            }
        } = this;

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
                title={`${++idx}. Leave Allocation Details`}
                onFormOpen={onFormOpen}
                onFormBack={!isNewEmployee && !embeddedEmployee && onFormBack}
                onFormSave={!isNewEmployee && this.onFormSave}
            >
                <SelectLeaveTypeInput
                    name="leave_type"
                    placeholder="Leave Type..."
                    defaultValue={leave_type}
                    className="col-lg-12 form-control"
                    onChange={this.form.onChange}
                />
                <ClearableInput
                    name="year"
                    type="number"
                    defaultValue={year || new Date().getFullYear()}
                    placeholder="Year"
                    className="col-lg-12 form-control"
                    onChange={this.form.onChange}
                />
                <ClearableInput
                    name="days_allocated"
                    type="number"
                    defaultValue={days_allocated}
                    placeholder="Days Allocated"
                    className="col-lg-12 form-control"
                    onChange={this.form.onChange}
                />
                <ClearableInput
                    name="days_used"
                    type="number"
                    defaultValue={days_used}
                    placeholder="Days Used"
                    className="col-lg-12 form-control"
                    onChange={this.form.onChange}
                />
                <ClearableInput
                    name="days_carried_over"
                    type="number"
                    defaultValue={days_carried_over}
                    placeholder="Days Carried Over"
                    className="col-lg-12 form-control"
                    onChange={this.form.onChange}
                />
                <ClearableInput
                    name="days_accrued"
                    type="number"
                    defaultValue={days_accrued}
                    placeholder="Days Accrued"
                    className="col-lg-12 form-control"
                    onChange={this.form.onChange}
                />
                <ClearableInput
                    name="last_accrual_date"
                    type="date"
                    placeholder="Last Accrual Date"
                    defaultValue={last_accrual_date}
                    className="col-lg-12 form-control"
                    onChange={this.form.onChange}
                />
                <ClearableInput
                    name="carryover_expiry_date"
                    type="date"
                    placeholder="Carryover Expiry Date"
                    defaultValue={carryover_expiry_date}
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