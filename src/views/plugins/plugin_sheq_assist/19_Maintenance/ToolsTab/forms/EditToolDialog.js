//<editor-fold desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {autorun, computed} from "mobx";

import {ShouldUpdate} from 'utils/Utils';

import {ClearableInput, RowOrgs, SelectAssetTypeInput, SelectEmployeeInput, UploadButton} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import {CONSTANTS, CurrentDistanceOrTime, FutureMaintenanceDistanceOrTime, SelectWrapper} from './AssetComponents';
import {AEditDialog} from 'components/dialogs';

import style from "./EditToolDialog.lazy.css";
import {Sign} from "views/plugins/plugin_sheq_assist/17_Incident_Investigation/dialogs/ManHourComponents";
import {AControls} from "./AssetControls";
import {MonitoringPlanStats} from "./AssetStats";
import {
    NewCalibrationRecordTable,
    NewDocumentTable,
    NewMaintenancePlanTable,
    NewMonitoringPlanFuelUsageTable,
    NewMonitoringPlanWorkingHrsOrKmTable,
    NewRegisterTable
} from "./AssetTables";
import findByIdAsset from "mutations/all/Asset/findByIdAsset";
import InspectionTabs from "./InspectionTabs";
import LinkedAssetsDetailsSection from "./LinkedAssetsDetailsSection";
import {CircularProgress} from "@mui/material";
import insertAssetPhoto from "mutations/all/Asset/insertAssetPhoto";
import updateAssetPhoto from "mutations/all/Asset/updateAssetPhoto";
import ImageSection from "components/FormComponents/ImageSection";

import {
    onSubmit,
    onSubmitAssetCalibrationRecord,
    onSubmitAssetDepreciation,
    onSubmitAssetDetails,
    onSubmitAssetMaintenancePlan,
    onSubmitAssetPurchaseInfo,
} from './AssetOnEditSave';
//</editor-fold>

//<editor-fold desc="Dialog">
@observer
class EditToolDialog extends AEditDialog {
    pageKey = "EditToolDialog";
    findById = findByIdAsset;

    constructor(props) {
        super(props, style);
    }

    get title() {
        return "Edit Asset";
    }

    get topButtonsHiddenSave() {
        const {props: {isNewEmployee}} = this;
        return !isNewEmployee;
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

        this.onUpdatedMonitoringPlanWorkingHrsOrKm = this.onUpdatedMonitoringPlanWorkingHrsOrKm.bind(this);
        this.onUpdatedMonitoringPlanFuelUsage = this.onUpdatedMonitoringPlanFuelUsage.bind(this);
        this.onUpdatedCalibrationRecord = this.onUpdatedCalibrationRecord.bind(this);
        this.onUpdatedMaintenancePlan = this.onUpdatedMaintenancePlan.bind(this);

        this.onFormChange = this.onFormChange.bind(this);
        this.onFormSave = this.onFormSave.bind(this);
    }

    get isNewEmployee() {
        const {props: {dialog: {props: {isNewEmployee}}}} = this;
        return isNewEmployee;
    }

    //</editor-fold>

    @computed get item() {
        return this.props.state.item;
    }

    //<editor-fold desc="componentDidMount">
    componentDidMount() {
        super.componentDidMount();
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
    }

    onUpdatedMonitoringPlanWorkingHrsOrKm(e, el) {
        let {action, idx, item} = el.props;
    }

    onUpdatedMonitoringPlanFuelUsage(e, el) {
        let {action, idx, item} = el.props;
    }

    onUpdatedMaintenancePlan(e, el) {
        let {action, idx, item} = el.props;
    }

    // </editor-fold>

    onUpdatedCalibrationRecord(e, el) {
        let {action, idx, item} = el.props;

    }

