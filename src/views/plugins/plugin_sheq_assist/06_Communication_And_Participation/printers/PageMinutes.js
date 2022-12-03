// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';
import {Page, Text, View} from '@react-pdf/renderer';

import styles from '../../printers/ProfilePDFReader.style';

import {Dates, execWhen} from '../../../../../utils/Utils';

import {Panel} from '../../../../../pdf-components';

import APageDocuments from '../../printers/APageDocuments';

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
        const {standalone, counter} = this.props;
        execWhen(() => (standalone && counter.pos === "Page2") || counter.pos === "PageCompetencies").then(() => {
            this.state.renderer = true;
            setTimeout(() => {
                this.props.counter.pos = "PageMedicals";
            }, 100);
        });
    }
    
    renderItem(item, n) {
        const {data: {created_at, annexture_3, restrictions, date, expiry_date, doc}} = item;
        
        return <View style={[styles.flexColumn]}>
            <View style={[styles.flexRow]}>
                <Panel title={`#${n+1}: Medical Fitness Certificate of ${Dates.formatDate(date)} to ${Dates.formatDate(expiry_date)}`} noValue colStyle={{width: '100%', borderBottom: '4px solid #fafafa', backgroundColor: ''}}/>
            </View>
            <View style={[styles.flexRow]}>
                <Panel title="Expiry Date" type="date" value={expiry_date} colStyle={{width: '50%', borderRight: '4px solid #fafafa', borderBottom: '4px solid #fafafa'}}/>
                <Panel title="Annexture 3?" value={annexture_3} colStyle={{width: '50%', borderBottom: '4px solid #fafafa'}}/>
            </View>
            <View style={[styles.flexColumn]}>
                <Panel title="Restrictions" value={restrictions} colStyle={{width: '100%', borderBottom: '4px solid #fafafa'}}/>
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
    
    isLast(n) {
        const {standalone} = this.props;
        return this.list.length - 1 === n;
    }
    
    @computed get list() {
        const {data: {employee_medical_list = {}}} = this.props.item;
        let list = Object.keys(employee_medical_list).map(id => {
            return {id, expiry_date: employee_medical_list[id].expiry_date || null};
        });
        list.sortBy('expiry_date', 'desc');
        list = list.map(({id, expiry_date}) => {
            return {id, data: employee_medical_list[id]};
        });
        return list;
    }
    
    render() {
        if(!this.state.renderer) return null;
        const {standalone} = this.props;
        let {list} = this;  
        return <PageWrapper2 size="A4" style={styles.page}>
            <View style={styles.content}>
                <View style={[styles.contentPanel, {textAlign: "left"}]}>
                    <Text style={styles.headingPoint}>{standalone ? 5 : 9}. MEDICAL FITNESS CERTIFICATES DETAILS</Text>
                    {createStats(list)}
                    {list.map(this.renderItem)}
                </View>
            </View>
        </PageWrapper2>;
    }
}
// </editor-fold>

function createStats(list) {
    const colStyle = {
        display: 'flex', flexShrink: '1', flexDirection: 'column', 
        justifyContent: "center", alignItems: "center", 
        borderRadius: '50%', 
        width: '33.3333%', height: '50px'
    };
    
    const count = type => {
        return list.filter(v => v.data.annexture_3 === type).length + '';
    };
    
    return <View style={[styles.flexRow, {justifyContent: "space-between", alignItems: "center"}]}>
        <Panel title="Total" value={list.length + ''} colStyle={colStyle}/>
        <Panel title="Annexture 3: Yes" value={count('Yes')} colStyle={colStyle}/>
        <Panel title="Annexture 3: No" value={count('No')} colStyle={colStyle}/>
    </View>;
}

export default PageMedicals;
//573