// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import {Page, Text, View} from '@react-pdf/renderer';

import styles from './ProfilePDFReader.style';

import {execWhen} from 'utils/Utils';

import {Panel} from 'pdf-components';

import APageDocuments from './APageDocuments';

const PageWrapper2 = ({size, orientation, style, children}) => (
  <Page wrap size={size} orientation={orientation} style={style}>
    {children}
  </Page>
);

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="PageMedicals">
@observer
class PageMedicals extends APageDocuments {
    @observable state = {renderer: false};
    
    componentDidMount() {
        execWhen(() => this.props.counter.pos === "PageCompetencies").then(() => {
            this.state.renderer = true;
            setTimeout(() => {
                this.props.counter.pos = "PageMedicals";
            }, 100);
        });
    }
    
    renderItem(item, n) {
        const {data: {created_at, annexture_3, restrictions, expiry_date, doc}} = item;
        
        return <View style={[styles.flexColumn]}>
            <View style={[styles.flexRow]}>
                <Panel title="Expiry Date" type="date" value={expiry_date} colStyle={{width: '50%', borderRight: '1px dotted #eee', borderBottom: '1px dotted #eee'}}/>
                <Panel title="Annexture 3?" value={annexture_3} colStyle={{width: '50%', borderBottom: '1px dotted #eee'}}/>
            </View>
            <View style={[styles.flexColumn]}>
                <Panel title="Restrictions" value={restrictions} colStyle={{width: '100%', borderBottom: '1px dotted #eee'}}/>
            </View>
            <Panel 
                title="Medical Fitness Certificate Document" 
                value={doc} 
                type="file" 
                titleStyle={{marginBottom: '10px'}} 
                colStyle={{width: '100%', height: 'auto'}}
                pdfPageRenderer={this.pdfPageRenderer}
            />
        </View>;
    }
    
    render() {
        if(!this.state.renderer) return null;
        const {
            data: {
                employee_medical_list = {}
            }
        } = this.props.item;
        
        let list = Object.keys(employee_medical_list).map(id => {
            return {id, expiry_date: employee_medical_list[id].expiry_date || null};
        });
        list.sortBy('expiry_date', 'desc');
//        const l = list.map(({id, expiry_date}) => {
//            return Dates.formatDate(expiry_date);
//        });
//        console.log('employees test', l)
        list = list.map(({id, expiry_date}) => {
            return {id, data: employee_medical_list[id]};
        });
        
        const item = list[0];
        
        return <PageWrapper2 size="A4" style={styles.page}>
            <View style={styles.content}>
                <View style={[styles.contentPanel, {textAlign: "left"}]}>
                    <Text style={styles.headingPoint}>9. MEDICAL FITNESS CERTIFICATES DETAILS</Text>
                    {item && this.renderItem(item, 0)}
                </View>
            </View>
        </PageWrapper2>;
    }
}
// </editor-fold>

export default PageMedicals;
//573