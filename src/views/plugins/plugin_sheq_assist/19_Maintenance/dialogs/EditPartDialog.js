//<editor-fold desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import {
    ClearableInput,
    SelectAssetInput,
    SelectAssetTypeInput,
    SelectEmployeeInput,
    UploadButton
} from '../../../../../components/inputs';
import {AControls, FormControls, Row} from '../../../../../components/FormComponents';
import {AEditDialog} from '../../../../../components/dialogs';

import style from "./EditPartDialog.lazy.css";
import {NewPartItemOrderReceivedListTable} from "../../../../../components/FormTableComponents";
//</editor-fold>

//<editor-fold desc="Dialog">
@observer
class EditPartDialog extends AEditDialog {
    pageKey = "EditPartDialog";

    constructor(props) {
        super(props, style);
    }

    get title() {
        return "Edit Asset Part";
    }

    get controls() {
        return Controls;
    }
}

//</editor-fold>

@observer
class Controls extends AControls {

    // <editor-fold defaultstate="collapsed" desc="mounts">
    get title() {
        return 'Edit Asset Part';
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onNext">
    onNext(e, btn) {
        const {form} = this;
        const {idx} = btn.props;
        if (idx === 1) {
            if (!form.isValid('claim_number')) {
                infoDialog.open('Claim Number is required');
                return;
            }
            if (!form.isValid('accident_date')) {
                infoDialog.open('Date of Accident is required');
                return;
            }
        }
        if (idx === 2) {
            if (!form.isValid('company_name')) {
                infoDialog.open('Name of employer is required');
                return;
            }
            if (!form.isValid('company_str_addr')) {
                infoDialog.open('Employer Street Address is required');
                return;
            }
            if (!form.isValid('company_str_addr_code')) {
                infoDialog.open('Employer Postal Code is required');
                return;
            }
        }
        if (idx === 3) {
            if (!form.isValid('employee')) {
                infoDialog.open('Employee is required');
                return;
            }
            if (!form.isValid('id_num')) {
                infoDialog.open('Employee Identity Number is required');
                return;
            }
            if (!form.isValid('employee_str_addr')) {
                infoDialog.open('Employee Street Address is required');
                return;
            }
            if (!form.isValid('employee_str_addr_code')) {
                infoDialog.open('Employee Postal Code is required');
                return;
            }
        }
        if (idx === 4) {
        }
        if (idx === 5) {
        }

        return true;
    }

    // </editor-fold>

    //<editor-fold desc="onSubmit">
    onSubmit(e, btn, onSaved) {
        const data = super.onSubmit(e, btn, onSaved);

        console.log(data)

        onSaved(data);
        this.props.close();
    }

    //</editor-fold>

    get item() {
        return this.props.state.item;
    }

    //<editor-fold desc="render">
    render() {
        if (!this.item)
            return null;
        const {
            props: {
                onFormNext, onFormBack, onFormOpen,
                dialog: {renderProfileCover}
            },
            item, item: {
                id, data: {
                    created_at, status,
                    //1
                    name, asset, asset_type, part_photo,
                    //2
                    requested_by, date_requested, request_reason, measurement_unit, qty_requested,
                    //3
                    approving_manager, approving_manager_date,
                    approving_finance, approving_finance_date,
                    //4
                    qty_ordered, date_ordered,
                    //5
                    order_received_list
                }
            }
        } = this;

        return <FormControls>
            <Row
                rendered
                active
                idx={1}
                title="1. Part Details"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
            >
                <ClearableInput ref="name" name="name" type="text" placeholder="Part Name"
                                className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <SelectAssetInput ref="asset" name="asset" placeholder="Asset..." className="col-lg-12 form-control"
                                  onChange={this.form.onChange}/>
                <SelectAssetTypeInput name="asset_type" placeholder="Asset Type..." className="col-lg-12 form-control"
                                      onChange={this.form.onChange}/>
                <UploadButton name="part_photo" buttonTitle="Part Photo"
                              type={['Photo']}
                              showOnlyIcon
                              className="col-lg-12"
                              onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={2}
                title="2. Order Request"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <SelectEmployeeInput ref="requested_by" name="requested_by" placeholder="Requested By..."
                                     className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput ref="date_requested" name="date_requested" type="date" placeholder="Date Requested..."
                                className="col-lg-12 form-control" onChange={this.form.onChange}/>

                <hr className="margin-0"/>

                <ClearableInput ref="request_reason" name="request_reason" type="textarea"
                                placeholder="Reason For Request" className="col-lg-12 form-control"
                                onChange={this.form.onChange}/>

                <hr className="margin-0"/>

                <ClearableInput ref="measurement_unit" name="measurement_unit" type="select"
                                placeholder="Measurement Unit..." className="col-lg-12 form-control"
                                onChange={this.form.onChange}/>
                <ClearableInput ref="qty_requested" name="qty_requested" type="number" placeholder="Quantity Requested"
                                className="col-lg-12 form-control" onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={3}
                title="3. Request Approval"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <FormControls>
                    <Row
                        rendered
                        active
                        idx={3.1}
                        title="3.1. Manager Approval"
                        onFormOpen={onFormOpen}
                        onFormNext={onFormNext}
                    >
                        <SelectEmployeeInput ref="approving_manager" name="approving_manager"
                                             placeholder="Approving Manager..."
                                             className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <ClearableInput ref="approving_manager_date" name="approving_manager_date" type="date"
                                        placeholder="Date Approved..."
                                        className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    </Row>
                    <Row
                        rendered
                        idx={3.2}
                        title="3.2. Finance Approval"
                        onFormOpen={onFormOpen}
                        onFormBack={onFormBack}
                    >
                        <SelectEmployeeInput ref="approving_finance" name="approving_finance"
                                             placeholder="Finance Approving Person..."
                                             className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <ClearableInput ref="approving_finance_date" name="approving_finance_date" type="date"
                                        placeholder="Date Approved..."
                                        className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    </Row>
                </FormControls>
            </Row>
            <Row
                rendered
                idx={4}
                title="4. Order Details"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <ClearableInput ref="qty_ordered" name="qty_ordered" type="number" placeholder="Quantity Ordered"
                                className="col-lg-6 form-control" onChange={this.form.onChange}/>
                <ClearableInput ref="date_ordered" name="date_ordered" type="date" placeholder="Date Ordered..."
                                className="col-lg-6 form-control" onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={5}
                title="5. Orders Received"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
            >
                <NewPartItemOrderReceivedListTable ref='order_received_list' name='order_received_list' onChange={this.form.onChange}/>
            </Row>
        </FormControls>;
    }

    //</editor-fold>
}

export default EditPartDialog;
