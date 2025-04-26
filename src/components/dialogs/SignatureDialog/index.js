//<editor-fold desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';
import {CircularProgress} from "@mui/material";

import Form from 'utils/Form';

import {ANewDialog} from '../../dialogs';

import style from "./SignatureDialog.lazy.css";
import {FormControls, Row} from "../../FormComponents";
import {NewEmployeeListTable, NewJobPositionListTable} from "../../FormTableComponents";

import {ClearableInput, UploadButton,} from "../../inputs";
import pluginManager from "app/PluginManager";
import DocusealBuilderWrapper from "./DocusealBuilderWrapper";
import CreateTemplateBtnWrapper from "./CreateTemplateBtnWrapper";
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
        module: null,
        template: null,
        token: null,
    };

    //<editor-fold desc="constructor">
    constructor(props) {
        super(props);

        this.onFormChange = this.onFormChange.bind(this);
        this.onNext = this.onNext.bind(this);

        this.form = new Form();
        this.form.addChangeOne("plugin", this.onChangePlugin.bind(this));
    }

    //</editor-fold>

    //<editor-fold desc="defaultPluginValue">
    @computed
    get defaultPluginValue() {
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

        return value;
    }

    //</editor-fold>

    //<editor-fold desc="defaultPluginTitle">
    @computed
    get defaultPluginTitle() {
        const {defaultPluginValue: value} = this;
        if (value) {
            return value.data.title;
        }
    }

    //</editor-fold>

    //<editor-fold desc="defaultModuleValue">
    @computed
    get defaultModuleValue() {
        let value;
        if (this.state.module) {
            value = this.state.module;
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

    //</editor-fold>

    get template() {
        return this.state.template;
    }

    get doc_type() {
        const {doc_type} = this.props.dialog.props;
        return doc_type;
    }

    @computed get itemEmployee() {
        const {item} = this;
        if (!item) return null;
        const {data: {employee}} = item;
        return employee;
    }

    @computed get itemTitle() {
        const {item} = this;
        if (!item) return null;
        const {data: {title}} = item;
        return title;
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
        return this.props.dialog.item;
    }

    componentWillMount() {
        this.state.lists.plugin = pluginManager.listAll.filter(({data: {status}}) => status === "Installed").map((value) => ({
            label: value.data.title, value,
        }));
    }

    //<editor-fold desc="onChanges">
    onChangePlugin(el, val) {
        this.state.plugin = val;
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

    //<editor-fold desc="onSubmit">
    onSubmit(e, btn, onSaved) {
        const {form} = this;
        const {module} = this.props.dialog.props;

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

    //</editor-fold>

    //<editor-fold desc="render">
    render() {
        if (this.state.lists.plugin.isEmpty()) {
            return <CircularProgress className="fixed-center"/>;
        }

        const {onFormNext, onFormBack, onFormOpen, onFormChange} = this.props;

        const {module} = this.props.dialog.props;

        const {itemDoc, itemTitle, itemEmployee} = this;

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
                <ClearableInput name="plugin" type="text" placeholder="Plugin" defaultValue={this.defaultPluginTitle}
                                vertical readonly isEditable={false}
                                className="col-lg-12 form-control"/>
                <ClearableInput name="module" type="text" placeholder="Module" defaultValue={module}
                                vertical readonly isEditable={false}
                                className="col-lg-12 form-control"/>
                {/*<SelectModule state={this.state} defaultValue={module} isEditable={false} readonly*/}
                {/*              onChange={this.form.onChange}/>*/}
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
                    defaultValue={itemEmployee ? true : null}
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
                        title="2.1. Management To Sign"
                        onFormOpen={onFormOpen}
                        onFormNext={onFormNext}
                        onFormChange={onFormChange}
                    >
                        <NewJobPositionListTable name="signing_job_position_list" onChange={this.form.onChange}/>
                    </Row>
                    {/*<Row*/}
                    {/*    rendered*/}
                    {/*    idx={2.1}*/}
                    {/*    title="2.1. Specific Job Position(s) To Sign"*/}
                    {/*    onFormOpen={onFormOpen}*/}
                    {/*    onFormNext={onFormNext}*/}
                    {/*    onFormChange={onFormChange}*/}
                    {/*>*/}
                    {/*    <NewJobPositionListTable name="signing_job_position_list" onChange={this.form.onChange}/>*/}
                    {/*</Row>*/}
                    <Row
                        rendered
                        idx={2.2}
                        title="2.2. Specific Employee(s) To Sign"
                        onFormOpen={onFormOpen}
                        onFormBack={onFormBack}
                        onFormChange={onFormChange}
                    >
                        <NewEmployeeListTable name="signing_employee_list" onChange={this.form.onChange}/>
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
                    defaultValue={itemTitle}
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
                    defaultValue={itemDoc}
                    readonly={!!itemDoc}
                    showOnlyIcon
                    className="col-lg-12 margin-b-10"
                    onChange={this.form.onChange}
                />
                <CreateTemplateBtnWrapper
                    form={this.form}
                    doc_type={this.doc_type}
                    state={this.state}
                    item={this.item}
                />
                <DocusealBuilderWrapper
                    ref="docusealBuilderWrapper"
                    form={this.form}
                    state={this.state}
                />
            </Row>
        </FormControls>;
    }

    //</editor-fold>
}

export default SignatureDialog;
