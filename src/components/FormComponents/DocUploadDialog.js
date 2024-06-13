//<editor-fold desc="imports">
import {observer} from "mobx-react";
import React from "react";
import {computed, observable} from "mobx";
import {DocusealForm} from '@docuseal/react';
import {Dialog} from "../dialogs";
import style from "./DocUploadDialog.lazy.css";

import {execWhen} from "utils/Utils";

//</editor-fold>

@observer
class DocUploadDialog extends React.Component {

    @observable state = {
        item: null,
    };//

    //<editor-fold desc="constructor">
    constructor(props) {
        super(props);

        // this.loadTemplate = this.loadTemplate.bind(this);
    }

    //</editor-fold>

    get customCss() {
        return `
            .sticky.bg-yellow-100:first-of-type{
                visibility: hidden !important;
            }
        `;
    }

    @computed get item() {
        return this.state.item;
    }

    get role() {
        const {id, data: {slug, is_owning, role}} = this.item;
        // if (is_owning) {
        //     return 'Employee';
        // }
        return role;
    }

    open(item) {
        this.state.item = item;
        return execWhen(() => this.refs.dialog).then(dialog => {
            return dialog.open(item);
        });
    }

    //
    // componentDidMount() {
    //     this.loadTemplate();
    // }
    //
    // loadTemplate() {
    //     const {module, doc_type} = this.props;
    //     this.loadStatus = LoadStatus.LOADING;
    //     this.template = null;
    //
    //     const findByModuleKey = sockets.of('doc-signing-settings/api/docuseal/templates').fn('findByModuleKey');
    //     findByModuleKey({
    //         module_key: module,
    //         doc_type: doc_type,
    //     }).then(res => {
    //         console.log('template', res);
    //         if (res) {
    //             this.template = res;
    //             this.loadStatus = LoadStatus.LOADED_DATA;
    //         } else {
    //             this.loadStatus = LoadStatus.LOADED_EMPTY;
    //         }
    //     }).catch(err => {
    //         console.error(err);
    //         this.loadStatus = LoadStatus.ERROR;
    //     }).finally(() => {
    //
    //     });
    // }
    //

    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }

    render() {
        const {item} = this;
        if (!item) return null;

        // const {isUpload, isTemplate, props: {type, name, doc_type, plugin, module, defaultValue, onChange}} = this;
        // const {type, name, doc_type, defaultValue, plugin, module, onChange} = this.props;

        const {id, data: {slug, is_owning}} = item;

        return <Dialog
            key={'DocUploadDialog-profile-dialog'}
            ref="dialog"
            className={'DocUploadDialog-dialog'}
            topButtons={this.topButtons}
            dialog={this}
        >
            <DocusealForm
                src={`https://docuseal.co/s/${slug}`}
                role={this.role}
                customCss={this.customCss}
            />
        </Dialog>;
    }
}

export default DocUploadDialog;
