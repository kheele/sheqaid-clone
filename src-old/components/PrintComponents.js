import React from 'react';
import {findDOMNode} from "react-dom";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';
import {Document, PDFViewer} from '@react-pdf/renderer';

import {Dates, execWhen} from '../utils/Utils';

import {Clickable} from './inputs';
import {AProfileDialog, OptionsDialog} from './dialogs';

import style from "./ProfilePDFReader.lazy.css";

// <editor-fold defaultstate="collapsed" desc="APDFReader">
@observer
class APDFReader extends AProfileDialog {
    pageKey = "ProfilePDFReader";
        
    @observable counter = {
        pos: 0
    };
    
    constructor(props) {
        super(props, style);

        this.onComplete = this.onComplete.bind(this);
        this.onDownload = this.onDownload.bind(this);
    }
    
    close() {
        setTimeout(() => this.counter.pos = 0);
        super.close();
    }

    onComplete(webview) {
        
    }

    onDownload(e, btn) {
        const {controls} = this.refs;
        controls.onDownload && controls.onDownload(e, btn);
    }

    @computed get topButtons() {
        const download = (this.title().replaceAll(' ', '-') + "_" + Dates.formatDateTime(new Date())).replaceAll(" ", "_") + ".pdf";
        return <React.Fragment>
            <Clickable onClick={this.onDownload}>
                <a className="btn btn-primary" download={download} type="application/pdf">
                    <i className="fa fa-download icon-left"/> Download
                </a>
            </Clickable>
        </React.Fragment>;
    }

    get controls() {
        return Controls;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="PDFViewerWrapper">
@observer
class PDFViewerWrapper extends React.Component {

    constructor(props) {
        super(props);
        this.onLoadSuccess = this.onLoadSuccess.bind(this);
        this.onLoadError = this.onLoadError.bind(this);
    }
    
    componentDidMount() {
        execWhen(() => {
            try {
                return findDOMNode(this);
            } catch(e) {
                return false;
            }
        }).then(webview => {
            webview.addEventListener('did-stop-loading', this.onLoadSuccess);
            webview.onload = this.onLoadSuccess;
            this.webview = webview;
        });
    }
    
    onLoadSuccess() {
        const {webview, props: {onLoad}} = this;
        webview.removeEventListener('did-stop-loading', this.onLoadSuccess);
        onLoad(webview);
    }
    
    onLoadError() {
//        if(this.refs.iframe){
//            this.refs.iframe.src = this.src;
//        }
    }
    
    render() {
        const {item, pages} = this.props;
        if(!item) return null;
        
        const style = {width: "100%", height: "100%"};
        return <PDFViewer style={style}>
            <Document>{pages}</Document>
        </PDFViewer>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Controls">
@observer
class Controls extends React.Component {
    
    @observable state = {
        webview: null
    };
    
    constructor(props) {
        super(props);
        
        this.onDownload  = this.onDownload.bind(this);
        this.onLoad = this.onLoad.bind(this);
    }
    
    onDownload(e, btn) {
        const jqEl = $(e.target);
        let {webview: {src}} = this.state;
        src = decodeURIComponent(src.substring(src.indexOf('file=blob') + 5, src.length));
        
        jqEl.attr('href', src).click();
    }
    
    onLoad(webview) {
        const {onComplete} = this.props.dialog;
        this.state.webview = webview;
        onComplete && onComplete(webview);
    }

    @computed get item() {
        return this.props.state.item;
    }

    render() {
        if (!this.item)
            return null;
        
        const {dialog: {pages}} = this.props;
        
//        console.log('pages', pages)
        
        return (<div className="controls-wrapper h-full">
            <div className="controls padding-0 h-full">
                <div className="row padding-0 h-full">
                    <div className="row sec-group w-full h-full">
                        <PDFViewerWrapper pages={pages} item={this.item} state={this.state} onLoad={this.onLoad}/>
                    </div>
                </div>
            </div>
            <OptionsDialog ref="optionsDialog"/>
        </div>);
    }
}
// </editor-fold>

export {APDFReader};