// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {PDFDocument, rgb, StandardFonts} from 'pdf-lib';
//import ReactPDF from '@react-pdf/renderer';
//import {Document} from '@react-pdf/renderer';
import {observer} from 'mobx-react';
import {autorun} from 'mobx';

import {APDFReader} from 'components/PrintComponents';

import {
    Page2,
    PageDisposalsDetails,
    PageEmergencyActionsForSpillsDetails,
    PageFirst,
    PageFirstAidProceduresDetails,
    PageHazardIdentificationDetails
} from './ProfileHazchemSheetPDFReaderPages';
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="PDFReader">
@observer
class PDFReader extends APDFReader {
    
    componentDidMount() {
        super.componentDidMount();
        
        const {execWhen, counter} = this;
        execWhen(() => this.item).then(() => {
//            progressDialog.open();
        });
        autorun(async () => {
            if(!this.item || (counter.pos !== 7 && this.item))
                return;
            const {data: {
                precaution_photo_concentrate_list = [],
                precaution_photo_application_list = []
            }} = this.item;
        
//            return;
//            if(!doc) return setTimeout(progressDialog.close, 1000);
            
            const {controls} = this.refs;
            execWhen(() => this.refs.controls && controls.state.webview).then(async () => {
                const {src} = controls.state.webview;
                const dataUrl = src.substring(src.indexOf('file=blob') + 5, src.length);
                const webviewPdfSrc = decodeURIComponent(dataUrl);
                const mainPdfDocBytes = await fetch(webviewPdfSrc).then(res => res.arrayBuffer());
                const mainPdfDoc = await PDFDocument.load(mainPdfDocBytes);
                const picsPdfDoc = await PDFDocument.create();
                
                const pageSize = [841.89, 595.28];// A4 landscape
                const picsPage = picsPdfDoc.addPage(pageSize);
                const timesRomanFont = await picsPdfDoc.embedFont(StandardFonts.TimesRoman);
                
                const addPics = async (list, indx, title) => {
                    const x = (indx * picsPage.getWidth() / 2);
                    const fontSize = 16;
                    const textWidth = timesRomanFont.widthOfTextAtSize(title, fontSize);
                    const textHeight = timesRomanFont.heightAtSize(fontSize);
                    const half = picsPage.getWidth() / 2;
                    picsPage.drawText(title, {
                        x: x + ((half - textWidth) / 2),
                        y: picsPage.getHeight() - 46,
                        size: fontSize,
                        font: timesRomanFont,
//                      color: rgb(0, 0.53, 0.71)
                    });
                    
//                    picsPage.moveDown(160);
                    const boxWidth = half - 30;
                    const boxHeight = 480;
                    picsPage.drawRectangle({
                        x: x + (indx === 0? 30 : 0),
                        y: picsPage.getHeight() - 560,
                        width: boxWidth,
                        height: boxHeight,
                        borderColor: rgb(0, 0, 0),
                        borderWidth: 1,
                    });
                                
                    return await Promise.all(list.splitAt(4).map(async (list, n0) => {
                        let pics = await Promise.all(list.map(async (v) => {
                            if(v && v.dlUrls) {
                                const src = v.dlUrls[0];
                                try {
                                    const imgBytes = await fetch(src).then(res => res.arrayBuffer());
                                    let pic;
                                    if(src.contains('.jpg') || src.contains('.jpeg')) {
                                        pic = await picsPdfDoc.embedJpg(imgBytes);
                                    } else if(src.contains('.png')) {
                                        pic = await picsPdfDoc.embedPng(imgBytes);
                                    }
                                    return pic;
                                } catch(ex) {

                                }
                            }
                        }));
                        pics = pics.filter(pic => !!pic);
                        pics.forEach((pic, n) => {
                            const {width: imgWidth, height: imgHeight} = pic.scale(1.0);
                            const maxWidth = boxWidth / 4;
                            const maxHeight = boxHeight / 5;
                            let height = ((imgHeight * maxWidth) / imgWidth);
                            let width;
                            if(height > maxHeight) {
                                height = maxHeight;
                                width = ((imgWidth * maxHeight) / imgHeight);
                            } else {
                                width = maxWidth;
                            }

                            const x2 = x + (n * maxWidth) + (indx === 0? 30 : 0);
                            const y = height * (n0+1);
                            picsPage.drawImage(pic, {
                                x: x2,
                                y: (picsPage.getHeight() - y) - 80,
                                width,
                                height
                            });
                        });
                    }));
                };
                
//
                await addPics([
                    ...precaution_photo_concentrate_list, 
                    ...precaution_photo_concentrate_list, 
                    ...precaution_photo_concentrate_list, 
                    ...precaution_photo_concentrate_list, 
                    ...precaution_photo_concentrate_list, 
                    ...precaution_photo_concentrate_list
                ], 0, "Precaution Concentrate Photo(s)");
//
                await addPics([
                    ...precaution_photo_application_list, 
                    ...precaution_photo_application_list, 
                    ...precaution_photo_application_list, 
                    ...precaution_photo_application_list, 
                    ...precaution_photo_application_list, 
                    ...precaution_photo_application_list
                ], 1, "Precaution Application Photo(s)");
//
                const picsPdfDocCopiedPages = await mainPdfDoc.copyPages(picsPdfDoc, picsPdfDoc.getPageIndices());
                picsPdfDocCopiedPages.forEach((picPageCopy, n) => {
                    mainPdfDoc.insertPage(1 + n, picPageCopy);
                });
//
                const newBase64Src = await mainPdfDoc.saveAsBase64({dataUri: true});
                const newSrc = src.replace(dataUrl, dataUriToUrl(newBase64Src));
                controls.state.webview.src = newSrc;
//
            }).finally(() => {
//                setTimeout(() => progressDialog.close(), 1000);
            });
        });
    }
    
    title() {
        return "Hazchem Sheet Profile";
    }

    get pages() {
        const {item, counter} = this;
        return <React.Fragment>
            <PageFirst item={this.item} counter={counter}/>
            <Page2 item={this.item} counter={counter}/>
            
            <PageHazardIdentificationDetails item={this.item} counter={counter}/>
            <PageFirstAidProceduresDetails item={this.item} counter={counter}/>
            <PageEmergencyActionsForSpillsDetails item={this.item} counter={counter}/>
            <PageDisposalsDetails item={this.item} counter={counter}/>
        </React.Fragment>;
    }
}
// </editor-fold>

/*
    <PagePrecautionPics item={this.item}/>
*/
export default PDFReader;