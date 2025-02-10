// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import {APDFReader} from '../../PrintComponents';

import {Page2, PageFirst, PageLast} from './ProfileResponsePDFReaderPages';
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="PDFReader">
@observer
class PDFReader extends APDFReader {
    
    title() {
        return "Contractor Questionnaire Responses";
    }

    get pages() {
        const {item, counter} = this;
        return <React.Fragment>
            <PageFirst item={this.item} counter={counter} title="Contractor Questionnaire Responses REPORT"/>
            <Page2 item={this.item} counter={counter}/>
            
            <PageLast item={this.item} counter={counter}/>
        </React.Fragment>;
    }
}
// </editor-fold>

export default PDFReader;