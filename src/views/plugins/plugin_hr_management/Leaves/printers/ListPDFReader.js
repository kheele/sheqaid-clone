// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {View} from '@react-pdf/renderer';

import {APDFReader} from 'components/PrintComponents';
import {Panel, styles} from 'pdf-components';

import {getValue, Page2, PageFirst, PageLast} from '../../printers/ListPDFReaderPages';

import ListLeaves from './ListLeaves';
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="PDFReader">
@observer
class PDFReader extends APDFReader {
    constructor(props) {
        super(props);
        this.renderExtraDateDetails = this.renderExtraDateDetails.bind(this);
    }
    
    title() {
        return "Employees Leaves";
    }
    
    renderExtraDateDetails() {
        const date = getValue.call(this, 'date');
        return <View style={[styles.flexRow]}>
            <Panel title="Start Date" value={date} colStyle={{width: '100%', borderBottom: '4px solid #fafafa'}}/>
        </View>
    }

    get pages() {
        const {item, counter} = this;
        if(!item) return null;
        return <React.Fragment>
            <PageFirst item={item} counter={counter} title="LEAVES"/>
            <Page2 item={item} counter={counter} renderExtraDateDetails={this.renderExtraDateDetails}/>
            <ListLeaves item={item} counter={counter} standalone/>
            
            <PageLast item={item} counter={counter}/>
        </React.Fragment>;
    }
}
// </editor-fold>

export default PDFReader;