// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import {APDFReader} from 'components/PrintComponents';

import {Page2, PageFirst, PageLast} from '../../printers/ProfilePDFReaderPages';

import PageKPI from './PageKPI';
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="PDFReader">
@observer
class PDFReader extends APDFReader {
    
    title() {
        return "KPI (Key Perfomance Indicator)";
    }

    get pages() {
        const {item, counter} = this;
        return <React.Fragment>
            <PageFirst item={this.item} counter={counter} title="KPI (Key Perfomance Indicator) REPORT"/>
            <Page2 item={this.item} counter={counter}/>
            <PageKPI item={this.item} counter={counter} standalone/>
            
            <PageLast item={this.item} counter={counter}/>
        </React.Fragment>;
    }
}
// </editor-fold>

export default PDFReader;