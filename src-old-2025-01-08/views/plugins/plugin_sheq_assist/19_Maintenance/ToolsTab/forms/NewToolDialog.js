//<editor-fold desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import {ClearableInput, RowOrgs, SelectAssetTypeInput, SelectEmployeeInput, UploadButton} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import {CONSTANTS, CurrentDistanceOrTime, FutureMaintenanceDistanceOrTime, SelectWrapper} from './AssetComponents';
import {ANewDialog} from 'components/dialogs';

import style from "./NewToolDialog.lazy.css";
import {Sign} from "views/plugins/plugin_sheq_assist/17_Incident_Investigation/dialogs/ManHourComponents";
import {AControls} from "./AssetControls";
import {MonitoringPlanStats} from "./AssetStats";
import {
    NewCalibrationRecordTable,
    NewDocumentTable,
    NewMaintenancePlanTable,
    NewMonitoringPlanFuelUsageTable,
    NewMonitoringPlanWorkingHrsOrKmTable
} from "./AssetTables";
import {insertAsset} from "mutations/create";
import LinkedAssetsDetailsSection from "./LinkedAssetsDetailsSection";
import ImageSection from "components/FormComponents/ImageSection";
import {upsertAssetPhoto} from "mutations/upsert";
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

    get isNewEmployee() {
        const {props: {dialog: {props: {isNewEmployee}}}} = this;
        return isNewEmployee;
    }

    //</editor-fold>

    get listName() {
        const {props: {dialog: {props: {listName}}}} = this;
        return listName;
    }

    get isParent() {
        const {listName} = this;
        return listName === 'asset_parent_list';
    }

    get isChild() {
        const {listName} = this;
        return listName === 'asset_children_list';
    }

    get assetItem() {
        return this.props.state.item;
    }

    //<editor-fold desc="onSubmit">
    async onSubmit(e, btn, onSaved) {
        const {form, isNewEmployee, assetItem, isParent, isChild} = this;

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

        const data = {
            formData: form.data,
            isParent,
            isChild,
        };//await onProcessFormData(form.data, company_id);

        if (assetItem) {
            data.target_asset_id = assetItem.id;
        }

        console.log(data)

        btn.text("Saving...").disabled();
        progressDialog.open();
        insertAsset(data).then(res => {
            console.log("res", res)
            onSaved && onSaved(res);
            infoDialog.open("Record successfully saved.");
            infoDialog.close(2000);
            this.props.close();
        }).finally(() => {
            btn.text("Save").enabled();
            setTimeout(() => progressDialog.close());
        });
    }

    //<editor-fold desc="render">
    render() {
        const {isParent, isChild} = this;
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
                                   values="manufacturers" add/>
                    <SelectWrapper state={this.state} name="model" placeholder="Model..."
                                   className="col-lg-6 form-control" onChange={this.form.onChange} values="models" add/>
                    <ClearableInput name="reg_num" type="text" placeholder="Registration No." required
                                    className="col-lg-6 form-control" onChange={this.form.onChange}/>
                    <ClearableInput name="serial_num" type="text" placeholder="Serial No." required
                                    className="col-lg-6 form-control" onChange={this.form.onChange}/>

                    <SelectWrapper state={this.state} name="location" placeholder="Location..."
                                   onChange={this.form.onChange} className="col-lg-12 form-control"
                                   values="locations" add/>
                    <SelectWrapper state={this.state} name="toolkit" placeholder="Toolkit..."
                                   onChange={this.form.onChange} className="col-lg-6 form-control"
                                   values="toolkits" add/>
                    <SelectWrapper state={this.state} name="condition" placeholder="Condition..."
                                   onChange={this.form.onChange} className="col-lg-6 form-control"
                                   values="conditions"/>

                    <ClearableInput name="barcode" type="text" placeholder="Barcode" required
                                    className="col-lg-6 form-control" onChange={this.form.onChange}/>
                    <ClearableInput name="qr_code" type="text" placeholder="QR Code" required
                                    className="col-lg-6 form-control" onChange={this.form.onChange}/>

                    <ClearableInput name="notes" type="textarea" placeholder="Notes" required
                                    className="col-lg-12 form-control" onChange={this.form.onChange}/>
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
            >
                <ImageSection
                    listName="photo_list"
                    item_id_key="asset_id"
                    onInsert={upsertAssetPhoto}
                    onUpdate={upsertAssetPhoto}
                    isNewEmployee
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
            >
                <SelectEmployeeInput name="responsible_person" placeholder="Responsible Person..." required
                                     className="col-lg-6 pull-left-3 form-control"
                                     onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={4}
                title="4. Documents"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <NewDocumentTable ref="doc_list" name="doc_list" onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={5}
                title="5. Purchase Info."
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <ClearableInput name="acquisition_date" type="date" placeholder="Date of Purchase..." required
                                className="col-lg-6 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="acquisition_value" type="number" placeholder="Asset Cost" required
                                className="col-lg-6 form-control" onChange={this.form.onChange}/>
                <SelectWrapper state={this.state} name="vendor" placeholder="Vendor..."
                               className="col-lg-6 form-control" onChange={this.form.onChange}
                               values="vendors" add/>
                <ClearableInput name="reference_num" type="text" placeholder="Purchase Reference No." required
                                className="col-lg-6 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="warranty_expiry" type="date" placeholder="Warranty Expiry Date..."
                                required className="col-lg-6 form-control" onChange={this.form.onChange}/>
                <UploadButton name="warranty_certificate"
                              buttonTitle="Warranty Certificate"
                              type={['PDF', 'Word']}
                              showOnlyIcon
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
                                desc="Depreciation Percentage" required
                                className="col-lg-6 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="partial_year_depreciation" type="radio"
                                placeholder="Partial Year Depreciation?" required
                                className="col-lg-7 pull-left-2_5 form-control" onChange={this.form.onChange}
                                values={this.state.lists.partial_year_depreciations}/>
            </Row>
            <Row
                rendered
                idx={7}
                title="7. Monitoring Plan"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <FormControls>
                    <Row
                        rendered
                        idx={CONSTANTS.MONITORING + 0.1}
                        title={`${CONSTANTS.MONITORING}.1 Working Distance/Time`}
                        onFormOpen={onFormOpen}
                        onFormNext={onFormNext}
                    >
                        <NewMonitoringPlanWorkingHrsOrKmTable ref="monitoring_plan_working_distance_or_time_list"
                                                              name="monitoring_plan_working_distance_or_time_list"
                                                              state={this.state}
                                                              onChange={this.form.onChange}/>
                        <MonitoringPlanStats ref="monitoring_plan_stats_working_distance_or_time"
                                             name='working_distance_or_time_list' state={this.state}/>
                    </Row>
                    <Row
                        rendered
                        idx={CONSTANTS.MONITORING + 0.2}
                        title={`${CONSTANTS.MONITORING}.2 Fuel Usage`}
                        onFormOpen={onFormOpen}
                        onFormBack={onFormBack}
                    >
                        <NewMonitoringPlanFuelUsageTable ref="monitoring_plan_fuel_usage_list"
                                                         name="monitoring_plan_fuel_usage_list"
                                                         state={this.state}
                                                         onChange={this.form.onChange}/>
                        <MonitoringPlanStats ref="monitoring_plan_stats_fuel_usage" name='fuel_usage_list'
                                             state={this.state}/>
                    </Row>
                </FormControls>
            </Row>
            <Row
                rendered
                idx={8}
                title="8. Maintenance Plan"
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
                                    className="next_service_hrs_or_km min-w-300 w-300 form-control"
                                    onChange={this.form.onChange}/>
                    <Sign className='Sign margin-t-0' value='='/>
                    <FutureMaintenanceDistanceOrTime state={this.state}/>
                </div>
            </Row>
            <Row
                rendered
                idx={9}
                title="9. Calibration Record"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <NewCalibrationRecordTable ref="calibration_record_list" name="calibration_record_list"
                                           onChange={this.form.onChange}/>

                <label className="hor-center margin-t-10 margin-b-0">Next Calibration Details</label>
                <ClearableInput ref="next_calibration_interval" name="next_calibration_interval" type="select"
                                placeholder="Calibration Interval..." defaultValue="12 Months" required
                                className="col-lg-4 pull-left-2 form-control" onChange={this.form.onChange}
                                values={this.state.lists.next_calibration_interval} returnValue/>
                <ClearableInput ref="next_calibration_date" name="next_calibration_date" type="date"
                                isEditable={false} placeholder="Next Calibration Date..." required
                                className="col-lg-4 form-control" onChange={this.form.onChange}/>
            </Row>
            {!isParent && !isChild && <Row
                rendered
                idx={10}
                title="10. Linked Assets"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
            >
                <FormControls>
                    <Row
                        rendered
                        idx={10.1}
                        title="10.1 Linked Parent Assets"
                        sectionClassName="h-680 -margin-l-10 -margin-t-5 -margin-b-10 w-full-calc-add-20"
                        onFormOpen={onFormOpen}
                        onFormNext={!isChild && onFormNext}
                    >
                        <LinkedAssetsDetailsSection listName="asset_parent_list" isNewEmployee isEmbedded
                                                    onChange={this.form.onChange}/>
                    </Row>
                    <Row
                        rendered
                        idx={10.2}
                        title="10.2 Linked Child Assets"
                        sectionClassName="h-680 -margin-l-10 -margin-t-5 -margin-b-10 w-full-calc-add-20"
                        onFormOpen={onFormOpen}
                        onFormBack={!isParent && onFormBack}
                    >
                        <LinkedAssetsDetailsSection listName="asset_children_list" isNewEmployee isEmbedded
                                                    onChange={this.form.onChange}/>
                    </Row>
                </FormControls>
            </Row>}
            {/*<Row*/}
            {/*	rendered*/}
            {/*	idx={11}*/}
            {/*	title="11. Parts Inventory"*/}
            {/*	onFormOpen={onFormOpen}*/}
            {/*	onFormBack={onFormBack}*/}
            {/*	onFormNext={onFormNext}*/}
            {/*>*/}

            {/*</Row>*/}
            {/*<Row*/}
            {/*	rendered*/}
            {/*	idx={12}*/}
            {/*	title="12. Job Cards"*/}
            {/*	onFormOpen={onFormOpen}*/}
            {/*	onFormBack={onFormBack}*/}
            {/*>*/}

            {/*</Row>*/}
        </FormControls>;
    }

    //</editor-fold>
}

export default NewToolDialog;
