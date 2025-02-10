// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';

import {ANewDialog} from 'components/dialogs';
import {ClearableInput, RowOrgs} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';

import style from "./NewPPEDisposalDialog.lazy.css";
import {insertPPEDisposal} from "mutations/create";
import SelectPPEItemInput from "../../../../../../components/inputs/SelectPPEItemInput";
import SelectEmployeeInput from "../../../../../../components/inputs/SelectEmployeeInput";
import {Dates} from "../../../../../../utils/Dates";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class NewDialog extends ANewDialog {
    pageKey = "NewPPEDisposalDialog";
    title = "Create PPE Disposal";

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
        if (!form.isValid('disposed_by')) {
            infoDialog.open('Disposed By is required');
            return;
        }
        if (!form.isValid('disposal_date')) {
            infoDialog.open('Disposal Date is required');
            return;
        }

        const {
            site,
            project,
            client,
            //
            disposal_date,
            method,
            reason,
            ppe_item,
            disposed_by,
        } = form.data;
        const data = {
            client_id: client && client.id,
            project_id: project && project.id,
            site_id: site && site.id,
            //
            disposal_date: Dates.formatDateSQL(disposal_date),
            method,
            reason,
            ppe_item_id: ppe_item.id,
            disposed_by_id: disposed_by.id,
        };

        console.log(data)

        btn.text("Saving...").disabled();
        progressDialog.open();
        insertPPEDisposal(data).then(res => {
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
                    title="1. PPE Disposal Details"
                    onFormNext={null}
                >
                    <SelectPPEItemInput
                        name="ppe_item"
                        placeholder="PPE Item..."
                        className="col-lg-12 form-control"
                        onChange={this.onChange}
                    />
                    <SelectEmployeeInput
                        name="disposed_by"
                        placeholder="Disposed By..."
                        className="col-lg-12 form-control"
                        onChange={this.onChange}
                    />
                    <ClearableInput
                        name="method"
                        type="radio"
                        placeholder="Disposal Method"
                        className="col-lg-12 form-control"
                        values={this.state.lists.method}
                        onChange={this.form.onChange}
                    />
                    <ClearableInput
                        name="reason"
                        type="textarea"
                        placeholder="Disposal Reason"
                        className="col-lg-12 form-control"
                        onChange={this.form.onChange}
                    />
                    <ClearableInput
                        name="disposal_date"
                        type="date"
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

export default NewDialog;
