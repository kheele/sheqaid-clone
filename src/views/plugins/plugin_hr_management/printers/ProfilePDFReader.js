// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import {APDFReader} from 'components/PrintComponents';

import {
    Page2,
    Page2BankingDetails,
    Page2LivingAddress,
    PageDependentsNextOfKin,
    PageDocuments1,
    PageDocuments2,
    PageFirst,
    PageLast
} from './ProfilePDFReaderPages';

import PageContracts from './PageContracts';
import PageCompetencies from './PageCompetencies';
import PageMedicals from './PageMedicals';
import PageWarnings from './PageWarnings';
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="PDFReader">
@observer
class PDFReader extends APDFReader {
    
    title() {
        return "Employee Profile";
    }

    get pages() {
        const {item, counter} = this;
        return <React.Fragment>
            <PageFirst item={this.item} counter={counter}/>
            <Page2 item={this.item} counter={counter}/>
            <Page2LivingAddress item={this.item} counter={counter}/>
            <Page2BankingDetails item={this.item} counter={counter}/>
            <PageDocuments1 item={this.item} counter={counter}/>
            <PageDocuments2 item={this.item} counter={counter}/>

            <PageDependentsNextOfKin item={this.item} counter={counter}/>
            
            <PageContracts item={this.item} counter={counter}/>
            <PageCompetencies item={this.item} counter={counter}/>
            <PageMedicals item={this.item} counter={counter}/>
            <PageWarnings item={this.item} counter={counter}/>
            
            <PageLast item={this.item} counter={counter}/>
        </React.Fragment>;
    }
}
// </editor-fold>

export default PDFReader;