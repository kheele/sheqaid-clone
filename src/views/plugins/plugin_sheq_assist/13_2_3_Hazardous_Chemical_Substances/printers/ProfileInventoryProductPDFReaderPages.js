// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import {Image, Page, Text, View} from '@react-pdf/renderer';

import {execWhen} from 'utils/Utils';

import {HTMLContentCanvas, Panel, styles, Table} from 'pdf-components';

import riskLevelImg from 'img/risk-assessment.png';

const PageWrapper = ({wrap = true, size, orientation, style, children}) => (
  <Page wrap={wrap} size={size} orientation={orientation} style={style}>
    {children}
  </Page>
);
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="PageFirst">
@observer
class PageFirst extends React.Component {
    
    componentDidMount() {
        setTimeout(() => {
            this.props.counter.pos = "PageFirst";
        }, 100);
    }
    
    render() {
        let {
            data: {
                client, project, site,
                name
            }
        } = this.props.item;
        
        const rowStyle = {margin: '30px auto 0px', display: 'flex', flexDirection: 'column', placeItems: "center", justifyContent: 'center'};
        
        return <PageWrapper size="A4" style={styles.page}>
            <View style={styles.content}>
                <View style={{height: '100%', display: 'flex', flexDirection: 'column', placeItems: "center", justifyContent: 'center', fontSize: 26}}>
                    <Text style={{margin: '20px auto 0'}}>CHEMICAL PRODUCT</Text>
                    <Text style={{margin: '0px auto 20px', fontSize: '15px'}}>OF</Text>
                        
                    <View style={rowStyle}>
                        <Text style={{marginTop: '10px'}}>{name}</Text>
                    </View>
                    
                    {(client || project || site) && <Text style={{margin: '20px auto 0', fontSize: 16}}>AT</Text>}
                        
                    {client && <View style={rowStyle}>
                        <Text>COMPANY</Text>
                        <Text style={{marginTop: '10px', fontSize: '15px'}}>{client.name || client.data.name}</Text>
                    </View>}
                        
                    {project && <View style={rowStyle}>
                        <Text>PROJECT</Text>
                        <Text style={{marginTop: '10px', fontSize: '15px'}}>{project.name || project.data.name}</Text>
                    </View>}
                        
                    {site && <View style={rowStyle}>
                        <Text>SITE</Text>
                        <Text style={{marginTop: '10px', fontSize: '15px'}}>{site.name || site.data.name}</Text>
                    </View>}
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
    
    get ppe_type_table_list() {
        const {item} = this.props;
        const {data: {ppe_type_list}} = item;
        return [
            ['Photo', 'PPE Name'],
            ...[...(ppe_type_list || [])].filter(v => !!v).map(v => {
                let {
                    id, name, profile_pic, data
                } = v.ppe_type || v;
                name = name || (data && data.name);
                profile_pic = profile_pic || (data && data.profile_pic);
                let dlUrls;
                if(profile_pic && profile_pic.dlUrls) {
                    dlUrls = profile_pic.dlUrls[0];
                }
                const stylePic = {
                    maxWidth: '100%',
                    maxHeight: 20,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    display: 'table',
                    backgroundColor: '#000'
                };
                return [dlUrls && <Image style={[stylePic]} src={dlUrls}/>, name];
            })
        ];
    }
    
    render() {
        if(!this.state.renderer) return null;
        const {item} = this.props;
        let {
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
        return <PageWrapper wrap={false} size="A4" style={styles.page}>
            <View style={styles.content}>
                <View style={[styles.contentPanel, {textAlign: "left"}]}>
                    <Text style={styles.headingPoint}>1. Product Details</Text>
                    <View style={[styles.flexColumn, styles.gridGap5]}>
                        <Text style={styles.headingPoint}>Product Identification</Text>
                        <View style={[styles.flexRow, styles.gridGap5]}>
                            <Panel title="Product Name" value={name} wHalf borderRight4 borderBottom4/>
                            <Panel title="Common Names / Synonyms" value={common_names} wHalf borderBottom4/>
                        </View>
                        <View style={[styles.flexRow, styles.gridGap5]}>
                            <Panel title="Chemical Name" value={chemical_name} wHalf borderRight4 borderBottom4/>
                            <Panel title="Empirical Formula" value={empirical_formula} wHalf borderBottom4/>
                        </View>
                        <View style={[styles.flexRow, styles.gridGap5]}>
                            <Panel title="UN Number" value={un_num} wQuarter borderRight4 borderBottom4/>
                            <Panel title="CAS Number" value={cas_num} wQuarter borderRight4 borderBottom4/>
                            <Panel title="Concentration" value={concentration} wThird borderBottom4/>
                        </View>
                        <View style={[styles.flexRow, styles.gridGap5]}>
                            <Panel title="Category" value={category} wQuarter borderRight4 borderBottom4/>
                            <Panel title="Physical State" value={physical_state} wQuarter borderRight4 borderBottom4/>
                            <Panel title="Type" value={type} wThird borderBottom4/>
                        </View>                           
                            
                        <Panel title="Application / Use" value={application_or_use} wFull borderBottom4/>
                            
                        <Text style={styles.headingPoint}>Manufacturer / Supplier</Text>
                        <View style={[styles.flexColumn, styles.gridGap5]}>
                            <Panel title="Manufacturer" value={manufacturer} wFull borderBottom4/>
                            <Panel title="Address" value={manufacturer_addr} wFull borderBottom4/>
                            <View style={[styles.flexRow, styles.gridGap5]}>
                                <Panel title="Telephone" value={manufacturer_phone_num} wHalf borderRight4 borderBottom4/>
                                <Panel title="Fax" value={manufacturer_fax} wHalf borderBottom4/>
                            </View> 
                            <View style={[styles.flexRow, styles.gridGap5]}>
                                <Panel title="E-mail Address" value={manufacturer_email} wHalf borderRight4 borderBottom4/>
                                <Panel title="Website" value={manufacturer_website} wHalf borderBottom4/>
                            </View> 
                        </View>
                            
                        <Text style={styles.headingPoint}>Emergency Details</Text>
                        <View style={[styles.flexColumn, styles.gridGap5]}>
                            <Panel title="Emergency Phone Numbers" value={emergency_phone_nums} wFull borderBottom4/>
                        </View>                       
                    </View>
                </View>
                
                <View style={[styles.contentPanel, {textAlign: "left"}]}>
                    <Text style={styles.headingPoint}>2. Further Details</Text>
                    <View style={[styles.flexColumn, styles.gridGap5]}>
                        <Panel title="Location Where Product Is Used" value={location_where_product_is_used} wFull borderBottom4/>
                        <Panel title="Process Where Product Is Used" value={process_where_product_is_used} wFull borderBottom4/>
                                        
                        <View style={[styles.flexRow, styles.gridGap5]}>
                            <Panel title="Is Stable?" value={is_stable} wHalf borderRight4 borderBottom4/>
                            <Panel title="Requires Cool, Well-Ventilated Area?" value={is_cool_well_ventilated_area} wHalf borderBottom4/>
                        </View>
                        
                        <Panel break title="Heat, Sparks, Static, Flames" value={heat_sparks_static_flames} wFull borderTop4 borderBottom4/>
                        <Panel title="Spillage Control" value={spillage_control} wFull borderBottom4/>
                        <Panel title="Other Special Info" value={other_special_info} wFull borderBottom4/>
                    </View>
                </View>
                
                <View style={[styles.contentPanel, {textAlign: "left"}]}>
                    <Text style={styles.headingPoint}>3. Product Compatibility</Text>
                    <View style={[styles.flexColumn, styles.gridGap5]}>
                        <Panel title="Compatible With" value={compatible_with_list} wFull borderBottom4/>
                        <Panel title="Incompatible With" value={incompatible_with_list} wFull borderBottom4/>
                    </View>
                </View>
                
                <View style={[styles.contentPanel, {textAlign: "left"}]}>
                    <Text style={styles.headingPoint}>4. Risk Level / Class</Text>
                    <View style={[styles.flexColumn, styles.gridGap5]}>
                        <Panel title="Risk Level" value={risk_level} wFull borderBottom4/>
                        <Panel title="Please refer to the diagram below" value={riskLevelImg} type="file" wFull/>
                    </View>
                </View>
                
                <View break style={[styles.contentPanel, {textAlign: "left"}]}>
                    <Text style={styles.headingPoint}>5. Combustibility / Flammability</Text>
                    <View style={[styles.flexColumn, styles.gridGap5]}>
                        <View style={[styles.flexRow, styles.gridGap5]}>
                            <Panel title="Is Combustible?" value={is_combustible} wHalf borderRight4 borderBottom4/>
                            <Panel title="Is Flammable?" value={is_flammable} wHalf borderBottom4/>
                        </View>
                        <Panel title="Flammability / Combustibility Class" value={flammability_combustibility_class} wFull borderBottom4/>
                    </View>
                </View>
                
                <View style={[styles.contentPanel, {textAlign: "left"}]}>
                    <Text style={styles.headingPoint}>6. Fire Fighting</Text>
                    <View style={[styles.flexColumn, styles.gridGap5]}>
                        <View style={[styles.flexRow, styles.gridGap5]}>
                            <Panel title="Foam" value={fire_fighting_foam} wQuarter borderRight4 borderBottom4/>
                            <Panel title="DCP" value={fire_fighting_dcp} wQuarter borderRight4 borderBottom4/>
                            <Panel title="CO2" value={fire_fighting_co2} wQuarter borderRight4 borderBottom4/>
                            <Panel title="Sand" value={fire_fighting_sand} wQuarter borderBottom4/>
                        </View>
                        <Panel title="Water" value={fire_fighting_water} wFull borderBottom4/>
                        <Panel title="Other" value={fire_fighting_other} wFull borderBottom4/>
                    </View>
                </View>
                
                <View style={[styles.contentPanel, {textAlign: "left"}]}>
                    <Text style={styles.headingPoint}>7. Hazard Class</Text>
                    <View style={[styles.flexColumn, styles.gridGap5]}>
                        <Panel title="Is Substance Hazardous?" value={is_hazardous} wFull borderBottom4/>
                        <Panel title="Hazard Class" value={hazard_class_list} wFull borderBottom4/>
                    </View>
                </View>
                
                <View style={[styles.contentPanel, {textAlign: "left"}]}>
                    <Text style={styles.headingPoint}>8. Safety Data Sheet (SDS)</Text>
                    <View style={[styles.flexColumn, styles.gridGap5]}>
                        <View style={[styles.flexRow, styles.gridGap5]}>
                            <Panel title="Has SDS?" value={has_sds} wHalf borderRight4 borderBottom4/>
                            <Panel title="SDS Date" type="date" value={sds_date} wHalf borderBottom4/>
                        </View>
                    </View>
                </View>
                
                <View style={[styles.contentPanel, {textAlign: "left"}]}>
                    <Text style={styles.headingPoint}>9. Hazchem Sheet</Text>
                    <View style={[styles.flexColumn, styles.gridGap5]}>
                        <View style={[styles.flexRow, styles.gridGap5]}>
                            <Panel title="Has Hazchem Sheet?" value={has_hazchem_sheet} wHalf borderRight4 borderBottom4/>
                            <Panel title="Hazchem Sheet Date" type="date" value={hazchem_sheet_date} wHalf borderBottom4/>
                        </View>
                    </View>
                </View>
                
                <View style={[styles.contentPanel, {textAlign: "left"}]}>
                    <Text style={styles.headingPoint}>10. Risk Assessment</Text>
                    <View style={[styles.flexColumn, styles.gridGap5]}>
                        <View style={[styles.flexRow, styles.gridGap5]}>
                            <Panel title="Has Risk Assessment?" value={has_risk_assessment} wHalf borderRight4 borderBottom4/>
                            <Panel title="Risk Assessment Date" type="date" value={risk_assessment_date} wHalf borderBottom4/>
                        </View>
                    </View>
                </View>
                
                <View break style={[styles.contentPanel, {textAlign: "left"}]}>
                    <Text style={styles.headingPoint}>11. PPE Required</Text>
                    <View style={[styles.flexColumn, styles.gridGap5]}>
                        {ppe_type_list && <Table th col={['15%', '85%']} list={this.ppe_type_table_list}/>}
                    </View>
                </View>
                
                <View style={[styles.contentPanel, {textAlign: "left"}]}>
                    <Text style={styles.headingPoint}>12. Action / Comments</Text>
                    <View style={[styles.flexColumn, styles.gridGap5]}>
                        <HTMLContentCanvas width="100" height="100">
                            <div dangerouslySetInnerHTML={{__html: action_or_comments}}></div>
                        </HTMLContentCanvas>
                    </View>
                </View>
            </View>
            <View fixed style={[styles.flexRow, {fontSize: 9, justifyContent: 'center', placeItems: "center", padding: '7px', borderTop: '1px solid #eee', position: 'absolute', left: 0, right: 0, bottom: 0}]}>
                <Text style={{flexGrow: 1}}>Powered by SHEQ Aid</Text>
                <Text style={{borderLeft: '1px solid #ddd', paddingLeft: 10, width: '60px'}} render={({pageNumber, totalPages}) => (
                    `Page ${pageNumber} of ${totalPages}`
                )}/>
            </View>
        </PageWrapper>;
    }
}
// </editor-fold>

export {
    PageFirst, Page2, PageLast
};
