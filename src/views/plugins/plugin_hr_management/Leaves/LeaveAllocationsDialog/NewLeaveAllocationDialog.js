// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';

import {ANewDialog} from 'components/dialogs';
import {ClearableInput} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';

import style from "./NewLeaveAllocationDialog.lazy.css";
import {insertEmployeeLeaveAllocation} from "mutations/create";
import SelectLeaveTypeInput from "components/inputs/SelectLeaveTypeInput";
import SelectEmployeeInput from "../../../../../components/inputs/SelectEmployeeInput";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class NewDialog extends ANewDialog {
    pageKey = "NewLeaveAllocationDialog";
    title = "Create Leave Allocation";

    constructor(props) {
        super(props, style);
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

        this.form = new Form();
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

    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    onSubmit(e, btn, onSaved) {
        const {form} = this;

        //1
        if (!form.isValid('employee')) {
            infoDialog.open('Employee is required');
            return;
        }

        //2
        if (!form.isValid('leave_type')) {
            infoDialog.open('Leave Type is required');
            return;
        }
        if (!form.isValid('year')) {
            infoDialog.open('Year is required');
            return;
        }

        const {
            employee,
            leave_type,
            days_allocated,
            days_used,
            days_carried_over,
            days_accrued,
            last_accrual_date,
            carryover_expiry_date,
            year,
        } = form.data;

        console.log(form.data)

        btn.text("Saving...").disabled();
        progressDialog.open();
        insertEmployeeLeaveAllocation(form.data).then(res => {
            console.log("res", res)
            onSaved && onSaved(res);
            infoDialog.open("Record successfully saved.");
            infoDialog.close(2000);
            this.props.close();
        }).finally(() => {
            btn.text("Save").enabled();
            setTimeout(() => progressDialog.close());
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {onFormNext, onFormBack, onFormOpen} = this.props;

        return (<FormControls>
            <Row
                active
                rendered
                idx={1}
                title="1. Employee"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
            >
                <SelectEmployeeInput
                    name="employee"
                    placeholder="Employee..."
                    className="col-lg-12 form-control"
                    onChange={this.form.onChange}
                />
            </Row>
            <Row
                rendered
                idx={2}
                title="2. Leave Allocation Details"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
            >
                <SelectLeaveTypeInput
                    name="leave_type"
                    placeholder="Leave Type..."
                    className="col-lg-12 form-control"
                    onChange={this.form.onChange}
                />
                <ClearableInput
                    name="year"
                    type="number"
                    defaultValue={new Date().getFullYear()}
                    placeholder="Year"
                    className="col-lg-12 form-control"
                    onChange={this.form.onChange}
                />
                <ClearableInput
                    name="days_allocated"
                    type="number"
                    defaultValue={0}
                    placeholder="Days Allocated"
                    className="col-lg-12 form-control"
                    onChange={this.form.onChange}
                />
                <ClearableInput
                    name="days_used"
                    type="number"
                    defaultValue={0}
                    placeholder="Days Used"
                    className="col-lg-12 form-control"
                    onChange={this.form.onChange}
                />
                <ClearableInput
                    name="days_carried_over"
                    type="number"
                    defaultValue={0}
                    placeholder="Days Carried Over"
                    className="col-lg-12 form-control"
                    onChange={this.form.onChange}
                />
                <ClearableInput
                    name="days_accrued"
                    type="number"
                    defaultValue={0}
                    placeholder="Days Accrued"
                    className="col-lg-12 form-control"
                    onChange={this.form.onChange}
                />
                <ClearableInput
                    name="last_accrual_date"
                    type="date"
                    placeholder="Last Accrual Date"
                    className="col-lg-12 form-control"
                    onChange={this.form.onChange}
                />
                <ClearableInput
                    name="carryover_expiry_date"
                    type="date"
                    placeholder="Carryover Expiry Date"
                    className="col-lg-12 form-control"
                    onChange={this.form.onChange}
                />
            </Row>
        </FormControls>);
    }

    // </editor-fold>
}

export default NewDialog;
