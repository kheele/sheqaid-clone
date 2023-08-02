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

// <editor-fold defaultstate="collapsed" desc="ListCompetencies">
@observer
class ListCompetencies extends APageDocuments {
    @observable state = {renderer: false};
    
    componentDidMount() {
        const {standalone, counter} = this.props;
        execWhen(() => (standalone && counter.pos === "Page2") || counter.pos === "ListContracts").then(() => {
            this.state.renderer = true;
            setTimeout(() => {
                this.props.counter.pos = "ListCompetencies";
            }, 100);
        });
    }
    
    renderItem(item, n) {
        const {data: {created_at, title, training, trainer, type, competency_type, issued_date, expiry_date, accreditation_num, doc}} = item;
        
        return <View style={[styles.flexColumn]}>
            <View style={[styles.flexRow]}>
                <Panel title={`#${n+1}: ${competency_type} Competency Certificate of ${Dates.formatDate(issued_date)} to ${Dates.formatDate(expiry_date)}`} noValue colStyle={{width: '100%', borderBottom: '4px solid #fafafa', backgroundColor: ''}}/>
            </View>
            <View style={[styles.flexRow]}>
                <Panel title="Certificate Type" value={type} colStyle={{width: '33.3333%', borderRight: '4px solid #fafafa', borderBottom: '4px solid #fafafa'}}/>
                <Panel title="Competency Type" value={competency_type} colStyle={{width: '33.3333%', borderRight: '4px solid #fafafa', borderBottom: '4px solid #fafafa'}}/>
                <Panel title="Accreditation Number" value={accreditation_num} colStyle={{width: '33.3333%', borderBottom: '4px solid #fafafa'}}/>
            </View>
            <View style={[styles.flexRow]}>
                <Panel title="Date Of Issue" type="date" value={issued_date} colStyle={{width: '50%', borderRight: '4px solid #fafafa', borderBottom: '4px solid #fafafa'}}/>
                <Panel title="Expiry Date" type="date" value={expiry_date} colStyle={{width: '50%', borderBottom: '4px solid #fafafa'}}/>
            </View>
            <View style={[styles.flexRow]}>
                <Panel title="Training" value={training} value={training && training.course_or_module} renderer={v => isString(v) ? v : (v.name || v.data.name)} colStyle={{width: '50%', borderRight: '4px solid #fafafa', borderBottom: '4px solid #fafafa'}}/>
                <Panel title="Trainer" value={trainer} renderer={v => v.lname + " " + v.fname} colStyle={{width: '50%', borderBottom: '4px solid #fafafa'}}/>
            </View>
            <Panel 
                title="Competency Certificate Document" 
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
        const {data: {employee_competency_list = {}}} = this.props.item;
        let list = Object.keys(employee_competency_list).map(id => {
            return {id, expiry_date: employee_competency_list[id].expiry_date || null};
        });
        list.sortBy('expiry_date', 'desc');
        list = list.map(({id, expiry_date}) => {
            return {id, data: employee_competency_list[id]};
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
                    <Text style={styles.headingPoint}>{standalone ? 5 : 8}. COMPETENCY CERTIFICATES DETAILS</Text>
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
        width: '25%', height: '50px',
        margin: '5px'
    };
    const titleStyle = {fontSize: '8px'};
    
    const count = type => {
        return list.filter(v => v.data.competency_type === type).length + '';
    };
    
    return <View style={[styles.flexRow, {justifyContent: "space-between", alignItems: "center"}]}>
        <Panel title="Total" value={list.length + ''} colStyle={colStyle} titleStyle={titleStyle}/>
        <Panel title="Behavioural" value={count('Behavioural')} colStyle={colStyle} titleStyle={titleStyle}/>
        <Panel title="Technical/Functional" value={count('Technical / Functional')} colStyle={colStyle} titleStyle={titleStyle}/>
        <Panel title="Leadership" value={count('Leadership')} colStyle={colStyle} titleStyle={titleStyle}/>
    </View>;
}

export default ListCompetencies;
//573