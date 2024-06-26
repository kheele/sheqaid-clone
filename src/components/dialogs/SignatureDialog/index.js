//<editor-fold desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';
import {CircularProgress} from "@mui/material";
import {DocusealBuilder} from '@docuseal/react';

import Form from 'utils/Form';

import {ANewDialog, Dialog} from '../../dialogs';

import style from "./SignatureDialog.lazy.css";
import {FormControls, Row} from "../../FormComponents";
import {NewEmployeeListTable, NewJobPositionListTable} from "../../FormTableComponents";

import {
    Button,
    ClearableInput,
    SelectModuleClaimsInput,
    SelectModuleExtraInput,
    SelectModuleHRInput,
    SelectModuleSHEQInput,
    UploadButton,
} from "../../inputs";
import pluginManager from "app/PluginManager";
import {insertSignableDocTemplate} from "mutations/create";
import {updateSignableDocTemplate} from "mutations/update";
//</editor-fold>

//<editor-fold desc="Dialog">
@observer
class SignatureDialog extends ANewDialog {
    pageKey = "SignatureDialog";
    title = "Signature Settings";

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
    path = 'plugin_sheq_assist/signature-settings/';

    @observable
    state = {
        lists: {
            plugin: [],
            doc_name: [],
            is_employee_owning: [
                {text: 'Yes', value: true, checked: false},
                {text: 'No', value: false, checked: false},
            ],
        },
        plugin: null,
        template: null,
        token: null,
    };

    //<editor-fold desc="constructor">
    constructor() {
        super();

        this.onCreateTemplate = this.onCreateTemplate.bind(this);
        this.onSaveTemplate = this.onSaveTemplate.bind(this);

        this.onFormChange = this.onFormChange.bind(this);
        this.onNext = this.onNext.bind(this);

        this.form = new Form();
        this.form.addChangeOne("plugin", this.onChangePlugin.bind(this));
    }

    //</editor-fold>

    //<editor-fold desc="defaultValue">
    @computed
    get defaultValue() {
        let value;
        if (this.state.plugin) {
            value = this.state.plugin;
        } else {
            const {plugin, module} = this.props.dialog.props;
            const p = this.state.lists.plugin.find(({value: {data: {key}}}) => key === plugin);
            if (p) {
                value = p.value;
            }
        }

        if (value) {
            return {label: value.data.title, value};
        }
    }

    get template() {
        return this.state.template;
    }

    //</editor-fold>

    get doc_type() {
        const {doc_type} = this.props.dialog.props;
        return doc_type;
    }

    // </editor-fold>

    componentWillMount() {
        this.state.lists.plugin = pluginManager.listAll.filter(({data: {status}}) => status === "Installed").map((value) => ({
            label: value.data.title, value,
        }));
    }

    //<editor-fold desc="onChanges">
    onChangePlugin(el, val) {
        this.state.plugin = val;
    }

    onCreateTemplate(evt, btn) {
        const {form, doc_type} = this;
        
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

        insertSignableDocTemplate({
            name,
            doc_type: doc_type || mod.title,
            doc,
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
                this.state.template = res.template;
                this.state.token = res.token;
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
        });
    }

    // </editor-fold>

    onSaveTemplate(detail) {
        const {form, template} = this;
        const {
            name,
        } = form.data;

        const {
            id: external_id,
        } = detail;

        updateSignableDocTemplate({id: template.id, external_id}).then((res) => {
            if (res) {

            } else {

            }
        }).catch((error) => {
            console.error("Error:", error);
            // setSubmitting(false);
        });
    }

    //</editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onFormChange">
    onFormChange(idx) {
        const {dialog} = this.props;
        switch (idx) {
            case 4:
                dialog.addClass('full-size');
                break;
            default:
                dialog.removeClass('full-size');
                break;
        }
        return true;
    }

    //</editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onNext">
    onNext(e, btn) {
        const {form} = this;
        const {idx} = btn.props;
        if (idx === 1) {
            if (!form.isValid('plugin')) {
                infoDialog.open('Plugin is required');
                return;
            }
            if (!form.isValid('module')) {
                infoDialog.open('Module is required');
                return;
            }
        }
        if (idx === 2) {
            // const {docusealBuilderWrapper} = this.refs;
            // docusealBuilderWrapper.load(form.data);
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
        }

        return true;
    }

    //</editor-fold>

    //<editor-fold desc="render">

    //<editor-fold desc="onSubmit">
    onSubmit(e, btn, onSaved) {
        const {form} = this;

        const {template} = this.state;

        if (!template) {
            infoDialog.open('Please upload the template document');
            return;
        }

        const res = {
            id: template.id,
            data: template,
        }

        console.log("res", res)
        onSaved && onSaved(res);
        infoDialog.open("Record successfully saved.");
        infoDialog.close(2000);
        this.props.close();
    }

