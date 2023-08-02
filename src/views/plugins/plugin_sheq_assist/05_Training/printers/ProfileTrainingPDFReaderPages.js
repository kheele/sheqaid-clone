// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import {Image, Page, Text, View} from '@react-pdf/renderer';

import {CanvasJS} from 'components/stats/canvasjs.react';

import {createMonitoringPlanStats} from '../../19_Maintenance/utils/AssetCharts';

import {Dates} from 'utils/Utils';

import {Panel} from 'pdf-components';

import styles from './ProfilePDFReader.style';

const unitsShort = {
    Time: "hrs", Distance: "km"
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="PageFirst">
@observer
class PageFirst extends React.Component {
    
    render() {
        let {
            data: {
                client, project, site,
                //1
                owning_company, name, asset_type, desc,
            }
        } = this.props.item;
        
        let clientName = client && (client.name || client.data.name);
        
        return <Page size="A4" style={styles.page}>
            <View style={styles.content}>
                <View style={{height: '100%', display: 'flex', flexDirection: 'column', placeItems: "center", justifyContent: 'center', fontSize: 26}}>
                    <Text style={{margin: '40px auto 0'}}>ASSET DETAILS</Text>
                    {asset_type && <Text style={{margin: '40px auto 0'}}>OF TYPE</Text>}
                    {asset_type && <Text style={{margin: '40px auto 0'}}>{asset_type}</Text>}
                    {name && <Text style={{margin: '40px auto 0'}}>{name}</Text>}
                    {owning_company && <Text style={{margin: '40px auto 0'}}>OWNED BY</Text>}
                    {owning_company && <Text style={{margin: '40px auto 0'}}>{owning_company}</Text>}
                    {clientName && <Text style={{margin: '40px auto 0'}}>USED AT</Text>}
                    {clientName && <Text style={{margin: '40px auto 0'}}>{clientName}</Text>}
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
    render() {
        const {item} = this.props;
        return <Page size="A4" style={styles.page}>
            <View style={styles.content}>
                <AssetDetailsPanel item={item}/>
            </View>
            <View fixed style={[styles.flexRow, {fontSize: 9, justifyContent: 'center', placeItems: "center", padding: '7px', borderTop: '1px solid #eee', position: 'absolute', left: 0, right: 0, bottom: 0}]}>
                <Text style={{flexGrow: 1}}>Powered by SHEQ Aid</Text>
                <Text style={{borderLeft: '1px solid #ddd', paddingLeft: 10, width: '60px'}}>Page 1 of 1</Text>
            </View>
        </Page>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="PageAssetPics">
@observer
class PageAssetPics extends React.Component {
    render() {
        const {
            data: {
                //2
                profile_pic
            }
        } = this.props.item;
        
        return <Page size="A4" style={styles.page}>
            <View style={styles.content}>
                <View style={[styles.contentPanel, {textAlign: "left"}]}>
                    <Text style={styles.headingPoint}>ASSET PHOTOS</Text>
                    <Panel value={profile_pic} type="file" colStyle={{maxHeight: '700px'}}/>
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

// <editor-fold defaultstate="collapsed" desc="AssetDetailsPanel">
@observer
class AssetDetailsPanel extends React.Component {
    render() {
        let {
            data: {
                created_at, status/*In Storage | Checked Out | Loaned Out | Out For Repair*/, statusVal,
                client, project, site,
                //1
                owning_company, name, asset_type, desc,
                manufacturer, model, reg_num, serial_num, 
                location, toolkit, condition,
                barcode_or_qr_code_type, barcode_or_qr_code, 
                notes,
                //2
                profile_pic,
                //3
                responsible_person,
            }
        } = this.props.item;
        
        return <View style={[styles.contentPanel, {textAlign: "left"}]}>
            <Text style={styles.headingPoint}>BASIC DETAILS</Text>
            <View style={[styles.flexColumn, {marginTop: 10}]}>
                <View style={[styles.flexRow]}>
                    <Panel title="Company" value={client} isOrg colStyle={{width: '100%', borderBottom: '1px dotted #eee'}}/>
                </View>
                <View style={[styles.flexRow]}>
                    <Panel title="Project" value={project} isOrg colStyle={{width: '50%', borderBottom: '1px dotted #eee', borderRight: '1px dotted #eee'}}/>
                    <Panel title="Site" value={site} isOrg colStyle={{width: '50%', borderBottom: '1px dotted #eee'}}/>
                </View>
                <View style={[styles.flexRow]}>
                    <Panel title="Owning Company Name" value={owning_company} colStyle={{width: '50%', borderBottom: '1px dotted #eee', borderRight: '1px dotted #eee'}}/>
                    <Panel title="Responsible Person" value={responsible_person} renderer={v => (v.fname || v.data.fname) + ' ' + (v.lname || v.data.lname)} colStyle={{width: '50%', borderBottom: '1px dotted #eee'}}/>
                </View>
                <View style={[styles.flexRow]}>
                    <Panel title="Asset Type" value={asset_type} colStyle={{width: '50%', borderBottom: '1px dotted #eee', borderRight: '1px dotted #eee'}}/>
                    <Panel title="Asset Name" value={name} colStyle={{width: '50%', borderBottom: '1px dotted #eee'}}/>
                </View>
                <View style={[styles.flexRow]}>
                    <Panel title="Manufacturer" value={manufacturer} colStyle={{width: '50%', borderBottom: '1px dotted #eee', borderRight: '1px dotted #eee'}}/>
                    <Panel title="Model" value={model} colStyle={{width: '50%', borderBottom: '1px dotted #eee'}}/>
                </View>
                <Panel title="Description" value={desc} colStyle={{borderBottom: '1px dotted #eee'}}/>
                <View style={[styles.flexRow]}>
                    <Panel title="Registration No." value={reg_num} colStyle={{width: '50%', borderBottom: '1px dotted #eee', borderRight: '1px dotted #eee'}}/>
                    <Panel title="Serial No." value={serial_num} colStyle={{width: '50%', borderBottom: '1px dotted #eee'}}/>
                </View>
                <View style={[styles.flexRow]}>
                    <Panel title="Location" value={location} colStyle={{width: '33.3333%', borderBottom: '1px dotted #eee', borderRight: '1px dotted #eee'}}/>
                    <Panel title="Toolkit" value={toolkit} colStyle={{width: '33.3333%', borderBottom: '1px dotted #eee', borderRight: '1px dotted #eee'}}/>
                    <Panel title="Condition" value={condition} colStyle={{width: '33.3333%', borderBottom: '1px dotted #eee'}}/>
                </View>
                <Panel title="Notes" value={notes}/>
            </View>
        </View>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="PagePurchaseDetails">
@observer
class PagePurchaseDetails extends React.Component {
    render() {
        const {
            data: {
                //6
                purchase_info
            }
        } = this.props.item;
        
        return <Page size="A4" style={styles.page}>
            <View style={styles.content}>
                <View style={[styles.contentPanel, {textAlign: "left"}]}>
                    <Text style={styles.headingPoint}>PURCHASE DETAILS</Text>
                    <View style={[styles.flexRow]}>
                        <Panel title="Date of Purchase" value={purchase_info && purchase_info.acquisition_date} type="date" colStyle={{width: '50%', borderBottom: '1px dotted #eee', borderRight: '1px dotted #eee'}}/>
                        <Panel title="Warranty Expiry Date" value={purchase_info && purchase_info.warranty_expiry} type="date" colStyle={{width: '50%', borderBottom: '1px dotted #eee'}}/>
                    </View>
                    <View style={[styles.flexRow]}>
                        <Panel title="Asset Cost" value={purchase_info && purchase_info.acquisition_value && purchase_info.acquisition_value.toCurrency('R')} colStyle={{width: '33.3333%', borderBottom: '1px dotted #eee', borderRight: '1px dotted #eee'}}/>
                        <Panel title="Vendor" value={purchase_info && purchase_info.vendor} colStyle={{width: '33.3333%', borderBottom: '1px dotted #eee', borderRight: '1px dotted #eee'}}/>
                        <Panel title="Purchase Reference No." value={purchase_info && purchase_info.reference_num} colStyle={{width: '33.3333%', borderBottom: '1px dotted #eee'}}/>
                    </View>
                    <Panel title="Warranty Certificate" value={purchase_info && purchase_info.warranty_certificate} type="file" titleStyle={{marginBottom: '5px'}} colStyle={{maxHeight: '600px'}}/>
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

// <editor-fold defaultstate="collapsed" desc="PageDepreciationDetails">
@observer
class PageDepreciationDetails extends React.Component {
    render() {
        const {
            data: {
                //7
                depreciation,
            }
        } = this.props.item;
        
        return <Page size="A4" style={styles.page}>
            <View style={styles.content}>
                <View style={[styles.contentPanel, {textAlign: "left"}]}>
                    <Text style={styles.headingPoint}>DEPRECIATION DETAILS</Text>
                    <Panel title="Depreciation Method" value={depreciation && depreciation.depreciation_method} colStyle={{borderBottom: '1px dotted #eee'}}/>
                    <Panel title="Asset Cost" value={depreciation && depreciation.asset_cost && depreciation.asset_cost.toCurrency('R')} colStyle={{borderBottom: '1px dotted #eee'}}/>
                    <Panel title="Salvage Value" value={depreciation && depreciation.salvage_value && depreciation.salvage_value.toCurrency('R')} colStyle={{borderBottom: '1px dotted #eee'}}/>
                    <Panel title="Depreciation Years" value={depreciation && depreciation.depreciation_years} renderer={v => v ? "Yes" : "No"} colStyle={{borderBottom: '1px dotted #eee'}}/>
                    <Panel title="Depreciation Factor" value={depreciation && depreciation.depreciation_factor} colStyle={{borderBottom: '1px dotted #eee'}}/>
                    <Panel title="Partial Year Depreciation?" value={depreciation && depreciation.partial_year_depreciation} renderer={v => v ? "Yes" : "No"}/>
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

// <editor-fold defaultstate="collapsed" desc="PageWorkManualDocDetails">
@observer
class PageWorkManualDocDetails extends React.Component {
    render() {
        const {
            data: {
                //5
                doc_work_manual
            }
        } = this.props.item;
        if(!doc_work_manual) return null;
        
        return <Page size="A4" style={styles.page}>
            <View style={styles.content}>
                <View style={[styles.contentPanel, {textAlign: "left"}]}>
                    <Text style={styles.headingPoint}>WORK MANUAL DOCUMNENT</Text>
                    <Panel value={doc_work_manual} type="file"/>
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

// <editor-fold defaultstate="collapsed" desc="PageWorkProcedureDocDetails">
@observer
class PageWorkProcedureDocDetails extends React.Component {
    render() {
        const {
            data: {
                //5
                doc_procedure,
            }
        } = this.props.item;
        if(!doc_procedure) return null;
        
        return <Page size="A4" style={styles.page}>
            <View style={styles.content}>
                <View style={[styles.contentPanel, {textAlign: "left"}]}>
                    <Text style={styles.headingPoint}>WORK PROCEDURE DOCUMNENT</Text>
                    <Panel value={doc_procedure} type="file"/>
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

// <editor-fold defaultstate="collapsed" desc="PageClearanceCertificateDocDetails">
@observer
class PageClearanceCertificateDocDetails extends React.Component {
    render() {
        const {
            data: {
                //5
                doc_clearance_certificate,
            }
        } = this.props.item;
        if(!doc_clearance_certificate) return null;
        
        return <Page size="A4" style={styles.page}>
            <View style={styles.content}>
                <View style={[styles.contentPanel, {textAlign: "left"}]}>
                    <Text style={styles.headingPoint}>CLEARANCE CERTIFICATE DOCUMNENT</Text>
                    <Panel value={doc_clearance_certificate} type="file"/>
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

// <editor-fold defaultstate="collapsed" desc="PageOtherDocDetails">
@observer
class PageOtherDocDetails extends React.Component {
    render() {
        const {
            data: {
                //4
                doc_pdf, doc_pdf_desc, doc_pdf_expiry
            }
        } = this.props.item;
        if(!doc_pdf) return null;
        
        return <Page size="A4" style={styles.page}>
            <View style={styles.content}>
                <View style={[styles.contentPanel, {textAlign: "left"}]}>
                    <Text style={styles.headingPoint}>OTHER DOCUMNENT</Text>
                    <Panel title="Document Description" value={doc_pdf_desc} colStyle={{borderBottom: '1px dotted #eee'}}/>
                    <Panel title="Document Expiry Date" value={doc_pdf_expiry} colStyle={{borderBottom: '1px dotted #eee'}}/>
                    <Panel value={doc_pdf} type="file"/>
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

// <editor-fold defaultstate="collapsed" desc="PageMonitoringPlanDetails">
@observer
class PageMonitoringPlanDetails extends React.Component {

    @observable state = {
        chartImgSrc: null
    };
    
    componentDidMount() {
        const {units, monitoring_plan_list: list} = this;
        if(list.isEmpty()) {
            return;
        }
        
        const options = createMonitoringPlanStats(list, units);   
        
        const container = document.createElement('div');
        container.id = 'PageMonitoringPlanDetails';
        container.style.width = '800px';
        container.style.height = '450px';
        const {body} = document;
        body.appendChild(container);                     
                     
        const chart = new CanvasJS.Chart(container.id, options);
        chart.render();
        
        setTimeout(() => {
            const canvas = container.querySelector('canvas');
            const src = canvas.toDataURL('image/jpeg');
            this.state.chartImgSrc = src;
            body.removeChild(container);
        }, 500);
    }
    
    get monitoring_plan_list() {
        const {data: {monitoring_plan_list}} = this.item;
        return monitoring_plan_list || [];
    }
    
    get units() {
        const {data: {asset_type}} = this.item;
        return asset_type === 'Plant' ? 'Time' : 'Distance';
    }
    
    get item() {
        return this.props.item;
    }
    
    render() {
        const {
            data: {
                asset_type,
                //8
                monitoring_plan_list
            }
        } = this.item;
        if(!monitoring_plan_list || monitoring_plan_list.isEmpty()) return null;
        
        const {units} = this;
        const {chartImgSrc} = this.state;
        
        const Table = ({th, col, list}) => {
            const cellNumStyle = {flexShrink: 1, borderRight: '1px solid #eee', width: '25px', fontSize: '11px', fontWeight: 'bold', padding: '5px'};
            const cellStyle = {flexShrink: 1, borderRight: '1px solid #eee', fontSize: '11px', padding: '5px'};
            return <View style={[styles.table, {padding: '2px'}]}>
                <View style={[styles.flexRow, {backgroundColor: '#fafafa', width: '100%'}]}>
                    <Text style={cellNumStyle}>#</Text>
                    <Text style={[cellStyle, {flexGrow: 1, fontWeight: 'bold'}]}>Fuel Usage</Text>
                    <Text style={[cellStyle, {width: '140px', fontWeight: 'bold'}]}>Working {units || 'Time/Distance'}</Text>
                    <Text style={[cellStyle, {width: '95px', fontWeight: 'bold', borderRight: 0}]}>Date</Text>
                </View>
                {list.map((val, ind) => {
                    const {fuel_usage, working_hrs_or_km, date} = val;
                    return <View key={ind} style={[styles.tableRow, styles.flexRow, {borderBottom: '1px solid #eee'}, (th && ind === 0 ? styles.tableEm: {})]}>
                        <Text style={cellNumStyle}>{ind + 1}</Text>
                        <Text style={[cellStyle, {flexGrow: 1}]}>{fuel_usage}l / week</Text>
                        <Text style={[cellStyle, {width: '140px'}]}>{working_hrs_or_km}{unitsShort[units] || 'hrs/km'} / week</Text>
                        <Text style={[cellStyle, {width: '95px', borderRight: 0}]}>{Dates.formatDate(date) || 'N/A'}</Text>
                    </View>;
                })}
            </View>;
        };
        
        return <Page size="A4" style={styles.page}>
            <View style={styles.content}>
                <View style={[styles.contentPanel, {textAlign: "left"}]}>
                    <Text style={styles.headingPoint}>MONITORING PLAN</Text>
                    <View style={[styles.flexColumn]}>
                        <Text style={{marginVertical: '5px', fontSize: '11px', fontWeight: 'bold'}}>Fuel & {units || 'Time/Distance'} Usage Statistics</Text>
                        {chartImgSrc && <Image style={[styles.copyPic, {marginTop: 0, maxWidth: '800px', maxHeight: '450px'}]} src={chartImgSrc}/>}
                    </View>
                    <View style={[styles.flexColumn]}>
                        <Text style={{marginVertical: '5px', fontSize: '11px', fontWeight: 'bold'}}>Fuel & {units || 'Time/Distance'} Usage History</Text>
                        {monitoring_plan_list && <Table th col={['50%', '50%']} list={monitoring_plan_list}/>}
                        {!monitoring_plan_list && <Text style={{padding: 10, backgroundColor: '#fff'}}>N/A</Text>}
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

// <editor-fold defaultstate="collapsed" desc="PageMaintenancePlanDetails">
@observer
class PageMaintenancePlanDetails extends React.Component {
    
    @observable state = {
        chartImgSrc: null
    };
    
    componentDidMount() {
        const {units, maintenance_plan_list: list} = this;
        if(list.isEmpty()) {
            return;
        }
        const options = createMonitoringPlanStats(list, units);   
        
        const container = document.createElement('div');
        container.id = 'PageMaintenancePlanDetails';
        container.style.width = '800px';
        container.style.height = '450px';
        const {body} = document;
        body.appendChild(container);                     
                     
        const chart = new CanvasJS.Chart(container.id, options);
        chart.render();
        
        setTimeout(() => {
            const canvas = container.querySelector('canvas');
            const src = canvas.toDataURL('image/jpeg');
            this.state.chartImgSrc = src;
            body.removeChild(container);
        }, 500);
    }
    
    get maintenance_plan_list() {
        const {data: {maintenance_plan}} = this.item;
        return (maintenance_plan && maintenance_plan.list) || [];
    }
    
    get units() {
        const {data: {asset_type}} = this.item;
        return asset_type === 'Plant' ? 'Time' : 'Distance';
    }
    
    get item() {
        return this.props.item;
    }
    
    render() {
        const {
            data: {
                asset_type,
                //9
                maintenance_plan
            }
        } = this.props.item;
        if(!maintenance_plan) return null;
        
        const units = asset_type === 'Plant' ? 'Time' : 'Distance';
        const {chartImgSrc} = this.state;
        
        const Table = ({th, col, list}) => {
            const cellNumStyle = {flexShrink: 1, borderRight: '1px solid #eee', width: '25px', fontSize: '11px', fontWeight: 'bold', padding: '5px'};
            const cellStyle = {flexShrink: 1, borderRight: '1px solid #eee', fontSize: '11px', padding: '5px'};
            return <View style={[styles.table, {padding: '2px'}]}>
                <View style={[styles.flexRow, {backgroundColor: '#fafafa', width: '100%'}]}>
                    <Text style={cellNumStyle}>#</Text>
                    <Text style={[cellStyle, {flexGrow: 1, fontWeight: 'bold'}]}>Reason For Service</Text>
                    <Text style={[cellStyle, {width: '140px', fontWeight: 'bold'}]}>Service {units || 'Time/Distance'}</Text>
                    <Text style={[cellStyle, {width: '95px', fontWeight: 'bold', borderRight: 0}]}>Service Date</Text>
                </View>
                {list.map((val, ind) => {
                    const {reason_for_service, service_hrs_or_km, service_date} = val;
                    return <View key={ind} style={[styles.tableRow, styles.flexRow, {borderBottom: '1px solid #eee'}, (th && ind === 0 ? styles.tableEm: {})]}>
                        <Text style={cellNumStyle}>{ind + 1}</Text>
                        <Text style={[cellStyle, {flexGrow: 1}]}>{reason_for_service}</Text>
                        <Text style={[cellStyle, {width: '140px'}]}>{service_hrs_or_km}{unitsShort[units] || 'hrs/km'}</Text>
                        <Text style={[cellStyle, {width: '95px', borderRight: 0}]}>{Dates.formatDate(service_date) || 'N/A'}</Text>
                    </View>;
                })}
            </View>;
        };
        
        const {list, next_service_hrs_or_km} = maintenance_plan;
        
        return <Page size="A4" style={styles.page}>
            <View style={styles.content}>
                <View style={[styles.contentPanel, {textAlign: "left"}]}>
                    <Text style={styles.headingPoint}>MAINTENANCE PLAN</Text>
                    <Panel title="Next Service Details" value={next_service_hrs_or_km}/>
                    <View style={[styles.flexColumn]}>
                        <Text style={{marginVertical: '5px', fontSize: '11px', fontWeight: 'bold'}}>Maintenance Statistics</Text>
                        {chartImgSrc && <Image style={[styles.copyPic, {marginTop: 0, maxWidth: '800px', maxHeight: '450px'}]} src={chartImgSrc}/>}
                    </View>
                    <View style={[styles.flexColumn]}>
                        <Text style={{marginVertical: '5px', fontSize: '11px', fontWeight: 'bold'}}>Maintenance History</Text>
                        {list && <Table th col={['50%', '50%']} list={list}/>}
                        {!list && <Text style={{padding: 10, backgroundColor: '#fff'}}>N/A</Text>}
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

// <editor-fold defaultstate="collapsed" desc="PageCalibrationRecordDetails">
@observer
class PageCalibrationRecordDetails extends React.Component {
    render() {
        const {
            data: {
                //10
                calibration_record
            }
        } = this.props.item;
        if(!calibration_record) return null;
        
        const {list, next_calibration_interval, next_calibration_date} = calibration_record;
        
        const Table = ({th, col, list}) => {
            const cellNumStyle = {flexShrink: 1, borderRight: '1px solid #eee', width: '25px', fontSize: '11px', fontWeight: 'bold', padding: '5px'};
            const cellStyle = {flexShrink: 1, borderRight: '1px solid #eee', fontSize: '11px', padding: '5px'};
            return <View style={[styles.table, {padding: '2px'}]}>
                <View style={[styles.flexRow, {backgroundColor: '#fafafa', width: '100%'}]}>
                    <Text style={cellNumStyle}>#</Text>
                    <Text style={[cellStyle, {flexGrow: 1, fontWeight: 'bold'}]}>Calibrating Company</Text>
                    <Text style={[cellStyle, {width: '120px', fontWeight: 'bold'}]}>Reference Standard</Text>
                    <Text style={[cellStyle, {width: '100px', fontWeight: 'bold'}]}>Certificate No.</Text>
                    <Text style={[cellStyle, {width: '95px', fontWeight: 'bold', borderRight: 0}]}>Calibration Date</Text>
                </View>
                {list.map((val, ind) => {
                    const {calibrating_company, reference_standard, certificate_num, calibration_date} = val;
                    return <View key={ind} style={[styles.tableRow, styles.flexRow, {borderBottom: '1px solid #eee'}, (th && ind === 0 ? styles.tableEm: {})]}>
                        <Text style={cellNumStyle}>{ind + 1}</Text>
                        <Text style={[cellStyle, {flexGrow: 1}]}>{calibrating_company || 'N/A'}</Text>
                        <Text style={[cellStyle, {width: '120px'}]}>{reference_standard || 'N/A'}</Text>
                        <Text style={[cellStyle, {width: '100px'}]}>{certificate_num || 'N/A'}</Text>
                        <Text style={[cellStyle, {width: '95px', borderRight: 0}]}>{Dates.formatDate(calibration_date) || 'N/A'}</Text>
                    </View>;
                })}
            </View>;
        };
        
        return <Page size="A4" style={styles.page}>
            <View style={styles.content}>
                <View style={[styles.contentPanel, {textAlign: "left"}]}>
                    <Text style={styles.headingPoint}>CALIBRATION RECORD</Text>
                    <View style={[styles.flexRow]}>
                        <Panel title="Calibration Interval" value={next_calibration_interval} colStyle={{width: '50%', borderRight: '1px dotted #eee'}}/>
                        <Panel title="Next Calibration Date" value={next_calibration_date} type="date" colStyle={{width: '50%'}}/>
                    </View>
                    <View style={[styles.flexColumn]}>
                        <Text style={{marginVertical: '5px', fontSize: '11px', fontWeight: 'bold'}}>Calibration History</Text>
                        {list && <Table th col={['50%', '50%']} list={list}/>}
                        {!list && <Text style={{padding: 10, backgroundColor: '#fff'}}>N/A</Text>}
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
    PageAssetPics,
    PagePurchaseDetails, PageDepreciationDetails, PageWorkManualDocDetails, PageWorkProcedureDocDetails, PageClearanceCertificateDocDetails, PageOtherDocDetails,
    PageMonitoringPlanDetails, PageMaintenancePlanDetails, PageCalibrationRecordDetails
};
//573