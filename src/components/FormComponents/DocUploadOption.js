//<editor-fold desc="imports">
import {observer} from "mobx-react";
import React from "react";
import {computed, observable} from "mobx";
import {DocusealForm} from '@docuseal/react';
import {CircularProgress} from "@mui/material";
import {Button, ClearableInput, UploadButton} from "../inputs";
import {Dialog} from "../dialogs";
import style from "./DocUploadOption.lazy.css";
import SignatureDialog from "../dialogs/SignatureDialog";

//</editor-fold>

const LoadStatus = {
    LOADING: "Loading",
    ERROR: "Error",
    LOADED_DATA: "Loaded Data",
    LOADED_EMPTY: "Loaded Empty",
};

@observer
class DocUploadOption extends React.Component {

    @observable
    state = {
        lists: {
            doc_option: ["Upload Document", "Use Existing Template Document"].map(text => ({
                text, value: text.contains("Upload") ? "Upload" : "Template", checked: false,
            })),
        },
        doc_option: null,
    };

    //<editor-fold desc="constructor">
    constructor(props) {
        super(props);

        props.addChangeOne("doc_option", this.onChangeDocOption.bind(this));
    }

    //</editor-fold>

    get defaultOptionValue() {
        const {itemDoc, itemTemplate} = this;
        return itemDoc ? "Upload" : itemTemplate ? "Template" : null;
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

    // </editor-fold>

    @computed get item() {
        return this.props.item;
    }

    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }

    //<editor-fold desc="onChanges">
    onChangeDocOption(el, val) {
        this.state.doc_option = val;
    }

    render() {
        const {type, name, setupNew, doc_type, defaultValue, plugin, module, onChange} = this.props;

        return <>
            <ClearableInput
                name="doc_option"
                type="radio"
                placeholder="Select Option"
                defaultValue={this.defaultOptionValue}
                vertical
                className="col-lg-12 margin-b-15 form-control"
                onChange={onChange}
                values={this.state.lists.doc_option}
                returnValue
            />
            <DocUploadOptionWrapper
                state={this.state}
                item={this.item}
                type={type}
                name={name}
                setupNew={setupNew}
                doc_type={doc_type}
                defaultValue={defaultValue}
                plugin={plugin}
                module={module}
                onChange={onChange}
            />
        </>;
    }
}

@observer
class DocUploadOptionWrapper extends React.Component {

    @observable
    state = {
        is_employee_owning: [
            {text: 'Yes', value: true, checked: false},
            {text: 'No', value: false, checked: false},
        ],
        template: null,
        loadStatus: LoadStatus.LOADING,
    };

    //<editor-fold desc="constructor">
    constructor(props) {
        super(props);

        this.loadTemplate = this.loadTemplate.bind(this);
        this.onCreateTemplateDocument = this.onCreateTemplateDocument.bind(this);
        this.onSetUpDocumentSigning = this.onSetUpDocumentSigning.bind(this);
        this.onViewTemplateDocument = this.onViewTemplateDocument.bind(this);
    }

    //</editor-fold>

    @computed get template() {
        return this.state.template;
    }

    set template(v) {
        this.state.template = v;
    }

    @computed get doc_option() {
        return this.props.state.doc_option;
    }

    @computed get isUpload() {
        return !this.item && this.doc_option === "Upload";
    }

    @computed get isTemplate() {
        return this.doc_option === "Template";
    }

    @computed get isItem() {
        return !!this.item;
    }

    @computed get loadStatus() {
        return this.state.loadStatus;
    }

    set loadStatus(v) {
        this.state.loadStatus = v;
    }

