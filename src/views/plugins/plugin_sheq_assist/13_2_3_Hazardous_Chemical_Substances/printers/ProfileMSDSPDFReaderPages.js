// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import {Page, Text, View} from '@react-pdf/renderer';

import {execWhen} from 'utils/Utils';

import {HTMLContentCanvas, Panel, styles} from 'pdf-components';

import riskLevelImg from 'img/risk-assessment.png';

const PageWrapper = ({size, orientation, style, children}) => (
  <Page wrap size={size} orientation={orientation} style={style}>
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
                //1
                created_at,
                name, category, manufacturer, risk_level, emergency_phone, 
                date_identified,
                doc
            }
        } = this.props.item;
        
        const rowStyle = {margin: '30px auto 0px', display: 'flex', flexDirection: 'column', placeItems: "center", justifyContent: 'center'};
        
        return <PageWrapper size="A4" style={styles.page}>
            <View style={styles.content}>
                <View style={{height: '100%', display: 'flex', flexDirection: 'column', placeItems: "center", justifyContent: 'center', fontSize: 26}}>
                    <Text style={{margin: '20px auto 0'}}>SAFETY DATA SHEET</Text>
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
    
    render() {
        if(!this.state.renderer) return null;
        const {item} = this.props;
        let {
            data: {
                created_at,
                //
                client, project, site,
                //
                name, common_names, chemical_name, empirical_formula, un_num, 
                category, date_identified,//other added
                application_or_use,
                manufacturer, manufacturer_addr, manufacturer_phone_num, manufacturer_email, manufacturer_fax, manufacturer_website,
                emergency_phone_nums = [], 
        //            emergency_phone, //replaced with emergency_phone_nums
                risk_level,//other added
                more_product_info,
                //
                composition_or_information_on_ingredients,
                hazards_identification,
                first_aid_measures_and_precautions,
                firefighting_measures,
                accidental_release_measures,
                handling_and_storage_requirements,
                exposure_controls_or_personal_protection,
                physical_and_chemical_properties,
                stability_and_reactivity,
                toxicological_info,
                ecological_info,
                disposal_considerations,
                transport_info,
                regulatory_info,
                other_info, 
                //
                doc
            }
        } = item;
        return <PageWrapper size="A4" style={styles.page}>
            <View style={styles.content}>
                <View style={[styles.contentPanel, {textAlign: "left"}]}>
                    <Text style={styles.headingPoint}>1. Product & Company Identification</Text>
                    <View style={[styles.flexColumn, styles.gridGap5]}>
                        <Panel title="UN Number" value={un_num} colStyle={{width: '100%', borderBottom: '4px solid #fafafa'}}/>
                            
                        <View style={[styles.flexRow, styles.gridGap5]}>
                            <Panel title="Product Name" value={name} wHalf borderRight4 borderBottom4/>
                            <Panel title="Common Names / Synonyms" value={common_names} wHalf borderBottom4/>
                        </View>
                        <View style={[styles.flexRow, styles.gridGap5]}>
                            <Panel title="Chemical Name" value={chemical_name} wThird borderRight4 borderBottom4/>
                            <Panel title="Empirical Formula" value={empirical_formula} wThird borderRight4 borderBottom4/>
                            <Panel title="UN Number" value={un_num} wThird borderBottom4/>
                        </View>
                        <View style={[styles.flexRow, styles.gridGap5]}>
                            <Panel title="Category" value={category} wHalf borderRight4 borderBottom4/>
                            <Panel title="Date Identified" type="date" value={date_identified} wHalf borderBottom4/>
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
                        
                        <View style={[styles.contentPanel, {textAlign: "left"}]}>
                            <Text style={styles.headingPoint}>4. Risk Level / Class</Text>
                            <View style={[styles.flexColumn, styles.gridGap5]}>
                                <Panel title="Risk Level" value={risk_level} wFull borderBottom4/>
                                <Panel title="Please refer to the diagram below" value={riskLevelImg} type="file" wFull/>
                            </View>
                        </View>
                            
                        <Text style={styles.headingPoint}>More Product Information</Text>
                        <View style={[styles.flexColumn, styles.gridGap5]}>
                            <HTMLContentCanvas width="100" height="100">
                                <div dangerouslySetInnerHTML={{__html: more_product_info}}></div>
                            </HTMLContentCanvas>
                        </View>
                    </View>
                </View>
                <View style={[styles.contentPanel, {textAlign: "left"}]}>
                    <Text style={styles.headingPoint}>2. Composition/Information On Ingredients</Text>
                    <View style={[styles.flexColumn, styles.gridGap5]}>
                        <HTMLContentCanvas width="100" height="100">
                            <div dangerouslySetInnerHTML={{__html: composition_or_information_on_ingredients}}></div>
                        </HTMLContentCanvas>
                    </View>
                </View>
                <View style={[styles.contentPanel, {textAlign: "left"}]}>
                    <Text style={styles.headingPoint}>3. Hazards Identification</Text>
                    <View style={[styles.flexColumn, styles.gridGap5]}>
                        <HTMLContentCanvas width="100" height="100">
                            <div dangerouslySetInnerHTML={{__html: hazards_identification}}></div>
                        </HTMLContentCanvas>
                    </View>
                </View>
                <View style={[styles.contentPanel, {textAlign: "left"}]}>
                    <Text style={styles.headingPoint}>4. First Aid Measures & Precautions</Text>
                    <View style={[styles.flexColumn, styles.gridGap5]}>
                        <HTMLContentCanvas width="100" height="100">
                            <div dangerouslySetInnerHTML={{__html: first_aid_measures_and_precautions}}></div>
                        </HTMLContentCanvas>
                    </View>
                </View>
                <View style={[styles.contentPanel, {textAlign: "left"}]}>
                    <Text style={styles.headingPoint}>5. Firefighting Measures</Text>
                    <View style={[styles.flexColumn, styles.gridGap5]}>
                        <HTMLContentCanvas width="100" height="100">
                            <div dangerouslySetInnerHTML={{__html: firefighting_measures}}></div>
                        </HTMLContentCanvas>
                    </View>
                </View>
                <View style={[styles.contentPanel, {textAlign: "left"}]}>
                    <Text style={styles.headingPoint}>6. Accidental Release Measures (Spillage)</Text>
                    <View style={[styles.flexColumn, styles.gridGap5]}>
                        <HTMLContentCanvas width="100" height="100">
                            <div dangerouslySetInnerHTML={{__html: accidental_release_measures}}></div>
                        </HTMLContentCanvas>
                    </View>
                </View>
                <View style={[styles.contentPanel, {textAlign: "left"}]}>
                    <Text style={styles.headingPoint}>7. Handling & Storage Requirements</Text>
                    <View style={[styles.flexColumn, styles.gridGap5]}>
                        <HTMLContentCanvas width="100" height="100">
                            <div dangerouslySetInnerHTML={{__html: handling_and_storage_requirements}}></div>
                        </HTMLContentCanvas>
                    </View>
                </View>
                <View style={[styles.contentPanel, {textAlign: "left"}]}>
                    <Text style={styles.headingPoint}>8. Exposure Controls / Personal Protection</Text>
                    <View style={[styles.flexColumn, styles.gridGap5]}>
                        <HTMLContentCanvas width="100" height="100">
                            <div dangerouslySetInnerHTML={{__html: exposure_controls_or_personal_protection}}></div>
                        </HTMLContentCanvas>
                    </View>
                </View>
                <View style={[styles.contentPanel, {textAlign: "left"}]}>
                    <Text style={styles.headingPoint}>9. Physical & Chemical Properties</Text>
                    <View style={[styles.flexColumn, styles.gridGap5]}>
                        <HTMLContentCanvas width="100" height="100">
                            <div dangerouslySetInnerHTML={{__html: physical_and_chemical_properties}}></div>
                        </HTMLContentCanvas>
                    </View>
                </View>
                <View style={[styles.contentPanel, {textAlign: "left"}]}>
                    <Text style={styles.headingPoint}>10. Stability & Reactivity</Text>
                    <View style={[styles.flexColumn, styles.gridGap5]}>
                        <HTMLContentCanvas width="100" height="100">
                            <div dangerouslySetInnerHTML={{__html: stability_and_reactivity}}></div>
                        </HTMLContentCanvas>
                    </View>
                </View>
                <View style={[styles.contentPanel, {textAlign: "left"}]}>
                    <Text style={styles.headingPoint}>11. Toxicological Information</Text>
                    <View style={[styles.flexColumn, styles.gridGap5]}>
                        <HTMLContentCanvas width="100" height="100">
                            <div dangerouslySetInnerHTML={{__html: toxicological_info}}></div>
                        </HTMLContentCanvas>
                    </View>
                </View>
                <View style={[styles.contentPanel, {textAlign: "left"}]}>
                    <Text style={styles.headingPoint}>12. Ecological Information</Text>
                    <View style={[styles.flexColumn, styles.gridGap5]}>
                        <HTMLContentCanvas width="100" height="100">
                            <div dangerouslySetInnerHTML={{__html: ecological_info}}></div>
                        </HTMLContentCanvas>
                    </View>
                </View>
                <View style={[styles.contentPanel, {textAlign: "left"}]}>
                    <Text style={styles.headingPoint}>13. Disposal Considerations</Text>
                    <View style={[styles.flexColumn, styles.gridGap5]}>
                        <HTMLContentCanvas width="100" height="100">
                            <div dangerouslySetInnerHTML={{__html: disposal_considerations}}></div>
                        </HTMLContentCanvas>
                    </View>
                </View>
                <View style={[styles.contentPanel, {textAlign: "left"}]}>
                    <Text style={styles.headingPoint}>14. Transport Information</Text>
                    <View style={[styles.flexColumn, styles.gridGap5]}>
                        <HTMLContentCanvas width="100" height="100">
                            <div dangerouslySetInnerHTML={{__html: transport_info}}></div>
                        </HTMLContentCanvas>
                    </View>
                </View>
                <View style={[styles.contentPanel, {textAlign: "left"}]}>
                    <Text style={styles.headingPoint}>15. Regulatory Information</Text>
                    <View style={[styles.flexColumn, styles.gridGap5]}>
                        <HTMLContentCanvas width="100" height="100">
                            <div dangerouslySetInnerHTML={{__html: regulatory_info}}></div>
                        </HTMLContentCanvas>
                    </View>
                </View>
                <View style={[styles.contentPanel, {textAlign: "left"}]}>
                    <Text style={styles.headingPoint}>16. Other Information</Text>
                    <View style={[styles.flexColumn, styles.gridGap5]}>
                        <HTMLContentCanvas width="100" height="100">
                            <div dangerouslySetInnerHTML={{__html: other_info}}></div>
                        </HTMLContentCanvas>
                    </View>
                </View>
            </View>
            <View fixed style={[styles.flexRow, {fontSize: 9, justifyContent: 'center', placeItems: "center", padding: '7px', borderTop: '1px solid #eee', position: 'absolute', left: 0, right: 0, bottom: 0}]}>
                <Text style={{flexGrow: 1}}>Powered by SHEQ Aid</Text>
                <Text style={{borderLeft: '1px solid #ddd', paddingLeft: 10, width: '60px'}}>Page 1 of 1</Text>
            </View>
        </PageWrapper>;
    }
}
// </editor-fold>

export {
    PageFirst, Page2, PageLast
};