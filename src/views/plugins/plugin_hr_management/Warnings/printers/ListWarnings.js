// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';
import {Page, Text, View} from '@react-pdf/renderer';

import styles from '../../printers/ProfilePDFReader.style';

import {Dates, execWhen} from 'utils/Utils';

import {Panel} from 'pdf-components';

import APageDocuments from '../../printers/APageDocuments';

const PageWrapper2 = ({size, orientation, style, children}) => (
  <Page wrap size={size} orientation={orientation} style={style}>
    {children}
  </Page>
);

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ListWarnings">
@observer
class ListWarnings extends APageDocuments {
    @observable state = {renderer: false};
    
    componentDidMount() {
        const {standalone, counter} = this.props;
        execWhen(() => (standalone && counter.pos === "Page2") || counter.pos === "ListMedicals").then(() => {
            this.state.renderer = true;
            setTimeout(() => {
                this.props.counter.pos = "ListWarnings";
            }, 100);
        });
    }
    
    renderItem(item, n) {
        const {data: {created_at, issued_by, type, date, expiry_date, details, employee_comments, notes, doc}} = item;
        
        console.log('w', item)
        
        return <View style={[styles.flexColumn]}>
            <View style={[styles.flexRow]}>
                <Panel title={`#${n+1}: ${type} Warning of ${Dates.formatDate(date)} to ${Dates.formatDate(expiry_date)}`} noValue colStyle={{width: '100%', borderBottom: '4px solid #fafafa', backgroundColor: ''}}/>
            </View>
            <View style={[styles.flexRow]}>
                <Panel title="Warning Issued By" value={issued_by} renderer={v => v.lname + ' ' + v.fname} colStyle={{width: '100%', borderBottom: '4px solid #fafafa'}}/>
            </View>
            <View style={[styles.flexRow]}>
                <Panel title="Warning Type" value={type} colStyle={{width: '33.3333%', borderRight: '4px solid #fafafa', borderBottom: '4px solid #fafafa'}}/>
                <Panel title="Warning Date" type="date" value={date} colStyle={{width: '33.3333%', borderRight: '4px solid #fafafa', borderBottom: '4px solid #fafafa'}}/>
                <Panel title="Warning Expiry Date" type="date" value={expiry_date} colStyle={{width: '33.3333%', borderBottom: '4px solid #fafafa'}}/>
            </View>
            <View style={[styles.flexColumn]}>
                <Panel title="Details Of Misconduct" value={details} colStyle={{width: '100%', borderBottom: '4px solid #fafafa'}}/>
            </View>
            <View style={[styles.flexColumn]}>
                <Panel title="Employee's Comments" value={employee_comments} colStyle={{width: '100%', borderBottom: '4px solid #fafafa'}}/>
            </View>
            <View style={[styles.flexColumn]}>
                <Panel title="Notes" value={notes} colStyle={[styles.col1, {marginBottom: this.isLast(n) ? 0 : '5px'}]}/>
            </View>
        </View>;
    }
    
    isLast(n) {
        const {standalone} = this.props;
        return this.list.length - 1 === n;
    }
    
    @computed get list() {
        const {data: {employee_warning_list = {}}} = this.props.item;
        let list = Object.keys(employee_warning_list).map(id => {
            return {id, expiry_date: employee_warning_list[id].expiry_date || null};
        });
        list.sortBy('expiry_date', 'desc');
        list = list.map(({id, expiry_date}) => {
            return {id, data: employee_warning_list[id]};
        });
        return list;
    }
    
    render() {
        return null;
        if(!this.state.renderer) return null;
        const {standalone} = this.props;
        let {list} = this;        
        return <PageWrapper2 size="A4" style={styles.page}>
            <View style={styles.content}>
                <View style={[styles.contentPanel, {textAlign: "left"}]}>
                    <Text style={styles.headingPoint}>{standalone ? 5 : 10}. WARNINGS DETAILS</Text>
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
        width: '25%', height: '50px'
    };
    
    const count = type => {
        return list.filter(v => v.data.type === type).length + '';
    };
    
    return <View style={[styles.flexRow, {flexWrap: 'wrap', justifyContent: "space-between", alignItems: "center"}]}>
        <Panel title="Total" value={list.length + ''} colStyle={colStyle}/>
        <Panel title="Verbal" value={count('Verbal')} colStyle={colStyle}/>
        <Panel title="Written" value={count('Written')} colStyle={colStyle}/>
        <Panel title="Final" value={count('Final')} colStyle={colStyle}/>
    </View>;
}

export default ListWarnings;