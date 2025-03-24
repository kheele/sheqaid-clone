// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';

import {ANewDialog} from 'components/dialogs';
import {ClearableInput, RowOrgs, SelectPPETypeInput} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';

import style from "./NewPPERequisitionDialog.lazy.css";
import {insertPPERequisition} from "mutations/create";
import SelectEmployeeInput from "../../../../../../components/inputs/SelectEmployeeInput";
import {Dates} from "../../../../../../utils/Dates";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class NewDialog extends ANewDialog {
    pageKey = "NewPPERequisitionDialog";
    title = "Create PPE Requisition";

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
            duration_type: [
                {text: "Years", value: "Years", checked: false},
                {text: "Months", value: "Months", checked: false},
                {text: 'Weeks', value: 'Weeks', checked: false},
                {text: 'Days', value: 'Days', checked: false}
            ]
        },
        duration_type: null
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
        if (!form.isValid('quantity')) {
            infoDialog.open('Quantity is required');
            return;
        }

        const {
            site,
            project,
            client,
            //
            created_at,
            auto_reorder_trigger,
            approval_status,
            quantity,
            reason,
            ppe_type,
            employee,
        } = form.data;
        const data = {
            client_id: client && client.id,
            project_id: project && project.id,
            site_id: site && site.id,
            ppe_type_id: ppe_type.id,
            employee_id: employee.id,
            approval_status,
            quantity,
            reason,
            created_at: Dates.formatDateSQL(created_at),
        };

        console.log(data)

        btn.text("Saving...").disabled();
        progressDialog.open();
        insertPPERequisition(data).then(res => {
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
                    title="1. PPE Requisition Details"
                    onFormNext={null}
                >
                    <SelectEmployeeInput
                        name="employee"
                        placeholder="Employee..."
                        className="col-lg-12 form-control"
                        onChange={this.onChange}
                    />
                    <SelectPPETypeInput
                        name="ppe_type"
                        placeholder="PPE Type..."
                        className="col-lg-12 form-control"
                        onChange={this.onChange}
                    />
                    <ClearableInput
                        name="quantity"
                        type="number"
                        placeholder="Quantity"
                        className="col-lg-12 form-control"
                        onChange={this.form.onChange}
                    />
                    <ClearableInput
                        name="reason"
                        type="textarea"
                        placeholder="Reason"
                        className="col-lg-12 form-control"
                        onChange={this.form.onChange}
                    />
                    <ClearableInput
                        name="created_at"
                        type="date"
                        placeholder="Date"
                        className="col-lg-12 form-control"
                        onChange={this.form.onChange}
                    />
                    <ClearableInput
                        name="approval_status"
                        type="radio"
                        placeholder="Approval Status"
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
