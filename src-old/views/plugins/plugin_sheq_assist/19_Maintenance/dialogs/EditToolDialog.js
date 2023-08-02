//<editor-fold desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import {ShouldUpdate} from '../../../../../utils/Utils';

import {
    ClearableInput,
    RowOrgs,
    SelectAssetTypeInput,
    SelectEmployeeInput,
    UploadButton
} from '../../../../../components/inputs';
import {FormControls, Row} from '../../../../../components/FormComponents';
import {
    BarcodeWrapper,
    CurrentDistanceOrTime,
    FutureMaintenanceDistanceOrTime,
    QRCodeWrapper,
    SelectWrapper
} from './AssetComponents';
import {AEditDialog} from '../../../../../components/dialogs';

import style from "./EditToolDialog.lazy.css";
import {Sign} from "../../17_Incident_Investigation/dialogs/ManHourComponents";
import {AControls} from "./AssetControls";
import {MonitoringPlanStats} from "./AssetStats";
import {
    NewCalibrationRecordTable,
    NewMaintenancePlanTable,
    NewMonitoringPlanFuelUsageTable,
    NewMonitoringPlanWorkingHrsOrKmTable
} from "./AssetTables";
//</editor-fold>

//<editor-fold desc="Dialog">
@observer
class EditToolDialog extends AEditDialog {
    pageKey = "EditToolDialog";

    constructor(props) {
        super(props, style);
    }

    get title() {
        return "Edit Asset";
    }

    get controls() {
        return Controls;
    }
}

//</editor-fold>

@observer
class Controls extends AControls {

    constructor(props) {
        super(props);
    }

