// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import {APDFReader} from 'components/PrintComponents';

import {Page2, PageFirst, PageLast} from '../../printers/ListPDFReaderPages';

import ListWorkPermits from './ListWorkPermits';
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="PDFReader">
@observer
class PDFReader extends APDFReader {
    constructor(props) {
        super(props);
//        this.renderExtraDateDetails = this.renderExtraDateDetails.bind(this);
    }
    
    title() {
        return "Employees Work Permits";
    }

    get pages() {
        const {item, counter} = this;
        if(!item) return null;
        return <React.Fragment>
            <PageFirst item={item} counter={counter} title="WORK PERMITS"/>
            <Page2 item={item} counter={counter}/>
            <ListWorkPermits item={item} counter={counter} standalone/>
            
            <PageLast item={item} counter={counter}/>
        </React.Fragment>;
    }
}
// </editor-fold>

export default PDFReader;