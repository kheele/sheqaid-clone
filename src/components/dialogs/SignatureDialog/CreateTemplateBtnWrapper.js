//<editor-fold desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed} from 'mobx';

import {Button,} from "../../inputs";
import {insertSignableDocTemplate} from "mutations/create";
//</editor-fold>

//<editor-fold desc="CreateTemplateBtnWrapper">
@observer
class CreateTemplateBtnWrapper extends React.Component {

    //<editor-fold desc="constructor">
    constructor(props) {
        super(props);

        this.onCreateTemplate = this.onCreateTemplate.bind(this);
    }

    //</editor-fold>

    @computed get token() {
        return this.propState.token;
    }

    @computed get propState() {
        return this.props.state;
    }

    @computed get itemTemplate() {
        const {item} = this;
        if (!item) return null;
        const {
            data: {
                // doc_version_list,
                // latest_version: _latest_version,
            }
        } = item;
        // const [latest_version] = _latest_version || [];
        // const {doc, doc_docs_id} = latest_version || {};
        // return doc;
    }

    @computed get itemDoc() {
        const {item} = this;
        if (!item) return null;
        const {
            data: {
                doc_version_list,
                latest_version: _latest_version,
            }
        } = item;
        const [latest_version] = _latest_version || [];
        const {doc, doc_docs_id} = latest_version || {};
        return doc;
    }

    @computed get item() {
        return this.props.item;
    }

    onCreateTemplate(evt, btn) {
        const {propState} = this;
        const {form, doc_type} = this.props;

        //1
        if (!form.isValid('plugin')) {
            infoDialog.open('Plugin is required');
            return;
        }
        if (!form.isValid('module')) {
            infoDialog.open('Module is required');
            return;
        }

        //2
        if (!form.isValid('is_employee_owning')) {
            infoDialog.open('Select "Requires Employee Owning The Form" option');
            return;
        }
        if (!form.get('is_employee_owning') && (
            !form.isValid('signing_employee_list') || !form.isValid('signing_job_position_list')
        )) {
            infoDialog.open('Specific Employee(s) / Specific Job Position(s) To Sign is/are required');
            return;
        }

        //3
        if (!form.isValid('name')) {
            infoDialog.open('Document Name is required');
            return;
        }
        if (!form.isValid('doc')) {
            infoDialog.open('Template Document Attachment is required');
            return;
        }

        const {
            plugin, module,
            is_employee_owning,
            signing_employee_list,
            signing_job_position_list,
            name,
            doc,
        } = form.data;

        console.log('module', module);
        const mod = module.module;

        progressDialog.open();

        insertSignableDocTemplate({
            name,
            doc_type: doc_type || mod.title,
            doc: this.itemDoc || doc,
            is_employee_owning,
            plugin_id: plugin.id,
            module_id: mod.id,
            signing_employee_list: {
                data: (signing_employee_list || []).map(({employee,}) => ({
                    employee_id: employee.id,
                })),
            },
            signing_job_position_list: {
                data: (signing_job_position_list || []).map(({job_position,}) => ({
                    job_position_id: job_position.id,
                })),
            },
        }).then((res) => {
            if (res) {
                propState.template = res.template;
                propState.token = res.token;
                // response.json().then((data) => {
                //     setSubmitting(false);
                //     setToken(data.token);
                //     setTemplate(data.template);
                // });
            } else {
                // response.json().then(() => {
                //     setSubmitting(false);
                // });
            }
        }).catch((error) => {
            console.error("Error:", error);
            // setSubmitting(false);
        }).finally(() => {
            setTimeout(() => progressDialog.close());
        });
    }

    render() {
        const {token} = this;
        if (token) return null;

        return <>
            <hr/>
            <Button className="btn btn-primary margin-t-20 margin-b-5 hor-center" onClick={this.onCreateTemplate}>
                <i className="fa fa-check"/> Set Up Signature(s)
            </Button>
        </>;
    }
}

//</editor-fold>

export default CreateTemplateBtnWrapper;
