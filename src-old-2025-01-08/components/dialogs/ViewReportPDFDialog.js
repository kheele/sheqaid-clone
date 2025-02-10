import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import {Dates} from '../../utils/Utils';
import {Button} from '../inputs';

import {GDocHTMLViewer} from '../documents';
import AProfileDialog from './AProfileDialog';

import style from "./ViewReportPDFDialog.lazy.css";

@observer
class ViewReportPDFDialog extends AProfileDialog {
    pageKey = "ViewReportPDFDialog";

    constructor(props) {
        super(props, style);

        this.onPrint = this.onPrint.bind(this);
    }

    title() {
        return this.props.title + " PDF";
    }

    onPrint(e, btn) {
        this.refs.controls.onPrint(e, btn);
    }
    
    @computed get url() {
//        if(!this.state.item) return null;
        return '';//base64ToUrlPDF(this.state.item.data);
    }

    @computed get topButtons() {
        const download = (this.props.fileName + "_" + Dates.formatDateTime(new Date())).replaceAll(" ", "_") + ".pdf";
        return <React.Fragment>
            <a className="btn btn-primary" href={this.url} download={download} type="application/pdf">
                <i className="fa fa-download icon-left"/> Download
            </a>
            <Button className="btn btn-primary margin-l-10" onClick={this.onPrint}>
                <i className="fa fa-clipboard-list icon-left"/> Print
            </Button>
        </React.Fragment>;
    }

    get controls() {
        return  Controls;
    }
}

@observer
class Controls extends React.Component {
    @observable
    state = {

    };

    constructor() {
        super();
    }

    onPrint(e, btn) {
//        printPDF(this.props.dialog.url);
    }

    @computed get item() {
        return this.props.state.item;
    }

    render() {
        if (!this.item)
            return null;
        
        const html = '<h1>H1</h1>';
        return (<div className="controls-wrapper">
            <div className="controls padding-0">
                <div className="row padding-0">
                    <div className="row sec-group w-full">
                        <GDocHTMLViewer html={html}/>
                    </div>
                </div>
            </div>
        </div>);
    }
}

export default ViewReportPDFDialog;
