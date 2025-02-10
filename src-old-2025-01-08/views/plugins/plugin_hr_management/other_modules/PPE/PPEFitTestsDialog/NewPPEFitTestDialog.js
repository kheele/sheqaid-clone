// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';

import {ANewDialog} from 'components/dialogs';
import {ClearableInput, RowOrgs, SelectPPETypeInput} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';

import style from "./NewPPEFitTestDialog.lazy.css";
import {insertPPEFitTest} from "mutations/create";
import SelectEmployeeInput from "../../../../../../components/inputs/SelectEmployeeInput";
import {Dates} from "../../../../../../utils/Dates";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class NewDialog extends ANewDialog {
    pageKey = "NewPPEFitTestDialog";
    title = "Create PPE Fit Test";

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
    state = {
        lists: {
            result: ['Pass', 'Fail'].map(value => ({text: value, value, checked: false})),
        },
    };
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
        if (!form.isValid('ppe_type')) {
            infoDialog.open('PPE Type is required');
            return;
        }
        if (!form.isValid('employee')) {
            infoDialog.open('Employee is required');
            return;
        }
        if (!form.isValid('result')) {
            infoDialog.open('Result is required');
            return;
        }
        if (!form.isValid('test_date')) {
            infoDialog.open('Test Date is required');
            return;
        }

        const {
            site,
            project,
            client,
            //
            test_date,
            next_due_date,
            result,
            notes,
            ppe_type,
            employee,
        } = form.data;
        const data = {
            client_id: client && client.id,
            project_id: project && project.id,
            site_id: site && site.id,
            //
            ppe_type_id: ppe_type.id,
            employee_id: employee.id,
            result,
            notes,
            test_date: Dates.formatDateSQL(test_date),
            next_due_date: Dates.formatDateSQL(next_due_date),
        };

        console.log(data)

        btn.text("Saving...").disabled();
        progressDialog.open();
        insertPPEFitTest(data).then(res => {
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
            <RowOrgs
                onChange={this.form.onChange}
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <Row
                    rendered
                    idx={1}
                    title="1. PPE Fit Test Details"
                    onFormNext={null}
                >
                    <SelectPPETypeInput
                        name="ppe_type"
                        placeholder="PPE Type..."
                        className="col-lg-12 form-control"
                        onChange={this.onChange}
                    />
                    <SelectEmployeeInput
                        name="employee"
                        placeholder="Employee..."
                        className="col-lg-12 form-control"
                        onChange={this.onChange}
                    />
                    <ClearableInput
                        name="result"
                        type="radio"
                        placeholder="Result"
                        className="col-lg-12 form-control"
                        values={this.state.lists.result}
                        onChange={this.form.onChange}
                    />
                    <ClearableInput
                        name="notes"
                        type="textarea"
                        placeholder="Notes"
                        className="col-lg-12 form-control"
                        onChange={this.form.onChange}
                    />
                    <ClearableInput
                        name="test_date"
                        type="date"
                        placeholder="Test Date"
                        className="col-lg-12 form-control"
                        onChange={this.form.onChange}
                    />
                    <ClearableInput
                        name="next_due_date"
                        type="date"
                        placeholder="Next Due Date"
                        className="col-lg-12 form-control"
                        onChange={this.form.onChange}
                    />
                </Row>
            </RowOrgs>
        </FormControls>);
    }

    // </editor-fold>
}

export default NewDialog;
