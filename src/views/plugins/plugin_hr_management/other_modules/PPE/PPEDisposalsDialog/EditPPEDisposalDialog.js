// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';
import {CircularProgress} from "@mui/material";

import Form from 'utils/Form';
import {ShouldUpdate} from 'utils/Utils';

import {AEditDialog} from 'components/dialogs';
import {ClearableInput, RowOrgs} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';

import style from "./EditPPEDisposalDialog.lazy.css";
import {findByIdPPEDisposal} from "mutations/findById";
import {updatePPEDisposal} from "mutations/update";
import SelectPPEItemInput from "../../../../../../components/inputs/SelectPPEItemInput";
import SelectEmployeeInput from "../../../../../../components/inputs/SelectEmployeeInput";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class EditDialog extends AEditDialog {
    pageKey = "EditPPEDisposalDialog";
    title = "Edit PPE Disposal";
    findById = findByIdPPEDisposal;
    removeById = updatePPEDisposal;

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
            method: ['Recycling', 'Incineration', 'Other'].map(value => ({text: value, value, checked: false})),
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
            updatePPEDisposal({id: this.item.id, ...data}).then(res => {
                console.log("res", res)
                if (!res) {
                    infoDialog.open("An error occurred. Please try again.");
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
            if (!form.isValid('disposed_by')) {
                infoDialog.open('Disposed By is required');
                return;
            }
            if (!form.isValid('disposal_date')) {
                infoDialog.open('Disposal Date is required');
                return;
            }

            const {
                disposal_date,
                method,
                reason,
                ppe_item,
                disposed_by,
            } = form.data;

            const data = {};
            ShouldUpdate.checkPPEItem(data, old_data, ppe_item, 'ppe_item');
            ShouldUpdate.checkEmployee(data, old_data, disposed_by, 'disposed_by');
            ShouldUpdate.check(data, old_data, method, 'method');
            ShouldUpdate.check(data, old_data, reason, 'reason');
            ShouldUpdate.checkDate(data, old_data, disposal_date, 'disposal_date');

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
                    site, project, client,
                    disposal_date,
                    method,
                    reason,
                    ppe_item,
                    disposed_by,
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
                    title="1. PPE Disposal Details"
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
                        name="disposed_by"
                        defaultValue={disposed_by}
                        placeholder="Disposed By..."
                        className="col-lg-12 form-control"
                        onChange={this.onChange}
                    />
                    <ClearableInput
                        name="method"
                        type="radio"
                        defaultValue={method}
                        placeholder="Disposal Method"
                        className="col-lg-12 form-control"
                        values={this.state.lists.method}
                        onChange={this.form.onChange}
                    />
                    <ClearableInput
                        name="reason"
                        type="textarea"
                        defaultValue={reason}
                        placeholder="Disposal Reason"
                        className="col-lg-12 form-control"
                        onChange={this.form.onChange}
                    />
                    <ClearableInput
                        name="disposal_date"
                        type="date"
                        defaultValue={disposal_date}
                        placeholder="Disposal Date"
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
