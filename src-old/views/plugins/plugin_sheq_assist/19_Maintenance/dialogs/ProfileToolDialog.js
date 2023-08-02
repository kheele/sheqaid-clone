// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {findDOMNode} from 'react-dom';
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from '../../../../../utils/Form';
import {execWhen} from '../../../../../utils/Utils';
import {AProfileDialog} from '../../../../../components/dialogs';
import {Button, ProfileField, RowOrgs, UploadButton} from '../../../../../components/inputs';
import {FormControls, Row} from '../../../../../components/FormComponents';
import {CONSTANTS, CurrentDistanceOrTime, FutureMaintenanceDistanceOrTime} from './AssetComponents';

import EditToolDialog from './EditToolDialog.js';

import ProfilePDFReader from '../printers/ProfilePDFReader';
import style from "./ProfileToolDialog.lazy.css";
import {Sign} from "../../17_Incident_Investigation/dialogs/ManHourComponents";
import {MonitoringPlanStats} from "./AssetStats";
import {
    NewCalibrationRecordTable,
    NewMaintenancePlanTable,
    NewMonitoringPlanFuelUsageTable,
    NewMonitoringPlanWorkingHrsOrKmTable
} from "./AssetTables";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfileToolDialog";

    constructor(props) {
        super(props, style);
    }

    title() {
        return "Asset";
    }

    onSaveAsPDF(e, btn) {
        this.refs.controls.onSaveAsPDF(e, btn);
    }

    get controls() {
        return Controls;
    }
}

// </editor-fold>

@observer
class Controls extends React.Component {

    // <editor-fold defaultstate="collapsed" desc="state">
    @observable
    state = {
        lists: {},
        showBarcode: false,
        showQRCode: false
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.onAddMonitoringService = this.onAddMonitoringService.bind(this);
        this.onAddMaintenanceService = this.onAddMaintenanceService.bind(this);
        this.onAddCalibrationService = this.onAddCalibrationService.bind(this);

        this.form = new Form();
    }

    // </editor-fold>

    //<editor-fold desc="componentDidMount">
    componentDidMount() {
        execWhen(() => this.refs.maintenance_plan_list &&
            this.refs.next_service_hrs_or_km &&
            this.refs.monitoring_plan_working_distance_or_time_list &&
            this.refs.monitoring_plan_fuel_usage_list &&
            //
            this.refs.monitoring_plan_stats_working_distance_or_time &&
            this.refs.monitoring_plan_stats_fuel_usage
        ).then(() => {
            const {asset_type, maintenance_plan = {}} = this.item.data;
            const {next_service_hrs_or_km: __next_service_hrs_or_km} = maintenance_plan;

            const {
                maintenance_plan_list,
                next_service_hrs_or_km,
                monitoring_plan_working_distance_or_time_list,
                monitoring_plan_fuel_usage_list,
                //
                monitoring_plan_stats_working_distance_or_time,
                monitoring_plan_stats_fuel_usage
            } = this.refs;
            const units = asset_type === 'Plant' ? 'Time' : 'Distance';
            maintenance_plan_list.setUnits(units);
            next_service_hrs_or_km.setPlaceholder('Next Service ' + units);
            monitoring_plan_working_distance_or_time_list.setUnits(units);
            monitoring_plan_fuel_usage_list.setUnits(units);
            //
            monitoring_plan_stats_working_distance_or_time.setUnits(units);
            monitoring_plan_stats_fuel_usage.setUnits(units);

            this.state.next_service_hrs_or_km = isNullable(__next_service_hrs_or_km) ? 0 : parseInt(__next_service_hrs_or_km);
        });

        const index = this.props.dialog.extraProp("index");
        if (index) {
            execWhen(() => {
                try {
                    return !!findDOMNode(this);
                } catch (e) {
                    return false;
                }
            }).then(() => {
                this.props.onFormGoto(index + 1 + 1);//Another 1 is form renderProfileCover() row
            });
        }
    }

