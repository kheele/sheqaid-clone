import React from "react";
import {observer} from 'mobx-react';

import Form from 'utils/Form';

import {ClearableInput, UploadButton} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import {ANewDialog} from 'components/dialogs';

import style from "./NewDocBankingDetailsDialog.lazy.css";
import {insertEmployeeDocBankingDetail} from "mutations/create";

//<editor-fold desc="NewDialog">
@observer
class NewDialog extends ANewDialog {
    pageKey = "NewBankingDetailsDialog";
    title = "Create Banking Details";

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
            if (!form.isValid('name')) {
                infoDialog.open('Bank Name is required');
                return;
            }
            // if (!form.isValid('branch')) {
            //     infoDialog.open('Branch is required');
            //     return;
            // }
            if (!form.isValid('code')) {
                infoDialog.open("Branch Code is required");
                return;
            }
            if (!form.isValid('account_num')) {
                infoDialog.open("Account No. is required");
                return;
            }
        }

        return true;
    }

    //<editor-fold desc="onSubmit">
    onSubmit(e, btn, onSaved) {
        const {form, isNewEmployee} = this;

        //1
        if (!form.isValid('name')) {
            infoDialog.open('Bank Name is required');
            return;
        }
        // if (!form.isValid('branch')) {
        //     infoDialog.open('Branch is required');
        //     return;
        // }
        if (!form.isValid('code')) {
            infoDialog.open("Branch Code is required");
            return;
        }
        if (!form.isValid('account_num')) {
            infoDialog.open("Account No. is required");
            return;
        }

        //2
        // if (!form.isValid('doc')) {
        //     infoDialog.open("Proof of Banking Details is required");
        //     return;
        // }

        if (isNewEmployee) {
            console.log("res", form.data)
            onSaved && onSaved(form.data);
            infoDialog.open("Record added.");
            infoDialog.close(2000);
            this.props.close();
            return;
        }

        const {} = form.data;
        const data = {
            formData: {...form.data, employee_id: this.employeeItem.id},
        };

        console.log(data)

        btn.text("Saving...").disabled();
        progressDialog.open();
        insertEmployeeDocBankingDetail(data).then(res => {
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
        let {props: {onFormNext, onFormBack, onFormOpen}} = this;

        return <FormControls>
            <Row
                rendered
                active
                idx={1}
                title="1. Banking Details"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
            >
                <ClearableInput name="name" type="text" placeholder="Bank Name" className="col-lg-6 form-control"
                                onChange={this.form.onChange}/>
                <ClearableInput name="branch" type="text" placeholder="Branch" className="col-lg-6 form-control"
                                onChange={this.form.onChange}/>
                <ClearableInput name="code" type="text" placeholder="Branch Code"
                                className="col-lg-6 form-control"
                                onChange={this.form.onChange}/>
                <ClearableInput name="account_num" type="number" placeholder="Account No."
                                className="col-lg-6 form-control"
                                onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={2}
                title="2. Proof of Banking Details"
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
