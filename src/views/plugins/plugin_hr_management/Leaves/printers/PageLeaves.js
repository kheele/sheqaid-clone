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

// <editor-fold defaultstate="collapsed" desc="PageLeaves">
@observer
class PageLeaves extends APageDocuments {
    @observable state = {renderer: false};
    
    componentDidMount() {
        const {standalone, counter} = this.props;
        execWhen(() => (standalone && counter.pos === "Page2") || counter.pos === "PageMedicals").then(() => {
            this.state.renderer = true;
            setTimeout(() => {
                this.props.counter.pos = "PageLeaves";
            }, 100);
        });
    }
    
    renderItem(item, n) {
        const {data: {created_at, doc, employee, type, due_to, date, expiry_date, days_booked, reason, employee_comments, notes}} = item;
        
        return <View style={[styles.flexColumn]}>
            <View style={[styles.flexRow]}>
                <Panel title={`#${n+1}: ${type} Leave of ${Dates.formatDate(date)} to ${Dates.formatDate(expiry_date)}`} noValue colStyle={{width: '100%', borderBottom: '4px solid #fafafa', backgroundColor: ''}}/>
            </View>
            <View style={[styles.flexRow]}>
                <Panel title="Leave Type" value={type} colStyle={{width: '50%', borderRight: '4px solid #fafafa', borderBottom: '4px solid #fafafa'}}/>
                <Panel title="Leave Due To" value={due_to} colStyle={{width: '50%', borderBottom: '4px solid #fafafa'}}/>
            </View>
            <View style={[styles.flexRow]}>
                <Panel title="No. Of Days Booked" value={days_booked} colStyle={{width: '33.3333%', borderRight: '4px solid #fafafa', borderBottom: '4px solid #fafafa'}}/>
                <Panel title="Leave Start Date" type="date" value={date} colStyle={{width: '33.3333%', borderRight: '4px solid #fafafa', borderBottom: '4px solid #fafafa'}}/>
                <Panel title="Leave Expiry Date" type="date" value={expiry_date} colStyle={{width: '33.3333%', borderBottom: '4px solid #fafafa'}}/>
            </View>
            <View style={[styles.flexColumn]}>
                <Panel title="Reason Of Leave" value={reason} colStyle={{width: '100%', borderBottom: '4px solid #fafafa'}}/>
            </View>
            <View style={[styles.flexColumn]}>
                <Panel title="Employee's Comments" value={employee_comments} colStyle={{width: '100%', borderBottom: '4px solid #fafafa'}}/>
            </View>
            <View style={[styles.flexColumn]}>
                <Panel title="Notes" value={notes} colStyle={[styles.col1, {marginBottom: this.isLast(n) ? 0 : '5px'}]}/>
            </View>
            <Panel 
                title="Leave Document" 
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
        const {data: {employee_leave_list = {}}} = this.props.item;
        let list = Object.keys(employee_leave_list).map(id => {
            return {id, expiry_date: employee_leave_list[id].expiry_date || null};
        });
        list.sortBy('expiry_date', 'desc');
        list = list.map(({id, expiry_date}) => {
            return {id, data: employee_leave_list[id]};
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
                    <Text style={styles.headingPoint}>{standalone ? 5 : 9}. LEAVES DETAILS</Text>
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
        width: '16.6666%', height: '50px'
    };
    
    const count = type => {
        return list.filter(v => v.data.type === type).length + '';
    };
    
    return <View style={[styles.flexRow, {justifyContent: "space-between", alignItems: "center"}]}>
        <Panel title="Total" value={list.length + ''} colStyle={colStyle}/>
        <Panel title="Annual" value={count('Annual')} colStyle={colStyle}/>
        <Panel title="Sick" value={count('Sick')} colStyle={colStyle}/>
        <Panel title="Maternity" value={count('Maternity')} colStyle={colStyle}/>
        <Panel title="Family Responsibility" value={count('Family Responsibility')} colStyle={colStyle}/>
        <Panel title="Unpaid" value={count('Unpaid')} colStyle={colStyle}/>
    </View>;
}

export default PageLeaves;
//573