    //</editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onSaveAsPDF">
    onSaveAsPDF(e, btn) {
//        btn.text("Saving As PDF...").disabled();
//        this.printImpl().then(res => {
//            console.log('onSaveAsPDF', res)
//            this.refs.viewReportPDFDialog.open({});
////            infoDialog.open("Record successfully saved as PDF.");
////            infoDialog.close(2000);
//        }).finally(() => {
//            btn.text("Save As PDF").enabled();
//        });  
        this.refs.pdfReader.open(this.item);
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onAddMonitoringService, onAddMaintenanceService, onAddCalibrationService">
    onAddMonitoringService(e, el) {
        this.refs.editDialog.extraProp('index', CONSTANTS.MONITORING).open(this.item);
    }

    onAddMaintenanceService(e, el) {
        this.refs.editDialog.extraProp('index', CONSTANTS.MAINTENANCE).open(this.item);
    }

    onAddCalibrationService(e, el) {
        this.refs.editDialog.extraProp('index', CONSTANTS.CALIBRATION).open(this.item);
    }

    // </editor-fold>

    get item() {
        return this.props.state.item;
    }

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        if (!this.item)
            return null;
        const {
            props: {
                onFormNext, onFormBack, onFormOpen,
                dialog: {renderProfileCover}
            },
            item, item: {
                id, data: {
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
                    //4
                    doc_pdf, doc_pdf_desc, doc_pdf_expiry,
                    //5
                    doc_work_manual, doc_procedure, doc_clearance_certificate,
                    //6
                    purchase_info,
                    //7
                    depreciation,
                    //8
                    monitoring_plan_working_distance_or_time_list, monitoring_plan_fuel_usage_list,
                    //9
                    maintenance_plan,
                    //10
                    calibration_record
                }
            }
        } = this;

        const {isContractor, isConsultant, isEmployee} = storage.is;

        return <FormControls>
            <RowOrgs
                readonly
                client={client}
                project={project}
                site={site}
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <Row
                    rendered
                    idx={1}
                    title="1. Asset Details"
                >
                    <ProfileField name="owning_company" value={owning_company} placeholder="Owning Company Name"
                                  className="col-lg-12"/>
                    <ProfileField name="name" value={name} placeholder="Asset Name"/>
                    <ProfileField name="asset_type" value={asset_type} placeholder="Asset Type"/>
                    <ProfileField name="desc" value={desc} type="textarea" placeholder="Description"
                                  className="col-lg-12"/>

                    <ProfileField name="manufacturer" value={manufacturer} placeholder="Manufacturer"
                                  className="col-lg-6"/>
                    <ProfileField name="model" value={model} placeholder="Model" className="col-lg-6"/>
                    <ProfileField name="reg_num" value={reg_num} placeholder="Registration No."
                                  className="col-lg-6"/>
                    <ProfileField name="serial_num" value={serial_num} placeholder="Serial No."
                                  className="col-lg-6"/>

                    <ProfileField name="location" value={location} placeholder="Location" className="col-lg-12"/>
                    <ProfileField name="toolkit" value={toolkit} placeholder="Toolkit" className="col-lg-6"/>
                    <ProfileField name="condition" value={condition} placeholder="Condition" className="col-lg-6"/>

                    <ProfileField name="barcode_or_qr_code_type" value={barcode_or_qr_code_type}
                                  placeholder="Barcode / QR Code"/>
                    <BarcodeWrapper state={this.state} value={barcode_or_qr_code} type={barcode_or_qr_code_type}/>
                    <QRCodeWrapper state={this.state} value={barcode_or_qr_code} type={barcode_or_qr_code_type}/>

                    <ProfileField name="notes" value={notes} type="textarea" placeholder="Notes"
                                  className="col-lg-12"/>
                </Row>
            </RowOrgs>
            <Row
                rendered
                idx={2}
                title="2. Asset Photo"
                className="row-photo"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <UploadButton name="profile_pic"
                              buttonTitle="Asset Photo"
                              type={['Photo']}
                              defaultValue={profile_pic}
                              showOnlyIcon
                              className="hor-center col-lg-6"
                              readonly/>
            </Row>
            <Row
                rendered
                idx={3}
                title="3. Responsible Person"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <ProfileField name="responsible_person" value={responsible_person}
                              renderer={v => (v.fname || v.data.fname) + ' ' + (v.lname || v.data.lname)}
                              placeholder="Responsible Person" className="col-lg-12"/>
            </Row>
            <Row
                rendered
                idx={4}
                title="4. Document Attachment"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <UploadButton name="doc_pdf"
                              defaultValue={doc_pdf}
                              buttonTitle="Attached Document"
                              type={['PDF', 'Word']}
                              showOnlyIcon
                              readonly
                              className="col-lg-12"/>
                <ProfileField name="doc_pdf_desc" value={doc_pdf_desc} placeholder="Document Description"
                              className="col-lg-12"/>
                <ProfileField name="doc_pdf_expiry" value={doc_pdf_expiry} type="date"
                              placeholder="Document Expiry Date" className="col-lg-12"/>
            </Row>
            <Row
                rendered
                idx={5}
                title="5. Other Document Attachments"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <UploadButton name="doc_work_manual"
                              defaultValue={doc_work_manual}
                              buttonTitle="Work Manual Document"
                              type={['PDF', 'Word']}
                              showOnlyIcon
                              className="col-lg-12"
                              readonly/>
                <UploadButton name="doc_procedure"
                              defaultValue={doc_procedure}
                              buttonTitle="Work Procedure Document"
                              type={['PDF', 'Word']}
                              showOnlyIcon
                              className="col-lg-12"
                              readonly/>
                <UploadButton name="doc_clearance_certificate"
                              defaultValue={doc_clearance_certificate}
                              buttonTitle="Clearance Certificate Document"
                              type={['PDF', 'Word']}
                              showOnlyIcon
                              className="col-lg-12"
                              readonly/>
            </Row>
            <Row
                rendered
                idx={6}
                title="6. Purchase Info."
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <ProfileField name="acquisition_date" value={purchase_info && purchase_info.acquisition_date}
                              type="date" placeholder="Date of Purchase" className="col-lg-6"/>
                <ProfileField name="vendor" value={purchase_info && purchase_info.vendor} placeholder="Vendor"
                              className="col-lg-6"/>
                <ProfileField name="acquisition_value"
                              value={purchase_info && purchase_info.acquisition_value && purchase_info.acquisition_value.toCurrency('R')}
                              type="number" placeholder="Asset Cost" className="col-lg-6"/>
                <ProfileField name="warranty_expiry" value={purchase_info && purchase_info.warranty_expiry}
                              type="date" placeholder="Warranty Expiry Date" className="col-lg-6"/>
                <ProfileField name="reference_num" value={purchase_info && purchase_info.reference_num}
                              placeholder="Purchase Reference No." className="col-lg-12"/>
                <UploadButton name="warranty_certificate"
                              defaultValue={purchase_info && purchase_info.warranty_certificate}
                              buttonTitle="Warranty Certificate"
                              type={['PDF', 'Word']}
                              showOnlyIcon
                              className="col-lg-12"
                              readonly/>
            </Row>
            <Row
                rendered
                idx={7}
                title="7. Depreciation"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <ProfileField name="depreciation_method"
                              value={depreciation && depreciation.depreciation_method}
                              placeholder="Depreciation Method" className="col-lg-12"/>
                <ProfileField name="asset_cost"
                              value={depreciation && depreciation.asset_cost && depreciation.asset_cost.toCurrency('R')}
                              placeholder="Asset Cost" className="col-lg-6"/>
                <ProfileField name="salvage_value"
                              value={depreciation && depreciation.salvage_value && depreciation.salvage_value.toCurrency('R')}
                              placeholder="Salvage Value"
                              desc="In regards to depreciation, salvage value (sometimes called residual or scrap value) is the estimated worth of an asset at the end of its useful life. If the salvage value of an asset is known (such as the amount it can be sold as for parts at the end of its life), the cost of the asset can subtract this value to find the total amount that can be depreciated. Assets with no salvage value will have the same total depreciation as the cost of the asset."
                              className="col-lg-6"/>
                <ProfileField name="depreciation_years" value={depreciation && depreciation.depreciation_years}
                              renderer={v => v ? "Yes" : "No"} placeholder="Depreciation Years"/>
                <ProfileField name="depreciation_factor"
                              value={depreciation && depreciation.depreciation_factor}
                              placeholder="Depreciation Factor" desc="Depreciation Percentage"/>
                <ProfileField name="partial_year_depreciation"
                              value={depreciation && depreciation.partial_year_depreciation}
                              placeholder="Partial Year Depreciation?" className="col-lg-12"/>
            </Row>
            <Row
                rendered
                idx={8}
                title="8. Monitoring Plan"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <NewMonitoringPlanWorkingHrsOrKmTable ref="monitoring_plan_working_distance_or_time_list"
                                                      name="monitoring_plan_working_distance_or_time_list"
                                                      state={this.state}
                                                      defaultValue={monitoring_plan_working_distance_or_time_list || []}
                                                      readonly/>
                <MonitoringPlanStats ref="monitoring_plan_stats_working_distance_or_time"
                                     name='working_distance_or_time_list' state={this.state}/>

                <NewMonitoringPlanFuelUsageTable ref="monitoring_plan_fuel_usage_list"
                                                 name="monitoring_plan_fuel_usage_list"
                                                 state={this.state}
                                                 defaultValue={monitoring_plan_fuel_usage_list || []} readonly/>
                <MonitoringPlanStats ref="monitoring_plan_stats_fuel_usage" name='fuel_usage_list'
                                     state={this.state}/>
                <br/>
                <br/>
                <Button className="btn btn-primary hor-center margin-b-10" text="Add Monitoring Service"
                        onClick={this.onAddMonitoringService}/>
            </Row>
            <Row
                rendered
                idx={9}
                title="9. Maintenance Plan"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <NewMaintenancePlanTable ref="maintenance_plan_list" name="maintenance_plan_list"
                                         asset={this.item}
                                         defaultValue={maintenance_plan && maintenance_plan.list || []}
                                         readonly/>
                <br/>
                <br/>
                <Button className="btn btn-primary hor-center margin-b-10" text="Add Maintenance Service"
                        onClick={this.onAddMaintenanceService}/>
                <hr className="margin-t-10 margin-b-0"/>

                <label className="hor-center margin-t-10 margin-b-0">Next Service Details</label>
                <div className="flex grid-gap-10 w-680 margin-t-20 margin-b-10 hor-center flex-center">
                    <CurrentDistanceOrTime state={this.state}/>
                    <Sign className='Sign margin-t-0' value='+'/>
                    <ProfileField ref="next_service_hrs_or_km" name="next_service_hrs_or_km"
                                  value={maintenance_plan && maintenance_plan.next_service_hrs_or_km}
                                  placeholder="Next Service Hours/Kilometres" className="col-lg-12"/>
                    <Sign className='Sign margin-t-0' value='='/>
                    <FutureMaintenanceDistanceOrTime state={this.state}/>
                </div>
            </Row>
            <Row
                rendered
                idx={10}
                title="10. Calibration Record"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
            >
                <NewCalibrationRecordTable name="calibration_record_list"
                                           defaultValue={calibration_record && calibration_record.list || []}
                                           readonly/>
                <br/>
                <br/>
                <Button className="btn btn-primary hor-center margin-b-10" text="Add Calibration Service"
                        onClick={this.onAddCalibrationService}/>
                <hr className="margin-t-10 margin-b-0"/>

                <label className="hor-center margin-t-10 margin-b-0">Next Calibration Details</label>
                <ProfileField name="next_calibration_interval"
                              value={calibration_record && calibration_record.next_calibration_interval}
                              placeholder="Calibration Interval" className="col-lg-6"/>
                <ProfileField name="next_calibration_date" type="date"
                              value={calibration_record && calibration_record.next_calibration_date}
                              placeholder="Next Calibration Date" className="col-lg-6"/>
            </Row>
            <Row
                rendered
                idx={11}
                title="11. Parts Inventory"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >

            </Row>
            <Row
                rendered
                idx={12}
                title="12. Job Cards"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
            >

            </Row>

            {!isEmployee && <EditToolDialog ref="editDialog"/>}
            <ProfilePDFReader ref="pdfReader"/>
        </FormControls>;
    }

    // </editor-fold>
}

// <editor-fold defaultstate="collapsed" desc="BarcodeWrapper">
@observer
class BarcodeWrapper extends React.Component {

    render() {
        const {type, value} = this.props;
        return type === 'Barcode' &&
            <ProfileField name="barcode_or_qr_code" value={value} type="text" placeholder="Barcode" className="col-lg-6"
                          onChange={this.props.onChange}/>;
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="QRCodeWrapper">
@observer
class QRCodeWrapper extends React.Component {

    render() {
        const {type, value} = this.props;
        return type === 'QR Code' &&
            <ProfileField name="barcode_or_qr_code" value={value} type="text" placeholder="QR Code" className="col-lg-6"
                          onChange={this.props.onChange}/>;
    }
}

// </editor-fold>

export default ProfileDialog;