    //<editor-fold desc="onSubmit">
    onSubmit(e, btn, onSaved) {
        const {form, item: {data: old_data}} = this;

        if (!form.isValid('name')) {
            infoDialog.open('Asset Name is required');
            return;
        }
        if (!form.isValid('asset_type')) {
            infoDialog.open('Asset Type is required');
            return;
        }

        const {
            site,
            project,
            client,
            //1
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
            barcode_or_qr_code_type,
            barcode_or_qr_code,
            notes,
            //2
            profile_pic,
            //3
            responsible_person,
            //4
            doc_pdf,
            doc_pdf_desc,
            doc_pdf_expiry,
            //5
            doc_work_manual,
            doc_procedure,
            doc_clearance_certificate,
            //6
            acquisition_date,
            vendor,
            acquisition_value,
            warranty_expiry,
            reference_num,
            warranty_certificate,
            //7
            depreciation_method,
            asset_cost,
            salvage_value,
            depreciation_years,
            depreciation_factor,
            partial_year_depreciation,
            //8
            monitoring_plan_working_distance_or_time_list,
            monitoring_plan_fuel_usage_list,
            //9
            maintenance_plan_list,
            next_service_hrs_or_km,
            //10
            calibration_record_list,
            next_calibration_date,
            next_calibration_interval
        } = form.data;
        const data = {};

        ShouldUpdate.checkClient(data, old_data, client);
        ShouldUpdate.checkProject(data, old_data, project);
        ShouldUpdate.checkSite(data, old_data, site);

        //1
        ShouldUpdate.check(data, old_data, owning_company, 'owning_company');
        ShouldUpdate.check(data, old_data, name, 'name');
        ShouldUpdate.check(data, old_data, asset_type, 'asset_type');

        ShouldUpdate.check(data, old_data, desc, 'desc');
        ShouldUpdate.check(data, old_data, manufacturer, 'manufacturer');
        ShouldUpdate.check(data, old_data, model, 'model');
        ShouldUpdate.check(data, old_data, reg_num, 'reg_num');
        ShouldUpdate.check(data, old_data, serial_num, 'serial_num');
        ShouldUpdate.check(data, old_data, location, 'location');
        ShouldUpdate.check(data, old_data, toolkit, 'toolkit');
        ShouldUpdate.check(data, old_data, condition, 'condition');
        ShouldUpdate.check(data, old_data, barcode_or_qr_code_type, 'barcode_or_qr_code_type');
        ShouldUpdate.check(data, old_data, barcode_or_qr_code, 'barcode_or_qr_code');
        ShouldUpdate.check(data, old_data, notes, 'notes');

        //2
        ShouldUpdate.checkFile(data, old_data, profile_pic, 'profile_pic');

        //3
        ShouldUpdate.checkEmployee(data, old_data, responsible_person, 'responsible_person');

        //4
        ShouldUpdate.checkFile(data, old_data, doc_pdf, 'doc_pdf');
        ShouldUpdate.check(data, old_data, doc_pdf_desc, 'doc_pdf_desc');
        ShouldUpdate.checkDate(data, old_data, doc_pdf_expiry, 'doc_pdf_expiry');

        //5
        ShouldUpdate.checkFile(data, old_data, doc_work_manual, 'doc_work_manual');
        ShouldUpdate.checkFile(data, old_data, doc_procedure, 'doc_procedure');
        ShouldUpdate.checkFile(data, old_data, doc_clearance_certificate, 'doc_clearance_certificate');

        //6
        if (acquisition_date || vendor || acquisition_value || warranty_expiry || reference_num || warranty_certificate) {
            const new_purchase_info = {};
            ShouldUpdate.checkDate(new_purchase_info, old_data.purchase_info, acquisition_date, 'acquisition_date');
            ShouldUpdate.check(new_purchase_info, old_data.purchase_info, vendor, 'vendor');
            ShouldUpdate.check(new_purchase_info, old_data.purchase_info, acquisition_value, 'acquisition_value');
            ShouldUpdate.checkDate(new_purchase_info, old_data.purchase_info, warranty_expiry, 'warranty_expiry');
            ShouldUpdate.check(new_purchase_info, old_data.purchase_info, reference_num, 'reference_num');
            ShouldUpdate.checkFile(new_purchase_info, old_data.purchase_info, warranty_certificate, 'warranty_certificate');
            if (!Object.keys(new_purchase_info).isEmpty()) {
                data.purchase_info = new_purchase_info;
            }
        }

        //7
        if (depreciation_method || asset_cost || salvage_value || depreciation_years || depreciation_factor || isBoolean(partial_year_depreciation)) {
            const new_depreciation = {};
            ShouldUpdate.check(new_depreciation, old_data.depreciation, depreciation_method, 'depreciation_method');
            ShouldUpdate.check(new_depreciation, old_data.depreciation, asset_cost, 'asset_cost');
            ShouldUpdate.check(new_depreciation, old_data.depreciation, salvage_value, 'salvage_value');
            ShouldUpdate.check(new_depreciation, old_data.depreciation, depreciation_years, 'depreciation_years');
            ShouldUpdate.check(new_depreciation, old_data.depreciation, depreciation_factor, 'depreciation_factor');
            ShouldUpdate.check(new_depreciation, old_data.depreciation, partial_year_depreciation, 'partial_year_depreciation');
            if (!Object.keys(new_depreciation).isEmpty()) {
                data.depreciation = new_depreciation;
            }
        }

        //8
        let _monitoring_plan_working_distance_or_time_list;
        if (monitoring_plan_working_distance_or_time_list) {
            _monitoring_plan_working_distance_or_time_list = monitoring_plan_working_distance_or_time_list.map(v => {
                const {working_hrs_or_km_opening, working_hrs_or_km_closing, working_hrs_or_km, date} = v;
                if (date && isDate(date)) {
                    v.date = date.getTime();
                }
                return v;
            });
        }
        ShouldUpdate.checkListToJS(data, old_data, _monitoring_plan_working_distance_or_time_list, 'monitoring_plan_working_distance_or_time_list');
        let _monitoring_plan_fuel_usage_list;
        if (monitoring_plan_fuel_usage_list) {
            _monitoring_plan_fuel_usage_list = monitoring_plan_fuel_usage_list.map(v => {
                const {refilled_fuel, current_hrs_or_km, working_hrs_or_km, date} = v;
                if (date && isDate(date)) {
                    v.date = date.getTime();
                }
                return v;
            });
        }
        ShouldUpdate.checkListToJS(data, old_data, _monitoring_plan_fuel_usage_list, 'monitoring_plan_fuel_usage_list');

        //9
        let _maintenance_plan_list;
        if (maintenance_plan_list) {
            _maintenance_plan_list = maintenance_plan_list.map(v => {
                const {service_hrs_or_km, reason_for_service, service_date} = v;
                if (service_date && isDate(service_date)) {
                    v.service_date = service_date.getTime();
                }
                return v;
            });
        }
        if (_maintenance_plan_list || next_service_hrs_or_km) {
            const new_maintenance_plan = {};
            ShouldUpdate.checkListToJS(new_maintenance_plan, old_data.maintenance_plan, _maintenance_plan_list, 'list');
            ShouldUpdate.check(new_maintenance_plan, old_data.maintenance_plan, next_service_hrs_or_km, 'next_service_hrs_or_km');
            if (!Object.keys(new_maintenance_plan).isEmpty()) {
                data.maintenance_plan = new_maintenance_plan;
            }
        }

        //10
        let _calibration_record_list;
        if (calibration_record_list) {
            _calibration_record_list = calibration_record_list.map(v => {
                const {reference_standard, certificate_num, calibrating_company, calibration_date} = v;
                if (calibration_date && isDate(calibration_date)) {
                    v.calibration_date = calibration_date.getTime();
                }
                return v;
            });
        }
        if (_calibration_record_list || next_calibration_date || next_calibration_interval) {
            const new_calibration_record = {};
            ShouldUpdate.checkListToJS(new_calibration_record, old_data.calibration_record, _calibration_record_list, 'list');
            ShouldUpdate.checkDate(new_calibration_record, old_data.calibration_record, next_calibration_date, 'next_calibration_date');
            ShouldUpdate.check(new_calibration_record, old_data.calibration_record, next_calibration_interval, 'next_calibration_interval');
            if (!Object.keys(new_calibration_record).isEmpty()) {
                data.calibration_record = new_calibration_record;
            }
        }

        console.log(data)

        btn.text("Saving...").disabled();
        neonBinding.events.emit(this.path + "update", this.item.id, data).then(res => {
            console.log("res", res)
            onSaved && onSaved(res);
            infoDialog.open("Record successfully updated.");
            infoDialog.close(2000);
            this.props.close();
        }).finally(() => {
            btn.text("Save").enabled();
        });
    }