    //</editor-fold>

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
                dialog.cssWidth = '1060px';
                break;
        }
        return true;
    }

    //<editor-fold desc="onFormSave">
    async onFormSave(e, btn) {
        const {
            form,
            item: {
                id,
                data: old_data,
                data: {
                    asset_detail,
                    purchase_info,
                    depreciation,
                    monitoring_plan_list,
                    maintenance_plan_list,
                    calibration_record_list,
                }
            },
            refs: {}
        } = this;

        const {idx} = btn.props;
        //test
        if (idx === 0) {
            const {isConsultant} = storage.is;
            if (isConsultant && !form.isValid('client')) {
                infoDialog.open('Company is required');
                return;
            }

            const {
                site, project, client,
            } = form.data;

            const data = {};
            ShouldUpdate.checkClient(data, old_data, client);
            ShouldUpdate.checkProject(data, old_data, project);
            ShouldUpdate.checkSite(data, old_data, site);

            onSubmit(btn, data);
            return;
        }

        //test
        if (idx === 1) {
            if (!form.isValid('name')) {
                infoDialog.open('Asset Name is required');
                return;
            }
            if (!form.isValid('asset_type')) {
                infoDialog.open('Asset Type is required');
                return;
            }

            const {
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
            } = form.data;

            const data = {};
            ShouldUpdate.check(data, asset_detail, owning_company, 'owning_company');
            ShouldUpdate.check(data, asset_detail, name, 'name');
            ShouldUpdate.check(data, asset_detail, asset_type, 'asset_type');

            ShouldUpdate.check(data, asset_detail, desc, 'desc');
            ShouldUpdate.check(data, asset_detail, manufacturer, 'manufacturer');
            ShouldUpdate.check(data, asset_detail, model, 'model');
            ShouldUpdate.check(data, asset_detail, reg_num, 'reg_num');
            ShouldUpdate.check(data, asset_detail, serial_num, 'serial_num');
            ShouldUpdate.check(data, asset_detail, location, 'location');
            ShouldUpdate.check(data, asset_detail, toolkit, 'toolkit');
            ShouldUpdate.check(data, asset_detail, condition, 'condition');
            ShouldUpdate.check(data, asset_detail, barcode, 'barcode');
            ShouldUpdate.check(data, asset_detail, qr_code, 'qr_code');
            ShouldUpdate.check(data, asset_detail, notes, 'notes');

            onSubmitAssetDetails(btn, data, asset_detail);
            return;
        }

        //test
        if (idx === 2) {
            const {
                //2
                photo_list,
            } = form.data;
            const data = {};
            console.log('photo_list', photo_list)
            ShouldUpdate.checkFileList(data, old_data, photo_list, 'photo_list');
            console.log('photo_list data', data)
            if (Object.keys(data).isEmpty()) {
                infoDialog.open("Nothing changed!");
                return;
            }

            console.log(data)

            let onProgress;
            if (data.photo_list) {
                onProgress = true;
                const {photo_list} = data;
                delete data.photo_list;

                btn.text("Saving...").disabled();
                progressDialog.open();

                const res = await Promise.all(photo_list.map(async item => {
                    if (item.id) {
                        if (item.doc.path) {
                            return await updateAssetPhoto({id: item.id, doc: item.doc.path});
                        }
                    } else {
                        return await insertAssetPhoto({
                            asset_id: this.item.id,
                            doc: item.path,
                        });
                    }
                }));

                console.log("res", res)
                // onSaved && onSaved(res);
                infoDialog.open("Record successfully updated.");
                infoDialog.close(2000);
                // this.props.close();

                btn.text("Save").enabled();
                setTimeout(() => progressDialog.close());
                return;
            }

            if (Object.keys(data).isEmpty()) {
                infoDialog.open("Nothing changed!");
                return;
            }

            onSubmit(btn, data, onProgress);
            return;
        }

        //test
        if (idx === 3) {
            const {
                //3
                responsible_person,
            } = form.data;

            const data = {};

            ShouldUpdate.checkEmployee(data, old_data, responsible_person, 'responsible_person');

            onSubmit(btn, data);
            return;
        }

        //test
        if (idx === 5) {
            const {
                //5
                acquisition_date,
                vendor,
                acquisition_value,
                warranty_expiry,
                reference_num,
                warranty_certificate,
            } = form.data;

            const data = {};

            ShouldUpdate.check(data, purchase_info, vendor, 'vendor');
            ShouldUpdate.checkDate(data, purchase_info, acquisition_date, 'acquisition_date');
            ShouldUpdate.check(data, purchase_info, acquisition_value, 'acquisition_value');
            ShouldUpdate.checkDate(data, purchase_info, warranty_expiry, 'warranty_expiry');
            ShouldUpdate.check(data, purchase_info, reference_num, 'reference_num');
            ShouldUpdate.checkFile(data, purchase_info, warranty_certificate, 'warranty_certificate');

            onSubmitAssetPurchaseInfo(btn, data, purchase_info);
            return;
        }

        //test
        if (idx === 6) {
            const {
                //6
                depreciation_method,
                asset_cost,
                salvage_value,
                depreciation_years,
                depreciation_factor,
                partial_year_depreciation,
            } = form.data;

            const data = {};

            ShouldUpdate.check(data, depreciation, depreciation_method, 'depreciation_method');
            ShouldUpdate.check(data, depreciation, asset_cost, 'asset_cost');
            ShouldUpdate.check(data, depreciation, salvage_value, 'salvage_value');
            ShouldUpdate.check(data, depreciation, depreciation_years, 'depreciation_years');
            ShouldUpdate.check(data, depreciation, depreciation_factor, 'depreciation_factor');
            ShouldUpdate.check(data, depreciation, partial_year_depreciation, 'partial_year_depreciation');

            onSubmitAssetDepreciation(btn, data, depreciation);
            return;
        }

        if (idx === CONSTANTS.MAINTENANCE) {
            const {
                //8
                // maintenance_plan_list,//[{next_service_hrs_or_km, plan_list = [],}]
                next_service_hrs_or_km: new_next_service_hrs_or_km,
            } = form.data;

            const data = {};
            if (new_next_service_hrs_or_km) {
                let {
                    // id,
                    maintenance_plan_list,
                } = old_data;

                const lastMaintenancePlan = (maintenance_plan_list || []).getLastElement();
                const {
                    // id,
                    next_service_hrs_or_km: old_next_service_hrs_or_km,
                    // plan_list = [],
                } = lastMaintenancePlan || {};

                if (lastMaintenancePlan) {
                    ShouldUpdate.check(data, lastMaintenancePlan, new_next_service_hrs_or_km, 'next_service_hrs_or_km');
                } else {
                    data.asset_id = id;
                    data.next_service_hrs_or_km = new_next_service_hrs_or_km;
                }

                onSubmitAssetMaintenancePlan(btn, data, lastMaintenancePlan);
            } else {

            }

            return;
        }

        if (idx === CONSTANTS.CALIBRATION) {
            const {
                //9
                // calibration_record_list: calibration_list,//[{next_calibration_interval, next_calibration_date, calibration_list = [],}]
                next_calibration_date: new_next_calibration_date,
                next_calibration_interval: new_next_calibration_interval
            } = form.data;

            const data = {};
            if (new_next_calibration_date || new_next_calibration_interval) {
                let {
                    // id,
                    calibration_record_list,
                } = old_data;

                const lastCalibrationRecord = (calibration_record_list || []).getLastElement();
                const {
                    // id,
                    next_calibration_interval: old_next_calibration_interval,
                    next_calibration_date: old_next_calibration_date,
                    // calibration_list = [],
                } = lastCalibrationRecord || {};

                if (lastCalibrationRecord) {
                    ShouldUpdate.check(data, lastCalibrationRecord, new_next_calibration_date, 'next_calibration_date');
                    ShouldUpdate.check(data, lastCalibrationRecord, new_next_calibration_interval, 'next_calibration_interval');
                } else {
                    data.asset_id = id;
                    data.next_calibration_date = new_next_calibration_date;
                    data.next_calibration_interval = new_next_calibration_interval;
                }

                onSubmitAssetCalibrationRecord(btn, data, lastCalibrationRecord);
            } else {

            }

            return;
        }

        return true;
    }

    onSubmit(e, btn, onSaved) {
        const {form, isNewEmployee, item: {data: old_data}} = this;

        if (!form.isValid('name')) {
            infoDialog.open('Asset Name is required');
            return;
        }
        if (!form.isValid('asset_type')) {
            infoDialog.open('Asset Type is required');
            return;
        }

        if (isNewEmployee) {
            console.log("res", form.data)
            onSaved && onSaved(form.data);
            infoDialog.open("Record added.");
            infoDialog.close(2000);
            this.props.close();
            return;
        }


    }

    //<editor-fold desc="render">
    render() {
        if (!this.item) {
            return <CircularProgress className="fixed-center"/>;
        }

        const {
            props: {
                onFormNext, onFormBack, onFormOpen, onFormChange,
                dialog,
            },
            item, item: {
                id, data: {
                    created_at, status/*In Storage | Checked Out | Loaned Out | Out For Repair*/, statusVal,
                    client, project, site,
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
        const {
            // id,
            fuel_usage_list = [],
            working_distance_or_time_list = [],
        } = (monitoring_plan_list || []).getLastElement() || {};

        //8 done
        const {
            // id,
            next_service_hrs_or_km,
            plan_list = [],
        } = (maintenance_plan_list || []).getLastElement() || {};

        //9 done
        const {
            // id,
            next_calibration_interval,
            next_calibration_date,
            calibration_list = [],
        } = (calibration_record_list || []).getLastElement() || {};

        const rowIdx = dialog.extraProp('rowIdx');

        return <FormControls>
            <RowOrgs
                client={client}
                project={project}
                site={site}
                active={rowIdx === 0 || !rowIdx}
                onChange={this.form.onChange}
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
                onFormChange={onFormChange}
                onFormSave={this.onFormSave}
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
                                   onChange={this.form.onChange} values="manufacturers" add/>
                    <SelectWrapper state={this.state} name="model" placeholder="Model..." defaultValue={model}
                                   className="col-lg-6 form-control" onChange={this.form.onChange} values="models" add/>
                    <ClearableInput name="reg_num" type="text" placeholder="Registration No." defaultValue={reg_num}
                                    required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                    <ClearableInput name="serial_num" type="text" placeholder="Serial No." defaultValue={serial_num}
                                    required className="col-lg-6 form-control" onChange={this.form.onChange}/>

                    <SelectWrapper state={this.state} name="location" placeholder="Location..."
                                   defaultValue={location} onChange={this.form.onChange}
                                   className="col-lg-12 form-control" values="locations" add/>
                    <SelectWrapper state={this.state} name="toolkit" placeholder="Toolkit..." defaultValue={toolkit}
                                   onChange={this.form.onChange} className="col-lg-6 form-control"
                                   values="toolkits" add/>
                    <SelectWrapper state={this.state} name="condition" placeholder="Condition..."
                                   defaultValue={condition} onChange={this.form.onChange}
                                   className="col-lg-6 form-control" values="conditions"/>

                    <ClearableInput name="barcode" type="text" placeholder="Barcode" defaultValue={barcode}
                                    className="col-lg-6 form-control" onChange={this.form.onChange}/>
                    <ClearableInput name="qr_code" type="text" placeholder="QR Code" defaultValue={qr_code}
                                    className="col-lg-6 form-control" onChange={this.form.onChange}/>

                    <ClearableInput name="notes" type="textarea" placeholder="Notes" defaultValue={notes} required
                                    className="col-lg-12 form-control" onChange={this.form.onChange}/>
                </Row>
            </RowOrgs>
            <Row
                rendered
                idx={2}
                title="2. Asset Photo"
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
                    onInsert={insertAssetPhoto}
                    onUpdate={updateAssetPhoto}
                    item={item}
                    embeddedEmployee={this.item}
                    isEmbedded
                    onChange={this.form.onChange}
                />
            </Row>
            <Row
                rendered
                idx={3}
                title="3. Responsible Person"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
                onFormChange={onFormChange}
                onFormSave={this.onFormSave}
            >
                <SelectEmployeeInput name="responsible_person" placeholder="Responsible Person..."
                                     defaultValue={responsible_person} required
                                     className="col-lg-6 pull-left-3 form-control"
                                     onChange={this.form.onChange}/>
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
                <NewDocumentTable
                    ref="doc_list"
                    name="doc_list"
                    defaultValue={[...(doc_list || []), null]}
                    savable
                    item={item}
                />
            </Row>
            <Row
                rendered
                idx={5}
                title="5. Purchase Info."
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
                onFormChange={onFormChange}
                onFormSave={this.onFormSave}
            >
                <ClearableInput name="acquisition_date" type="date" placeholder="Date of Purchase..."
                                defaultValue={acquisition_date} required
                                className="col-lg-6 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="acquisition_value" type="number" placeholder="Asset Cost"
                                defaultValue={acquisition_value} required
                                className="col-lg-6 form-control" onChange={this.form.onChange}/>
                <SelectWrapper state={this.state} name="vendor" placeholder="Vendor..."
                               defaultValue={vendor}
                               className="col-lg-6 form-control" onChange={this.form.onChange}
                               values="vendors" add/>
                <ClearableInput name="reference_num" type="text" placeholder="Purchase Reference No."
                                defaultValue={purchase_info && purchase_info.reference_num} required
                                className="col-lg-6 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="warranty_expiry" type="date" placeholder="Warranty Expiry Date..."
                                defaultValue={warranty_expiry} required
                                className="col-lg-6 form-control" onChange={this.form.onChange}/>
                <UploadButton name="warranty_certificate"
                              buttonTitle="Warranty Certificate"
                              type={['PDF', 'Word']}
                              showOnlyIcon
                              defaultValue={warranty_certificate}
                              className="col-lg-6"
                              onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={6}
                title="6. Depreciation"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
                onFormChange={onFormChange}
                onFormSave={this.onFormSave}
            >
                <ClearableInput name="depreciation_method" type="select" placeholder="Depreciation Method..."
                                defaultValue={depreciation_method} required
                                className="col-lg-12 form-control" onChange={this.form.onChange}
                                values={this.state.lists.depreciation_methods} returnValue/>
                <ClearableInput ref="asset_cost" name="asset_cost" type="number" placeholder="Asset Cost"
                                isEditable={false} required className="col-lg-6 form-control"
                                onChange={this.form.onChange}/>
                <ClearableInput name="salvage_value" type="number" placeholder="Salvage Value"
                                defaultValue={salvage_value}
                                desc="In regards to depreciation, salvage value (sometimes called residual or scrap value) is the estimated worth of an asset at the end of its useful life. If the salvage value of an asset is known (such as the amount it can be sold as for parts at the end of its life), the cost of the asset can subtract this value to find the total amount that can be depreciated. Assets with no salvage value will have the same total depreciation as the cost of the asset."
                                required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="depreciation_years" type="number" placeholder="Depreciation Years"
                                defaultValue={depreciation_years} required
                                className="col-lg-6 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="depreciation_factor" type="number" placeholder="Depreciation Factor"
                                defaultValue={depreciation_factor} defaultValue={2}
                                desc="Depreciation Percentage" required className="col-lg-6 form-control"
                                onChange={this.form.onChange}/>
                <ClearableInput name="partial_year_depreciation" type="radio"
                                defaultValue={partial_year_depreciation}
                                placeholder="Partial Year Depreciation?" required
                                className="col-lg-7 pull-left-2_5 form-control" onChange={this.form.onChange}
                                values={this.state.lists.partial_year_depreciations}/>
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
                        sectionClassName="w-full-calc-add-20"
                        onFormOpen={onFormOpen}
                        onFormNext={onFormNext}
                    >
                        <NewMonitoringPlanWorkingHrsOrKmTable
                            ref="monitoring_plan_working_distance_or_time_list"
                            name="monitoring_plan_working_distance_or_time_list"
                            state={this.state}
                            defaultValue={[...(working_distance_or_time_list || []), null]}
                            onUpdated={this.onUpdatedMonitoringPlanWorkingHrsOrKm}
                            item={item}
                            savable
                            onChange={this.form.onChange}
                        />
                        <MonitoringPlanStats
                            ref="monitoring_plan_stats_working_distance_or_time"
                            name='working_distance_or_time_list'
                            state={this.state}
                        />
                    </Row>
                    <Row
                        rendered
                        idx={CONSTANTS.MONITORING + 0.2}
                        title={`${CONSTANTS.MONITORING}.2 Fuel Usage`}
                        sectionClassName="w-full-calc-add-20"
                        onFormOpen={onFormOpen}
                        onFormBack={onFormBack}
                    >
                        <NewMonitoringPlanFuelUsageTable
                            ref="monitoring_plan_fuel_usage_list"
                            name="monitoring_plan_fuel_usage_list"
                            state={this.state}
                            defaultValue={[...(fuel_usage_list || []), null]}
                            onUpdated={this.onUpdatedMonitoringPlanFuelUsage}
                            item={item}
                            savable
                            onChange={this.form.onChange}
                        />
                        <MonitoringPlanStats
                            ref="monitoring_plan_stats_fuel_usage"
                            name='fuel_usage_list'
                            state={this.state}
                        />
                    </Row>
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
                onFormSave={this.onFormSave}
            >
                <NewMaintenancePlanTable
                    ref="maintenance_plan_list"
                    name="maintenance_plan_list"
                    asset={this.item}
                    defaultValue={[...(plan_list || []), null]}
                    onUpdated={this.onUpdatedMaintenancePlan}
                    item={item}
                    savable
                    onChange={this.form.onChange}
                />

                <label className="hor-center margin-t-10 margin-b-0">Next Service Details</label>
                <div className="flex grid-gap-10 w-680 margin-t-20 margin-b-10 hor-center flex-center">
                    <CurrentDistanceOrTime state={this.state}/>
                    <Sign className='Sign margin-t-0' value='+'/>
                    <ClearableInput
                        ref="next_service_hrs_or_km"
                        name="next_service_hrs_or_km"
                        type="number"
                        defaultValue={next_service_hrs_or_km}
                        placeholder="Next Service Hours/Kilometres"
                        className="next_service_hrs_or_km w-260 form-control"
                        onChange={this.form.onChange}
                    />
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
                onFormSave={this.onFormSave}
            >
                <NewCalibrationRecordTable ref="calibration_record_list" name="calibration_record_list"
                                           defaultValue={[...(calibration_list || []), null]}
                                           onUpdated={this.onUpdatedCalibrationRecord}
                                           item={item}
                                           savable
                                           onChange={this.form.onChange}/>

                <label className="hor-center margin-t-10 margin-b-0">Next Calibration Details</label>
                <ClearableInput ref="next_calibration_interval" name="next_calibration_interval" type="select"
                                placeholder="Calibration Interval..."
                                defaultValue={next_calibration_interval || "12 Months"}
                                required
                                className="col-lg-4 pull-left-2 form-control" onChange={this.form.onChange}
                                values={this.state.lists.next_calibration_interval} returnValue/>
                <ClearableInput ref="next_calibration_date" name="next_calibration_date" type="date"
                                placeholder="Next Calibration Date..."
                                defaultValue={next_calibration_date}
                                className="col-lg-4 form-control" onChange={this.form.onChange}/>
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
                        <LinkedAssetsDetailsSection
                            listName="asset_parent_list"
                            item={item}
                            isEditing
                            isEmbedded
                            onChange={this.form.onChange}
                        />
                    </Row>
                    <Row
                        rendered
                        idx={10.2}
                        title="10.2 Linked Child Assets"
                        sectionClassName="h-680 -margin-l-10 -margin-t-5 -margin-b-10 w-full-calc-add-20"
                        onFormOpen={onFormOpen}
                        onFormBack={onFormBack}
                    >
                        <LinkedAssetsDetailsSection
                            listName="asset_children_list"
                            item={item}
                            isEditing
                            isEmbedded
                            onChange={this.form.onChange}
                        />
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
                <NewRegisterTable ref="register_list" name="register_list" defaultValue={register_list || []} readonly/>
            </Row>
            {/*<Row*/}
            {/*	rendered*/}
            {/*	idx={12}*/}
            {/*	title="12. Parts Inventory"*/}
            {/*	onFormOpen={onFormOpen}*/}
            {/*	onFormBack={onFormBack}*/}
            {/*	onFormNext={onFormNext}*/}
            {/*	onFormSave={this.onFormSave}*/}
            {/*>*/}

            {/*</Row>*/}
            {/*<Row*/}
            {/*	rendered*/}
            {/*	idx={13}*/}
            {/*	title="13. Job Cards"*/}
            {/*	onFormOpen={onFormOpen}*/}
            {/*	onFormBack={onFormBack}*/}
            {/*	onFormSave={this.onFormSave}*/}
            {/*>*/}

            {/*</Row>*/}
        </FormControls>;
    }

    //</editor-fold>
}

export default EditToolDialog;
