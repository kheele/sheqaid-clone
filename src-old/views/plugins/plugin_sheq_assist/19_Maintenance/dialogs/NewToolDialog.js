//<editor-fold desc="imports">
import React from "react";
import {observer} from 'mobx-react';

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
import {ANewDialog} from '../../../../../components/dialogs';

import style from "./NewToolDialog.lazy.css";
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
class NewToolDialog extends ANewDialog {
    pageKey = "NewToolDialog";
    title = "Create Asset";

    constructor(props) {
        super(props, style);
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
        const {form} = this;

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
        const data = {
            name, asset_type,
            //6
            purchase_info: {},
            //7
            depreciation: {},
            //8
            monitoring_plan_working_distance_or_time_list: [],
            monitoring_plan_fuel_usage_list: [],
            //9
            maintenance_plan: {},
            //10
            calibration_record: {}
        };

        if (client) {
            if (client.id) {
                const {id, data: _data, name} = client;
                data.client = {id, name: name || _data.name};
            } else {
                data.client = client;
            }
        }
        if (project) {
            if (project.id) {
                const {id, data: _data, name} = project;
                data.project = {id, name: name || _data.name};
            } else {
                data.project = project;
            }
        }
        if (site) {
            if (site.id) {
                const {id, data: _data, name} = site;
                data.site = {id, name: name || _data.name};
            } else {
                data.site = site;
            }
        }

        //1
        if (owning_company) {
            data.owning_company = owning_company;
        }
        if (desc) {
            data.desc = desc;
        }
        if (manufacturer) {
            data.manufacturer = manufacturer;
        }
        if (model) {
            data.model = model;
        }
        if (reg_num) {
            data.reg_num = reg_num;
        }
        if (serial_num) {
            data.serial_num = serial_num;
        }
        if (location) {
            data.location = location;
        }
        if (toolkit) {
            data.toolkit = toolkit;
        }
        if (condition) {
            data.condition = condition;
        }
        if (barcode_or_qr_code_type) {
            data.barcode_or_qr_code_type = barcode_or_qr_code_type;
        }
        if (barcode_or_qr_code) {
            data.barcode_or_qr_code = barcode_or_qr_code;
        }
        if (notes) {
            data.notes = notes;
        }

        //2
        if (profile_pic) {
            data.profile_pic = profile_pic.path;
        }

        //3
        if (responsible_person) {
            const {id, fname, lname, data: _data} = responsible_person;
            data.responsible_person = {id, fname: fname || _data.fname, lname: lname || _data.lname};
        }

        //4
        if (doc_pdf) {
            data.doc_pdf = doc_pdf.path;
        }
        if (doc_pdf_desc) {
            data.doc_pdf_desc = doc_pdf_desc;
        }
        if (doc_pdf_expiry) {
            data.doc_pdf_expiry = doc_pdf_expiry.getTime();
        }

        //5
        if (doc_work_manual) {
            data.doc_work_manual = doc_work_manual.path;
        }
        if (doc_procedure) {
            data.doc_procedure = doc_procedure.path;
        }
        if (doc_clearance_certificate) {
            data.doc_clearance_certificate = doc_clearance_certificate.path;
        }

        //6
        if (acquisition_date) {
            data.purchase_info.acquisition_date = acquisition_date.getTime();
        }
        if (vendor) {
            data.purchase_info.vendor = vendor;
        }
        if (acquisition_value) {
            data.purchase_info.acquisition_value = acquisition_value;
        }
        if (warranty_expiry) {
            data.purchase_info.warranty_expiry = warranty_expiry.getTime();
        }
        if (reference_num) {
            data.purchase_info.reference_num = reference_num;
        }
        if (warranty_certificate) {
            data.purchase_info.warranty_certificate = warranty_certificate.path;
        }

        //7
        if (depreciation_method) {
            data.depreciation.depreciation_method = depreciation_method;
        }
        if (asset_cost) {
            data.depreciation.asset_cost = asset_cost;
        }
        if (salvage_value) {
            data.depreciation.salvage_value = salvage_value;
        }
        if (depreciation_years) {
            data.depreciation.depreciation_years = depreciation_years;
        }
        if (depreciation_factor) {
            data.depreciation.depreciation_factor = depreciation_factor;
        }
        if (partial_year_depreciation) {
            data.depreciation.partial_year_depreciation = partial_year_depreciation;
        }

        //8
        if (monitoring_plan_working_distance_or_time_list) {
            data.monitoring_plan_working_distance_or_time_list = monitoring_plan_working_distance_or_time_list.map(v => {
                const {working_hrs_or_km_opening, working_hrs_or_km_closing, working_hrs_or_km, date} = v;
                if (date && isDate(date)) {
                    v.date = date.getTime();
                }
                return v;
            });
        }
        if (monitoring_plan_fuel_usage_list) {
            data.monitoring_plan_fuel_usage_list = monitoring_plan_fuel_usage_list.map(v => {
                const {refilled_fuel, current_hrs_or_km, working_hrs_or_km, date} = v;
                if (date && isDate(date)) {
                    v.date = date.getTime();
                }
                return v;
            });
        }

        //9
        if (maintenance_plan_list) {
            data.maintenance_plan.list = maintenance_plan_list.map(v => {
                const {service_hrs_or_km, reason_for_service, service_date} = v;
                if (service_date) {
                    v.service_date = service_date.getTime();
                }
                return v;
            });
        }
        if (next_service_hrs_or_km) {
            data.maintenance_plan.next_service_hrs_or_km = parseInt(next_service_hrs_or_km);
        }

        //10
        if (calibration_record_list) {
            data.calibration_record.list = calibration_record_list.map(v => {
                const {reference_standard, certificate_num, calibrating_company, calibration_date} = v;
                if (calibration_date) {
                    v.calibration_date = calibration_date.getTime();
                }
                return v;
            });
        }
        if (next_calibration_date) {
            data.calibration_record.next_calibration_date = next_calibration_date.getTime();
        }
        if (next_calibration_interval) {
            data.calibration_record.next_calibration_interval = next_calibration_interval;
        }

        console.log(data)

        btn.text("Saving...").disabled();
        neonBinding.events.emit(this.path + "create", data).then(res => {
            console.log("res", res)
            onSaved && onSaved(res);
            infoDialog.open("Record successfully saved.");
            infoDialog.close(2000);
            this.props.close();
        }).finally(() => {
            btn.text("Save").enabled();
        });
    }

