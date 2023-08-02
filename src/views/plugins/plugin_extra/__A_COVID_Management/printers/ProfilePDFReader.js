// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import {APDFReader} from 'components/PrintComponents';

import {PageFirst, PageLast} from './ProfilePDFReaderPages';
import {Page2 as Page2Screening} from './ProfileListScreeningPDFReaderPages';
import {Page2 as Page2Vulnerability} from './ProfileListVulnerabilityPDFReaderPages';
import {Page2 as Page2Positive} from './ProfileListPositivePDFReaderPages';
import {Page2 as Page2ReturnToWork} from './ProfileListReturnToWorkPDFReaderPages';

// <editor-fold defaultstate="collapsed" desc="PDFReader">
@observer
class PDFReader extends APDFReader {
    
    title() {
        return this.props.title;
    }

    get pages() {
        const {item, counter, props: {title, type}} = this;
        return <React.Fragment>
            <PageFirst item={this.item} counter={counter} title={`${title.toUpperCase()} REPORT`}/>
            {type === 'Screening' && <Page2Screening title={title.toUpperCase()} item={this.item} counter={counter}/>}
            {type === 'Vulnerability' && <Page2Vulnerability title={title.toUpperCase()} item={this.item} counter={counter}/>}
            {type === 'Positive' && <Page2Positive title={title.toUpperCase()} item={this.item} counter={counter}/>}
            {type === 'ReturnToWork' && <Page2ReturnToWork title={title.toUpperCase()} item={this.item} counter={counter}/>}
            
            <PageLast title={title.toUpperCase()} item={this.item} counter={counter}/>
        </React.Fragment>;
    }
    
}
// </editor-fold>

export default PDFReader;