// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {Image, Page} from '@react-pdf/renderer';
// </editor-fold>

const PageWrapper0 = ({size, orientation, style, children}) => (
  <Page wrap size={size} orientation={orientation} style={style}>
    {children}
  </Page>
);

@observer
class APageDocuments extends React.Component {
    pdfPageRenderer(src, n, length) {
        const imageStyle = {border: '1px solid #000'};
        let height;
        if(n === 0) {
            height = '570px';
        } else if(n === length - 1) {
            height = '715px';
        } else {
            height = '770px';                
        }
        if(n > 0) {
            return <PageWrapper0>
                <Image 
                    style={[imageStyle, {border: '1px solid #000', margin: 0, height: height, maxHeight: height}]} 
                    src={src}
                />
            </PageWrapper0>;
        } else {
            return <Image 
                style={[imageStyle, {border: '1px solid #000', margin: 0, height: height, maxHeight: height}]} 
                src={src}
            />;
        }
    }
    
}

export default APageDocuments;
//573