    //</editor-fold>

    get item() {
        return this.props.state.item;
    }

    //<editor-fold desc="render">
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

        let responsible_personDefault;
        if (responsible_person) {
            const {fname, lname, data: _data} = responsible_person;
            responsible_personDefault = {
                label: (lname || _data.lname) + ' ' + (fname || _data.fname),
                value: responsible_person
            };
        }

        return <FormControls>
            <RowOrgs
                client={client}
                project={project}
                site={site}
                onChange={this.form.onChange}
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <Row
                    rendered
                    idx={1}
                    title="1. Asset Details"
                >
                    <ClearableInput name="owning_company" type="text" placeholder="Owning Company Name"
                                    defaultValue={owning_company} required
                                    className="col-lg-6 pull-left-3 form-control" onChange={this.form.onChange}/>
                    <ClearableInput name="name" type="text" placeholder="Asset Name" defaultValue={name}
                                    footerDesc="Ex. TLB, Truck, Grader, Van" required
                                    className="col-lg-6 form-control" onChange={this.form.onChange}/>
                    <SelectAssetTypeInput name="asset_type" placeholder="Asset Type..."
                                          defaultValue={asset_type} required
                                          className="col-lg-6 form-control" onChange={this.form.onChange}/>
                    <ClearableInput name="desc" type="textarea" placeholder="Description" defaultValue={desc}
                                    required className="col-lg-12 form-control" onChange={this.form.onChange}/>

                    <SelectWrapper state={this.state} name="manufacturer" placeholder="Manufacturer..."
                                   defaultValue={manufacturer} className="col-lg-6 form-control"
                                   onChange={this.form.onChange} values="manufacturers"/>
                    <SelectWrapper state={this.state} name="model" placeholder="Model..." defaultValue={model}
                                   className="col-lg-6 form-control" onChange={this.form.onChange} values="models"/>
                    <ClearableInput name="reg_num" type="text" placeholder="Registration No." defaultValue={reg_num}
                                    required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                    <ClearableInput name="serial_num" type="text" placeholder="Serial No." defaultValue={serial_num}
                                    required className="col-lg-6 form-control" onChange={this.form.onChange}/>

                    <SelectWrapper state={this.state} name="location" placeholder="Location..."
                                   defaultValue={location} onChange={this.form.onChange}
                                   className="col-lg-12 form-control" values="locations"/>
                    <SelectWrapper state={this.state} name="toolkit" placeholder="Toolkit..." defaultValue={toolkit}
                                   onChange={this.form.onChange} className="col-lg-6 form-control"
                                   values="toolkits"/>
                    <SelectWrapper state={this.state} name="condition" placeholder="Condition..."
                                   defaultValue={condition} onChange={this.form.onChange}
                                   className="col-lg-6 form-control" values="conditions"/>

