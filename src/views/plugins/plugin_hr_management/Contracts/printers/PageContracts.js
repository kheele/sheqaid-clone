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

// <editor-fold defaultstate="collapsed" desc="PageContracts">
@observer
class PageContracts extends APageDocuments {
    @observable state = {renderer: false};
    
    componentDidMount() {
        const {standalone, counter} = this.props;
        execWhen(() => (standalone && counter.pos === "Page2") || counter.pos === "PageDependentsNextOfKin").then(() => {
            this.state.renderer = true;
            setTimeout(() => {
                this.props.counter.pos = "PageContracts";
            }, 100);
        });
    }
    
    renderItemDeductible(item, n) {
        const {text, value} = item;
        return <Panel title={text} value={value.toCurrency('R')} colStyle={{width: '100%', borderBottom: '4px solid #fafafa'}}/>;
    }
    
    renderItem(item, n) {
        const {data: {created_at, salary_info = {}, contract_details = {}, doc, job_profile_doc}} = item;
        let {contract_type, start_date, expiry_date, end_of_trial_period, start_time, end_time, daily_working_hours, notes} = contract_details;        
        let {payment_type, salary_interval, salary = "N/A", wage, deductible = {}} = salary_info;
        if(salary !== "N/A") {
            salary = salary.toCurrency('R');
        }
        
        const {list: deductible_list} = deductible;
        
        return <View style={[styles.flexColumn]}>
            <View style={[styles.flexRow]}>
                <Panel title={`#${n+1}: ${contract_type} Contract of ${Dates.formatDate(start_date)} to ${Dates.formatDate(expiry_date)}`} noValue colStyle={{width: '100%', borderBottom: '4px solid #fafafa', backgroundColor: ''}}/>
            </View>
            <View style={[styles.flexColumn, {width: '100%'}]}>
                <Text style={styles.headingPoint}>Contract Details</Text>
                <View style={[styles.flexColumn, {width: '100%'}]}>
                    <Text style={styles.headingPoint}>Contract Terms</Text>
                    <View style={[styles.flexRow, {width: '100%'}]}>
                        <Panel title="Contract Type" value={contract_type} colStyle={{width: '25%', borderBottom: '4px solid #fafafa'}}/>
                        <Panel title="Start Date" type="date" value={start_date} colStyle={{width: '25%', borderBottom: '4px solid #fafafa'}}/>
                        <Panel title="End Date" type="date" value={expiry_date} colStyle={{width: '25%', borderBottom: '4px solid #fafafa'}}/>
                        <Panel title="End Of Trial Period" type="date" value={end_of_trial_period} colStyle={{width: '25%', borderBottom: '4px solid #fafafa'}}/>

                        <Text style={styles.headingPoint}>Working Schedule</Text>
                        <Panel title="Start Time" value={start_time} colStyle={{width: '33.3333%', borderBottom: '4px solid #fafafa'}}/>
                        <Panel title="End Time" value={end_time} colStyle={{width: '33.3333%', borderBottom: '4px solid #fafafa'}}/>
                        <Panel title="Daily Working Hours" value={daily_working_hours} colStyle={{width: '33.3333%', borderBottom: '4px solid #fafafa'}}/>

                        <Panel title="Notes" value={notes} colStyle={{width: '100%', borderBottom: '4px solid #fafafa'}}/>
                    </View>
                </View>
                    
                <View style={[styles.flexColumn, {width: '100%'}]}>
                    <Text style={styles.headingPoint}>Salary Information</Text>
                    <View style={[styles.flexRow, {width: '100%'}]}>
                        <Panel title="Payment Type" value={payment_type} colStyle={{width: '33.3333%', borderBottom: '4px solid #fafafa'}}/>
                        {payment_type==="Salary" && <Panel title="Salary Interval" value={salary_interval} colStyle={{width: '33.3333%', borderBottom: '4px solid #fafafa'}}/>}
                        {payment_type==="Salary" && <Panel title="Salary" value={salary} colStyle={{width: '33.3333%', borderBottom: '4px solid #fafafa'}}/>}
                        {payment_type==="Wage" && <Panel title="Wage" value={wage} colStyle={{width: '33.3333%', borderBottom: '4px solid #fafafa'}}/>}
                        <View style={[styles.flexColumn, {width: '100%'}]}>
                            <Text style={styles.headingPoint}>Deductibles</Text>
                            {deductible_list.map(this.renderItemDeductible)}
                        </View>
                    </View>
                </View>
            </View>
            <View style={[styles.flexColumn, {width: '100%'}]}>
                <Panel 
                    title="Contract Document" 
                    value={doc} 
                    type="file" 
                    titleStyle={{marginBottom: '10px'}} 
                    colStyle={{width: '100%', height: 'auto'}}
                    pdfPageRenderer={this.pdfPageRenderer}
                />
                <Panel 
                    title="Job Profile Document" 
                    value={job_profile_doc} 
                    type="file" 
                    titleStyle={{marginBottom: '10px'}} 
                    colStyle={{width: '100%', height: 'auto'}}
                    pdfPageRenderer={this.pdfPageRenderer}
                />
            </View>
        </View>;
    }
    
    isLast(n) {
        const {standalone} = this.props;
        return this.list.length - 1 === n;
    }
    
    @computed get list() {
        const {data: {employee_contract_list = {}}} = this.props.item;
        let list = Object.keys(employee_contract_list).map(id => {
            return {id, expiry_date: employee_contract_list[id].expiry_date || null};
        });
        list.sortBy('expiry_date', 'desc');
        list = list.map(({id, expiry_date}) => {
            return {id, data: employee_contract_list[id]};
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
                    <Text style={styles.headingPoint}>{standalone ? 5 : 7}. CONTRACTS DETAILS</Text>
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
        return list.filter(v => v.data.contract_details && v.data.contract_details.contract_type === type).length + '';
    };
    const countTrial = () => {
        return list.filter(v => v.data.contract_details && !!v.data.contract_details.end_of_trial_period).length + '';
    };
    
    return <View style={[styles.flexRow, {justifyContent: "space-between", alignItems: "center"}]}>
        <Panel title="Total" value={list.length + ''} colStyle={colStyle}/>
        <Panel title="Fixed Term" value={count('Fixed Term')} colStyle={colStyle}/>
        <Panel title="Permanent" value={count('Permanent')} colStyle={colStyle}/>
        <Panel title="Trial" value={countTrial()} colStyle={colStyle}/>
    </View>;
}

export default PageContracts;
//573