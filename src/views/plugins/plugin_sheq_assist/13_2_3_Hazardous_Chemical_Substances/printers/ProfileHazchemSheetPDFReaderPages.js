// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {Image, Page, Text, View} from '@react-pdf/renderer';

import {Panel} from '../../../../../pdf-components';

import styles from './ProfilePDFReader.style';

const unitsShort = {
    Time: "hrs", Distance: "km"
};

const LIST_LIMIT = 3;
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="PageFirst">
@observer
class PageFirst extends React.Component {
    
    componentDidMount() {
        setTimeout(() => {
            this.props.counter.pos++;
        });
    }
    
    render() {
        let {
            data: {
                client, project, site,
                
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
        } = this.props.item;
        
        let clientName = client && (client.name || client.data.name);
        let projectName = project && (project.name || project.data.name);
        let siteName = site && (site.name || site.data.name);
        
        const explanationStyle = {margin: '5px auto 0', fontStyle: 'italic', fontSize: 16};
        
        return <Page size="A4" style={styles.page}>
            <View style={styles.content}>
                <View style={{height: '100%', display: 'flex', flexDirection: 'column', placeItems: "center", justifyContent: 'center', fontSize: 26}}>
                    <Text style={{margin: '20px auto 0'}}>HAZCHEM SHEET DETAILS</Text>
                    {product && <Text style={{margin: '20px auto 0', fontSize: 16}}>NAMED</Text>}
                    {product && <Text style={{margin: '20px auto 0'}}>{product.data.name}</Text>}                   
                    {clientName && <Text style={{margin: '20px auto 0', fontSize: 16}}>OF</Text>}
                    {clientName && <View style={[styles.flexColumn, {margin: '20px auto 0'}]}>
                        <Text>{clientName}</Text>
                        <Text style={explanationStyle}>(Company)</Text>
                    </View>}
                    {(projectName || siteName) && <Text style={{margin: '20px auto 0', fontSize: 16}}>AT</Text>}
                    {projectName && <View style={[styles.flexColumn, {margin: '20px auto 0'}]}>
                        <Text>{projectName}</Text>
                        <Text style={explanationStyle}>(Project)</Text>
                    </View>}
                    {siteName && <View style={[styles.flexColumn, {margin: '20px auto 0'}]}>
                        <Text>{siteName}</Text>
                        <Text style={explanationStyle}>(Site)</Text>
                    </View>}
                </View>
            </View>
            <View fixed style={[styles.flexRow, {fontSize: 9, justifyContent: 'center', placeItems: "center", padding: '7px', borderTop: '1px solid #eee', position: 'absolute', left: 0, right: 0, bottom: 0}]}>
                <Text style={{flexGrow: 1}}>Powered by SHEQ Aid</Text>
                <Text style={{borderLeft: '1px solid #ddd', paddingLeft: 10, width: '60px'}}>Cover Page</Text>
            </View>
        </Page>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="PageLast">
@observer
class PageLast extends React.Component {
    
    componentDidMount() {
        setTimeout(() => {
            this.props.counter.pos++;
        });
    }
    
    render() {
        
        return <Page size="A4" style={styles.page}>
            <View fixed style={[styles.flexRow, {fontSize: 9, justifyContent: 'center', placeItems: "center", padding: '7px', borderTop: '1px solid #eee', position: 'absolute', left: 0, right: 0, bottom: 0}]}>
                <Text style={{flexGrow: 1}}>Powered by SHEQ Aid</Text>
                <Text style={{borderLeft: '1px solid #ddd', paddingLeft: 10, width: '60px'}}>Last Page</Text>
            </View>
        </Page>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Page2">
@observer
class Page2 extends React.Component {
    
    componentDidMount() {
        setTimeout(() => {
            this.props.counter.pos++;
        });
    }
    
    render() {
        const {item} = this.props;
        return <Page size="A4" style={styles.page}>
            <View style={styles.content}>
                <View style={styles.contentBackground}/>
                <BasicDetailsPanel item={item}/>
            </View>
            <View fixed style={[styles.flexRow, {fontSize: 9, justifyContent: 'center', placeItems: "center", padding: '7px', borderTop: '1px solid #eee', position: 'absolute', left: 0, right: 0, bottom: 0}]}>
                <Text style={{flexGrow: 1}}>Powered by SHEQ Aid</Text>
                <Text style={{borderLeft: '1px solid #ddd', paddingLeft: 10, width: '60px'}}>Page 1 of 1</Text>
            </View>
        </Page>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="BasicDetailsPanel">
@observer
class BasicDetailsPanel extends React.Component {
    render() {
        let {
            data: {
                created_at,
                client, project, site,
                product = {}, physical_state, type,
                precaution_photo_concentrate_list, precaution_photo_application_list,
                active_ingredient_list = [], 
                hazard_identification_physical_list, hazard_identification_reproductive_list, hazard_identification_biological_list,
                first_aid_procedure_splashes_in_eyes_list, first_aid_procedure_contact_with_skin_list, first_aid_procedure_mouth_contact_or_eaten_list, first_aid_procedure_fumes_breathed_in_list,
                emergency_action_for_spills_small_list, emergency_action_for_spills_large_list,
                disposal_used_container_list, disposal_unused_product_list,
                contacts_emergency_name, contacts_emergency_num, contacts_manufacturer_name, contacts_manufacturer_num
            }
        } = this.props.item;
        
        const Table = ({th, col, list}) => {
            const cellNumStyle = {flexShrink: 1, borderRight: '1px solid #eee', width: '25px', fontSize: '11px', fontWeight: 'bold', padding: '5px'};
            const cellStyle = {flexShrink: 1, borderRight: '1px solid #eee', fontSize: '11px', padding: '5px'};
            return <View style={[styles.table, {padding: '2px'}]}>
                <View style={[styles.flexRow, {backgroundColor: '#fafafa', width: '100%'}]}>
                    <Text style={cellNumStyle}>#</Text>
                    <Text style={[cellStyle, {flexGrow: 1, fontWeight: 'bold'}]}>Name</Text>
                </View>
                {list.map((val, ind) => {
                    const {text} = val || {};
                    return <View key={ind} style={[styles.tableRow, styles.flexRow, {borderBottom: '1px solid #eee'}, (th && ind === 0 ? styles.tableEm: {})]}>
                        <Text style={cellNumStyle}>{ind + 1}</Text>
                        <Text style={[cellStyle, {flexGrow: 1}]}>{text || ''}</Text>
                    </View>;
                })}
            </View>;
        };
        
        // const len = active_ingredient_list.length;
        // for(let n = len; n < LIST_LIMIT; n++) {
        //     active_ingredient_list.push(null);
        // }
        
        return <View style={[styles.contentPanel, {textAlign: "left"}]}>
            <Text style={styles.headingPoint}>BASIC DETAILS</Text>
            <View style={[styles.flexColumn, {marginTop: 10}]}>
                <View style={[styles.flexColumn]}>
                    <Panel title="Company" value={client} isOrg horizontal={['180px']} colStyle={{width: '100%', borderBottom: '1px dotted #eee'}}/>
                    <Panel title="Project" value={project} isOrg horizontal={['180px']} colStyle={{width: '100%', borderBottom: '1px dotted #eee'}}/>
                    <Panel title="Site" value={site} isOrg horizontal={['180px']} colStyle={{width: '100%', borderBottom: '1px dotted #eee'}}/>
                </View>
                <View style={[styles.flexColumn]}>
                    <Panel title="Product" value={product} renderer={v => v.name || v.data.name} horizontal={['180px']} colStyle={{width: '100%', borderBottom: '1px dotted #eee'}}/>
                    <Panel title="Physical State" value={physical_state} horizontal={['180px']} colStyle={{width: '100%', borderBottom: '1px dotted #eee'}}/>
                    <Panel title="Type" value={type} horizontal={['180px']} colStyle={{width: '100%'}}/>
                </View>
            </View>
            <Text style={[styles.headingPoint, {marginTop: 10}]}>CONTACT DETAILS</Text>
            <View style={[styles.flexColumn, {marginTop: 10}]}>
                <View style={[styles.flexColumn]}>
                    <Panel title="Emergency Contact Name" value={contacts_emergency_name} horizontal={['180px']} colStyle={{width: '100%', borderBottom: '1px dotted #eee'}}/>
                    <Panel title="Emergency Contact No." value={contacts_emergency_num} horizontal={['180px']} colStyle={{width: '100%', borderBottom: '1px dotted #eee'}}/>
                </View>
                <View style={[styles.flexColumn]}>
                    <Panel title="Manufacturer Contact Name" value={contacts_manufacturer_name} horizontal={['180px']} colStyle={{width: '100%', borderBottom: '1px dotted #eee'}}/>
                    <Panel title="Manufacturer Contact No." value={contacts_manufacturer_num} horizontal={['180px']} colStyle={{width: '100%'}}/>
                </View>
            </View>
            <Text style={[styles.headingPoint, {marginTop: 10}]}>ACTIVE INGREDIENTS</Text>
            <View style={[styles.flexColumn, {marginTop: 10}]}>
                <View style={[styles.flexColumn]}>
                    <Table th col={['50%', '50%']} list={active_ingredient_list}/>
                </View>
            </View>
        </View>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="PagePrecautionPics">
@observer
class PagePrecautionPics extends React.Component {
    
    render() {
        const {
            data: {
                precaution_photo_concentrate_list = [],
                precaution_photo_application_list = []
            }
        } = this.props.item;
        
        const mapImg = v => {
            if (v && v.dlUrls) {
                return <Image src={v.dlUrls[0]} style={{width: '50%'}}/>;
            }
            return null;
        };
        return <Page size="A4" orientation="landscape" style={styles.page}>
            <View style={styles.content}>
                <View style={[styles.contentPanel, {textAlign: "left"}]}>
                    <Text style={styles.headingPoint}>PRECAUTION PHOTOS</Text>
                    <View style={[styles.flexRow]}>
                        <View style={[styles.flexColumn]}>
                            <Text style={{marginVertical: '5px', fontSize: '11px', fontWeight: 'bold'}}>Precautions For Handling Concentrate</Text>
                            <View style={[styles.flexColumn]}>
                                {precaution_photo_concentrate_list.map(mapImg)}
                                {precaution_photo_concentrate_list.isEmpty() && <Text style={{padding: 10, backgroundColor: '#fff'}}>N/A</Text>}
                            </View>
                        </View>
                        <View style={[styles.flexColumn]}>
                            <Text style={{marginVertical: '5px', fontSize: '11px', fontWeight: 'bold'}}>Precautions For Handling Application</Text>
                            <View style={[styles.flexColumn]}>
                                {precaution_photo_application_list.map(mapImg)}
                                {precaution_photo_application_list.isEmpty() && <Text style={{padding: 10, backgroundColor: '#fff'}}>N/A</Text>}
                            </View>
                        </View>
                    </View>
                </View>
            </View>
            <View fixed style={[styles.flexRow, {fontSize: 9, justifyContent: 'center', placeItems: "center", padding: '7px', borderTop: '1px solid #eee', position: 'absolute', left: 0, right: 0, bottom: 0}]}>
                <Text style={{flexGrow: 1}}>Powered by SHEQ Aid</Text>
                <Text style={{borderLeft: '1px solid #ddd', paddingLeft: 10, width: '60px'}}>Page 1 of 1</Text>
            </View>
        </Page>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="PageHazardIdentificationDetails">
@observer
class PageHazardIdentificationDetails extends React.Component {

    componentDidMount() {
        setTimeout(() => {
            this.props.counter.pos++;
        });
    }
    
    get item() {
        return this.props.item;
    }
    
    render() {
        const {
            data: {
                hazard_identification_physical_list = [],
                hazard_identification_reproductive_list = [],
                hazard_identification_biological_list = []
            }
        } = this.item;
        
        // const len1 = hazard_identification_physical_list.length;
        // for(let n = len1; n < LIST_LIMIT; n++) {
        //     hazard_identification_physical_list.push(null);
        // }
        
        // const len2 = hazard_identification_reproductive_list.length;
        // for(let n = len2; n < LIST_LIMIT; n++) {
        //     hazard_identification_reproductive_list.push(null);
        // }
        
        // const len3 = hazard_identification_biological_list.length;
        // for(let n = len3; n < LIST_LIMIT; n++) {
        //     hazard_identification_biological_list.push(null);
        // }
        
        const Table = ({th, col, list}) => {
            const cellNumStyle = {flexShrink: 1, borderRight: '1px solid #eee', width: '25px', fontSize: '11px', fontWeight: 'bold', padding: '5px'};
            const cellStyle = {flexShrink: 1, borderRight: '1px solid #eee', fontSize: '11px', padding: '5px'};
            return <View style={[styles.table, {padding: '2px'}]}>
                <View style={[styles.flexRow, {backgroundColor: '#fafafa', width: '100%'}]}>
                    <Text style={cellNumStyle}>#</Text>
                    <Text style={[cellStyle, {flexGrow: 1, fontWeight: 'bold'}]}>Name</Text>
                </View>
                {list.map((val, ind) => {
                    const {text} = val || {};
                    return <View key={ind} style={[styles.tableRow, styles.flexRow, {borderBottom: '1px solid #eee'}, (th && ind === 0 ? styles.tableEm: {})]}>
                        <Text style={cellNumStyle}>{ind + 1}</Text>
                        <Text style={[cellStyle, {flexGrow: 1}]}>{text || ''}</Text>
                    </View>;
                })}
            </View>;
        };
        
        return <Page size="A4" style={styles.page}>
            <View style={styles.content}>
                <View style={[styles.contentPanel, {textAlign: "left"}]}>
                    <Text style={styles.headingPoint}>HAZARD IDENTIFICATION DETAILS</Text>
                    <View style={[styles.flexColumn]}>
                        <Text style={{marginVertical: '5px', fontSize: '11px', fontWeight: 'bold'}}>Physical Hazards</Text>
                        <Table th col={['50%', '50%']} list={hazard_identification_physical_list}/>
                    </View>
                    <View style={[styles.flexColumn]}>
                        <Text style={{marginVertical: '5px', fontSize: '11px', fontWeight: 'bold'}}>Reproductive Hazards</Text>
                        <Table th col={['50%', '50%']} list={hazard_identification_reproductive_list}/>
                    </View>
                    <View style={[styles.flexColumn]}>
                        <Text style={{marginVertical: '5px', fontSize: '11px', fontWeight: 'bold'}}>Biological Hazards</Text>
                        <Table th col={['50%', '50%']} list={hazard_identification_biological_list}/>
                    </View>
                </View>
            </View>
            <View fixed style={[styles.flexRow, {fontSize: 9, justifyContent: 'center', placeItems: "center", padding: '7px', borderTop: '1px solid #eee', position: 'absolute', left: 0, right: 0, bottom: 0}]}>
                <Text style={{flexGrow: 1}}>Powered by SHEQ Aid</Text>
                <Text style={{borderLeft: '1px solid #ddd', paddingLeft: 10, width: '60px'}}>Page 1 of 1</Text>
            </View>
        </Page>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="PageFirstAidProceduresDetails">
@observer
class PageFirstAidProceduresDetails extends React.Component {

    componentDidMount() {
        setTimeout(() => {
            this.props.counter.pos++;
        });
    }
    
    get item() {
        return this.props.item;
    }
    
    render() {
        const {
            data: {
                first_aid_procedure_splashes_in_eyes_list = [],
                first_aid_procedure_contact_with_skin_list = [],
                first_aid_procedure_mouth_contact_or_eaten_list = [],
                first_aid_procedure_fumes_breathed_in_list = []
            }
        } = this.item;
        
        // const len1 = first_aid_procedure_splashes_in_eyes_list.length;
        // for(let n = len1; n < LIST_LIMIT; n++) {
        //     first_aid_procedure_splashes_in_eyes_list.push(null);
        // }
        //
        // const len2 = first_aid_procedure_contact_with_skin_list.length;
        // for(let n = len2; n < LIST_LIMIT; n++) {
        //     first_aid_procedure_contact_with_skin_list.push(null);
        // }
        //
        // const len3 = first_aid_procedure_mouth_contact_or_eaten_list.length;
        // for(let n = len3; n < LIST_LIMIT; n++) {
        //     first_aid_procedure_mouth_contact_or_eaten_list.push(null);
        // }
        //
        // const len4 = first_aid_procedure_fumes_breathed_in_list.length;
        // for(let n = len4; n < LIST_LIMIT; n++) {
        //     first_aid_procedure_fumes_breathed_in_list.push(null);
        // }
        
        const Table = ({th, col, list}) => {
            const cellNumStyle = {flexShrink: 1, borderRight: '1px solid #eee', width: '25px', fontSize: '11px', fontWeight: 'bold', padding: '5px'};
            const cellStyle = {flexShrink: 1, borderRight: '1px solid #eee', fontSize: '11px', padding: '5px'};
            return <View style={[styles.table, {padding: '2px'}]}>
                <View style={[styles.flexRow, {backgroundColor: '#fafafa', width: '100%'}]}>
                    <Text style={cellNumStyle}>#</Text>
                    <Text style={[cellStyle, {flexGrow: 1, fontWeight: 'bold'}]}>Name</Text>
                </View>
                {list.map((val, ind) => {
                    const {text} = val || {};
                    return <View key={ind} style={[styles.tableRow, styles.flexRow, {borderBottom: '1px solid #eee'}, (th && ind === 0 ? styles.tableEm: {})]}>
                        <Text style={cellNumStyle}>{ind + 1}</Text>
                        <Text style={[cellStyle, {flexGrow: 1}]}>{text || ''}</Text>
                    </View>;
                })}
            </View>;
        };
        
        return <Page size="A4" style={styles.page}>
            <View style={styles.content}>
                <View style={[styles.contentPanel, {textAlign: "left"}]}>
                    <Text style={styles.headingPoint}>FIRST AID PROCEDURES DETAILS</Text>
                    <View style={[styles.flexColumn]}>
                        <Text style={{marginVertical: '5px', fontSize: '11px', fontWeight: 'bold'}}>Splashes in Eyes</Text>
                        <Table th col={['50%', '50%']} list={first_aid_procedure_splashes_in_eyes_list}/>
                    </View>
                    <View style={[styles.flexColumn]}>
                        <Text style={{marginVertical: '5px', fontSize: '11px', fontWeight: 'bold'}}>Contact with Skin</Text>
                        <Table th col={['50%', '50%']} list={first_aid_procedure_contact_with_skin_list}/>
                    </View>
                    <View style={[styles.flexColumn]}>
                        <Text style={{marginVertical: '5px', fontSize: '11px', fontWeight: 'bold'}}>Mouth Contact or Eaten</Text>
                        <Table th col={['50%', '50%']} list={first_aid_procedure_mouth_contact_or_eaten_list}/>
                    </View>
                    <View style={[styles.flexColumn]}>
                        <Text style={{marginVertical: '5px', fontSize: '11px', fontWeight: 'bold'}}>Fumes Breathed In</Text>
                        <Table th col={['50%', '50%']} list={first_aid_procedure_fumes_breathed_in_list}/>
                    </View>
                </View>
            </View>
            <View fixed style={[styles.flexRow, {fontSize: 9, justifyContent: 'center', placeItems: "center", padding: '7px', borderTop: '1px solid #eee', position: 'absolute', left: 0, right: 0, bottom: 0}]}>
                <Text style={{flexGrow: 1}}>Powered by SHEQ Aid</Text>
                <Text style={{borderLeft: '1px solid #ddd', paddingLeft: 10, width: '60px'}}>Page 1 of 1</Text>
            </View>
        </Page>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="PageEmergencyActionsForSpillsDetails">
@observer
class PageEmergencyActionsForSpillsDetails extends React.Component {

    componentDidMount() {
        setTimeout(() => {
            this.props.counter.pos++;
        });
    }
    
    get item() {
        return this.props.item;
    }
    
    render() {
        const {
            data: {
                emergency_action_for_spills_small_list = [],
                emergency_action_for_spills_large_list = []
            }
        } = this.item;
        
        // const len1 = emergency_action_for_spills_small_list.length;
        // for(let n = len1; n < LIST_LIMIT; n++) {
        //     emergency_action_for_spills_small_list.push(null);
        // }
        //
        // const len2 = emergency_action_for_spills_large_list.length;
        // for(let n = len2; n < LIST_LIMIT; n++) {
        //     emergency_action_for_spills_large_list.push(null);
        // }
        
        const Table = ({th, col, list}) => {
            const cellNumStyle = {flexShrink: 1, borderRight: '1px solid #eee', width: '25px', fontSize: '11px', fontWeight: 'bold', padding: '5px'};
            const cellStyle = {flexShrink: 1, borderRight: '1px solid #eee', fontSize: '11px', padding: '5px'};
            return <View style={[styles.table, {padding: '2px'}]}>
                <View style={[styles.flexRow, {backgroundColor: '#fafafa', width: '100%'}]}>
                    <Text style={cellNumStyle}>#</Text>
                    <Text style={[cellStyle, {flexGrow: 1, fontWeight: 'bold'}]}>Name</Text>
                </View>
                {list.map((val, ind) => {
                    const {text} = val || {};
                    return <View key={ind} style={[styles.tableRow, styles.flexRow, {borderBottom: '1px solid #eee'}, (th && ind === 0 ? styles.tableEm: {})]}>
                        <Text style={cellNumStyle}>{ind + 1}</Text>
                        <Text style={[cellStyle, {flexGrow: 1}]}>{text || ''}</Text>
                    </View>;
                })}
            </View>;
        };
        
        return <Page size="A4" style={styles.page}>
            <View style={styles.content}>
                <View style={[styles.contentPanel, {textAlign: "left"}]}>
                    <Text style={styles.headingPoint}>EMERGENCY ACTION FOR SPILLS DETAILS</Text>
                    <View style={[styles.flexColumn]}>
                        <Text style={{marginVertical: '5px', fontSize: '11px', fontWeight: 'bold'}}>Small Spills ({"<="} 10 Litres)</Text>
                        <Table th col={['50%', '50%']} list={emergency_action_for_spills_small_list}/>
                    </View>
                    <View style={[styles.flexColumn]}>
                        <Text style={{marginVertical: '5px', fontSize: '11px', fontWeight: 'bold'}}>Large Spills ({">"} 10 Litres)</Text>
                        <Table th col={['50%', '50%']} list={emergency_action_for_spills_large_list}/>
                    </View>
                </View>
            </View>
            <View fixed style={[styles.flexRow, {fontSize: 9, justifyContent: 'center', placeItems: "center", padding: '7px', borderTop: '1px solid #eee', position: 'absolute', left: 0, right: 0, bottom: 0}]}>
                <Text style={{flexGrow: 1}}>Powered by SHEQ Aid</Text>
                <Text style={{borderLeft: '1px solid #ddd', paddingLeft: 10, width: '60px'}}>Page 1 of 1</Text>
            </View>
        </Page>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="PageDisposalsDetails">
@observer
class PageDisposalsDetails extends React.Component {

    componentDidMount() {
        setTimeout(() => {
            this.props.counter.pos++;
        });
    }
    
    get item() {
        return this.props.item;
    }
    
    render() {
        const {
            data: {
                disposal_used_container_list = [],
                disposal_unused_product_list = []
            }
        } = this.item;
        
        // const len1 = disposal_used_container_list.length;
        // for(let n = len1; n < LIST_LIMIT; n++) {
        //     disposal_used_container_list.push(null);
        // }
        //
        // const len2 = disposal_unused_product_list.length;
        // for(let n = len2; n < LIST_LIMIT; n++) {
        //     disposal_unused_product_list.push(null);
        // }
        
        const Table = ({th, col, list}) => {
            const cellNumStyle = {flexShrink: 1, borderRight: '1px solid #eee', width: '25px', fontSize: '11px', fontWeight: 'bold', padding: '5px'};
            const cellStyle = {flexShrink: 1, borderRight: '1px solid #eee', fontSize: '11px', padding: '5px'};
            return <View style={[styles.table, {padding: '2px'}]}>
                <View style={[styles.flexRow, {backgroundColor: '#fafafa', width: '100%'}]}>
                    <Text style={cellNumStyle}>#</Text>
                    <Text style={[cellStyle, {flexGrow: 1, fontWeight: 'bold'}]}>Name</Text>
                </View>
                {list.map((val, ind) => {
                    const {text} = val || {};
                    return <View key={ind} style={[styles.tableRow, styles.flexRow, {borderBottom: '1px solid #eee'}, (th && ind === 0 ? styles.tableEm: {})]}>
                        <Text style={cellNumStyle}>{ind + 1}</Text>
                        <Text style={[cellStyle, {flexGrow: 1}]}>{text || ''}</Text>
                    </View>;
                })}
            </View>;
        };
        
        return <Page size="A4" style={styles.page}>
            <View style={styles.content}>
                <View style={[styles.contentPanel, {textAlign: "left"}]}>
                    <Text style={styles.headingPoint}>DISPOSAL DETAILS</Text>
                    <View style={[styles.flexColumn]}>
                        <Text style={{marginVertical: '5px', fontSize: '11px', fontWeight: 'bold'}}>Used Containers</Text>
                        <Table th col={['50%', '50%']} list={disposal_used_container_list}/>
                    </View>
                    <View style={[styles.flexColumn]}>
                        <Text style={{marginVertical: '5px', fontSize: '11px', fontWeight: 'bold'}}>Unused Product</Text>
                        <Table th col={['50%', '50%']} list={disposal_unused_product_list}/>
                    </View>
                </View>
            </View>
            <View fixed style={[styles.flexRow, {fontSize: 9, justifyContent: 'center', placeItems: "center", padding: '7px', borderTop: '1px solid #eee', position: 'absolute', left: 0, right: 0, bottom: 0}]}>
                <Text style={{flexGrow: 1}}>Powered by SHEQ Aid</Text>
                <Text style={{borderLeft: '1px solid #ddd', paddingLeft: 10, width: '60px'}}>Page 1 of 1</Text>
            </View>
        </Page>;
    }
}
// </editor-fold>

export {
    PageFirst, Page2, PageLast, 
    PagePrecautionPics, PageHazardIdentificationDetails, PageFirstAidProceduresDetails, PageEmergencyActionsForSpillsDetails, PageDisposalsDetails
};