    get customCss() {
        return `
            .sticky.bg-yellow-100:first-of-type{
                visibility: hidden !important;
            }
        `;
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

    componentDidMount() {
        const {item} = this;
        if (item) {

            return;
        }

        this.loadTemplate();
    }

    loadTemplate(newTemplateRes) {
        const {name, onChange} = this.props;

        if (newTemplateRes) {
            this.template = newTemplateRes;
            onChange && onChange(newTemplateRes, name, this);
        } else {
            const {module, doc_type, setupNew} = this.props;
            this.loadStatus = LoadStatus.LOADING;
            this.template = null;

            const findByModuleKey = sockets.of('doc-signing-settings/api/docuseal/templates').fn('findByModuleKey');
            findByModuleKey({
                module_key: module,
                doc_type: doc_type,
            }).then(res => {
                console.log('template', res);
                if (res) {
                    this.template = res;
                    onChange && onChange(newTemplateRes, name, this);
                    this.loadStatus = LoadStatus.LOADED_DATA;
                } else {
                    this.loadStatus = LoadStatus.LOADED_EMPTY;
                }
            }).catch(err => {
                console.error(err);
                this.loadStatus = LoadStatus.ERROR;
            }).finally(() => {

            });
        }
    }

    onCreateTemplateDocument() {
        this.refs.signaturesDialog.open().then(newTemplateRes => {
            console.log('onCreateTemplateDocument newTemplateRes', newTemplateRes);
            if (newTemplateRes) {
                this.loadTemplate(newTemplateRes);
            } else {
                this.loadStatus = LoadStatus.LOADED_EMPTY;
            }
        });
    }

    onSetUpDocumentSigning() {
        this.refs.signaturesDialog.open(this.item).then(newTemplateRes => {
            console.log('onSetUpDocumentSigning newTemplateRes', newTemplateRes);
            if (newTemplateRes) {
                this.loadTemplate(newTemplateRes);
            } else {
                this.loadStatus = LoadStatus.LOADED_EMPTY;
            }
        });
    }

    onViewTemplateDocument() {
        this.refs.dialog.open();
    }

    render() {
        const {doc_option} = this;
        if (!doc_option) return null;

        const {
            isUpload,
            isTemplate,
            isItem,
            template,
            props: {type, name, doc_type, plugin, module, defaultValue, onChange}
        } = this;

        if (isUpload) {
            return <UploadButton
                name={name}
                buttonTitle={`Upload File (${type ? type.join(', ') : 'PDF, Word, Photo'})`}
                type={type || ['PDF', 'Word', 'Image']}
                defaultValue={defaultValue}
                showOnlyIcon
                className="margin-t-0 margin-b-10 col-lg-12"
                onChange={onChange}
            />;
        }

        if (isItem && !template) {
            const {item} = this;
            return <>
                <Button
                    className="btn btn-primary margin-b-10 hor-center border-radius-20"
                    onClick={this.onSetUpDocumentSigning}
                >
                    <i className="fa fa-plus"/> Set Up Document Signing
                </Button>
                <SignatureDialog ref="signaturesDialog" plugin={plugin} module={module} doc_type={doc_type}/>
                {/*<ClearableInput*/}
                {/*    name="is_employee_owning"*/}
                {/*    type="radio"*/}
                {/*    placeholder="Recipient Employee Must Sign?"*/}
                {/*    defaultValue=/!*itemEmployee ? true : null*/}
                {/*    vertical*/}
                {/*    className="col-lg-12 form-control"*/}
                {/*    onChange={onChange}*/}
                {/*    values={this.state.lists.is_employee_owning}*/}
                {/*    returnValue*/}
                {/*/>*/}
                {/*<hr/>*/}
                {/*<FormControls>*/}
                {/*    <Row*/}
                {/*        rendered*/}
                {/*        activeAlways*/}
                {/*        idx={2.1}*/}
                {/*        title="2.1. Specific Employee(s) To Sign"*/}
                {/*    >*/}
                {/*        <NewEmployeeListTable name="signing_employee_list" onChange={onChange}/>*/}
                {/*    </Row>*/}
                {/*    <Row*/}
                {/*        rendered*/}
                {/*        activeAlways*/}
                {/*        idx={2.2}*/}
                {/*        title="2.2. Specific Job Position(s) To Sign"*/}
                {/*    >*/}
                {/*        <NewJobPositionListTable name="signing_job_position_list" onChange={onChange}/>*/}
                {/*    </Row>*/}
                {/*</FormControls>*/}
            </>;
        }

        if (isTemplate || template) {
            if (!template) {
                if (this.loadStatus === LoadStatus.LOADING) return <CircularProgress className="fixed-center"/>;
                if (this.loadStatus === LoadStatus.LOADED_EMPTY) {
                    return <>
                        <Button
                            className="btn btn-primary margin-b-10 hor-center border-radius-20"
                            onClick={this.onCreateTemplateDocument}
                        >
                            <i className="fa fa-plus"/> Create Template Document
                        </Button>
                        <SignatureDialog ref="signaturesDialog" plugin={plugin} module={module} doc_type={doc_type}/>
                    </>;
                }
            }

            const {id, data: {slug}} = template;

            return <>
                <Button
                    key={new Date().getTime()}
                    className="btn btn-primary margin-b-10 hor-center border-radius-20"
                    onClick={this.onViewTemplateDocument}
                >
                    <i className="fa fa-eye"/> View Template Document
                </Button>
                <Dialog
                    key={'DocUploadOption-profile-dialog'}
                    ref="dialog"
                    className={'DocUploadOption-dialog'}
                    topButtons={this.topButtons}
                    dialog={this}
                >
                    <DocusealForm
                        src={`https://docuseal.co/s/${slug}`}
                        preview={true}
                        customCss={this.customCss}
                    />
                </Dialog>
            </>;
        }

        return null;
    }
}

export default DocUploadOption;
