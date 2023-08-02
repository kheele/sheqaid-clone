// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed} from 'mobx';
import {Document, PDFViewer} from '@react-pdf/renderer';

import {Clickable} from '../../../../../components/inputs';

import {Dates} from '../../../../../utils/Utils';
import {AProfileDialog} from '../../../../../components/dialogs';

import {
    Page2,
    PageAssetPics,
    PageCalibrationRecordDetails,
    PageClearanceCertificateDocDetails,
    PageDepreciationDetails,
    PageFirst,
    PageLast,
    PageMaintenancePlanDetails,
    PageMonitoringPlanDetails,
    PageOtherDocDetails,
    PagePurchaseDetails,
    PageWorkManualDocDetails,
    PageWorkProcedureDocDetails
} from './ProfilePDFReaderPages';
import style from "./ProfilePDFReader.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="PDFReader">
@observer
class PDFReader extends AProfileDialog {
    pageKey = "ProfilePDFReader";
    
    constructor(props) {
        super(props, style);

        this.onDownload = this.onDownload.bind(this);
    }

    title() {
        return "Asset Profile";
    }

    onDownload(e, btn) {
        this.refs.controls.onDownload(e, btn);
    }

    @computed get topButtons() {
        const download = ("AssetInvestigationProfile_" + Dates.formatDateTime(new Date())).replaceAll(" ", "_") + ".pdf";
        return <React.Fragment>
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

@observer
class Controls extends React.Component {
    
    constructor(props) {
        super(props);
        this.onDownload  = this.onDownload.bind(this);
    }
    
    onDownload(e, btn) {
        const jqEl = $(e.target);
        let {webview: {src}} = this.state;
        src = decodeURIComponent(src.substring(src.indexOf('file=blob') + 5, src.length));
        
        jqEl.attr('href', src).click();
    }

    get item() {
        return this.props.state.item;
    }

    render() {
        if (!this.item)
            return null;
        
        const style = {width: "100%", height: "100%"};
        return (<div className="controls-wrapper h-full">
            <div className="controls h-full padding-0">
                <div className="row padding-0">
                    <div className="row sec-group w-full">
                        <PDFViewer style={style}>
                            <Document>
                                <PageFirst item={this.item}/>
                                <PageAssetPics item={this.item}/>
                                <Page2 item={this.item}/>
                                <PagePurchaseDetails item={this.item}/> 
                                <PageDepreciationDetails item={this.item}/>
                                <PageWorkManualDocDetails item={this.item}/>
                                <PageWorkProcedureDocDetails item={this.item}/>
                                <PageClearanceCertificateDocDetails item={this.item}/>
                                <PageOtherDocDetails item={this.item}/>
                                <PageMonitoringPlanDetails item={this.item}/>
                                <PageMaintenancePlanDetails item={this.item}/>
                                <PageCalibrationRecordDetails item={this.item}/>
                                <PageLast item={this.item}/>
                            </Document>
                        </PDFViewer>
                    </div>
                </div>
            </div>
        </div>);
    }
}
// </editor-fold>

export default PDFReader;
//573