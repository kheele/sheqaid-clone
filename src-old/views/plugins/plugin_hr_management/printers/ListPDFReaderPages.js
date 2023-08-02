// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';
import {Page, Text, View} from '@react-pdf/renderer';

import {execWhen} from '../../../../utils/Utils';

import {Panel, styles} from '../../../../pdf-components';

const PageWrapper = ({size, orientation, style, children}) => (
  <Page wrap size={size} orientation={orientation} style={style}>
    {children}
  </Page>
);
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="APage">
@observer
class APage extends React.Component {
    
    @computed get item() {
        return this.props.item;
    }
    
    get client() {
        return getValue.call(this, 'client_id');
    }
    
    get project() {
        return getValue.call(this, 'project_id');
    }
    
    get site() {
        return getValue.call(this, 'site_id');
    }
    
    get department() {
        return getValue.call(this, 'department_id');
    }
    
    get job_position() {
        return getValue.call(this, 'job_position_id');
    }
    
    get employee() {
        return getValue.call(this, 'employee');
    }
    
    get expiry_date() {
        return getValue.call(this, 'expiry_date');
    }
    
    get date_range() {
        return getValue.call(this, 'date_range');
    }
    
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="PageFirst">
@observer
class PageFirst extends APage {
    
    componentDidMount() {
        setTimeout(() => {
            this.props.counter.pos = "PageFirst";
        }, 100);
    }
    
    render() {
        let {
            client, project, site,
            props: {title}, 
            item
        } = this;
        if(!item) return null;
        const {list, values} = item;
        
        const rowStyle = {margin: '30px auto 0px', display: 'flex', flexDirection: 'column', placeItems: "center", justifyContent: 'center'};
        
        return <PageWrapper size="A4" style={styles.page}>
            <View style={styles.content}>
                <View style={{height: '100%', display: 'flex', flexDirection: 'column', placeItems: "center", justifyContent: 'center', fontSize: 26}}>
                    <Text style={{margin: '20px auto 0'}}>{title} REPORT</Text>
                    <Text style={{margin: '0px auto 20px', fontSize: '15px'}}>OF</Text>
                    
                    {client && <View style={rowStyle}>
                        <Text>COMPANY</Text>
                        <Text style={{marginTop: '10px', fontSize: '15px'}}>{client}</Text>
                    </View>}
                        
                    {project && <View style={rowStyle}>
                        <Text>PROJECT</Text>
                        <Text style={{marginTop: '10px', fontSize: '15px'}}>{project}</Text>
                    </View>}
                        
                    {site && <View style={rowStyle}>
                        <Text>SITE</Text>
                        <Text style={{marginTop: '10px', fontSize: '15px'}}>{site}</Text>
                    </View>}
                        
                    <View style={[rowStyle, {flexDirection: 'row'}]}>
                        <View style={[rowStyle, {margin: '0px auto', backgroundColor: '#fafafa', borderRadius: '50%', width: '140px', height: '140px'}]}>
                            <Text style={{fontSize: '25px'}}>{list.length}</Text>
                            <Text style={{marginTop: '10px', fontSize: '10px'}}>{title.toUpperCase()}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </PageWrapper>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="PageLast">
@observer
class PageLast extends React.Component {
    
    render() {
        
        return <PageWrapper size="A4" style={styles.page}>
            <View fixed style={[styles.flexRow, {fontSize: 9, justifyContent: 'center', placeItems: "center", padding: '7px', borderTop: '4px solid #fafafa', position: 'absolute', left: 0, right: 0, bottom: 0}]}>
                <Text style={{flexGrow: 1}}>Powered by SHEQ Aid</Text>
                <Text style={{borderLeft: '4px solid #ddd', paddingLeft: 10, width: '60px'}}>Last Page</Text>
            </View>
        </PageWrapper>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Page2">
@observer
class Page2 extends APage {
    @observable state = {renderer: false};
    
    componentDidMount() {
        execWhen(() => this.props.counter.pos === "PageFirst").then(() => {
            this.state.renderer = true;
            setTimeout(() => {
                this.props.counter.pos = "Page2";
            }, 100);
        });
    }
    
    render() {
        if(!this.state.renderer) return null;
        let {
            client, project, site,
            department, job_position, employee,
            expiry_date, date_range, 
            props: {renderExtraDateDetails, title},
            item
        } = this;
        if(!item) return null;
        const {list, values} = item;
        
        const {isConsultant} = storage.is;
        
        return <PageWrapper size="A4" style={styles.page}>
            <View style={styles.content}>
                <View style={[styles.contentPanel, {textAlign: "left"}]}>
                    <Text style={styles.headingPoint}>1. COMPANY DETAILS</Text>
                    {isConsultant && <View style={[styles.flexRow]}>
                        <Panel title="Company" value={client} colStyle={{width: '100%', borderBottom: '4px solid #fafafa'}}/>
                    </View>}
                    <View style={[styles.flexRow]}>
                        <Panel title="Project" value={project} colStyle={{width: '100%', borderBottom: '4px solid #fafafa'}}/>
                    </View>
                    <View style={[styles.flexRow]}>
                        <Panel title="Site" value={site} colStyle={{width: '100%'}}/>
                    </View>
                </View>
                <View style={[styles.contentPanel, {textAlign: "left"}]}>
                    <Text style={styles.headingPoint}>2. BASIC DETAILS</Text>
                    <View style={[styles.flexRow]}>
                        <Panel title="Department" value={department} renderer={val => val.name || val.data.name} colStyle={{width: '100%', borderBottom: '4px solid #fafafa'}}/>
                    </View>
                    <View style={[styles.flexRow]}>
                        <Panel title="Job Position" value={job_position} renderer={val => val.name || val.data.name} colStyle={{width: '100%', borderBottom: '4px solid #fafafa'}}/>
                    </View>
                    <View style={[styles.flexRow]}>
                        <Panel title="Employee" value={employee} renderer={val => val.name || val.data.name} colStyle={{width: '100%', borderBottom: '4px solid #fafafa'}}/>
                    </View>
                </View>
                <View style={[styles.contentPanel, {textAlign: "left"}]}>
                    <Text style={styles.headingPoint}>3. DATE DETAILS</Text>
                    {renderExtraDateDetails && renderExtraDateDetails()}
                    <View style={[styles.flexRow]}>
                        <Panel title="Expiry" value={expiry_date} renderer={val => val.name || val.data.name} colStyle={{width: '100%', borderBottom: '4px solid #fafafa'}}/>
                    </View>
                    <View style={[styles.flexRow]}>
                        <Panel title="Expiry Date Range" value={date_range} renderer={val => val.name || val.data.name} colStyle={{width: '100%', borderBottom: '4px solid #fafafa'}}/>
                    </View>
                </View>
            </View>
        </PageWrapper>;
    }
}
// </editor-fold>

function getValue(_key) {
    let {list, values} = this.item;
    const o = values.find(({key}) => key === _key);
    return o && o.value;
}

export {
    PageFirst, PageLast, Page2, getValue
};