    //</editor-fold>

    //<editor-fold desc="render">
    render() {
        const {onFormNext, onFormBack, onFormOpen} = this.props;
        return <FormControls>
            <RowOrgs
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
                    <ClearableInput name="owning_company" type="text" placeholder="Owning Company Name" required
                                    className="col-lg-6 pull-left-3 form-control" onChange={this.form.onChange}/>
                    <ClearableInput name="name" type="text" placeholder="Asset Name"
                                    footerDesc="Ex. TLB, Truck, Grader, Van" required
                                    className="col-lg-6 form-control" onChange={this.form.onChange}/>
                    <SelectAssetTypeInput name="asset_type" placeholder="Asset Type..." required
                                          className="col-lg-6 form-control" onChange={this.form.onChange}/>
                    <ClearableInput name="desc" type="textarea" placeholder="Description" required
                                    className="col-lg-12 form-control" onChange={this.form.onChange}/>

                    <SelectWrapper state={this.state} name="manufacturer" placeholder="Manufacturer..."
                                   className="col-lg-6 form-control" onChange={this.form.onChange}
                                   values="manufacturers"/>
                    <SelectWrapper state={this.state} name="model" placeholder="Model..."
                                   className="col-lg-6 form-control" onChange={this.form.onChange} values="models"/>
                    <ClearableInput name="reg_num" type="text" placeholder="Registration No." required
                                    className="col-lg-6 form-control" onChange={this.form.onChange}/>
                    <ClearableInput name="serial_num" type="text" placeholder="Serial No." required
                                    className="col-lg-6 form-control" onChange={this.form.onChange}/>

                    <SelectWrapper state={this.state} name="location" placeholder="Location..."
                                   onChange={this.form.onChange} className="col-lg-12 form-control"
                                   values="locations"/>
                    <SelectWrapper state={this.state} name="toolkit" placeholder="Toolkit..."
                                   onChange={this.form.onChange} className="col-lg-6 form-control"
                                   values="toolkits"/>
                    <SelectWrapper state={this.state} name="condition" placeholder="Condition..."
                                   onChange={this.form.onChange} className="col-lg-6 form-control"
                                   values="conditions"/>

                    <ClearableInput name="barcode_or_qr_code_type" type="radio" placeholder="Barcode / QR Code"
                                    required className="col-lg-7 pull-left-2_5 form-control"
                                    onChange={this.form.onChange}
                                    values={this.state.lists.barcode_or_qr_code_types}/>
                    <BarcodeWrapper state={this.state} onChange={this.form.onChange}/>
                    <QRCodeWrapper state={this.state} onChange={this.form.onChange}/>

                    <ClearableInput name="notes" type="textarea" placeholder="Notes" required
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
                <UploadButton name="profile_pic"
                              buttonTitle="Asset Photo"
                              type={['Photo']}
                              showOnlyIcon
                              className="hor-center col-lg-6"
                              onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={3}
                title="3. Responsible Person"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <SelectEmployeeInput name="responsible_person" placeholder="Responsible Person..." required
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
                <UploadButton name="doc_pdf"
                              buttonTitle="Upload Document"
                              type={['PDF', 'Word']}
                              showOnlyIcon
                              className="col-lg-12"
                              onChange={this.form.onChange}/>
                <ClearableInput name="doc_pdf_expiry" type="date" placeholder="Document Expiry Date..." required
                                className="col-lg-4 pull-left-4 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="doc_pdf_desc" type="textarea" placeholder="Document Description" required
                                className="col-lg-12 form-control" onChange={this.form.onChange}/>
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
                              type={['PDF', 'Word']}
                              showOnlyIcon
                              className="col-lg-12"
                              onChange={this.form.onChange}/>
                <UploadButton name="doc_procedure"
                              buttonTitle="Upload Work Procedure Document"
                              type={['PDF', 'Word']}
                              showOnlyIcon
                              className="col-lg-12"
                              onChange={this.form.onChange}/>
                <UploadButton name="doc_clearance_certificate"
                              buttonTitle="Upload Clearance Certificate Document"
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
                <ClearableInput name="acquisition_date" type="date" placeholder="Date of Purchase..." required
                                className="col-lg-6 form-control" onChange={this.form.onChange}/>
                <SelectWrapper state={this.state} name="vendor" placeholder="Vendor..."
                               className="col-lg-6 form-control" onChange={this.form.onChange}
                               values="vendors"/>
                <ClearableInput name="acquisition_value" type="number" placeholder="Asset Cost" required
                                className="col-lg-6 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="warranty_expiry" type="date" placeholder="Warranty Expiry Date..."
                                required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="reference_num" type="text" placeholder="Purchase Reference No." required
                                className="col-lg-6 pull-left-3 form-control" onChange={this.form.onChange}/>
                <UploadButton name="warranty_certificate"
                              buttonTitle="Warranty Certificate"
                              type={['PDF', 'Word']}
                              showOnlyIcon
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
                                required className="col-lg-12 form-control" onChange={this.form.onChange}
                                values={this.state.lists.depreciation_methods} returnValue/>
                <ClearableInput ref="asset_cost" name="asset_cost" type="number" placeholder="Asset Cost"
                                isEditable={false} required className="col-lg-6 form-control"
                                onChange={this.form.onChange}/>
                <ClearableInput name="salvage_value" type="number" placeholder="Salvage Value"
                                desc="In regards to depreciation, salvage value (sometimes called residual or scrap value) is the estimated worth of an asset at the end of its useful life. If the salvage value of an asset is known (such as the amount it can be sold as for parts at the end of its life), the cost of the asset can subtract this value to find the total amount that can be depreciated. Assets with no salvage value will have the same total depreciation as the cost of the asset."
                                required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="depreciation_years" type="number" placeholder="Depreciation Years"
                                required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="depreciation_factor" type="number" placeholder="Depreciation Factor"
                                defaultValue={2} desc="Depreciation Percentage" required
                                className="col-lg-6 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="partial_year_depreciation" type="radio"
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
                                                      onChange={this.form.onChange}/>
                <MonitoringPlanStats ref="monitoring_plan_stats_working_distance_or_time"
                                     name='working_distance_or_time_list' state={this.state}/>

                <NewMonitoringPlanFuelUsageTable ref="monitoring_plan_fuel_usage_list"
                                                 name="monitoring_plan_fuel_usage_list"
                                                 state={this.state}
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
                                         onChange={this.form.onChange}/>
                <label className="hor-center margin-t-10 margin-b-0">Next Service Details</label>
                <div className="flex grid-gap-10 w-680 margin-t-20 margin-b-10 hor-center flex-center">
                    <CurrentDistanceOrTime state={this.state}/>
                    <Sign className='Sign margin-t-0' value='+'/>
                    <ClearableInput ref="next_service_hrs_or_km" name="next_service_hrs_or_km" type="number"
                                    placeholder="Next Service Hours/Kilometres" required
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
                onFormNext={onFormNext}
            >
                <NewCalibrationRecordTable ref="calibration_record_list" name="calibration_record_list" onChange={this.form.onChange}/>
                <label className="hor-center margin-t-10 margin-b-0">Next Calibration Details</label>
                <ClearableInput ref="next_calibration_interval" name="next_calibration_interval" type="select"
                                placeholder="Calibration Interval..." defaultValue="12 Months" required
                                className="col-lg-4 pull-left-2 form-control" onChange={this.form.onChange}
                                values={this.state.lists.next_calibration_interval} returnValue/>
                <ClearableInput ref="next_calibration_date" name="next_calibration_date" type="date"
                                isEditable={false} placeholder="Next Calibration Date..." required
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

export default NewToolDialog;
