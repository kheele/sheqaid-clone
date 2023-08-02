// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import {APDFReader} from '../../../../../components/PrintComponents';

import {Page1, Page2, PageLast, PageStats} from './ProfilePDFReaderPages';
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="PDFReader">
@observer
class PDFReader extends APDFReader {
    
    title() {
        return "Audit";
    }

    get pages() {
        const {item} = this;
        return <React.Fragment>
            <Page1 item={item}/>
            <PageStats item={item}/>
            <Page2 item={item}/>
            <PageLast item={item}/>
        </React.Fragment>;
    }
}
// </editor-fold>

export default PDFReader;