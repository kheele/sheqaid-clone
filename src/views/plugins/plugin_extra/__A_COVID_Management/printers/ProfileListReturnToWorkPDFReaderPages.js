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
        const {data: {created_at, employee, date, hospitalised, hospital_type, admission_date, outcome, outcome_date, return_to_work_date, return_to_work_fitness, compensation_claim, percentage_disablement, claim_ref_num}} = item;
        
        console.log('w', item)
        
        return <View key={n} style={[styles.flexColumn, {borderBottom: '1px solid #ddd'}]}>
            <View style={[styles.backDetailsTableCell, {flexGrow: '1', borderRight: '1px solid #ddd'}]}>
                <Text>{employee.lname || employee.data.lname} {employee.fname || employee.data.fname}</Text>
            </View>
            <View style={[styles.backDetailsTableCell, {flexGrow: '1', borderRight: '1px solid #ddd'}]}>
                <Text>{Dates.formatDate(date)}</Text>
            </View>
            <View style={[styles.backDetailsTableCell, {flexGrow: '1', borderRight: '1px solid #ddd'}]}>
                <Text>{outcome} ({Dates.formatDate(outcome_date)})</Text>
            </View>
            <View style={[styles.backDetailsTableCell, {flexGrow: '1', borderRight: '1px solid #ddd'}]}>
                <Text>{hospitalised}{hospitalised === "Yes" && (" (" + hospital_type + ")")}</Text>
            </View>
            <View style={[styles.backDetailsTableCell, {flexGrow: '1', borderRight: '1px solid #ddd'}]}>
                <Text>{Dates.formatDate(admission_date)}</Text>
            </View>
            <View style={[styles.backDetailsTableCell, {flexGrow: '1', borderRight: '1px solid #ddd'}]}>
                <Text>{return_to_work_fitness}</Text>
            </View>
            <View style={[styles.backDetailsTableCell, {flexGrow: '1'}]}>
                <Text>{Dates.formatDate(return_to_work_date)}</Text>
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
                        <View style={[styles.backDetailsTableCell, {borderRight: '1px solid #ddd'}]}>
                            <Text>Employee</Text>
                        </View>
                        <View style={[styles.backDetailsTableCell, {borderRight: '1px solid #ddd'}]}>
                            <Text>Date</Text>
                        </View>
                        <View style={[styles.backDetailsTableCell, {borderRight: '1px solid #ddd'}]}>
                            <Text>Outcome (Date)</Text>
                        </View>
                        <View style={[styles.backDetailsTableCell, {borderRight: '1px solid #ddd'}]}>
                            <Text>Hospitalised (Type)</Text>
                        </View>
                        <View style={[styles.backDetailsTableCell, {borderRight: '1px solid #ddd'}]}>
                            <Text>Admission Date</Text>
                        </View>
                        <View style={[styles.backDetailsTableCell, {borderRight: '1px solid #ddd'}]}>
                            <Text>Return To Work Fitness</Text>
                        </View>
                        <View style={[styles.backDetailsTableCell, {flexGrow: '1'}]}>
                            <Text>Return To Work Date</Text>
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
    const countOutcomeDischarge = list.filter(({data:{outcome}}) => outcome === 'Discharge').length + '';
    const countOutcomeDeath = list.filter(({data:{outcome}}) => outcome === 'Death').length + '';
    
    const countHospitalised = list.filter(({data:{hospitalised}}) => hospitalised === 'Yes').length + '';
    const countIllnessTypeSevere = list.filter(({data:{illness_type}}) => illness_type === 'Severe').length + '';
    const countHighRiskContacts = list.map(({data:{high_risk_contacts_num}}) => high_risk_contacts_num || 0).reduce((n1, n2) => n1 + n2, 0) + '';
    const countVulnerabilityPresent = list.filter(({data:{vulnerability_status}}) => vulnerability_status === 'Yes').length + '';
    
    return <View style={[styles.flexRow, {flexWrap: 'wrap', justifyContent: "space-between", alignItems: "center"}]}>
        <Panel title="Records" value={countRecords} colStyle={colStyle}/>
        <Panel title="Employees" value={countEmployees} colStyle={colStyle}/>
        <Panel title="Outcome (Discharge)" value={countOutcomeDischarge} colStyle={colStyle}/>
        <Panel title="Outcome (Death)" value={countOutcomeDeath} colStyle={colStyle}/>
        
        <Panel title="Hospitalised" value={countHospitalised} colStyle={colStyle}/>
        <Panel title="Illness Type (Severe)" value={countIllnessTypeSevere} colStyle={colStyle}/>
        <Panel title="High Risk Contacts" value={countHighRiskContacts} colStyle={colStyle}/>
        <Panel title="Vulnerability Present" value={countVulnerabilityPresent} colStyle={colStyle}/>
    </View>;
}

export {
    Page2
};