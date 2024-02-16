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

// <editor-fold defaultstate="collapsed" desc="ListInventoryProducts">
@observer
class ListInventoryProducts extends APageDocuments {
    @observable state = {renderer: false};
    
    componentDidMount() {
        const {standalone, counter} = this.props;
        execWhen(() => (standalone && counter.pos === "Page2")).then(() => {
            this.state.renderer = true;
            setTimeout(() => {
                this.props.counter.pos = "ListInventoryProducts";
            }, 100);
        });
    }
    
    renderItem(item, n) {
        const {
            data: {
                created_at,
                //0
                client, project, site,
                //1
                name, common_names, chemical_name, empirical_formula, un_num, cas_num, concentration,
                category, physical_state, type,
                application_or_use,
                manufacturer, manufacturer_addr, manufacturer_phone_num, manufacturer_email, manufacturer_fax, manufacturer_website,
                emergency_phone_nums,
                //2
                location_where_product_is_used, process_where_product_is_used,
                is_stable, is_cool_well_ventilated_area, heat_sparks_static_flames, spillage_control, other_special_info,
                //3
                compatible_with_list,
                incompatible_with_list,
                //4
                risk_level,
                //5
                is_combustible,
                is_flammable,
                flammability_combustibility_class,
                //6
                fire_fighting_foam,
                fire_fighting_dcp,
                fire_fighting_co2,
                fire_fighting_sand,
                fire_fighting_water,
                fire_fighting_other,
                //7
                is_hazardous,
                hazard_class_list,
                //8
                has_sds, sds, sds_doc, sds_date,
                //9
                has_hazchem_sheet, hazchem_sheet, hazchem_sheet_doc, hazchem_sheet_date,
                //10
                has_risk_assessment, risk_assessment_doc, risk_assessment_date,
                //11
                ppe_type_list,
                //12
                action_or_comments,
                //13
                chemical_stock_list
            }
        } = item;
        
        return <View style={[styles.flexColumn]}>
            <View style={[styles.flexRow]}>
                <Panel title={`#${n+1}: ${name} Chemical Product`} noValue colStyle={{width: '100%', borderBottom: '4px solid #fafafa', backgroundColor: ''}}/>
            </View>
            <View style={[styles.flexRow]}>
                <Panel title="Product Name" value={name} colStyle={{width: '33.3333%', borderRight: '4px solid #fafafa', borderBottom: '4px solid #fafafa'}}/>
                <Panel title="Common Names / Synonyms" value={common_names} colStyle={{width: '33.3333%', borderRight: '4px solid #fafafa', borderBottom: '4px solid #fafafa'}}/>
                <Panel title="Chemical Name" value={chemical_name} colStyle={{width: '33.3333%', borderBottom: '4px solid #fafafa'}}/>
            </View>
            <View style={[styles.flexRow]}>
                <Panel title="Empirical Formula" value={empirical_formula} colStyle={{width: '20%', borderRight: '4px solid #fafafa', borderBottom: '4px solid #fafafa'}}/>
                <Panel title="UN Number" value={un_num} colStyle={{width: '20%', borderRight: '4px solid #fafafa', borderBottom: '4px solid #fafafa'}}/>
                <Panel title="CAS Number" value={cas_num} colStyle={{width: '20%', borderRight: '4px solid #fafafa', borderBottom: '4px solid #fafafa'}}/>
                <Panel title="Concentration" value={concentration} colStyle={{width: '20%', borderBottom: '4px solid #fafafa'}}/>
            </View>
            <View style={[styles.flexRow]}>
                <Panel title="Category" value={category} colStyle={{width: '33.3333%', borderRight: '4px solid #fafafa', borderBottom: '4px solid #fafafa'}}/>
                <Panel title="Physical State" value={physical_state} colStyle={{width: '33.3333%', borderRight: '4px solid #fafafa', borderBottom: '4px solid #fafafa'}}/>
                <Panel title="Type" value={type} colStyle={{width: '33.3333%', borderBottom: '4px solid #fafafa'}}/>
            </View>
            <View style={[styles.flexRow]}>
                <Panel title="Application / Use" value={category} colStyle={{width: '100%', borderBottom: '4px solid #fafafa'}}/>
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
                    <Text style={styles.headingPoint}>Chemical Product DETAILS</Text>
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
    
    const count = v => {
        return list.filter(v => v.data.risk_level === v).length + '';
    };
    
    return <View style={[styles.flexRow, {justifyContent: "space-between", alignItems: "center"}]}>
        <Panel title="Total" value={list.length + ''} colStyle={colStyle}/>
        <Panel title="Risk Level: Low" value={count('Low')} colStyle={colStyle}/>
        <Panel title="Risk Level: Medium" value={count('Medium')} colStyle={colStyle}/>
        <Panel title="Risk Level: High" value={count('High')} colStyle={colStyle}/>
        <Panel title="Risk Level: Very High" value={count('Very High')} colStyle={colStyle}/>
    </View>;
}

export default ListInventoryProducts;
//573
