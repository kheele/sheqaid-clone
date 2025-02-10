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

// <editor-fold defaultstate="collapsed" desc="PageWarnings">
@observer
class PageWarnings extends APageDocuments {
    @observable state = {renderer: false};
    
    componentDidMount() {
        execWhen(() => this.props.counter.pos === "PageMedicals").then(() => {
            this.state.renderer = true;
            setTimeout(() => {
                this.props.counter.pos = "PageWarnings";
            }, 100);
        });
    }
    
    renderItem(item, n) {
        const {data: {created_at, issued_by, type, date, expiry_date, details, employee_comments, notes, doc}} = item;
        
        return <View style={[styles.flexRow]}>
            <View style={[styles.flexRow]}>
                <Panel title="Warning Issued By" value={issued_by} renderer={v => v.lname + ' ' + v.fname} colStyle={{width: '50%', borderRight: '1px dotted #eee', borderBottom: '1px dotted #eee'}}/>
                <Panel title="Warning Type" value={type} colStyle={{width: '50%', borderBottom: '1px dotted #eee'}}/>
            </View>
            <View style={[styles.flexRow]}>
                <Panel title="Warning Date" type="date" value={date} colStyle={{width: '50%', borderRight: '1px dotted #eee', borderBottom: '1px dotted #eee'}}/>
                <Panel title="Warning Expiry Date" type="date" value={expiry_date} colStyle={{width: '50%', borderBottom: '1px dotted #eee'}}/>
            </View>
            <View style={[styles.flexColumn]}>
                <Panel title="Details Of Misconduct" value={details} colStyle={{width: '100%', borderBottom: '1px dotted #eee'}}/>
            </View>
            <View style={[styles.flexColumn]}>
                <Panel title="Employee's Comments" value={employee_comments} colStyle={{width: '100%', borderBottom: '1px dotted #eee'}}/>
            </View>
            <View style={[styles.flexColumn]}>
                <Panel title="Notes" value={notes} colStyle={{width: '100%', borderBottom: '1px dotted #eee'}}/>
            </View>
            <Panel 
                title="Warning Document" 
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
                employee_warning_list = {}
            }
        } = this.props.item;
        
        let list = Object.keys(employee_warning_list).map(id => {
            return {id, expiry_date: employee_warning_list[id].expiry_date || null};
        });
        list.sortBy('expiry_date', 'desc');
//        const l = list.map(({id, expiry_date}) => {
//            return Dates.formatDate(expiry_date);
//        });
//        console.log('employees test', l)
        list = list.map(({id, expiry_date}) => {
            return {id, data: employee_warning_list[id]};
        });
        
        const item = list[0];
        
        return <PageWrapper2 size="A4" style={styles.page}>
            <View style={styles.content}>
                <View style={[styles.contentPanel, {textAlign: "left"}]}>
                    <Text style={styles.headingPoint}>10. WARNINGS DETAILS</Text>
                    {item && this.renderItem(item, 0)}
                </View>
            </View>
        </PageWrapper2>;
    }
}
// </editor-fold>

export default PageWarnings;
//573