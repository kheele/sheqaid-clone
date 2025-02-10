import React from "react";
import {observer} from 'mobx-react';

import Form from 'utils/Form';

import {ShouldUpdate} from 'utils/Utils';
import {ClearableInput, UploadButton} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import {AEditDialog} from 'components/dialogs';

import style from "./EditDocumentDialog.lazy.css";
import {updateEmployeeDocDocument} from "mutations/updateWithCustomArgs";

//<editor-fold desc="EditDialog">
@observer
class EditDialog extends AEditDialog {
    pageKey = "EditDocumentDialog";
    title = "Edit Document Details";

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return Controls;
    }
}

//</editor-fold>

@observer
class Controls extends React.Component {

    state = {
        lists: {type: ['PrDP', 'ID/Passport'].map(label => ({label, value: label}))}
    };

    //<editor-fold desc="constructor">
    constructor() {
        super();

        this.onNext = this.onNext.bind(this);

        this.form = new Form();
    }

    //</editor-fold>

    get isNewEmployee() {
        const {props: {dialog: {props: {isNewEmployee}}}} = this;
        return isNewEmployee;
    }

    //</editor-fold>

    get item() {
        return this.props.state.item;
    }

    //</editor-fold>

    //<editor-fold desc="onNext">
    onNext(e, btn) {
        const {form} = this;
        const {idx} = btn.props;
        if (idx === 1) {
            if (!form.isValid('type')) {
                infoDialog.open("Document Type is required");
                return;
            }
            // if (!form.isValid('expiry_date')) {
            //     infoDialog.open("Expiry Date is required");
            //     return;
            // }
        }

        return true;
    }

    //<editor-fold desc="onSubmit">
    onSubmit(e, btn, onSaved) {
        const {form, isNewEmployee, item: {data: old_data}} = this;

        //1
        if (!form.isValid('type')) {
            infoDialog.open("Document Type is required");
            return;
        }
        // if (!form.isValid('expiry_date')) {
        //     infoDialog.open("Expiry Date is required");
        //     return;
        // }

        //2
        if (!form.isValid('doc')) {
            infoDialog.open("Document is required");
            return;
        }

        if (isNewEmployee) {
            console.log("res", form.data)
            onSaved && onSaved(form.data);
            infoDialog.open("Record added.");
            infoDialog.close(2000);
            this.props.close();
            return;
        }

        const {
            //1
            type,
            expiry_date,
            //2
            doc,
        } = form.data;
        const data = {};

        ShouldUpdate.check(data, old_data, type, 'type');
        ShouldUpdate.checkDate(data, old_data, expiry_date, 'expiry_date');
        ShouldUpdate.checkFile(data, old_data, doc, 'doc');

        if (Object.keys(data).isEmpty()) {
            infoDialog.open("Nothing changed!");
            return;
        }

        console.log(data)

        btn.text("Saving...").disabled();
        progressDialog.open();
        updateEmployeeDocDocument({id: this.item.id, ...data}).then(res => {
            console.log("res", res)
            onSaved && onSaved(res);
            infoDialog.open("Record successfully updated.");
            infoDialog.close(2000);
            this.props.close();
        }).finally(() => {
            btn.text("Save").enabled();
            setTimeout(() => progressDialog.close(), 0);
        });
    }

    //<editor-fold desc="render">
    render() {
        if (!this.item)
            return null;
        const {
            props: {
                onFormNext, onFormBack, onFormOpen,
                dialog, dialog: {renderProfileCover}
            },
            item, item: {
                id, data: {
                    created_at,
                    //1
                    type,
                    expiry_date,
                    //2
                    doc,
                }
            }
        } = this;

        const type__ = dialog.extraProp('type');

        console.log(this.item)

        return <FormControls>
            <Row
                rendered
                active
                idx={1}
                title="1. Document Details"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
            >
                <ClearableInput name="type" type="select" placeholder="Document Type..."
                                defaultValue={type || type__} className="col-lg-6 form-control"
                                onChange={this.form.onChange} values={this.state.lists.type} returnValue/>
                <ClearableInput name="expiry_date" type="date" placeholder="Expiry Date..."
                                defaultValue={expiry_date} className="col-lg-6 form-control"
                                onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={2}
                title="2. Document"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
            >
                <UploadButton
                    name="doc"
                    type={['PDF', 'Word', 'Image']}
                    showOnlyIcon
                    buttonTitle="Upload (PDF/Word/Image)"
                    defaultValue={doc}
                    className="col-lg-12"
                    onChange={this.form.onChange}
                />
            </Row>
        </FormControls>;
    }

    //</editor-fold>
}

export default EditDialog;
