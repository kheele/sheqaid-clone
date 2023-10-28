// <editor-fold defaultstate="collapsed" desc="import">
import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import {Dates} from 'utils/Utils';

import {Clickable} from 'components/inputs';
import {AProfileDialog} from 'components/dialogs';

import {PDFWCl4Form} from '../pdf_forms';

import style from "./PrintWCL4Dialog.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "PrintWCL4Dialog";
  
    constructor(props) {
        super(props, style);

        this.onDownload = this.onDownload.bind(this);
        this.onPrint = this.onPrint.bind(this);
    }

    title() {
        return "W.CI.4";
    }
    
    onDownload(e, btn) {
        const {controls} = this.refs;
        controls.onDownload && controls.onDownload(e, btn);
    }

    onPrint(e, btn) {
        const {controls} = this.refs;
        controls.onPrint && controls.onPrint(e, btn);
    }

    @computed get topButtons() {
        const download = (this.title().replaceAll(' ', '-') + "_" + Dates.formatDateTime(new Date())).replaceAll(" ", "_") + ".pdf";
        return <React.Fragment>
            <Clickable onClick={this.onPrint}>
                <a className="btn btn-primary" download={download} type="application/pdf">
                    <i className="fa fa-print icon-left"/> Print
                </a>
            </Clickable>
            <hr />
            <Clickable onClick={this.onDownload}>
                <a className="btn btn-primary" download={download} type="application/pdf">
                    <i className="fa fa-download icon-left"/> Download
                </a>
            </Clickable>
        </React.Fragment>;
    }

    get controls() {
        return  Controls;
    }
}
// </editor-fold>

@observer
class Controls extends React.Component {

    // <editor-fold defaultstate="collapsed" desc="fields">
    @observable
    state = {
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor() {
        super();
        
        this.onDownload  = this.onDownload.bind(this);
        this.onPrint  = this.onPrint.bind(this);
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onDownload">
    onDownload(evt, btn) {
        const {pdfForm} = this.refs;
        pdfForm.download(evt);
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onPrint">
    onPrint(evt, btn) {
        const {pdfForm} = this.refs;
        pdfForm.print(evt);
    }
    // </editor-fold>
    
    get item() {
        return this.props.state.item;
    }
    
    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        if (!this.item)
            return null;

        const employee = this.props.dialog.extraProp('employee');

        return (<div className="controls-wrapper controls-sectioned">
            <div className="controls">
                <PDFWCl4Form ref="pdfForm" employee={employee} item={this.item}/>
            </div>
        </div>);
    }
    // </editor-fold>
}

export default ProfileDialog;
