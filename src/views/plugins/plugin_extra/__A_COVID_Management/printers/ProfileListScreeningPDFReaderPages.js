// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import {Page, Text, View} from '@react-pdf/renderer';

import {Dates, execWhen} from '../../../../../utils/Utils';

import {Panel, styles} from '../../../../../pdf-components';

const PageWrapper = ({size, orientation, style, children}) => (
  <Page wrap size={size} orientation={orientation} style={style}>
    {children}
  </Page>
);

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Page2">
@observer
class Page2 extends React.Component {
    @observable state = {renderer: false};
    
    componentDidMount() {
        execWhen(() => this.props.counter.pos === "PageFirst").then(() => {
            this.state.renderer = true;
            setTimeout(() => {
                this.props.counter.pos = "Page2";
            }, 100);
        });
    }
    
    renderItem(item, n) {
        const {data: {created_at, employee, date, consent, business_id, sex, age, province, district, job_category, symptoms_status}} = item;
        
        console.log('w', item)
        
        return <View key={n} style={[styles.flexColumn, {borderBottom: '1px solid #ddd'}]}>
            <View style={[styles.backDetailsTableCell, {flexGrow: '1', borderRight: '1px solid #ddd'}]}>
                <Text>{employee.lname || employee.data.lname} {employee.fname || employee.data.fname}</Text>
            </View>
            <View style={[styles.backDetailsTableCell, {flexGrow: '1', borderRight: '1px solid #ddd'}]}>
                <Text>{Dates.formatDate(date)}</Text>
            </View>
            <View style={[styles.backDetailsTableCell, {flexGrow: '1', borderRight: '1px solid #ddd'}]}>
                <Text>{(isObject(consent) ? consent.value : consent) || 'No'}</Text>
            </View>
            <View style={[styles.backDetailsTableCell, {flexGrow: '1'}]}>
                <Text>{symptoms_status}</Text>
            </View>
        </View>;
    }
    
    isLast(n) {
        const {item: list, standalone} = this.props;
        return list.length - 1 === n;
    }
    
    render() {
        if(!this.state.renderer) return null;
        const {title, item: list} = this.props;
        
        const {isConsultant} = storage.is;
        
        return <PageWrapper size="A4" orientation="landscape" style={styles.page}>
            <View style={styles.content}>
                <View style={[styles.contentPanel, {textAlign: "left"}]}>
                    <Text style={styles.headingPoint}>{title} DETAILS</Text>
                    {createStats(list)}
                    <View style={[styles.flexRow, {fontWeight: 'bold', border: '1px solid #ddd', marginTop: '10px'}]}>
                        <View style={[styles.backDetailsTableCell, {flexGrow: '1', borderRight: '1px solid #ddd'}]}>
                            <Text>Employee</Text>
                        </View>
                        <View style={[styles.backDetailsTableCell, {flexGrow: '1', borderRight: '1px solid #ddd'}]}>
                            <Text>Date</Text>
                        </View>
                        <View style={[styles.backDetailsTableCell, {flexGrow: '1', borderRight: '1px solid #ddd'}]}>
                            <Text>Consent</Text>
                        </View>
                        <View style={[styles.backDetailsTableCell, {flexGrow: '1'}]}>
                            <Text>Symptoms Present</Text>
                        </View>
                    </View>
                    {list.map(this.renderItem)}
                </View>
            </View>
        </PageWrapper>;
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
    
    const countRecords = list.length + '';
    const countEmployees = list.map(({data:{employee}}) => employee.id).distinct().length + '';
    const countConsentNo = list.filter(({data:{consent}}) => (isObject(consent) ? consent.value : consent) === 'No').length + '';
    const countSymptomsPresentYes = list.filter(({data:{symptoms_status}}) => symptoms_status === 'Yes').length + '';
    
    const countHasFever = list.filter(({data:{checklist}}) => checklist.anyMatch(({key, status}) => key === 'temperature' && parseFloat(status) > 38)).length + '';
    const countNotWearingMask = list.filter(({data:{checklist}}) => checklist.anyMatch(({key, status}) => key === 'are_you_wearing_a_mask' && status === 'No')).length + '';
    const countInContactWithCovidPatient = list.filter(({data:{checklist}}) => checklist.anyMatch(({key, status}) => key === 'in_contact_with_covid_patient' && status === 'Yes')).length + '';
    const countTravelledInLast14Days = list.filter(({data:{checklist}}) => checklist.anyMatch(({key, status}) => key === 'last_14_days_travelled' && status === 'Yes')).length + '';
    
    return <View style={[styles.flexRow, {flexWrap: 'wrap', justifyContent: "space-between", alignItems: "center"}]}>
        <Panel title="Records" value={countRecords} colStyle={colStyle}/>
        <Panel title="Employees" value={countEmployees} colStyle={colStyle}/>
        <Panel title="Consent (No)" value={countConsentNo} colStyle={colStyle}/>
        <Panel title="Symptoms Present (Yes)" value={countSymptomsPresentYes} colStyle={colStyle}/>
        
        <Panel title="Has Fever" value={countHasFever} colStyle={colStyle}/>
        <Panel title="Not Wearing Mask" value={countNotWearingMask} colStyle={colStyle}/>
        <Panel title="In Contact With Covid Patient" value={countInContactWithCovidPatient} colStyle={colStyle}/>
        <Panel title="Travelled In Last 14 Days" value={countTravelledInLast14Days} colStyle={colStyle}/>
    </View>;
}

export {
    Page2
};