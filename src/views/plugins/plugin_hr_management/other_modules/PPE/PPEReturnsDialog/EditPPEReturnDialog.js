// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';
import {CircularProgress} from "@mui/material";

import Form from 'utils/Form';
import {ShouldUpdate} from 'utils/Utils';

import {AEditDialog} from 'components/dialogs';
import {ClearableInput, RowOrgs, UploadButton} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';

import style from "./EditPPEReturnDialog.lazy.css";
import {findByIdPPEReturn} from "mutations/findById";
import {updatePPEReturn} from "mutations/update";
import SelectPPEItemInput from "../../../../../../components/inputs/SelectPPEItemInput";
import SelectEmployeeInput from "../../../../../../components/inputs/SelectEmployeeInput";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class EditDialog extends AEditDialog {
    pageKey = "EditPPEReturnDialog";
    title = "Edit PPE Return";
    findById = findByIdPPEReturn;
    removeById = updatePPEReturn;

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
            updatePPEReturn({id: this.item.id, ...data}).then(res => {
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
                site, project, client,
                return_date,
                ppe_condition,
                ppe_item,
                employee,
                returner_signature,
                receiver_signature,
                doc,
            } = form.data;

            const data = {};
            ShouldUpdate.checkPPEItem(data, old_data, ppe_item, 'ppe_item');
            ShouldUpdate.checkEmployee(data, old_data, employee, 'employee');
            ShouldUpdate.check(data, old_data, ppe_condition, 'ppe_condition');
            ShouldUpdate.checkDate(data, old_data, return_date, 'return_date');
            ShouldUpdate.checkSignature(data, old_data, returner_signature, 'returner_signature');
            ShouldUpdate.checkSignature(data, old_data, receiver_signature, 'receiver_signature');
            ShouldUpdate.checkFile(data, old_data, doc, 'doc');

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
                    return_date,
                    ppe_condition,
                    ppe_item,
                    employee,
                    returner_signature,
                    receiver_signature,
                    doc,
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
                    title="1. PPE Return Details"
                    onFormNext={null}
                >
                    <SelectPPEItemInput
                        name="ppe_item"
                        defaultValue={ppe_item}
                        placeholder="PPE Item..."
                        className="col-lg-12 form-control"
                        onChange={this.onChange}
                    />
                    <SelectEmployeeInput
                        name="employee"
                        placeholder="Employee..."
                        defaultValue={employee}
                        className="col-lg-12 form-control"
                        onChange={this.onChange}
                    />
                    <ClearableInput
                        name="ppe_condition"
                        type="radio"
                        placeholder="PPE Condition"
                        defaultValue={ppe_condition}
                        className="col-lg-12 form-control"
                        values={this.state.lists.ppe_condition}
                        onChange={this.form.onChange}
                    />
                    <ClearableInput
                        name="returner_signature"
                        type="signature"
                        defaultValue={returner_signature}
                        placeholder="Returned By Signature"
                        className="col-lg-12 form-control"
                        onChange={this.form.onChange}
                    />
                    <ClearableInput
                        name="receiver_signature"
                        type="signature"
                        defaultValue={receiver_signature}
                        placeholder="Received By Signature"
                        className="col-lg-12 form-control"
                        onChange={this.form.onChange}
                    />
                    <ClearableInput
                        name="return_date"
                        type="date"
                        defaultValue={return_date}
                        placeholder="Return Date"
                        className="col-lg-12 form-control"
                        onChange={this.form.onChange}
                    />
                    <UploadButton
                        name="doc"
                        buttonTitle="PPE Photo On Return"
                        type={['Photo']}
                        defaultValue={doc}
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

export default EditDialog;
