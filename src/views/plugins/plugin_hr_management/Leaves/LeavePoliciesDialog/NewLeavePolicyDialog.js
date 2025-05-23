// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';

import {ANewDialog} from 'components/dialogs';
import {ClearableInput, SelectClientInput} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';

import style from "./NewLeavePolicyDialog.lazy.css";
import {insertEmployeeLeavePolicy} from "mutations/create";
import SelectLeaveTypeInput from "components/inputs/SelectLeaveTypeInput";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class NewDialog extends ANewDialog {
    pageKey = "NewLeavePolicyDialog";
    title = "Create Leave Policy";

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
        if (idx === 0) {
            if (!form.isValid('client')) {
                infoDialog.open('Company is required');
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
        if (!form.isValid('client')) {
            infoDialog.open('Company is required');
            return;
        }

        //2
        if (!form.isValid('leave_type')) {
            infoDialog.open('Leave Type is required');
            return;
        }

        const {
            client,
            //
            leave_type,
            default_days_allowed,
            max_carryover_years,
            accrual_period_start,
            accrual_period_end,
        } = form.data;

        console.log(form.data)

        btn.text("Saving...").disabled();
        progressDialog.open();
        insertEmployeeLeavePolicy(form.data).then(res => {
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

        const {isConsultant, isNoProjects} = storage.is;
        return (<FormControls>
            {!isNoProjects && <Row
                active
                rendered
                idx={0}
                title="Company"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
            >
                <SelectClientInput name="client" placeholder="Company..." required
                                   className="col-lg-12 form-control" onChange={this.form.onChange}/>
            </Row>}
            <Row
                rendered
                active={isNoProjects}
                idx={1}
                title="1. Leave Policy Details"
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
                    name="default_days_allowed"
                    type="number"
                    defaultValue={0}
                    placeholder="Default Days Allocated"
                    className="col-lg-12 form-control"
                    onChange={this.form.onChange}
                />
                <ClearableInput
                    name="max_carryover_years"
                    type="number"
                    defaultValue={3}
                    placeholder="Max. Years To Carry Over"
                    className="col-lg-12 form-control"
                    onChange={this.form.onChange}
                />
                <ClearableInput
                    name="accrual_period_start"
                    type="date"
                    placeholder="Accrual Period Start Date"
                    className="col-lg-12 form-control"
                    onChange={this.form.onChange}
                />
                <ClearableInput
                    name="accrual_period_end"
                    type="date"
                    placeholder="Accrual Period End Date"
                    className="col-lg-12 form-control"
                    onChange={this.form.onChange}
                />
            </Row>
        </FormControls>);
    }

    // </editor-fold>
}

export default NewDialog;
