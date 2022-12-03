// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {PDFDocument} from 'pdf-lib'
import {observer} from 'mobx-react';

import {APDFReader} from '../../../../../components/PrintComponents';

import {Page2, PageFirst, PageLast} from './ProfilePDFReaderPages';

//import PageCompetencies from './PageCompetencies';
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="PDFReader">
@observer
class PDFReader extends APDFReader {
    
    title() {
        return this.props.title;
    }

    get pages() {
        const {item, counter, props: {showCategory}} = this;
        return <React.Fragment>
            <PageFirst item={this.item} counter={counter} title={`${this.props.title.toUpperCase()} REPORT`}/>
            <Page2 item={this.item} counter={counter} showCategory={showCategory}/>
            
            <PageLast item={this.item} counter={counter}/>
        </React.Fragment>;
    }
    
    async onComplete(webview) {
        const {item, counter} = this;
        const {id, data: {doc, doc_old}} = item;
        let {src} = webview;
        const dataUrl = src.substring(src.indexOf('file=blob') + 5, src.length);
        const webviewPdfSrc = decodeURIComponent(dataUrl);
//        alert(webviewPdfSrc)
        const mainPdfDocBytes = await fetch(webviewPdfSrc).then(res => res.arrayBuffer());
        const docPdfDocBytes = await fetch(doc.dlUrls[0]).then(res => res.arrayBuffer());
        const mainPdfDoc = await PDFDocument.load(mainPdfDocBytes);
        const docPdfDoc = await PDFDocument.load(docPdfDocBytes);

        const docPdfDocCopiedPages = await mainPdfDoc.copyPages(docPdfDoc, docPdfDoc.getPageIndices());
        docPdfDocCopiedPages.forEach(docPageCopy => {
            const pages = mainPdfDoc.getPages();
            mainPdfDoc.insertPage(pages.length - 2, docPageCopy);
        });

        const newBase64Src = await mainPdfDoc.saveAsBase64({dataUri: true});
        const newSrc = src.replace(dataUrl, dataUriToUrl(newBase64Src));
        webview.src = newSrc;
    }
}
// </editor-fold>

export default PDFReader;