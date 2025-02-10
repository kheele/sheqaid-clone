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

// <editor-fold defaultstate="collapsed" desc="PageContracts">
@observer
class PageContracts extends APageDocuments {
    @observable state = {renderer: false};
    
    componentDidMount() {
        execWhen(() => this.props.counter.pos === "PageDependentsNextOfKin").then(() => {
            this.state.renderer = true;
            setTimeout(() => {
                this.props.counter.pos = "PageContracts";
            }, 100);
        });
    }
    
    renderItemDeductible(item, n) {
        const {text, value} = item;
        return <Panel title={text} value={value.toCurrency('R')} colStyle={{width: '100%', borderBottom: '1px dotted #eee'}}/>;
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
            <View style={[styles.flexColumn, {width: '100%'}]}>
                <Text style={styles.headingPoint}>Contract Details</Text>
                <View style={[styles.flexColumn, {width: '100%'}]}>
                    <Text style={styles.headingPoint}>Contract Terms</Text>
                    <View style={[styles.flexColumn, {width: '100%'}]}>
                        <Panel title="Contract Type" value={contract_type} colStyle={{width: '100%', borderBottom: '1px dotted #eee'}}/>
                        <Panel title="Start Date" type="date" value={start_date} colStyle={{width: '100%', borderBottom: '1px dotted #eee'}}/>
                        <Panel title="End Date" type="date" value={expiry_date} colStyle={{width: '100%', borderBottom: '1px dotted #eee'}}/>
                        <Panel title="End Of Trial Period" type="date" value={end_of_trial_period} colStyle={{width: '100%', borderBottom: '1px dotted #eee'}}/>

                        <Text style={styles.headingPoint}>Working Schedule</Text>
                        <Panel title="Start Time" value={start_time} colStyle={{width: '100%', borderBottom: '1px dotted #eee'}}/>
                        <Panel title="End Time" value={end_time} colStyle={{width: '100%', borderBottom: '1px dotted #eee'}}/>
                        <Panel title="Daily Working Hours" value={daily_working_hours} colStyle={{width: '100%', borderBottom: '1px dotted #eee'}}/>

                        <Panel title="Notes" value={notes} colStyle={{width: '100%', borderBottom: '1px dotted #eee'}}/>
                    </View>
                </View>
                    
                <View style={[styles.flexColumn, {width: '100%'}]}>
                    <Text style={styles.headingPoint}>Salary Information</Text>
                    <View style={[styles.flexColumn, {width: '100%'}]}>
                        <Panel title="Payment Type" value={payment_type} colStyle={{width: '100%', borderBottom: '1px dotted #eee'}}/>
                        {payment_type==="Salary" && <Panel title="Salary Interval" value={salary_interval} colStyle={{width: '100%', borderBottom: '1px dotted #eee'}}/>}
                        {payment_type==="Salary" && <Panel title="Salary" value={salary} colStyle={{width: '100%', borderBottom: '1px dotted #eee'}}/>}
                        {payment_type==="Wage" && <Panel title="Wage" value={wage} colStyle={{width: '100%', borderBottom: '1px dotted #eee'}}/>}
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
    
    render() {
        if(!this.state.renderer) return null;
        const {
            data: {
                employee_contract_list = {}
            }
        } = this.props.item;
        
        let list = Object.keys(employee_contract_list).map(id => {
            return {id, expiry_date: employee_contract_list[id].expiry_date || null};
        });
        list.sortBy('expiry_date', 'desc');
//        const l = list.map(({id, expiry_date}) => {
//            return Dates.formatDate(expiry_date);
//        });
//        console.log('employees test', l)
        list = list.map(({id, expiry_date}) => {
            return {id, data: employee_contract_list[id]};
        });
        
        const item = list[0];
        
        return <PageWrapper2 size="A4" style={styles.page}>
            <View style={styles.content}>
                <View style={[styles.contentPanel, {textAlign: "left"}]}>
                    <Text style={styles.headingPoint}>7. CONTRACTS DETAILS</Text>
                    {item && this.renderItem(item, 0)}
                </View>
            </View>
        </PageWrapper2>;
    }
}
// </editor-fold>

export default PageContracts;
//573