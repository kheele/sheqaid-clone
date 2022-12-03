// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import {APDFReader} from '../../../../../components/PrintComponents';

import {
    Page2,
    PageCauseAnalysis,
    PageEvidence,
    PageFirst,
    PageIncidentInjuryDetails,
    PageInvestigation,
    PageLast,
    PageParticipants,
    PageSeverity
} from './ProfilePDFReaderPages';
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="PDFReader">
@observer
class PDFReader extends APDFReader {
    title() {
        return "Incident Investigation Profile";
    }

    get pages() {
        const {item, counter} = this;
        return <React.Fragment>
            <PageFirst item={this.item}/>
            <PageParticipants item={this.item}/>
            <Page2 item={this.item}/>
            <PageIncidentInjuryDetails item={this.item}/>
            <PageCauseAnalysis item={this.item}/>
            <PageSeverity item={this.item}/>                                
            <PageInvestigation item={this.item}/>
            <PageEvidence item={this.item}/>
            <PageLast item={this.item}/>
        </React.Fragment>;
    }

}
// </editor-fold>

export default PDFReader;
//573