                    <ClearableInput name="barcode_or_qr_code_type" type="radio" placeholder="Barcode / QR Code"
                                    defaultValue={barcode_or_qr_code_type} required
                                    className="col-lg-7 pull-left-2_5 form-control" onChange={this.form.onChange}
                                    values={this.state.lists.barcode_or_qr_code_types}/>
                    <BarcodeWrapper state={this.state} defaultValue={barcode_or_qr_code}
                                    onChange={this.form.onChange}/>
                    <QRCodeWrapper state={this.state} defaultValue={barcode_or_qr_code}
                                   onChange={this.form.onChange}/>

                    <ClearableInput name="notes" type="textarea" placeholder="Notes" defaultValue={notes} required
                                    className="col-lg-12 form-control" onChange={this.form.onChange}/>
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
                <UploadButton name="profile_pic" buttonTitle="Asset Photo"
                              type={['Photo']}
                              defaultValue={profile_pic}
                              showOnlyIcon
                              className="hor-center col-lg-6" onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={3}
                title="3. Responsible Person"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <SelectEmployeeInput name="responsible_person" placeholder="Responsible Person..."
                                     defaultValue={responsible_personDefault} required
                                     className="col-lg-6 pull-left-3 form-control"
                                     onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={4}
                title="4. Document Attachment"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <UploadButton name="doc_pdf" buttonTitle="Upload Document"
                              type={['PDF', 'Word']}
                              defaultValue={doc_pdf}
                              showOnlyIcon
                              className="col-lg-12"
                              onChange={this.form.onChange}/>
                <ClearableInput name="doc_pdf_expiry" type="date" placeholder="Document Expiry Date..."
                                defaultValue={doc_pdf_expiry} required
                                className="col-lg-4 pull-left-4 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="doc_pdf_desc" type="textarea" placeholder="Document Description"
                                defaultValue={doc_pdf_desc} required className="col-lg-12 form-control"
                                onChange={this.form.onChange}/>
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
                              buttonTitle="Upload Work Manual Document"
                              defaultValue={doc_work_manual}
                              type={['PDF', 'Word']}
                              showOnlyIcon
                              className="col-lg-12"
                              onChange={this.form.onChange}/>
                <UploadButton name="doc_procedure"
                              buttonTitle="Upload Work Procedure Document"
                              defaultValue={doc_procedure}
                              type={['PDF', 'Word']}
                              showOnlyIcon
                              className="col-lg-12"
                              onChange={this.form.onChange}/>
                <UploadButton name="doc_clearance_certificate"
                              buttonTitle="Upload Clearance Certificate Document"
                              defaultValue={doc_clearance_certificate}
                              type={['PDF', 'Word']}
                              showOnlyIcon
                              className="col-lg-12"
                              onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={6}
                title="6. Purchase Info."
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <ClearableInput name="acquisition_date" type="date" placeholder="Date of Purchase..."
                                defaultValue={purchase_info && purchase_info.acquisition_date} required
                                className="col-lg-6 form-control" onChange={this.form.onChange}/>
                <SelectWrapper state={this.state} name="vendor" placeholder="Vendor..."
                               defaultValue={purchase_info && purchase_info.vendor}
                               className="col-lg-6 form-control" onChange={this.form.onChange}
                               values="vendors"/>
                <ClearableInput name="acquisition_value" type="number" placeholder="Asset Cost"
                                defaultValue={purchase_info && purchase_info.acquisition_value} required
                                className="col-lg-6 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="warranty_expiry" type="date" placeholder="Warranty Expiry Date..."
                                defaultValue={purchase_info && purchase_info.warranty_expiry} required
                                className="col-lg-6 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="reference_num" type="text" placeholder="Purchase Reference No."
                                defaultValue={purchase_info && purchase_info.reference_num} required
                                className="col-lg-6 pull-left-3 form-control" onChange={this.form.onChange}/>
                <UploadButton name="warranty_certificate"
                              buttonTitle="Warranty Certificate"
                              type={['PDF', 'Word']}
                              showOnlyIcon
                              defaultValue={purchase_info && purchase_info.warranty_certificate}
                              className="col-lg-12"
                              onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={7}
                title="7. Depreciation"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <ClearableInput name="depreciation_method" type="select" placeholder="Depreciation Method..."
                                defaultValue={depreciation && depreciation.depreciation_method} required
                                className="col-lg-12 form-control" onChange={this.form.onChange}
                                values={this.state.lists.depreciation_methods} returnValue/>
                <ClearableInput ref="asset_cost" name="asset_cost" type="number" placeholder="Asset Cost"
                                isEditable={false} required className="col-lg-6 form-control"
                                onChange={this.form.onChange}/>
                <ClearableInput name="salvage_value" type="number" placeholder="Salvage Value"
                                defaultValue={depreciation && depreciation.salvage_value}
                                desc="In regards to depreciation, salvage value (sometimes called residual or scrap value) is the estimated worth of an asset at the end of its useful life. If the salvage value of an asset is known (such as the amount it can be sold as for parts at the end of its life), the cost of the asset can subtract this value to find the total amount that can be depreciated. Assets with no salvage value will have the same total depreciation as the cost of the asset."
                                required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="depreciation_years" type="number" placeholder="Depreciation Years"
                                defaultValue={depreciation && depreciation.depreciation_years} required
                                className="col-lg-6 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="depreciation_factor" type="number" placeholder="Depreciation Factor"
                                defaultValue={depreciation && depreciation.depreciation_factor} defaultValue={2}
                                desc="Depreciation Percentage" required className="col-lg-6 form-control"
                                onChange={this.form.onChange}/>
                <ClearableInput name="partial_year_depreciation" type="radio"
                                defaultValue={depreciation && depreciation.partial_year_depreciation}
                                placeholder="Partial Year Depreciation?" required
                                className="col-lg-7 pull-left-2_5 form-control" onChange={this.form.onChange}
                                values={this.state.lists.partial_year_depreciations}/>
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
                                                      defaultValue={[...(monitoring_plan_working_distance_or_time_list || []), null]}
                                                      onChange={this.form.onChange}/>
                <MonitoringPlanStats ref="monitoring_plan_stats_working_distance_or_time"
                                     name='working_distance_or_time_list' state={this.state}/>

