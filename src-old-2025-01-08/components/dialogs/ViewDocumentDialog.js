// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import {Dates} from '../../utils/Utils';
import {Button} from '../inputs';

import {Document} from '../documents';
import AProfileDialog from './AProfileDialog';

import style from "./ViewDocumentDialog.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ViewDocumentDialog">
@observer
class ViewDocumentDialog extends AProfileDialog {
    pageKey = "ViewDocumentDialog";

    constructor(props) {
        super(props, style);

        this.onPrint = this.onPrint.bind(this);
    }

    @computed get url() {
//        if(!this.state.item) return null;
        return '';//base64ToUrlPDF(this.state.item.data);
    }

    @computed get topButtons() {
        const {showDownload, showPrint, fileName} = this.props;
        const download = showDownload ? ((fileName + "_" + Dates.formatDateTime(new Date())).replaceAll(" ", "_") + ".pdf") : null;
        return <React.Fragment>
            {showDownload && <a className="btn btn-primary" href={this.url} download={download} type="application/pdf">
                <i className="fa fa-download icon-left"/> Download
            </a>}
            {showPrint && <Button className="btn btn-primary margin-l-10" onClick={this.onPrint}>
                <i className="fa fa-clipboard-list icon-left"/> Print
            </Button>}
        </React.Fragment>;
    }

    get controls() {
        return Controls;
    }

    title() {
        return this.props.title;
    }

    onPrint(e, btn) {
        this.refs.controls.onPrint(e, btn);
    }
}

// </editor-fold>

@observer
class Controls extends React.Component {
    @observable
    state = {};

    constructor() {
        super();

        this.onLoadSuccess = this.onLoadSuccess.bind(this);
    }

    get item() {
        return this.props.state.item;
    }

    onPrint(e, btn) {
//        printPDF(this.props.dialog.url);
    }

    onLoadSuccess() {
        const {iframe} = this.refs;
        iframe.removeEventListener('did-stop-loading', this.onLoadSuccess);
        iframe.insertCSS(
            '.kix-appview-editor{overflow-x: hidden !important;}\
            #docs-file-menu, #docs-extensions-menu, #docs-help-menu, #printButton,\n\
            .docs-titlebar-buttons, .docs-titlebar-button, #viewModeButton, #docs-toolbar-mode-switcher-separator,\n\
            /*.left-sidebar-container.docs-ui-unprintable,*/\n\
            .docs-butterbar-wrap, .docs-explore-widget {display: none !important;}'
        );
        iframe.executeJavaScript('\n\
            const interval = setInterval(() => {\n\
                const editor = document.querySelector(".kix-appview-editor");\n\
                editor && (editor.scrollLeft = editor.offsetWidth);\n\
                if(editor.scrollLeft > 0) {\n\
                    clearInterval(interval);\n\
                }\n\
            }, 500);\n\
        ');
//        console.log(iframe.contentDocument)
    }

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        if (!this.item)
            return null;

        const {path, previewPath} = this.item;

        const isPDF = FileTypes.isPDF(path);
        const isWord = FileTypes.isWord(path);
        const isExcel = FileTypes.isExcel(path);
        const isPPT = FileTypes.isPPT(path);
        const isPic = FileTypes.isPic(path);
        const isVideo = FileTypes.isVideo(path);

        let src;
        if (isPDF) {
            src = previewPath;
        } else if (isWord || isExcel || isPPT) {
            src = previewPath;
        } else if (isPic || isVideo) {
            src = previewPath;
        }
//        console.log('src', src)
        return (<div className="controls-wrapper h-full">
            <div className="controls h-full padding-0">
                <div className="row padding-0">
                    <div className="row sec-group w-full">
                        {(isPDF || isWord || isExcel || isPPT) && <Document
                            previewPath={src}
                            className="fixed-center"
                        />}
                        {isPic && <img
                            ref="img"
                            src={src}
                            className="hor-center"
                            height="100%"
                        />}
                        {isVideo && <video
                            ref="video"
                            src={src}
                            height="100%"
                            className="hor-center"
                            controls
                        />}
                    </div>
                </div>
            </div>
        </div>);
    }

    // </editor-fold>
}

export default ViewDocumentDialog;
