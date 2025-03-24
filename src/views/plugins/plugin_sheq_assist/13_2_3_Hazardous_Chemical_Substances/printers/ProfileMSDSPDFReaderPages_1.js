// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import {Page, Text, View} from '@react-pdf/renderer';

import {execWhen} from 'utils/Utils';

import {Panel, styles} from 'pdf-components';

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

        const rowStyle = {
            margin: '30px auto 0px',
            display: 'flex',
            flexDirection: 'column',
            placeItems: "center",
            justifyContent: 'center'
        };

        return <PageWrapper size="A4" style={styles.page}>
            <View style={styles.content}>
                <View style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    placeItems: "center",
                    justifyContent: 'center',
                    fontSize: 26
                }}>
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
            <View fixed style={[styles.flexRow, {
                fontSize: 9,
                justifyContent: 'center',
                placeItems: "center",
                padding: '7px',
                borderTop: '4px solid #fafafa',
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0
            }]}>
                <Text style={{flexGrow: 1}}>Powered by SHEQ Intel</Text>
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
        if (!this.state.renderer) return null;
        const {item} = this.props;
        return <PageWrapper size="A4" style={styles.page}>
            <View style={styles.content}>
                <BasicDetailsPanel item={item}/>
            </View>
            <View fixed style={[styles.flexRow, {
                fontSize: 9,
                justifyContent: 'center',
                placeItems: "center",
                padding: '7px',
                borderTop: '1px solid #eee',
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0
            }]}>
                <Text style={{flexGrow: 1}}>Powered by SHEQ Intel</Text>
                <Text style={{borderLeft: '1px solid #ddd', paddingLeft: 10, width: '60px'}}>Page 1 of 1</Text>
            </View>
        </PageWrapper>;
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="BasicDetailsPanel">
@observer
class BasicDetailsPanel extends React.Component {
    render() {
        let {
            data: {
                client,
                project,
                site,
                //1
                created_at,
//                name, category, manufacturer, risk_level, emergency_phone, 
//                date_identified,
//                doc
                name,
                common_names,
                chemical_name,
                empirical_formula,
                un_num,
                application_or_use,
                manufacturer,
                manufacturer_addr,
                manufacturer_phone_num,
                manufacturer_email,
                manufacturer_fax,
                manufacturer_website,
                emergency_phone_nums,
                more_product_info,
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
                other_info
            }
        } = this.props.item;

        return <View style={[styles.contentPanel, {textAlign: "left"}]}>
            <Text style={styles.headingPoint}>BASIC DETAILS</Text>
            <View style={[styles.flexColumn, {marginTop: 10}]}>
                <View style={[styles.flexRow]}>
                    <Panel title="Company" value={client} isOrg
                           colStyle={{width: '100%', borderBottom: '1px dotted #eee'}}/>
                </View>
                <View style={[styles.flexRow]}>
                    <Panel title="Project" value={project} isOrg
                           colStyle={{width: '100%', borderBottom: '1px dotted #eee'}}/>
                </View>
                <View style={[styles.flexRow]}>
                    <Panel title="Site" value={site} isOrg colStyle={{width: '100%', borderBottom: '1px dotted #eee'}}/>
                </View>
                <View style={[styles.flexRow]}>
                    <Panel title="Safety Data Sheet / Product Name" value={name}
                           colStyle={{width: '100%', borderBottom: '1px dotted #eee'}}/>
                </View>
                <View style={[styles.flexRow]}>
                    <Panel title="Risk Level" value={risk_level}
                           colStyle={{width: '100%', borderBottom: '1px dotted #eee'}}/>
                </View>

                <View style={[styles.flexRow]}>
                    <Panel title="Category" value={category}
                           colStyle={{width: '100%', borderBottom: '1px dotted #eee'}}/>
                </View>
                <View style={[styles.flexRow]}>
                    <Panel title="Manufacturer" value={manufacturer}
                           colStyle={{width: '100%', borderBottom: '1px dotted #eee'}}/>
                </View>
                <View style={[styles.flexRow]}>
                    <Panel title="Emergency Phone No." value={emergency_phone}
                           colStyle={{width: '100%', borderBottom: '1px dotted #eee'}}/>
                </View>
                <View style={[styles.flexRow]}>
                    <Panel title="Date Identified" value={date_identified} type="date" colStyle={{width: '100%'}}/>
                </View>
            </View>
        </View>;
    }
}

// </editor-fold>

export {
    PageFirst, Page2, PageLast
};