    render() {
        if (this.state.lists.plugin.isEmpty()) {
            return <CircularProgress className="fixed-center"/>;
        }

        const {onFormNext, onFormBack, onFormOpen, onFormChange} = this.props;

        const {module} = this.props.dialog.props;

        return <FormControls>
            <Row
                active
                rendered
                idx={1}
                title="1. Plugin & Module"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
                onFormChange={onFormChange}
            >
                <ClearableInput name="plugin" type="select" placeholder="Plugin" defaultValue={this.defaultValue}
                                vertical readonly
                                className="col-lg-12 form-control" onChange={this.form.onChange}
                                values={this.state.lists.plugin} returnValue/>
                <SelectModule state={this.state} defaultValue={module} readonly onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={2}
                title="2. Document Signer(s)"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
                onFormChange={onFormChange}
            >
                <ClearableInput
                    name="is_employee_owning"
                    type="radio"
                    placeholder="Recipient Employee Must Sign?"
                    vertical
                    className="col-lg-12 form-control"
                    onChange={this.form.onChange}
                    values={this.state.lists.is_employee_owning}
                    returnValue
                />
                <hr/>
                <FormControls>
                    <Row
                        rendered
                        idx={2.1}
                        title="2.1. Specific Employee(s) To Sign"
                        onFormOpen={onFormOpen}
                        onFormNext={onFormNext}
                        onFormChange={onFormChange}
                    >
                        <NewEmployeeListTable name="signing_employee_list" onChange={this.form.onChange}/>
                    </Row>
                    <Row
                        rendered
                        idx={2.2}
                        title="2.2. Specific Job Position(s) To Sign"
                        onFormOpen={onFormOpen}
                        onFormBack={onFormBack}
                        onFormChange={onFormChange}
                    >
                        <NewJobPositionListTable name="signing_job_position_list" onChange={this.form.onChange}/>
                    </Row>
                </FormControls>
            </Row>
            <Row
                rendered
                idx={3}
                title="3. Document Template Builder"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormChange={onFormChange}
            >
                <ClearableInput
                    name="name"
                    type="select"
                    placeholder="Document Name"
                    className="col-lg-12 form-control"
                    onChange={this.form.onChange}
                    values={this.state.lists.doc_name}
                    returnValue
                    add
                />
                <UploadButton
                    name="doc"
                    buttonTitle="Template Document Attachment"
                    type={['PDF', 'Word']}
                    showOnlyIcon
                    className="col-lg-12 margin-b-10"
                    onChange={this.form.onChange}
                />
                <hr/>
                <Button className="btn btn-primary margin-t-20 margin-b-5 hor-center" onClick={this.onCreateTemplate}>
                    <i className="fa fa-check"/> Upload Document
                </Button>
                <DocusealBuilderWrapper
                    ref="docusealBuilderWrapper"
                    state={this.state}
                    onSaveTemplate={this.onSaveTemplate}
                />
            </Row>
        </FormControls>;
    }

    //</editor-fold>
}

//<editor-fold desc="DocusealBuilderWrapper">
@observer
class DocusealBuilderWrapper extends React.Component {
    @observable state = {
        token: null,
        name: null,
        roles: [],
    };

