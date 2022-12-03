// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {PDFDocument} from 'pdf-lib'
import {observer} from 'mobx-react';
import {autorun} from 'mobx';

import {APDFReader} from '../../../../../components/PrintComponents';

import {PageFirst, PageLast} from './ProfilePDFReaderPages';
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="PDFReader">
@observer
class PDFReader extends APDFReader {
    
    componentDidMount() {
        super.componentDidMount();
        
        const {execWhen, counter} = this;
        execWhen(() => this.item).then(() => {
            progressDialog.open();
        });
        autorun(async () => {
            if(counter.pos !== 2)
                return;
            const {controls} = this.refs;
            const organogramImgSrc = this.canvas.toDataURL('image/jpeg', 1.0);
            const organogramImgBytes = await fetch(organogramImgSrc).then(res => res.arrayBuffer());
            execWhen(() => controls.state.webview).then(async ({src}) => {
                const dataUrl = src.substring(src.indexOf('file=blob') + 5, src.length);
                const webviewPdfSrc = decodeURIComponent(dataUrl);
                const mainPdfDocBytes = await fetch(webviewPdfSrc).then(res => res.arrayBuffer());
                const mainPdfDoc = await PDFDocument.load(mainPdfDocBytes);
                const organogramPdfDoc = await PDFDocument.create();

                const pages = mainPdfDoc.getPages();

                const organogramImg = await organogramPdfDoc.embedJpg(organogramImgBytes);
                const {width: imgWidth, height: imgHeight} = organogramImg.scale(1.0);
                
                controls.refs.optionsDialog.options(['Print as A4', 'Print as A3']).open().then(async res => {
                    let pageSize;
                    if(res.contains('A4')) {
                        pageSize = [841.89, 595.28]; // A4 landscape
                    } else {
                        pageSize = [1190.55, 841.89]; // A3 landscape
                    }
                    const organogramPage = organogramPdfDoc.addPage(pageSize);

                    const height = organogramPage.getHeight() - 10;
                    const width = ((imgWidth * height) / imgHeight) - 10;

                    organogramPage.drawImage(organogramImg, {
                        x: organogramPage.getWidth() / 2 - width / 2,
                        y: organogramPage.getHeight() / 2 - height / 2,
                        width,
                        height
                    });

                    const organogramPdfDocCopiedPages = await mainPdfDoc.copyPages(organogramPdfDoc, [0]);
                    const [organogramPageCopy] = organogramPdfDocCopiedPages;
                    mainPdfDoc.insertPage(pages.length - 1, organogramPageCopy);

                    const newBase64Src = await mainPdfDoc.saveAsBase64({dataUri: true});
                    const newSrc = src.replace(dataUrl, dataUriToUrl(newBase64Src));
                    controls.state.webview.src = newSrc;

                    setTimeout(progressDialog.close, 1000);
                });
            });
        });
    }
    
    get canvas() {
        return this.item.canvas;
    }
    
    title() {
        return "Organogram Profile";
    }

    get pages() {
        const {item, counter} = this; 
        return <React.Fragment>
            <PageFirst item={this.item} counter={counter}/>        
            <PageLast item={this.item} counter={counter}/>
        </React.Fragment>;
    }
}
// </editor-fold>

export default PDFReader;