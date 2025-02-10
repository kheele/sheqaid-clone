// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';

import {ANewDialog} from 'components/dialogs';
import {ClearableInput, RowOrgs, UploadButton} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';

import style from "./NewPPEReturnDialog.lazy.css";
import {insertPPEReturn} from "mutations/create";
import SelectPPEItemInput from "../../../../../../components/inputs/SelectPPEItemInput";
import SelectEmployeeInput from "../../../../../../components/inputs/SelectEmployeeInput";
import {Dates} from "../../../../../../utils/Dates";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class NewDialog extends ANewDialog {
    pageKey = "NewPPEReturnDialog";
    title = "Create PPE Return";

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
            ppe_condition: ['New', 'Good', 'Fair', 'Poor', 'Unusable'].map(value => ({
                text: value,
                value,
                checked: false
            })),
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
        if (!form.isValid('ppe_item')) {
            infoDialog.open('PPE Item is required');
            return;
        }
        if (!form.isValid('employee')) {
            infoDialog.open('Employee is required');
            return;
        }
        if (!form.isValid('return_date')) {
            infoDialog.open('Return Date is required');
            return;
        }

        const {
            site,
            project,
            client,
            //
            return_date,
            ppe_condition,
            ppe_item,
            employee,
            returner_signature,
            receiver_signature,
            doc,
        } = form.data;
        const data = {
            client_id: client && client.id,
            project_id: project && project.id,
            site_id: site && site.id,
            ppe_item_id: ppe_item.id,
            employee_id: employee.id,
            return_date: Dates.formatDateSQL(return_date),
            ppe_condition,
            returner_signature,
            receiver_signature,
            doc,
        };

        console.log(data)

        btn.text("Saving...").disabled();
        progressDialog.open();
        insertPPEReturn(data).then(res => {
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
                    title="1. PPE Return Details"
                    onFormNext={null}
                >
                    <SelectPPEItemInput
                        name="ppe_item"
                        placeholder="PPE Item..."
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
                        name="ppe_condition"
                        type="radio"
                        placeholder="PPE Condition"
                        className="col-lg-12 form-control"
                        values={this.state.lists.ppe_condition}
                        onChange={this.form.onChange}
                    />
                    <ClearableInput
                        name="returner_signature"
                        type="signature"
                        placeholder="Returned By Signature"
                        className="col-lg-12 form-control"
                        onChange={this.form.onChange}
                    />
                    <ClearableInput
                        name="receiver_signature"
                        type="signature"
                        placeholder="Received By Signature"
                        className="col-lg-12 form-control"
                        onChange={this.form.onChange}
                    />
                    <ClearableInput
                        name="return_date"
                        type="date"
                        placeholder="Return Date"
                        className="col-lg-12 form-control"
                        onChange={this.form.onChange}
                    />
                    <UploadButton
                        name="doc"
                        buttonTitle="PPE Photo On Return"
                        type={['Photo']}
                        showOnlyIcon
                        className="col-lg-12"
                        onChange={this.form.onChange}
                    />
                </Row>
            </RowOrgs>
        </FormControls>);
    }

    // </editor-fold>
}

export default NewDialog;
