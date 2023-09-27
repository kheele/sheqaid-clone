//<editor-fold desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import {
	ClearableInput,
	RowOrgs,
	SelectAssetTypeInput,
	SelectEmployeeInput,
	UploadButton
} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import {
	CurrentDistanceOrTime,
	FutureMaintenanceDistanceOrTime,
	SelectWrapper
} from './AssetComponents';
import {ANewDialog} from 'components/dialogs';

import style from "./NewToolDialog.lazy.css";
import {Sign} from "views/plugins/plugin_sheq_assist/17_Incident_Investigation/dialogs/ManHourComponents";
import {AControls} from "./AssetControls";
import {MonitoringPlanStats} from "./AssetStats";
import {
	NewCalibrationRecordTable, NewDocumentTable,
	NewMaintenancePlanTable,
	NewMonitoringPlanFuelUsageTable,
	NewMonitoringPlanWorkingHrsOrKmTable
} from "./AssetTables";
import {Dates, toDataURI} from "utils/Utils";
import insertAsset from "mutations/all/Asset/insertAsset";
import LinkedAssetsDetailsSection from "./LinkedAssetsDetailsSection";
import ImageSection from "components/FormComponents/ImageSection";
import updateAssetPhoto from "mutations/all/Asset/updateAssetPhoto";
import insertAssetPhoto from "mutations/all/Asset/insertAssetPhoto";
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

		const onProcessFormData = async (formData) => {
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
				barcode,
				qr_code,
				notes,
				//2
				photo_list,
				//3
				responsible_person,
				//4
				doc_list,
				//5
				acquisition_date,
				vendor,
				acquisition_value,
				warranty_expiry,
				reference_num,
				warranty_certificate,
				//6
				depreciation_method,
				asset_cost,
				salvage_value,
				depreciation_years,
				depreciation_factor,
				partial_year_depreciation,
				//7
				monitoring_plan_working_distance_or_time_list,
				monitoring_plan_fuel_usage_list,
				//8
				maintenance_plan_list,
				next_service_hrs_or_km,
				//9
				calibration_record_list,
				next_calibration_date,
				next_calibration_interval,
				//10
				asset_parent_list,
				asset_children_list,
			} = formData;

			return {
				//0
				client_id: client && client.id,
				project_id: project && project.id,
				site_id: site && site.id,
				//1 done
				asset_detail: {
					data: {
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
				},
				//2 done
				photo_list: photo_list ? {
					data: await Promise.all(photo_list.map(async ({doc: {path}}) => {
						return {doc: {path: await toDataURI(path)}};
					})),
				} : null,
				//3 done
				responsible_person_id: responsible_person && responsible_person.id,
				//4 done
				doc_list: {
					data: await Promise.all((doc_list || []).map(async ({expiry, doc, ...others}) => ({
						...others,
						expiry: Dates.formatDateSQL(expiry),
						doc: doc ? {path: await toDataURI(doc.path)} : null,
					}))),
				},
				//5 done
				purchase_info: (
					vendor || Dates.formatDateSQL(acquisition_date) || acquisition_value ||
					Dates.formatDateSQL(warranty_expiry) || reference_num || warranty_certificate
				) ? {
					data: {
						vendor,
						acquisition_date: Dates.formatDateSQL(acquisition_date),
						acquisition_value,
						warranty_expiry: Dates.formatDateSQL(warranty_expiry),
						reference_num,
						warranty_certificate: warranty_certificate ? {path: await toDataURI(warranty_certificate.path)} : null,
					}
				} : null,
				//6 done
				depreciation: (depreciation_method ||
					asset_cost ||
					salvage_value ||
					depreciation_years ||
					depreciation_factor ||
					partial_year_depreciation
				) ? {
					data: {
						depreciation_method,
						asset_cost,
						salvage_value,
						depreciation_years,
						depreciation_factor,
						partial_year_depreciation,
					}
				} : null,
				//7 done
				monitoring_plan_list: (
					(monitoring_plan_working_distance_or_time_list || []).isNotEmpty() ||
					(monitoring_plan_fuel_usage_list || []).isNotEmpty()
				) ? {
					data: {
						fuel_usage_list: {
							data: (await Promise.all((monitoring_plan_fuel_usage_list || []).map(async (
								{
									refilled_fuel,
									current_hrs_or_km,
									working_hrs_or_km,
									date,
									receipt,
									cost,
								}
							) => (
								{
									refilled_fuel,
									current_hrs_or_km,
									working_hrs_or_km,
									date: Dates.formatDateSQL(date),
									receipt: receipt ? {path: await toDataURI(receipt.path)} : null,
									cost,
								}
							)))).filter(v => !!v)
						},
						working_distance_or_time_list: {
							data: (monitoring_plan_working_distance_or_time_list || []).map((
								{
									working_hrs_or_km_opening,
									working_hrs_or_km_closing,
									working_hrs_or_km,
									date
								}
							) => (
								{
									working_hrs_or_km_opening,
									working_hrs_or_km_closing,
									working_hrs_or_km,
									date: Dates.formatDateSQL(date),
								}
							)).filter(v => !!v)
						},
					},
				} : null,
				//8 done
				maintenance_plan_list: ((maintenance_plan_list || []).isNotEmpty() || next_service_hrs_or_km) ? {
					data: [
						{
							plan_list: {
								data: (maintenance_plan_list || []).map((
									{
										reason_for_service,
										service,
										service_date,
										service_hrs_or_km,
										parts_used,
										cost_and_receipt
									}
								) => ({
									reason_for_service,
									service,
									service_date: Dates.formatDateSQL(service_date),
									service_hrs_or_km,
									parts_used,
									cost_and_receipt,
								})),
							},
							next_service_hrs_or_km,
						}
					].filter(v => !!v),
				} : null,
				//9 done
				calibration_record_list: ((calibration_record_list || []).isNotEmpty() || next_calibration_interval || Dates.formatDateSQL(next_calibration_date)) ? {
					data: [
						{
							calibration_list: {
								data: (calibration_record_list || []).map((
									{
										calibrating_company,
										reference_standard,
										certificate_num,
										calibration_date
									}
								) => ({
									calibrating_company,
									reference_standard,
									certificate_num,
									calibration_date: Dates.formatDateSQL(calibration_date),
								})),
							},
							next_calibration_interval,
							next_calibration_date: Dates.formatDateSQL(next_calibration_date),
						}
					].filter(v => !!v),
				} : null,
				//10
				asset_parent_list: isParent ? {
					data: [{parent_asset_id: assetItem.id}],
				} : isChild ? null : {
					data: await Promise.all((asset_parent_list || []).map(async v => ({
						parent_asset: {data: await onProcessFormData(v)},
					}))),
				},
				asset_children_list: isChild ? {
					data: [{child_asset_id: assetItem.id}],
				} : isParent ? null : {
					data: await Promise.all((asset_children_list || []).map(async v => ({
						child_asset: {data: await onProcessFormData(v)},
					}))),
				},
			};
		};

		const data = await onProcessFormData(form.data);
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

	//</editor-fold>

	get isNewEmployee() {
		const {props: {dialog: {props: {isNewEmployee}}}} = this;
		return isNewEmployee;
	}

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
					onInsert={insertAssetPhoto}
					onUpdate={updateAssetPhoto}
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
					                className="next_service_hrs_or_km w-260 form-control"
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
