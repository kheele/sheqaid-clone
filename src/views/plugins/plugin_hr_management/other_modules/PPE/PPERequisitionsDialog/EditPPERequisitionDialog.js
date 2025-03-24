// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';
import {CircularProgress} from "@mui/material";

import Form from 'utils/Form';
import {ShouldUpdate} from 'utils/Utils';

import {AEditDialog} from 'components/dialogs';
import {ClearableInput, RowOrgs, SelectPPETypeInput} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';

import style from "./EditPPERequisitionDialog.lazy.css";
import {findByIdPPERequisition} from "mutations/findById";
import {updatePPERequisition} from "mutations/update";
import SelectEmployeeInput from "../../../../../../components/inputs/SelectEmployeeInput";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class EditDialog extends AEditDialog {
    pageKey = "EditPPERequisitionDialog";
    title = "Edit PPE Requisition";
    findById = findByIdPPERequisition;
    removeById = updatePPERequisition;

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
            updatePPERequisition({id: this.item.id, ...data}).then(res => {
                console.log("res", res)
                if (res === "EMAIL_DUP") {
                    infoDialog.open("An Employee with this email address already exist.");
                } else if (res === "PHONE_DUP") {
                    infoDialog.open("An Employee with this phone number address already exist.");
                } else {
                    const res_data = res;
                    onSaved && onSaved(res_data);
                    infoDialog.open("Record successfully updated.");
                    infoDialog.close(2000);
                    // this.props.close();
                }
            }).finally(() => {
                btn.text("Save").enabled();
                setTimeout(() => progressDialog.close());
            });
        };

        const {idx} = btn.props;
        if (idx === 0) {
            // const {isConsultant} = storage.is;
            // if (isConsultant && !form.isValid('client')) {
            //     infoDialog.open('Company is required');
            //     return;
            // }

            const {
                site, project, client,
            } = form.data;

            const data = {};

            if (isContractor) {
                ShouldUpdate.checkSite(data, old_data, site, 'contractor_site_id');
            } else {
                ShouldUpdate.checkClient(data, old_data, client);
                ShouldUpdate.checkProject(data, old_data, project);
                ShouldUpdate.checkSite(data, old_data, site);
            }

            onSubmit(data);
            return;
        }

        if (idx === 1) {
            if (!form.isValid('ppe_type')) {
                infoDialog.open('PPE Type is required');
                return;
            }
            if (!form.isValid('quantity')) {
                infoDialog.open('Quantity is required');
                return;
            }

            const {
                site, project, client,
                created_at,
                auto_reorder_trigger,
                approval_status,
                quantity,
                reason,
                ppe_type,
                employee,
            } = form.data;

            const data = {};
            ShouldUpdate.checkDate(data, old_data, created_at, 'created_at');
            ShouldUpdate.check(data, old_data, approval_status, 'approval_status');
            ShouldUpdate.check(data, old_data, quantity, 'quantity');
            ShouldUpdate.check(data, old_data, reason, 'reason');
            ShouldUpdate.checkPPEType(data, old_data, ppe_type, 'ppe_type_id');
            ShouldUpdate.checkEmployee(data, old_data, employee, 'employee_id');

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
                    site, project, client,
                    auto_reorder_trigger,
                    approval_status,
                    quantity,
                    reason,
                    ppe_type,
                    employee,
                }
            }
        } = this;

        return (<FormControls>
            <RowOrgs
                onChange={this.form.onChange}
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
                onFormSave={this.onFormSave}
            >
                <Row
                    rendered
                    idx={1}
                    title="1. PPE Requisition Details"
                    onFormNext={null}
                >
                    <SelectEmployeeInput
                        name="employee"
                        defaultValue={employee}
                        placeholder="Employee..."
                        className="col-lg-12 form-control"
                        onChange={this.onChange}
                    />
                    <SelectPPETypeInput
                        name="ppe_type"
                        defaultValue={ppe_type}
                        placeholder="PPE Type..."
                        className="col-lg-12 form-control"
                        onChange={this.onChange}
                    />
                    <ClearableInput
                        name="quantity"
                        type="number"
                        defaultValue={quantity}
                        placeholder="Quantity"
                        className="col-lg-12 form-control"
                        onChange={this.form.onChange}
                    />
                    <ClearableInput
                        name="reason"
                        type="textarea"
                        defaultValue={reason}
                        placeholder="Reason"
                        className="col-lg-12 form-control"
                        onChange={this.form.onChange}
                    />
                    <ClearableInput
                        name="created_at"
                        type="date"
                        defaultValue={created_at}
                        placeholder="Date"
                        className="col-lg-12 form-control"
                        onChange={this.form.onChange}
                    />
                    <ClearableInput
                        name="approval_status"
                        type="radio"
                        defaultValue={approval_status}
                        placeholder="Approval Status"
                        className="col-lg-12 form-control"
                        onChange={this.form.onChange}
                    />
                    <ClearableInput
                        name="auto_reorder_trigger"
                        type="select"
                        defaultValue={auto_reorder_trigger}
                        placeholder="Reorder Type"
                        className="col-lg-12 form-control"
                        onChange={this.form.onChange}
                    />
                </Row>
            </RowOrgs>
        </FormControls>);
    }

    // </editor-fold>
}

export default EditDialog;