    //<editor-fold desc="constructor">
    constructor(props) {
        super(props);

        this.onSetUpSignature = this.onSetUpSignature.bind(this);

        this.onLoad = this.onLoad.bind(this);
        this.onUpload = this.onUpload.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    //</editor-fold>

    @computed get template() {
        /*
        id,
        external_id,
        name,
        doc_type,
        slug,
        preview_image_url,
        doc,
        is_employee_owning,
        module,
        plugin,
        signing_employee_list,
        signing_job_position_list,
        * */
        return this.props.state.template;
    }

    @computed get token() {
        return this.props.state.token;
    }

    @computed get roles() {
        const {template} = this;
        if (!template) return [];
        const {is_employee_owning, signing_employee_list, signing_job_position_list} = template;

        const roles = [];
        if (is_employee_owning) {
            roles.push("Employee");
        }

        if (signing_employee_list) {
            const employee_list = signing_employee_list.map(
                (
                    {
                        employee: {full_name, email, job_position},
                    }
                ) => `${full_name}${email ? ` (${email})` : ''}${job_position ? ` - ${job_position.name}` : ''}`
            );
            roles.push(...employee_list);
        }
        if (signing_job_position_list) {
            const job_position_list = signing_job_position_list.map(v => v.job_position.name);
            roles.push(...job_position_list);
        }

        return roles;
    }

    // @computed get name() {
    //     return this.state.name;
    // }

    get customCss() {
        return `
            .sticky.bg-yellow-100:first-of-type, 
            #sign_yourself_button, 
            #send_button{
                display: none !important;
            }
            
            #main_container{
                max-height: calc(100% - 50px);
                height: 100%;
            }
            #pages_container{
                border-right: 2px solid #e1e1e1;
                padding: 0;
                margin-right: 10px;
            }
        `;
    }

    onSetUpSignature() {
        this.refs.dialog.open();
    }

    //
    // load(data) {
    //     const dom = findDOMNode(this);
    //     if (dom) {
    //         return;
    //     }
    //
    //     const {roles} = this;
    //
    //     let {
    //         plugin, //
    //         module,//
    //         doc,
    //         name,//
    //         is_employee_owning,
    //         signature_settings_list,
    //     } = data;
    //
    //     signature_settings_list = (signature_settings_list || []).map(({job_position, employee,}) => ({
    //         job_position: job_position && {id: job_position.id, name: job_position.data.name},
    //         employee: employee && {id: employee.id, full_name: employee.data.full_name, email: employee.data.email},
    //     }));
    //
    //     if (is_employee_owning) {
    //         roles.push("Employee");
    //     }
    //
    //     const job_position_list = signature_settings_list.filter(v => !!v.job_position && !v.employee).map(v => v.job_position.name);
    //     roles.push(...job_position_list);
    //
    //     const employee_list = signature_settings_list.filter(v => !v.job_position && !!v.employee).map(v => v.employee.full_name);
    //     roles.push(...employee_list);
    //
    //     this.state.token = null;
    //     const buildToken = sockets.of('doc-signing-settings/api/docuseal').fn('builder_token');
    //     buildToken({
    //         plugin_key: plugin.data.key,
    //         module_key: module.module.key,
    //         doc,
    //         name,
    //     }).then(res => {
    //         this.state.name = name;
    //         this.state.token = res;
    //     });
    // }

    onLoad(detail) {
        console.log('onLoad', detail);
    }

    onUpload(detail) {
        console.log('onUpload', detail);
    }

    onChange(detail) {
        console.log('onChange', detail);
    }

    render() {
        const {token} = this;
        if (token === null) return null;

        const {doc, roles, customCss} = this;
        const {onSaveTemplate} = this.props;

        return <>
            <hr/>
            <Button
                className="btn btn-primary margin-t-20 margin-b-5 hor-center"
                onClick={this.onSetUpSignature}
            >
                <i className="fa fa-check"/> Set Up Signature(s)
            </Button>
            <Dialog
                key={'DocusealBuilderWrapper-profile-dialog'}
                ref="dialog"
                className={'DocusealBuilderWrapper-dialog'}
                topButtons={this.topButtons}
                open={true}
                dialog={this}
            >
                <DocusealBuilder
                    ref="docusealBuilder"
                    token={token}
                    roles={roles}
                    autosave={true}
                    withRecipientsButton={false}
                    withSendButton={false}
                    withSignYourselfButton={false}
                    withUploadButton={false}
                    customCss={customCss}
                    onLoad={this.onLoad}
                    onUpload={this.onUpload}
                    onSave={onSaveTemplate}
                    onChange={this.onChange}
                />
            </Dialog>
        </>;
    }
}

//</editor-fold>

//<editor-fold desc="SelectModule">
@observer
class SelectModule extends React.Component {
    render() {
        const {state: {plugin}, defaultValue, readonly, onChange} = this.props;

        if (!plugin) {
            return null;
        }

        const {data: {key}} = plugin;

        console.log('plugin', plugin, defaultValue)

        let node = [<hr/>];
        if (key === 'plugin_sheq_assist') {
            node.push(<SelectModuleSHEQInput name="module" defaultValue={defaultValue} readonly={readonly}
                                             className="col-lg-12"
                                             onChange={onChange}/>);
        } else if (key === 'plugin_hr_management') {
            node.push(<SelectModuleHRInput name="module" defaultValue={defaultValue} readonly={readonly}
                                           className="col-lg-12"
                                           onChange={onChange}/>);
        } else if (key === 'plugin_extra') {
            node.push(<SelectModuleExtraInput name="module" defaultValue={defaultValue} readonly={readonly}
                                              className="col-lg-12"
                                              onChange={onChange}/>);
        } else if (key === 'plugin_claim_management') {
            node.push(<SelectModuleClaimsInput name="module" defaultValue={defaultValue} readonly={readonly}
                                               className="col-lg-12"
                                               onChange={onChange}/>);
        } else {
            return null;
        }

        return <>{node}</>;
    }
}

//</editor-fold>

export default SignatureDialog;