                <NewMonitoringPlanFuelUsageTable ref="monitoring_plan_fuel_usage_list"
                                                 name="monitoring_plan_fuel_usage_list"
                                                 state={this.state}
                                                 defaultValue={[...(monitoring_plan_fuel_usage_list || []), null]}
                                                 onChange={this.form.onChange}/>
                <MonitoringPlanStats ref="monitoring_plan_stats_fuel_usage" name='fuel_usage_list'
                                     state={this.state}/>
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
                                         defaultValue={[...(maintenance_plan && maintenance_plan.list || []), null]}
                                         onChange={this.form.onChange}/>

                <label className="hor-center margin-t-10 margin-b-0">Next Service Details</label>
                <div className="flex grid-gap-10 w-680 margin-t-20 margin-b-10 hor-center flex-center">
                    <CurrentDistanceOrTime state={this.state}/>
                    <Sign className='Sign margin-t-0' value='+'/>
                    <ClearableInput ref="next_service_hrs_or_km" name="next_service_hrs_or_km"
                                    defaultValue={maintenance_plan && maintenance_plan.next_service_hrs_or_km}
                                    type="number" placeholder="Next Service Hours/Kilometres" required
                                    className="next_service_hrs_or_km w-260 form-control"
                                    onChange={this.form.onChange}/>
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
                <NewCalibrationRecordTable ref="calibration_record_list" name="calibration_record_list"
                                           defaultValue={[...(calibration_record && calibration_record.list || []), null]}
                                           onChange={this.form.onChange}/>

                <label className="hor-center margin-t-10 margin-b-0">Next Calibration Details</label>
                <ClearableInput ref="next_calibration_interval" name="next_calibration_interval"
                                defaultValue={calibration_record && calibration_record.next_calibration_interval || "12 Months"}
                                type="select" placeholder="Calibration Interval..." required
                                className="col-lg-4 pull-left-2 form-control" onChange={this.form.onChange}
                                values={this.state.lists.next_calibration_interval} returnValue/>
                <ClearableInput ref="next_calibration_date" name="next_calibration_date"
                                defaultValue={calibration_record && calibration_record.next_calibration_date}
                                type="date" isEditable={false} placeholder="Next Calibration Date..." required
                                className="col-lg-4 form-control" onChange={this.form.onChange}/>
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
        </FormControls>;
    }

    //</editor-fold>
}

export default EditToolDialog;
