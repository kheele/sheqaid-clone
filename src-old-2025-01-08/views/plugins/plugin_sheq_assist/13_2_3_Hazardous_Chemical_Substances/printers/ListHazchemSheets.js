// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';
import {Page, Text, View} from '@react-pdf/renderer';

import {execWhen} from 'utils/Utils';

import {APageDocuments, Panel, styles} from 'pdf-components';

const PageWrapper2 = ({size, orientation, style, children}) => (
  <Page wrap size={size} orientation={orientation} style={style}>
    {children}
  </Page>
);

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ListHazchemSheets">
@observer
class ListHazchemSheets extends APageDocuments {
    @observable state = {renderer: false};
    
    componentDidMount() {
        const {standalone, counter} = this.props;
        execWhen(() => (standalone && counter.pos === "Page2")).then(() => {
            this.state.renderer = true;
            setTimeout(() => {
                this.props.counter.pos = "ListHazchemSheets";
            }, 100);
        });
    }
    
    renderItem(item, n) {
        const {data: {
                created_at,
                product, physical_state, type,
                precaution_photo_concentrate_list, precaution_photo_application_list,
                active_ingredient_list, 
                hazard_identification_physical_list, hazard_identification_reproductive_list, hazard_identification_biological_list,
                first_aid_procedure_splashes_in_eyes_list, first_aid_procedure_contact_with_skin_list, first_aid_procedure_mouth_contact_or_eaten_list, first_aid_procedure_fumes_breathed_in_list,
                emergency_action_for_spills_small_list, emergency_action_for_spills_large_list,
                disposal_used_container_list, disposal_unused_product_list,
                contacts_emergency_name, contacts_emergency_num, contacts_manufacturer_name, contacts_manufacturer_num
            }
        } = item;
        
        return <View style={[styles.flexColumn]}>
            <View style={[styles.flexRow]}>
                <Panel title={`#${n+1}: ${type} Hazchem Sheet`} noValue colStyle={{width: '100%', borderBottom: '4px solid #fafafa', backgroundColor: ''}}/>
            </View>
            <View style={[styles.flexColumn, {width: '100%'}]}>
                <Text style={styles.headingPoint}>Safety Data Sheet Details</Text>
                    
                <View style={[styles.flexRow, {width: '100%'}]}>
                    <Panel title="Product Name" value={product} renderer={v => v.name || v.data.name} colStyle={{width: '33.3333%', borderRight: '4px solid #fafafa', borderBottom: '4px solid #fafafa'}}/>
                    <Panel title="Category" value={product} renderer={v => v.category || v.data.category} colStyle={{width: '33.3333%', borderRight: '4px solid #fafafa', borderBottom: '4px solid #fafafa'}}/>
                    <Panel title="Manufacturer" value={product} renderer={v => v.manufacturer || v.data.manufacturer} colStyle={{width: '33.3333%', borderBottom: '4px solid #fafafa'}}/>
                </View>
                <View style={[styles.flexRow, {width: '100%'}]}>
                    <Panel title="Date Identified" type="date" value={product} renderer={v => v.date_identified || v.data.date_identified} colStyle={{width: '33.3333%', borderRight: '4px solid #fafafa', borderBottom: '4px solid #fafafa'}}/>
                    <Panel title="Emergency Phone No." value={product} renderer={v => v.name || v.data.name} colStyle={{width: '33.3333%', borderRight: '4px solid #fafafa', borderBottom: '4px solid #fafafa'}}/>
                    <Panel title="Risk Level" value={product} renderer={v => v.risk_level || v.data.risk_level} colStyle={{width: '33.3333%', borderBottom: '4px solid #fafafa'}}/>
                </View>
            </View>
            <View style={[styles.flexRow]}>
                <Panel title="Physical State" value={physical_state} colStyle={{width: '50%', borderRight: '4px solid #fafafa', borderBottom: '4px solid #fafafa'}}/>
                <Panel title="Type" value={type} colStyle={{width: '50%', borderBottom: '4px solid #fafafa'}}/>
            </View>
            <View style={[styles.flexColumn, {width: '100%'}]}>
                <Panel 
                    title="Safety Data Sheet Document" 
                    value={product && product.data.doc} 
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
        const {list, values} = this.props.item;
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
                    <Text style={styles.headingPoint}>Hazchem Sheet DETAILS</Text>
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
        width: '20%', height: '50px'
    };
    
    const count = type => {
        return list.filter(v => v.data.product.data.risk_level === v).length + '';
    };
    
    return <View style={[styles.flexRow, {justifyContent: "space-between", alignItems: "center"}]}>
        <Panel title="Total" value={list.length + ''} colStyle={colStyle}/>
        <Panel title="Risk Level: Low" value={count('Low')} colStyle={colStyle}/>
        <Panel title="Risk Level: Medium" value={count('Medium')} colStyle={colStyle}/>
        <Panel title="Risk Level: High" value={count('High')} colStyle={colStyle}/>
        <Panel title="Risk Level: Very High" value={count('Very High')} colStyle={colStyle}/>
    </View>;
}

export default ListHazchemSheets;
//573