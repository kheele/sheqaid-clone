//<editor-fold desc="imports">
import {observer} from "mobx-react";
import React from "react";
import {computed, observable} from "mobx";
import {DocusealForm} from '@docuseal/react';
import {Dialog} from "../dialogs";
import style from "./DocSubmissionPreviewDialog.lazy.css";

import {execWhen} from "utils/Utils";

//</editor-fold>

@observer
class DocSubmissionPreviewDialog extends React.Component {

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
            .sticky.bg-yellow-100:first-of-type,
            svg{
                visibility: hidden !important;
                display: none !important;
            }
        `;
    }

    @computed get item() {
        return this.state.item;
    }

    open(item) {
        this.state.item = item;
        return execWhen(() => this.refs.dialog).then(dialog => {
            return dialog.open(item);
        });
    }

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

        const {
            id,
            data: {
                // external_id,
                submission_id,
                submission: {
                    // id,
                    created_at,
                    updated_at,
                    status,
                    slug,
                    docuseal_id,
                    external_id,
                    template_id,
                    doc_template,
                },
                // slug,
                is_owning,
            }
        } = item;
        console.log('DocSubmissionPreviewDialog item', item)

        return <Dialog
            key={'DocSubmissionPreviewDialog-profile-dialog'}
            ref="dialog"
            className={'DocSubmissionPreviewDialog-profile-dialog'}
            topButtons={this.topButtons}
            dialog={this}
        >
            <DocusealForm
                src={`https://docuseal.co/s/${slug}`}
                externalId={docuseal_id}
                preview={true}
                customCss={this.customCss}
            />
        </Dialog>;
    }
}

export default DocSubmissionPreviewDialog;
