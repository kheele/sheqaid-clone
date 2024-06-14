import React from "react";
import {observer} from 'mobx-react';

import Form from 'utils/Form';

import {ClearableInput, UploadButton} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import {ANewDialog} from 'components/dialogs';

import style from "./NewDocumentDialog.lazy.css";
import insertEmployeeDocDocument from "mutations/all/EmployeeDocument/EmployeeDocDocument/insertEmployeeDocDocument";
import {Dates} from "utils/Dates";

//<editor-fold desc="NewDialog">
@observer
class NewDialog extends ANewDialog {
    pageKey = "NewDocumentDialog";
    title = "Create Document Details";

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

    get employeeItem() {
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
        const {form, isNewEmployee} = this;

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
        const data = {
            employee_id: this.employeeItem.id,
            is_default: true,
            //1
            type,
            expiry_date: Dates.formatDateSQL(expiry_date),
            //2
            doc: doc && doc.path,
        };

        console.log(data)

        btn.text("Saving...").disabled();
        progressDialog.open();
        insertEmployeeDocDocument(data).then(res => {
            console.log("res", res)
            onSaved && onSaved(res);
            infoDialog.open("Record successfully saved.");
            infoDialog.close(2000);
            this.props.close();
        }).finally(() => {
            btn.text("Save").enabled();
            setTimeout(() => progressDialog.close(), 0);
        });
    }

    //<editor-fold desc="render">
    render() {
        let {props: {onFormNext, onFormBack, onFormOpen, dialog}} = this;
        const type__ = dialog.extraProp('type');

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
                                defaultValue={type__} className="col-lg-6 form-control"
                                onChange={this.form.onChange} values={this.state.lists.type} returnValue/>
                <ClearableInput name="expiry_date" type="date" placeholder="Expiry Date..."
                                className="col-lg-6 form-control"
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
                    className="col-lg-12"
                    onChange={this.form.onChange}
                />
            </Row>
        </FormControls>;
    }

    //</editor-fold>
}

export default NewDialog;
