// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {findDOMNode} from 'react-dom';
import {observer} from 'mobx-react';
import {autorun, computed, observable} from 'mobx';

import Form from 'utils/Form';
import {execWhen} from 'utils/Utils';
import {AProfileDialog} from 'components/dialogs';
import {Button, ProfileField, RowOrgs, UploadButton} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import {CONSTANTS, CurrentDistanceOrTime, FutureMaintenanceDistanceOrTime} from './AssetComponents';

import EditToolDialog from './EditToolDialog.js';

import ProfilePDFReader from '../../printers/ProfilePDFReader';
import style from "./ProfileToolDialog.lazy.css";
import {Sign} from "views/plugins/plugin_sheq_assist/17_Incident_Investigation/dialogs/ManHourComponents";
import {MonitoringPlanStats} from "./AssetStats";
import {
    NewCalibrationRecordTable,
    NewDocumentTable,
    NewMaintenancePlanTable,
    NewMonitoringPlanFuelUsageTable,
    NewMonitoringPlanWorkingHrsOrKmTable,
    NewRegisterTable
} from "./AssetTables";
import {findByIdAsset} from "mutations/findById";
import InspectionTabs from "./InspectionTabs";
import LinkedAssetsDetailsSection from "./LinkedAssetsDetailsSection";
import ImageSection from "components/FormComponents/ImageSection";
import {upsertAssetPhoto} from "mutations/upsert";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfileToolDialog";
    findById = findByIdAsset;

    constructor(props) {
        super(props, style);
    }

    @computed
    get title() {
        if (!this.item) {
            return "Asset";
        }
        const {written_off: removed, status} = this.item.data;
        return `Asset (${removed ? "Removed" : status || "Active"})`;
    }

    get topButtonsHiddenDelete() {
        const {written_off: removed} = this.item.data;
        return removed;
    }

    // onSaveAsPDF(e, btn) {
    //     this.refs.controls.onSaveAsPDF(e, btn);
    // }

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

        this.onFormChange = this.onFormChange.bind(this);

        this.form = new Form();
    }

    // </editor-fold>

    @computed get item() {
        return this.props.state.item;
    }

    //</editor-fold>

    //<editor-fold desc="componentDidMount">
    componentDidMount() {
        const {dialog} = this.props;

        autorun(async () => {
            if (!this.item) return;

            const {written_off: removed, status} = this.item.data;
            const node = await dialog.execWhen(() => dialog.getTitleDOMNode());
            const jqEl = $(node);

            if (removed) {
                jqEl.addClass('removed');
                jqEl.removeClass('active');
            } else {
                jqEl.addClass('active');
                jqEl.removeClass('removed');

                if (status === 'In Storage') {
                    jqEl.addClass('green');
                } else if (status === 'Checked Out') {
                    jqEl.addClass('yellow');
                } else if (status === 'Loaned Out') {
                    jqEl.addClass('orange');
                } else if (status === 'Out For Repair') {
                    jqEl.addClass('blue');
                } else {

                }
            }
        });

        // execWhen(() => this.refs.maintenance_plan_list &&
        //     this.refs.next_service_hrs_or_km &&
        //     this.refs.monitoring_plan_working_distance_or_time_list &&
        //     this.refs.monitoring_plan_fuel_usage_list &&
        //     //
        //     this.refs.monitoring_plan_stats_working_distance_or_time &&
        //     this.refs.monitoring_plan_stats_fuel_usage
        // ).then(() => {
        //     const {asset_type, maintenance_plan = {}} = this.item.data;
        //     const {next_service_hrs_or_km: __next_service_hrs_or_km} = maintenance_plan;
        //
        //     const {
        //         maintenance_plan_list,
        //         next_service_hrs_or_km,
        //         monitoring_plan_working_distance_or_time_list,
        //         monitoring_plan_fuel_usage_list,
        //         //
        //         monitoring_plan_stats_working_distance_or_time,
        //         monitoring_plan_stats_fuel_usage
        //     } = this.refs;
        //     const units = asset_type === 'Plant' ? 'Time' : 'Distance';
        //     maintenance_plan_list.setUnits(units);
        //     next_service_hrs_or_km.setPlaceholder('Next Service ' + units);
        //     monitoring_plan_working_distance_or_time_list.setUnits(units);
        //     monitoring_plan_fuel_usage_list.setUnits(units);
        //     //
        //     monitoring_plan_stats_working_distance_or_time.setUnits(units);
        //     monitoring_plan_stats_fuel_usage.setUnits(units);
        //
        //     this.state.next_service_hrs_or_km = isNullable(__next_service_hrs_or_km) ? 0 : parseInt(__next_service_hrs_or_km);
        // });

        const rowIdx = this.props.dialog.extraProp("rowIdx");
        if (rowIdx) {
            execWhen(() => {
                try {
                    return !!findDOMNode(this);
                } catch (e) {
                    return;
                }
            }).then(() => {
                this.props.onFormGoto(rowIdx + 1);
            });
        }
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onFormChange">
    onFormChange(idx) {
        const {dialog} = this.props;
        switch (idx) {
            case CONSTANTS.REGISTER + 1:
            case CONSTANTS.INSPECTIONS + 1:
                dialog.cssWidth = '1700px';
                break;
            case CONSTANTS.DOCUMENTS + 1:
                dialog.cssWidth = '1400px';
                break;
            default:
                dialog.cssWidth = '1100px';
                break;
        }
        return true;
    }

    // </editor-fold>

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

    // <editor-fold defaultstate="collapsed" desc="onAddMonitoringService, onAddMaintenanceService, onAddCalibrationService">
    onAddMonitoringService(e, el) {
        this.refs.editDialog.extraProp('rowIdx', CONSTANTS.MONITORING).open(this.item);
    }

    onAddMaintenanceService(e, el) {
        this.refs.editDialog.extraProp('rowIdx', CONSTANTS.MAINTENANCE).open(this.item);
    }

    // </editor-fold>

    onAddCalibrationService(e, el) {
        this.refs.editDialog.extraProp('rowIdx', CONSTANTS.CALIBRATION).open(this.item);
    }

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        if (!this.item) {
            return null;
        }

        const {
            props: {
                onFormNext, onFormBack, onFormOpen, onFormChange,
                dialog,
            },
            item, item: {
                id, data: {
                    created_at,
                    status/*In Storage | Checked Out | Loaned Out | Out For Repair*/,
                    statusVal,
                    written_off,
                    client,
                    project,
                    site,
                    //1 done
                    asset_detail: {
                        owning_company,
                        name,
                        asset_type,
                        desc,
                        manufacturer,
                        model,
                        reg_num,
                        serial_num,
                        location,
                        toolkit,
                        condition,
                        barcode,
                        qr_code,
                        notes,
                    },
                    //2 done
                    photo_list,
                    //3 done
                    responsible_person,
                    //4 done
                    doc_list,
                    //5 done
                    purchase_info,
                    //6 done
                    depreciation,
                    //7 done
                    monitoring_plan_list,
                    //8 done
                    maintenance_plan_list,
                    //9 done
                    calibration_record_list,
                    //11
                    inspection_template_list = [],
                    inspection_list = [],
                    //12
                    register_list = [],
                }
            }
        } = this;

        const {isContractor, isConsultant, isEmployee} = storage.is;

        //5 done
        const {
            // id,
            acquisition_date,
            acquisition_value,
            vendor,
            warranty_expiry,
            reference_num,
            warranty_certificate,
        } = purchase_info || {};

        //6 done
        const {
            // id,
            depreciation_method,
            asset_cost,
            salvage_value,
            depreciation_years,
            depreciation_factor,
            partial_year_depreciation,
        } = depreciation || {};

        //7 done
        const [monitoring_plan_item] = monitoring_plan_list || [];
        const {
            // id,
            fuel_usage_list,
            working_distance_or_time_list,
        } = monitoring_plan_item || {};

        //8 done
        const [maintenance_plan_item] = maintenance_plan_list || [];
        const {
            // id,
            next_service_hrs_or_km,
            plan_list,
        } = maintenance_plan_item || {};

        //9 done
        const [calibration_record_item] = calibration_record_list || [];
        const {
            // id,
            next_calibration_interval,
            next_calibration_date,
            calibration_list,
        } = calibration_record_item || {};

        const rowIdx = dialog.extraProp('rowIdx');
        const docActiveId = dialog.extraProp('docActiveId');

        console.log('asset', item);
        console.log('doc_list', doc_list && doc_list.slice());
        console.log('monitoring_plan_item', monitoring_plan_item);
        console.log('maintenance_plan_item', maintenance_plan_item);
        console.log('calibration_record_item', calibration_record_item);

        return <>
            <FormControls>
                <RowOrgs
                    readonly
                    client={client}
                    project={project}
                    site={site}
                    active={rowIdx === 0 || !rowIdx}
                    onFormOpen={onFormOpen}
                    onFormBack={onFormBack}
                    onFormNext={onFormNext}
                    onFormChange={onFormChange}
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

                        <ProfileField name="barcode" value={barcode}
                                      placeholder="Barcode"/>
                        <ProfileField name="qr_code" value={qr_code}
                                      placeholder="QR Code"/>

                        <ProfileField name="notes" value={notes} type="textarea" placeholder="Notes"
                                      className="col-lg-12"/>
                    </Row>
                </RowOrgs>
                <Row
                    rendered
                    idx={2}
                    title="2. Asset Photo(s)"
                    className="row-photo"
                    sectionClassName="h-550 -margin-l-10 -margin-t-5 -margin-b-10 w-full-calc-add-20"
                    onFormOpen={onFormOpen}
                    onFormBack={onFormBack}
                    onFormNext={onFormNext}
                    onFormChange={onFormChange}
                >
                    <ImageSection
                        listName="photo_list"
                        item_id_key="asset_id"
                        onInsert={upsertAssetPhoto}
                        onUpdate={upsertAssetPhoto}
                        item={item}
                        embeddedEmployee={this.item}
                        isEmbedded
                    />
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
                                  renderer={v => v.full_name}
                                  placeholder="Responsible Person" className="col-lg-12"/>
                </Row>
                <Row
                    rendered
                    active={rowIdx === CONSTANTS.DOCUMENTS}
                    idx={CONSTANTS.DOCUMENTS}
                    title={`${CONSTANTS.DOCUMENTS}. Documents`}
                    onFormOpen={onFormOpen}
                    onFormBack={onFormBack}
                    onFormNext={onFormNext}
                    onFormChange={onFormChange}
                >
                    <NewDocumentTable ref="doc_list" name="doc_list" defaultValue={doc_list || []}
                                      docActiveId={docActiveId}
                                      readonly/>
                </Row>
                <Row
                    rendered
                    idx={5}
                    title="5. Purchase Info."
                    onFormOpen={onFormOpen}
                    onFormBack={onFormBack}
                    onFormNext={onFormNext}
                    onFormChange={onFormChange}
                >
                    <ProfileField name="acquisition_date" value={purchase_info && purchase_info.acquisition_date}
                                  type="date" placeholder="Date of Purchase" className="col-lg-6"/>
                    <ProfileField name="acquisition_value"
                                  value={purchase_info && purchase_info.acquisition_value && purchase_info.acquisition_value.toCurrency('R')}
                                  type="number" placeholder="Asset Cost" className="col-lg-6"/>
                    <ProfileField name="vendor" value={purchase_info && purchase_info.vendor} placeholder="Vendor"
                                  className="col-lg-6"/>
                    <ProfileField name="reference_num" value={purchase_info && purchase_info.reference_num}
                                  placeholder="Purchase Reference No." className="col-lg-6"/>
                    <ProfileField name="warranty_expiry" value={purchase_info && purchase_info.warranty_expiry}
                                  type="date" placeholder="Warranty Expiry Date" className="col-lg-6"/>
                    <UploadButton name="warranty_certificate"
                                  defaultValue={purchase_info && purchase_info.warranty_certificate}
                                  buttonTitle="Warranty Certificate"
                                  type={['PDF', 'Word']}
                                  showOnlyIcon
                                  className="col-lg-6"
                                  readonly/>
                </Row>
                <Row
                    rendered
                    idx={6}
                    title="6. Depreciation"
                    onFormOpen={onFormOpen}
                    onFormBack={onFormBack}
                    onFormNext={onFormNext}
                    onFormChange={onFormChange}
                >
                    <ProfileField name="depreciation_method"
                                  value={depreciation_method}
                                  placeholder="Depreciation Method" className="col-lg-12"/>
                    <ProfileField name="asset_cost"
                                  value={depreciation && depreciation.asset_cost && depreciation.asset_cost.toCurrency('R')}
                                  placeholder="Asset Cost" className="col-lg-6"/>
                    <ProfileField name="salvage_value"
                                  value={salvage_value && salvage_value.toCurrency('R')}
                                  placeholder="Salvage Value"
                                  desc="In regards to depreciation, salvage value (sometimes called residual or scrap value) is the estimated worth of an asset at the end of its useful life. If the salvage value of an asset is known (such as the amount it can be sold as for parts at the end of its life), the cost of the asset can subtract this value to find the total amount that can be depreciated. Assets with no salvage value will have the same total depreciation as the cost of the asset."
                                  className="col-lg-6"/>
                    <ProfileField name="depreciation_years" value={depreciation_years}
                                  renderer={v => v ? "Yes" : "No"} placeholder="Depreciation Years"/>
                    <ProfileField name="depreciation_factor"
                                  value={depreciation_factor}
                                  placeholder="Depreciation Factor" desc="Depreciation Percentage"/>
                    <ProfileField name="partial_year_depreciation"
                                  value={partial_year_depreciation}
                                  placeholder="Partial Year Depreciation?" className="col-lg-12"/>
                </Row>
                <Row
                    rendered
                    active={rowIdx === CONSTANTS.MONITORING}
                    idx={CONSTANTS.MONITORING}
                    title={`${CONSTANTS.MONITORING}. Monitoring Plan`}
                    onFormOpen={onFormOpen}
                    onFormBack={onFormBack}
                    onFormNext={onFormNext}
                    onFormChange={onFormChange}
                >
                    <FormControls>
                        <Row
                            rendered
                            idx={CONSTANTS.MONITORING + 0.1}
                            title={`${CONSTANTS.MONITORING}.1 Working Distance/Time`}
                            sectionClassName="w-full-calc-add-20 -margin-l-10 -margin-t-5"
                            onFormOpen={onFormOpen}
                            onFormNext={onFormNext}
                        >
                            <NewMonitoringPlanWorkingHrsOrKmTable
                                ref="monitoring_plan_working_distance_or_time_list"
                                name="monitoring_plan_working_distance_or_time_list"
                                state={this.state}
                                asset={item}
                                defaultValue={working_distance_or_time_list || []}
                                readonly
                            />
                            <MonitoringPlanStats
                                ref="monitoring_plan_stats_working_distance_or_time"
                                name='working_distance_or_time_list'
                                item={item}
                            />
                        </Row>
                        <Row
                            rendered
                            idx={CONSTANTS.MONITORING + 0.2}
                            title={`${CONSTANTS.MONITORING}.2 Fuel Usage`}
                            sectionClassName="w-full-calc-add-20 -margin-l-10 -margin-t-5"
                            onFormOpen={onFormOpen}
                            onFormBack={onFormBack}
                        >
                            <NewMonitoringPlanFuelUsageTable
                                ref="monitoring_plan_fuel_usage_list"
                                name="monitoring_plan_fuel_usage_list"
                                state={this.state}
                                asset={item}
                                defaultValue={fuel_usage_list || []}
                                readonly
                            />
                            <MonitoringPlanStats
                                ref="monitoring_plan_stats_fuel_usage"
                                name='fuel_usage_list'
                                item={item}
                            />
                        </Row>
                        {!written_off && <Row
                            rendered
                            activeAlways
                            idx={CONSTANTS.MONITORING + 0.3}
                            title={`Add Monitoring Service`}
                        >
                            <Button className="btn btn-primary border-radius-20 hor-center margin-t-20 margin-b-10"
                                    onClick={this.onAddMonitoringService}>
                                <i className="fa fa-plus"/> Add Monitoring Service
                            </Button>
                        </Row>}
                    </FormControls>
                </Row>
                <Row
                    rendered
                    active={rowIdx === CONSTANTS.MAINTENANCE}
                    idx={CONSTANTS.MAINTENANCE}
                    title={`${CONSTANTS.MAINTENANCE}. Maintenance Plan`}
                    onFormOpen={onFormOpen}
                    onFormBack={onFormBack}
                    onFormNext={onFormNext}
                    onFormChange={onFormChange}
                >
                    <NewMaintenancePlanTable ref="maintenance_plan_list" name="maintenance_plan_list"
                                             asset={this.item}
                                             defaultValue={plan_list || []}
                                             readonly/>

                    {!written_off && <>
                        <br/>
                        <Button className="btn btn-primary border-radius-20 hor-center margin-t-0"
                                onClick={this.onAddMaintenanceService}>
                            <i className="fa fa-plus"/> Add Maintenance Service
                        </Button>
                        <br/>
                        <hr className="margin-t-0 margin-b-0"/>
                    </>}

                    <label className="hor-center margin-t-10 padding-t-10 margin-b-0">Next Service Details</label>
                    <div className="flex grid-gap-10 margin-t-20 margin-b-10 hor-center flex-center">
                        <CurrentDistanceOrTime state={this.state}/>
                        <Sign className='Sign margin-t-0' value='+'/>
                        <ProfileField ref="next_service_hrs_or_km" name="next_service_hrs_or_km"
                                      value={next_service_hrs_or_km}
                                      placeholder="Next Service Hours/Kilometres" className="col-lg-12"/>
                        <Sign className='Sign margin-t-0' value='='/>
                        <FutureMaintenanceDistanceOrTime state={this.state}/>
                    </div>
                </Row>
                <Row
                    rendered
                    active={rowIdx === CONSTANTS.CALIBRATION}
                    idx={CONSTANTS.CALIBRATION}
                    title={`${CONSTANTS.CALIBRATION}. Calibration Record`}
                    onFormOpen={onFormOpen}
                    onFormBack={onFormBack}
                    onFormNext={onFormNext}
                    onFormChange={onFormChange}
                >
                    <NewCalibrationRecordTable name="calibration_record_list"
                                               defaultValue={calibration_list || []}
                                               readonly/>
                    {!written_off && <>
                        <br/>
                        <Button className="btn btn-primary border-radius-20 hor-center margin-t-0"
                                onClick={this.onAddCalibrationService}>
                            <i className="fa fa-plus"/> Add Calibration Service
                        </Button>
                        <br/>
                        <hr className="margin-t-0 margin-b-0"/>
                    </>}

                    <label className="hor-center margin-t-10 padding-t-10 margin-b-0">Next Calibration Details</label>
                    <ProfileField name="next_calibration_interval"
                                  value={next_calibration_interval}
                                  placeholder="Calibration Interval" className="col-lg-4 pull-left-2"/>
                    <ProfileField name="next_calibration_date" type="date"
                                  value={next_calibration_date}
                                  placeholder="Next Calibration Date" className="col-lg-4"/>
                </Row>
                <Row
                    rendered
                    idx={10}
                    title="10. Linked Assets"
                    onFormOpen={onFormOpen}
                    onFormBack={onFormBack}
                    onFormNext={onFormNext}
                    onFormChange={onFormChange}
                >
                    <FormControls>
                        <Row
                            rendered
                            idx={10.1}
                            title="10.1 Linked Parent Assets"
                            sectionClassName="h-680 -margin-l-10 -margin-t-5 -margin-b-10 w-full-calc-add-20"
                            onFormOpen={onFormOpen}
                            onFormNext={onFormNext}
                        >
                            <LinkedAssetsDetailsSection listName="asset_parent_list" item={item} isEmbedded readonly/>
                        </Row>
                        <Row
                            rendered
                            idx={10.2}
                            title="10.2 Linked Child Assets"
                            sectionClassName="h-680 -margin-l-10 -margin-t-5 -margin-b-10 w-full-calc-add-20"
                            onFormOpen={onFormOpen}
                            onFormBack={onFormBack}
                        >
                            <LinkedAssetsDetailsSection listName="asset_children_list" item={item} isEmbedded readonly/>
                        </Row>
                    </FormControls>
                </Row>
                <Row
                    rendered
                    active={rowIdx === CONSTANTS.INSPECTIONS}
                    idx={CONSTANTS.INSPECTIONS}
                    title={`${CONSTANTS.INSPECTIONS}. Inspections`}
                    sectionClassName="min-h-600"
                    onFormOpen={onFormOpen}
                    onFormBack={onFormBack}
                    onFormNext={onFormNext}
                    onFormChange={onFormChange}
                >
                    <InspectionTabs item={item}/>
                </Row>
                <Row
                    rendered
                    active={rowIdx === CONSTANTS.REGISTER}
                    idx={CONSTANTS.REGISTER}
                    title={`${CONSTANTS.REGISTER}. Register`}
                    sectionClassName="min-h-600"
                    onFormOpen={onFormOpen}
                    onFormBack={onFormBack}
                    onFormChange={onFormChange}
                >
                    <NewRegisterTable ref="register_list" name="register_list" defaultValue={register_list || []}
                                      readonly/>
                </Row>
                {/*<Row*/}
                {/*	rendered*/}
                {/*	idx={12}*/}
                {/*	title="12. Parts Inventory"*/}
                {/*	onFormOpen={onFormOpen}*/}
                {/*	onFormBack={onFormBack}*/}
                {/*	onFormNext={onFormNext}*/}
                {/*>*/}

                {/*</Row>*/}
                {/*<Row*/}
                {/*	rendered*/}
                {/*	idx={13}*/}
                {/*	title="13. Job Cards"*/}
                {/*	onFormOpen={onFormOpen}*/}
                {/*	onFormBack={onFormBack}*/}
                {/*>*/}

                {/*</Row>*/}

                {!isEmployee && <EditToolDialog ref="editDialog"/>}

            </FormControls>
            <ProfilePDFReader ref="pdfReader"/>
        </>;
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
