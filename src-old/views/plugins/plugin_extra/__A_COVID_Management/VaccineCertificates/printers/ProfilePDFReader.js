// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import {APDFReader} from '../../../../../../components/PrintComponents';

import {Page2, PageFirst, PageLast} from '../../../../plugin_hr_management/printers/ProfilePDFReaderPages';

import PageVaccineCertificates from './PageVaccineCertificates';
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="PDFReader">
@observer
class PDFReader extends APDFReader {
    
    title() {
        return "Employee Vaccine Certificates";
    }

    get pages() {
        const {item, counter} = this;
        return <React.Fragment>
            <PageFirst item={this.item} counter={counter} title="VACCINE CERTIFICATES REPORT"/>
            <Page2 item={this.item} counter={counter}/>
            <PageVaccineCertificates item={this.item} counter={counter} standalone/>
            
            <PageLast item={this.item} counter={counter}/>
        </React.Fragment>;
    }
}
// </editor-fold>

export default PDFReader;