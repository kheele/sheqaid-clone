// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import {APDFReader} from '../../../../../../components/PrintComponents';

import {Page2, PageFirst, PageLast} from '../../../printers/ProfilePDFReaderPages';

import PageCompetencies from './PageCompetencies';
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="PDFReader">
@observer
class PDFReader extends APDFReader {
    
    title() {
        return "Employee Competencies";
    }

    get pages() {
        const {item, counter} = this;
        return <React.Fragment>
            <PageFirst item={this.item} counter={counter} title="COMPETENCIES REPORT"/>
            <Page2 item={this.item} counter={counter}/>
            <PageCompetencies item={this.item} counter={counter} standalone/>
            
            <PageLast item={this.item} counter={counter}/>
        </React.Fragment>;
    }
}
// </editor-fold>

export default PDFReader;