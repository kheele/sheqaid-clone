// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import {Page, Text, View} from '@react-pdf/renderer';

import styles from './ProfilePDFReader.style';

import {execWhen} from '../../../../../utils/Utils';

import {Panel} from '../../../../../pdf-components';

const PageWrapper = ({size, orientation, style, children}) => (
  <Page wrap size={size} orientation={orientation} style={style}>
    {children}
  </Page>
);

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="PageDocuments2">
@observer
class PageDocuments2 extends React.Component {
    @observable state = {renderer: false};
    
    componentDidMount() {
        execWhen(() => this.props.counter.pos === "PageDocuments1").then(() => {
            this.state.renderer = true;
            setTimeout(() => {
                this.props.counter.pos = "PageDocuments2";
            }, 50);
        });
    }
    
    render() {
        if(!this.state.renderer) return null;
        const {
            data: {
                documents = {}
            }
        } = this.props.item;
        
        const {
            doc_pdrp_expiry, doc_pdrp, 
            doc_work_permit_expiry, doc_work_permit
        } = documents;
        
        return <PageWrapper size="A4" orientation="landscape" style={styles.page}>
            <View style={styles.content}>
                <View style={[styles.contentPanel, {textAlign: "left"}]}>
                    <View style={[styles.flexRow]}>
                        <View style={[styles.flexColumn, {width: '50%'}]}>
                            <Panel title="PDrP Expiry Date" value={doc_pdrp_expiry} type="date" colStyle={{width: '100%', borderBottom: '1px dotted #eee'}}/>
                            <Panel title="PDrP Copy" value={doc_pdrp} type="file" rotateImage titleStyle={{marginBottom: '10px'}} imageStyle={{border: '3px solid #000', height: '425px'}} colStyle={{width: '100%', height: '425px'}}/>
                        </View>
                        <View style={[styles.flexColumn, {width: '50%'}]}>
                            <Panel title="Work Permit Expiry Date" value={doc_work_permit_expiry} type="date" colStyle={{width: '100%', borderBottom: '1px dotted #eee'}}/>
                            <Panel title="Work Permit Copy" value={doc_work_permit} type="file" rotateImage titleStyle={{marginBottom: '10px'}} imageStyle={{border: '3px solid #000', height: '425px'}} colStyle={{width: '100%', height: '425px'}}/>
                        </View>
                    </View>
                </View>
            </View>
        </PageWrapper>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="PageDependentsNextOfKin">
@observer
class PageDependentsNextOfKin extends React.Component {
    @observable state = {renderer: false};
    
    componentDidMount() {
        execWhen(() => this.props.counter.pos === "PageDocuments2").then(() => {
            this.state.renderer = true;
            setTimeout(() => {
                this.props.counter.pos = "PageDependentsNextOfKin";
            }, 50);
        });
    }
    
    renderNextOfKin(next_of_kin, n) {
        const {fname, lname, phone1, phone2, relationship} = next_of_kin;
        return <View style={[styles.flexColumn, {width: '50%', marginRight: n === 1 ? '5px' : '0px'}]}>
            <Text style={[styles.headingPoint, {marginTop: '5px'}]}>Next Of Kin #{n}</Text>
            <View style={[styles.flexColumn, {width: '100%'}]}>
                <Panel title="First Name" value={fname} colStyle={{width: '100%', borderBottom: '1px dotted #eee'}}/>
                <Panel title="Last Name" value={lname} colStyle={{width: '100%', borderBottom: '1px dotted #eee'}}/>
                <Panel title="1) Phone No." value={phone1} colStyle={{width: '100%', borderBottom: '1px dotted #eee'}}/>
                <Panel title="2) Phone No." value={phone2} colStyle={{width: '100%', borderBottom: '1px dotted #eee'}}/>
                <Panel title="Relationship" value={relationship} colStyle={{width: '100%'}}/>
            </View>
        </View>;
    }
    
    render() {
        if(!this.state.renderer) return null;
        const {
            data: {
                next_of_kin_1 = {}, next_of_kin_2 = {}, dependants = []
            }
        } = this.props.item;
        
        return <PageWrapper size="A4" orientation="landscape" style={styles.page}>
            <View style={styles.content}>
                <View style={[styles.contentPanel, {textAlign: "left"}]}>
                    <Text style={styles.headingPoint}>6. DEPENDANTS & NEXT OF KINS</Text>
                    <View style={[styles.flexRow]}>
                        {this.renderNextOfKin(next_of_kin_1, 1)}
                        {this.renderNextOfKin(next_of_kin_2, 2)}
                    </View>
                    <View style={[styles.flexColumn]}>
                        <Text style={[styles.headingPoint, {marginTop: '5px'}]}>Dependant(s)</Text>
                        <View style={[styles.flexColumn, {width: '100%'}]}>
                             
                        </View>
                    </View>
                </View>
            </View>
        </PageWrapper>;
    }
}
// </editor-fold>

export {
    PageDocuments1, PageDocuments2, 
    PageDependentsNextOfKin
};
//573