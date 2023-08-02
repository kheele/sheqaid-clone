import React from "react";
import {observer} from 'mobx-react';

import Form from 'utils/Form';

import {ShouldUpdate} from 'utils/Utils';
import {ClearableInput, UploadButton} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import {AEditDialog} from 'components/dialogs';

import style from "./EditDocBankingDetailsDialog.lazy.css";
import updateEmployeeDocBankingDetail
    from "mutations/all/EmployeeDocument/EmployeeDocBankingDetail/updateEmployeeDocBankingDetail";

//<editor-fold desc="EditDialog">
@observer
class EditDialog extends AEditDialog {
    pageKey = "EditDocBankingDetailsDialog";
    title = "Edit Banking Details";

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

    //<editor-fold desc="onNext">
    onNext(e, btn) {
        const {form} = this;
        const {idx} = btn.props;
        if (idx === 1) {
            if (!form.isValid('name')) {
                infoDialog.open('Bank Name is required');
                return;
            }
            if (!form.isValid('branch')) {
                infoDialog.open('Branch is required');
                return;
            }
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

    //</editor-fold>

    //<editor-fold desc="onSubmit">
    onSubmit(e, btn, onSaved) {
        const {form, item: {data: old_data}} = this;

        //1
        if (!form.isValid('name')) {
            infoDialog.open('Bank Name is required');
            return;
        }
        if (!form.isValid('branch')) {
            infoDialog.open('Branch is required');
            return;
        }
        if (!form.isValid('code')) {
            infoDialog.open("Branch Code is required");
            return;
        }
        if (!form.isValid('account_num')) {
            infoDialog.open("Account No. is required");
            return;
        }

        //2
        if (!form.isValid('doc')) {
            infoDialog.open("Proof of Banking Details is required");
            return;
        }

        const {
            //1
            name,
            branch,
            code,
            account_num,
            //2
            doc,
        } = form.data;
        const data = {};

        ShouldUpdate.check(data, old_data, name, 'name');
        ShouldUpdate.check(data, old_data, branch, 'branch');
        ShouldUpdate.check(data, old_data, code, 'code');
        ShouldUpdate.check(data, old_data, account_num, 'account_num');
        ShouldUpdate.checkFile(data, old_data, doc, 'doc');

        if (Object.keys(data).isEmpty()) {
            infoDialog.open("Nothing changed!");
            return;
        }

        console.log(data)

        btn.text("Saving...").disabled();
        progressDialog.open();
        updateEmployeeDocBankingDetail({id: this.item.id, ...data}).then(res => {
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
                    created_at,
                    //1
                    name,
                    branch,
                    code,
                    account_num,
                    //2
                    doc,
                }
            }
        } = this;

        console.log(this.item)

        return <FormControls>
            <Row
                rendered
                active
                idx={1}
                title="1. Banking Details"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
            >
                <ClearableInput name="name" type="text" placeholder="Bank Name"
                                defaultValue={name} className="col-lg-6 form-control"
                                onChange={this.form.onChange}/>
                <ClearableInput name="branch" type="text" placeholder="Branch"
                                defaultValue={branch} className="col-lg-6 form-control"
                                onChange={this.form.onChange}/>
                <ClearableInput name="code" type="text" placeholder="Branch Code"
                                defaultValue={code} className="col-lg-6 form-control"
                                onChange={this.form.onChange}/>
                <ClearableInput name="account_num" type="number" placeholder="Account No."
                                defaultValue={account_num} className="col-lg-6 form-control"
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
