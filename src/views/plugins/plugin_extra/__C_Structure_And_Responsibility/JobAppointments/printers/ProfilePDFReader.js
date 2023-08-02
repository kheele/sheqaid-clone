// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import {APDFReader} from 'components/PrintComponents';

import {Page2, PageFirst, PageLast} from 'views/plugins/plugin_hr_management/printers/ProfilePDFReaderPages';

import PageJobAppointments from './PageJobAppointments';
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="PDFReader">
@observer
class PDFReader extends APDFReader {
    
    title() {
        return "Employee JobAppointments";
    }

    get pages() {
        const {item, counter} = this;
        return <React.Fragment>
            <PageFirst item={this.item} counter={counter} title="LEAVES REPORT"/>
            <Page2 item={this.item} counter={counter}/>
            <PageJobAppointments item={this.item} counter={counter} standalone/>
            
            <PageLast item={this.item} counter={counter}/>
        </React.Fragment>;
    }
}
// </editor-fold>

export default PDFReader;