//<editor-fold desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, observable, toJS} from 'mobx';

import {CalculationUtils, Dates, execWhen} from 'utils/Utils';

import {Button, ClearableInput, UploadButton} from 'components/inputs';
import {ATableSavable, Table, TBody, THead, TRow} from 'components/tables';

import NewPartCostAndReceiptDialog from "../../PartsTab/forms/NewPartCostAndReceiptDialog";
import ProfilePartCostAndReceiptDialog from "../../PartsTab/forms/ProfilePartCostAndReceiptDialog";
import ProfilePartDialog from "../../PartsTab/forms/ProfilePartDialog";
import {MaintenancePlanStats} from "./AssetStats";
import {CostAndReceipt, PartsUsed} from "./AssetComponents";
import NewPartsUsedListDialog from "../../PartsTab/forms/NewPartsUsedListDialog";
//</editor-fold>

const unitsShort = {
	Time: "h", Distance: "km"
};

//<editor-fold desc="NewMonitoringPlanWorkingHrsOrKmTable">
@observer
class NewMonitoringPlanWorkingHrsOrKmTable extends ATableSavable {

	@observable
	selfState = {
		units: null
	};

	constructor(props) {
		super(props);

		const {defaultValue} = this.props;
		if (defaultValue) {
			this.state.list = toJS(defaultValue);
		}

		const {onChange, name} = this.props;
		onChange && onChange(toJS(this.state.list.filter(v => !!v)), name, this);

		this.insertAt = this.insertAt.bind(this);

		this.renderItem = this.renderItem.bind(this);
	}

	insertAt(list, form) {
		list.insertAt(list.length - 1, form);
	}

	onClickComplete(e, el) {
		let {action, idx, item} = el.props;
		if (action === "save") {

		} else if (action === "saveEdit") {

		} else if (action === "delete") {

		}
	}

	onPostChange(val, name, el) {
		if (name === 'working_hrs_or_km_opening' || name === 'working_hrs_or_km_closing') {
			execWhen(() => this.ctrl_refs.working_hrs_or_km && this.ctrl_refs.working_hrs_or_km_opening && this.ctrl_refs.working_hrs_or_km_closing).then(() => {
				const {working_hrs_or_km, working_hrs_or_km_opening, working_hrs_or_km_closing} = this.ctrl_refs;
				if (working_hrs_or_km_opening.hasValue && working_hrs_or_km_closing.hasValue) {
					working_hrs_or_km.setEditable(true);
					const value = working_hrs_or_km_closing.value - working_hrs_or_km_opening.value;
					if (value > 0) {
						working_hrs_or_km.value = value;
					} else {

					}
					working_hrs_or_km.setEditable(false);
				}
			});
		}
	}

	setUnits(units) {
		this.selfState.units = units;
		const list = this.state.list.slice();
		this.state.list = list;
	}

	renderItem(n, onClick) {
		const {readonly} = this.props;
		const item = this.state.list[n];
		if (item) {
			const {id, working_hrs_or_km_opening, working_hrs_or_km_closing, working_hrs_or_km, date} = item;
			const unit = unitsShort[this.selfState.units] || 'h/km';
			return <TRow key={"item-" + n} className="tr-readonly w-full">
				<div className="td fixed-flex min-w-30"><span className="counter">{n + 1}</span></div>
				<div className="td">{working_hrs_or_km_opening}{unit}</div>
				<div className="td">{working_hrs_or_km_closing}{unit}</div>
				<div className="td">{working_hrs_or_km}{unit}</div>
				<div className="td fixed-flex min-w-165">{Dates.formatDate(date)}</div>
				{!readonly && <div className="td fixed-flex min-w-50 padding-l-0">
					<Button idx={n} action="delete" className="btn btn-primary pull-right w-40" onClick={onClick}>
						<i className="fa fa-times-circle"/>
					</Button>
				</div>}
				{readonly && <div className="td fixed-flex min-w-0 padding-0"></div>}
			</TRow>;
		} else {
			const list = [...this.list];
			// console.log('list1', list.map(v => v.date));
			list.sortBy('date');
			// console.log('list2', list.map(v => v.date));
			const lastItem = list.pop();

			const newOpeningVal = lastItem ? parseInt(lastItem.working_hrs_or_km_closing) : null;

			if (isNumber(newOpeningVal)) {
				execWhen(() => this.ctrl_refs.working_hrs_or_km_opening).then(ref => {
					ref.value = newOpeningVal;
					ref.min = newOpeningVal;
				});
			}
			execWhen(() => this.ctrl_refs.working_hrs_or_km).then(ref => {
				ref.setEditable(true);
				ref.reset();
				ref.setEditable(false);
			});

			return <TRow key="item-new" className="w-full padding-t-10 padding-b-10">
				<div className="td fixed-flex min-w-30"></div>
				<div className="td td-number flex">
					<ClearableInput ref={this.onSetRef} name="working_hrs_or_km_opening" type="number"
					                isClearable={false}
					                required className="form-control" onChange={this.onChange}/>
					<label
						className="fixed-flex min-w-45 margin-0 margin-r-10 text-center">{unitsShort[this.selfState.units] || 'h/km'}</label>
				</div>
				<div className="td td-number flex">
					<ClearableInput ref={this.onSetRef} name="working_hrs_or_km_closing" type="number"
					                isClearable={false}
					                required className="form-control" onChange={this.onChange}/>
					<label
						className="fixed-flex min-w-45 margin-0 margin-r-10 text-center">{unitsShort[this.selfState.units] || 'h/km'}</label>
				</div>
				<div className="td td-number flex">
					<ClearableInput ref={this.onSetRef} name="working_hrs_or_km" type="number"
					                isEditable={false} isClearable={false}
					                required className="form-control" onChange={this.onChange}/>
					<label
						className="fixed-flex min-w-45 margin-0 margin-r-10 text-center">{unitsShort[this.selfState.units] || 'h/km'}</label>
				</div>
				<div className="td fixed-flex min-w-165">
					<ClearableInput ref={this.onSetRef} name="date" type="date" placeholder="dd/mm/yyyy"
					                defaultValue={new Date()} required className="form-control margin-r-10"
					                onChange={this.onChange}/>
				</div>
				<div className="td flex-center">
					<Button idx={n} action="save" className="btn btn-primary hor-center w-60" onClick={onClick}>
						<i className="fa fa-check"/>
					</Button>
				</div>
			</TRow>;
		}
	}

	render() {
		const {readonly} = this.props;
		return <Table
			className="NewMonitoringPlanTable NewMonitoringPlanTable-WorkingHrsOrKm w-full-calc-add-10 min-h-90 h-auto -margin-t-5 -margin-l-10 margin-b-10 padding-0">
			<label className="">Working {this.selfState.units || 'Time/Distance'} Usage</label>
			<THead className="align-left">
				<div className="td fixed-flex min-w-30">#</div>
				<div className="td font-size-14">Opening {this.selfState.units || 'Time/Distance'}</div>
				<div className="td font-size-14">Closing {this.selfState.units || 'Time/Distance'}</div>
				<div className="td font-size-14">Total {this.selfState.units || 'Time/Distance'} Used</div>
				<div className="td fixed-flex min-w-165 font-size-14">Date</div>
				<div className={"td fixed-flex padding-0 min-w-" + (!readonly ? "60" : "0")}/>
			</THead>
			<TBody ref="body" title="Asset Monitoring Plan" renderItem={this.renderItem}
			       onClick={this.onClick}
			       state={this.state} onLoadList={this.onLoadList} disablePullToRefresh={true}/>
		</Table>;
	}
}

//</editor-fold>

//<editor-fold desc="NewMonitoringPlanFuelUsageTable">
@observer
class NewMonitoringPlanFuelUsageTable extends ATableSavable {

	@observable
	selfState = {
		units: null
	};

	constructor(props) {
		super(props);

		const {defaultValue} = this.props;
		if (defaultValue) {
			this.state.list = toJS(defaultValue);
		}

		const {onChange, name} = this.props;
		onChange && onChange(toJS(this.state.list.filter(v => !!v)), name, this);

		this.insertAt = this.insertAt.bind(this);

		this.renderItem = this.renderItem.bind(this)
	}

	insertAt(list, form) {
		list.insertAt(list.length - 1, form);
	}

	onClickComplete(e, el) {
		let {action, idx, item} = el.props;
		if (action === "save") {

		} else if (action === "saveEdit") {

		} else if (action === "delete") {

		}
	}

	onPostChange(val, name, el) {
		if (name === 'refilled_fuel' || name === 'current_hrs_or_km') {
			execWhen(() => this.ctrl_refs.working_hrs_or_km && this.ctrl_refs.refilled_fuel && this.ctrl_refs.current_hrs_or_km).then(() => {
				const {working_hrs_or_km, refilled_fuel, current_hrs_or_km} = this.ctrl_refs;
				if (refilled_fuel.hasValue && current_hrs_or_km.hasValue) {
					const {newCurrVal} = this;
					if (!newCurrVal) {
						return;
					}

					working_hrs_or_km.setEditable(true);
					const value = current_hrs_or_km.value - newCurrVal;
					if (value >= 0) {
						working_hrs_or_km.value = value;
					} else {

					}
					working_hrs_or_km.setEditable(false);
				}
			});
		}
	}

	setUnits(units) {
		this.selfState.units = units;
		const list = this.state.list.slice();
		this.state.list = list;
	}

	@computed get newCurrVal() {
		const list = [...this.list];
		// console.log('list1', list.map(v => v.date));
		list.sortBy('date');
		// console.log('list2', list.map(v => v.date));
		let lastItem = list.pop();
		let newCurrVal = lastItem ? parseInt(lastItem.current_hrs_or_km) : null;

		if (!newCurrVal) {
			const {monitoring_plan_working_distance_or_time_list = []} = this.props.state;
			const list = [...monitoring_plan_working_distance_or_time_list];
			// console.log('list1', list.map(v => v.date));
			list.sortBy('date');
			// console.log('list2', list.map(v => v.date));
			lastItem = list.pop();
			newCurrVal = lastItem ? parseInt(lastItem.working_hrs_or_km_closing) : null;
		}
		if (!newCurrVal) {
			const {current_hrs_or_km} = this.ctrl_refs;
			if (current_hrs_or_km) {
				newCurrVal = current_hrs_or_km.value;
			}
		}

		return newCurrVal;
	}

	renderItem(n, onClick) {
		const {readonly} = this.props;
		const item = this.state.list[n];

		const {newCurrVal} = this;

		if (item) {
			const {id, refilled_fuel, current_hrs_or_km, working_hrs_or_km, date, receipt, cost} = item;
			return <TRow key={"item-" + n} className="tr-readonly w-full">
				<div className="td fixed-flex min-w-30"><span className="counter">{n + 1}</span></div>
				<div className="td">{refilled_fuel}l</div>
				<div className="td">{current_hrs_or_km}{unitsShort[this.selfState.units] || 'h/km'}</div>
				<div className="td">{working_hrs_or_km}{unitsShort[this.selfState.units] || 'h/km'}</div>
				<div className="td fixed-flex min-w-165">{Dates.formatDate(date)}</div>
				<div className="td fixed-flex min-w-190">{receipt ? 'Yes' : 'N/A'}</div>
				<div className="td fixed-flex min-w-100">{cost || 'N/A'}</div>
				{!readonly && <div className="td fixed-flex min-w-50 padding-l-0">
					<Button idx={n} action="delete" className="btn btn-primary pull-right w-40" onClick={onClick}>
						<i className="fa fa-times-circle"/>
					</Button>
				</div>}
				{readonly && <div className="td fixed-flex min-w-0 padding-0"></div>}
			</TRow>;
		} else {

			if (isNumber(newCurrVal)) {
				execWhen(() => this.ctrl_refs.current_hrs_or_km).then(ref => {
					ref.value = newCurrVal;
					// ref.min = newCurrVal;
				});
			}

			return <TRow key="item-new" className="w-full padding-t-10 padding-b-10">
				<div className="td fixed-flex min-w-30"></div>
				<div className="td td-number flex">
					<ClearableInput ref={this.onSetRef} name="refilled_fuel" type="number" required isClearable={false}
					                className="form-control" onChange={this.onChange}/>
					<label className="fixed-flex min-w-20 margin-0 margin-r-10 text-center">l</label>
				</div>
				<div className="td td-number flex">
					<ClearableInput ref={this.onSetRef} name="current_hrs_or_km" type="number" required
					                isClearable={false}
					                className="form-control" onChange={this.onChange}/>
					<label
						className="fixed-flex min-w-45 margin-0 margin-r-10 text-center">{unitsShort[this.selfState.units] || 'h/km'}</label>
				</div>
				<div className="td td-number flex">
					<ClearableInput ref={this.onSetRef} name="working_hrs_or_km" type="number" isEditable={false}
					                isClearable={false}
					                required className="form-control" onChange={this.onChange}/>
					<label
						className="fixed-flex min-w-45 margin-0 margin-r-10 text-center">{unitsShort[this.selfState.units] || 'h/km'}</label>
				</div>
				<div className="td fixed-flex min-w-165">
					<ClearableInput ref={this.onSetRef} name="date" type="date" placeholder="dd/mm/yyyy"
					                defaultValue={new Date()} required className="form-control margin-r-10"
					                onChange={this.onChange}/>
				</div>
				<div className="td fixed-flex min-w-190">
					<UploadButton ref={this.onSetRef} name='receipt' onChange={this.onChange} required
					              type={['Photo', 'Word', 'Excel', 'PDF']}
					              buttonTitle='Receipt'
					              showOnlyIcon
					              className="form-control margin-t-10"/>
				</div>
				<div className="td fixed-flex min-w-100">
					<ClearableInput ref={this.onSetRef} name="cost" type="number" placeholder="Cost"
					                required className="form-control" onChange={this.onChange}/>
				</div>
				<div className="td flex-center">
					<Button idx={n} action="save" className="btn btn-primary hor-center w-60" onClick={onClick}>
						<i className="fa fa-check"/>
					</Button>
				</div>
			</TRow>;
		}
	}

	render() {
		const {readonly} = this.props;
		return <Table
			className="NewMonitoringPlanTable NewMonitoringPlanTable-FuelUsage w-full-calc-add-10 min-h-90 h-auto -margin-t-5 -margin-l-10 margin-b-10 padding-0">
			<label className="">Fuel Usage</label>
			<THead className="align-left">
				<div className="td fixed-flex min-w-30">#</div>
				<div className="td font-size-14">Refilled Fuel</div>
				<div className="td font-size-14">Current {this.selfState.units || 'Time/Distance'}</div>
				<div className="td font-size-14">Used {this.selfState.units || 'Time/Distance'}</div>
				<div className="td fixed-flex min-w-165 font-size-14">Date</div>
				<div className="td fixed-flex min-w-190 font-size-14">Receipt</div>
				<div className="td fixed-flex min-w-100 font-size-14">Cost</div>
				<div className={"td fixed-flex padding-0 min-w-" + (!readonly ? "60" : "0")}/>
			</THead>
			<TBody ref="body" title="Asset Monitoring Plan" renderItem={this.renderItem} onClick={this.onClick}
			       state={this.state} onLoadList={this.onLoadList} disablePullToRefresh={true}/>
		</Table>;
	}
}

//</editor-fold>

//<editor-fold desc="NewMaintenancePlanTable">
@observer
class NewMaintenancePlanTable extends ATableSavable {

	@observable
	selfState = {
		lists: {
			reason_for_service: ['Due Date', 'Mechanical Failure', 'Wear & Tear'].map(value => {
				return {label: value, value};
			}),
			service: ['Minor', 'Major'].map(value => {
				return {label: value, value};
			})
		},
		units: null,
		cost_and_receipt: null,
		parts_used: null
	};

	constructor(props) {
		super(props);

		const {defaultValue} = this.props;
		if (defaultValue) {
			this.state.list = toJS(defaultValue);
		}

		const {onChange, name} = this.props;
		onChange && onChange(toJS(this.state.list.filter(v => !!v)), name, this);

		this.insertAt = this.insertAt.bind(this);

		this.onNewPartCostAndReceiptDialog = this.onNewPartCostAndReceiptDialog.bind(this);
		this.onViewPartCostAndReceiptDialog = this.onViewPartCostAndReceiptDialog.bind(this);
		this.onNewPartsUsedListDialog = this.onNewPartsUsedListDialog.bind(this);
		this.onViewPartDialog = this.onViewPartDialog.bind(this);
	}

	insertAt(list, form) {
		list.insertAt(list.length - 1, form);
	}

	onClickComplete(e, el) {
		let {action, idx, item} = el.props;
		if (action === "save") {

		} else if (action === "saveEdit") {

		} else if (action === "delete") {

		}
	}

	setUnits(units) {
		this.selfState.units = units;
		const list = this.state.list.slice();
		this.state.list = list;
	}

	onNewPartCostAndReceiptDialog(part) {
		return this.refs.newPartCostAndReceiptDialog.open(part);
	}

	onViewPartCostAndReceiptDialog(part) {
		return this.refs.profilePartCostAndReceiptDialog.open(part);
	}

	onNewPartsUsedListDialog(part) {
		return this.refs.newPartsUsedListDialog.open(part);
	}

	onViewPartDialog(part) {
		return this.refs.profilePartDialog.open(part);
	}

	renderItem(n, onClick) {
		const {readonly, asset} = this.props;
		const item = this.state.list[n];
		if (item) {
			const {id, reason_for_service, service, service_hrs_or_km, service_date, parts_used, cost_and_receipt} = item;
			return <TRow key={"item-" + n} className="min-h-60 tr-readonly w-full">
				<div className="td fixed-flex min-w-30"><span className="counter">{n + 1}</span></div>
				<div className="td">{reason_for_service}</div>
				<div className="td fixed-flex min-w-130">{service}</div>
				<div
					className="td fixed-flex min-w-150">{service_hrs_or_km}{unitsShort[this.selfState.units] || 'h/km'}</div>
				<div className="td fixed-flex min-w-165">{Dates.formatDate(service_date)}</div>
				<div className="td td-PartsUsed fixed-flex min-w-140">
					<PartsUsed
						name='parts_used'
						onEdit={this.onNewPartsUsedListDialog}
						onView={this.onViewPartDialog}
						item={item}
						parts_used={parts_used}
						readonly
						isEditable={!readonly}
					/>
				</div>
				<div className="td td-CostAndReceipt fixed-flex min-w-135">
					<CostAndReceipt
						name='cost_and_receipt'
						onEdit={this.onNewPartCostAndReceiptDialog}
						onView={this.onViewPartCostAndReceiptDialog}
						item={item}
						cost_and_receipt={cost_and_receipt}
						readonly
						isEditable={!readonly}
					/>
				</div>
				{!readonly && <div className="td fixed-flex min-w-50 padding-l-0">
					<Button idx={n} action="delete" className="btn btn-primary pull-right w-40" onClick={onClick}>
						<i className="fa fa-times-circle"/>
					</Button>
				</div>}
				{readonly && <div className="td fixed-flex min-w-0 padding-0"></div>}
			</TRow>;
		} else {
			return <TRow key="item-new" className="min-h-60 w-full padding-t-10 padding-b-10">
				<div className="td fixed-flex min-w-30"></div>
				<div className="td">
					<ClearableInput ref={this.onSetRef} name="reason_for_service" type="select" placeholder="Select..."
					                required className="form-control margin-r-10" onChange={this.onChange}
					                values={this.selfState.lists.reason_for_service} returnValue/>
				</div>
				<div className="td fixed-flex min-w-130">
					<ClearableInput ref={this.onSetRef} name="service" type="select" placeholder="Select..."
					                required className="form-control margin-r-10" onChange={this.onChange}
					                values={this.selfState.lists.service} returnValue/>
				</div>
				<div className="td fixed-flex min-w-150 td-number flex">
					<ClearableInput ref={this.onSetRef} name="service_hrs_or_km" type="number" isClearable={false}
					                defaultValue={CalculationUtils.getTimeOrDistanceTakenFromLastService(asset)}
					                required className="form-control" onChange={this.onChange}/>
					<label
						className="fixed-flex min-w-45 margin-0 margin-r-10 text-center">{unitsShort[this.selfState.units] || 'h/km'}</label>
				</div>
				<div className="td fixed-flex min-w-165">
					<ClearableInput ref={this.onSetRef} name="service_date" type="date" placeholder="dd/mm/yyyy"
					                required className="form-control margin-r-10" onChange={this.onChange}/>
				</div>
				<div className="td td-PartsUsed fixed-flex min-w-140">
					<PartsUsed
						ref={this.onSetRef}
						name='parts_used'
						onEdit={this.onNewPartsUsedListDialog}
						state={this.selfState}
						onChange={this.onChange}
					/>
				</div>
				<div className="td td-CostAndReceipt fixed-flex flex min-w-135">
					<CostAndReceipt
						ref={this.onSetRef}
						name='cost_and_receipt'
						onEdit={this.onNewPartCostAndReceiptDialog}
						state={this.selfState}
						onChange={this.onChange}
					/>
					{/*<UploadButton ref={this.onSetRef} name='receipt' onChange={this.onChange} required*/}
					{/*              type={['Photo', 'Word', 'Excel', 'PDF']}*/}
					{/*              buttonTitle='Receipt'*/}
					{/*              showOnlyIcon*/}
					{/*              className="form-control"/>*/}
				</div>
				{/*<div className="td fixed-flex min-w-100">*/}
				{/*    <ClearableInput ref={this.onSetRef} name="cost" type="number" placeholder="Cost"*/}
				{/*                    required className="form-control" onChange={this.onChange}/>*/}
				{/*</div>*/}
				<div className="td flex-center">
					<Button idx={n} action="save" className="btn btn-primary hor-center w-60" onClick={onClick}>
						<i className="fa fa-check"/>
					</Button>
				</div>
			</TRow>;
		}
	}

	render() {
		const {readonly} = this.props;
		return (<Table
			className="NewMaintenancePlanTable w-full-calc-add-10 min-h-90 h-auto -margin-t-5 -margin-l-10 margin-b-10 padding-0">
			<THead className="align-left">
				<div className="td fixed-flex min-w-30">#</div>
				<div className="td font-size-14">Reason For Service</div>
				<div className="td fixed-flex min-w-130 font-size-14">Service</div>
				<div
					className="td fixed-flex min-w-150 font-size-14">Service {this.selfState.units || 'Time/Distance'}</div>
				<div className="td fixed-flex min-w-165 font-size-14">Service Date</div>
				<div className="td fixed-flex min-w-140 font-size-14">Parts Used</div>
				<div className="td fixed-flex min-w-135 font-size-14">Cost & Receipt</div>
				<div className={"td fixed-flex padding-0 min-w-" + (!readonly ? "60" : "0")}/>
			</THead>
			<TBody ref="body" title="Asset Maintenance Plan" renderItem={this.renderItem} onClick={this.onClick}
			       state={this.state} onLoadList={this.onLoadList} disablePullToRefresh={true}>
				<MaintenancePlanStats state={this.state} selfState={this.selfState}/>
			</TBody>

			<NewPartCostAndReceiptDialog ref='newPartCostAndReceiptDialog'/>
			<ProfilePartCostAndReceiptDialog ref='profilePartCostAndReceiptDialog'/>

			<NewPartsUsedListDialog ref='newPartsUsedListDialog'/>
			<ProfilePartDialog ref='profilePartDialog'/>
		</Table>);
	}
}

//</editor-fold>

//<editor-fold desc="NewCalibrationRecordTable">
@observer
class NewCalibrationRecordTable extends ATableSavable {

	@observable
	selfState = {};

	constructor(props) {
		super(props);

		const {defaultValue} = this.props;
		if (defaultValue) {
			this.state.list = toJS(defaultValue);
		}

		const {onChange, name} = this.props;
		onChange && onChange(toJS(this.state.list.filter(v => !!v)), name, this);

		this.insertAt = this.insertAt.bind(this);
	}

	insertAt(list, form, idx) {
		list.insertAt(list.length - 1, form);
	}

	onClickComplete(e, el) {
		let {action, idx, item} = el.props;
		if (action === "save") {

		} else if (action === "saveEdit") {

		} else if (action === "delete") {

		}
	}

	renderItem(n, onClick) {
		const {readonly} = this.props;
		const item = this.state.list[n];
		if (item) {
			const {id, calibrating_company, reference_standard, certificate_num, calibration_date} = item;
			return <TRow key={"item-" + n} className="tr-readonly w-full">
				<div className="td fixed-flex min-w-20"><span className="counter">{n + 1}</span></div>
				<div className="td">{calibrating_company}</div>
				<div className="td fixed-flex min-w-160">{reference_standard}</div>
				<div className="td fixed-flex min-w-160">{certificate_num}</div>
				<div className="td fixed-flex min-w-175">{Dates.formatDate(calibration_date)}</div>
				{!readonly ? <div className="td fixed-flex min-w-50 padding-l-0">
					<Button idx={n} action="delete" className="btn btn-primary pull-right w-40" onClick={onClick}>
						<i className="fa fa-times-circle"/>
					</Button>
				</div> : null}
				{readonly ? <div className="td fixed-flex min-w-0 padding-0"/> : null}
			</TRow>;
		} else {
			// alert(this.list.length)
			return <TRow key="item-new" className="w-full padding-t-10 padding-b-10 grid-1 grid-gap-10">
				<div className="td grid-2 grid-gap-10">
					<ClearableInput ref={this.onSetRef} name="calibrating_company" type="text" placeholder="Calibrating Company"
					                required className="form-control" onChange={this.onChange}/>
					<ClearableInput ref={this.onSetRef} name="reference_standard" type="text" placeholder="Reference Standard"
					                className="form-control" onChange={this.onChange}/>
					<ClearableInput ref={this.onSetRef} name="certificate_num" type="text" placeholder="Certificate No."
					                className="form-control" onChange={this.onChange}/>
					<ClearableInput ref={this.onSetRef} name="calibration_date" type="date" placeholder="Calibration Date"
					                required className="form-control" onChange={this.onChange}/>
				</div>
				<div className="td flex-center">
					<Button idx={n} action="save" className="btn btn-primary hor-center w-60" onClick={onClick}>
						<i className="fa fa-check"/>
					</Button>
				</div>
			</TRow>;
		}
	}

	render() {
		const {readonly} = this.props;
		return (<Table
			className="NewCalibrationRecordTable w-full-calc-add-10 min-h-90 h-auto -margin-t-5 -margin-l-10 margin-b-10 padding-0">
			<THead className="align-left">
				<div className="td fixed-flex min-w-20">#</div>
				<div className="td font-size-14">Calibrating Company</div>
				<div className="td fixed-flex min-w-160 font-size-14">Reference Standard</div>
				<div className="td fixed-flex min-w-160 font-size-14">Certificate No.</div>
				<div className="td fixed-flex min-w-175 font-size-14">Calibration Date</div>
				<div className={"td fixed-flex padding-0 min-w-" + (!readonly ? "60" : "0")}/>
			</THead>
			<TBody ref="body" title="Asset Calibration Record" renderItem={this.renderItem} onClick={this.onClick}
			       state={this.state} onLoadList={this.onLoadList} disablePullToRefresh={true}/>
		</Table>);
	}
}

//</editor-fold>

//<editor-fold desc="NewDocumentTable">
@observer
class NewDocumentTable extends ATableSavable {

	@observable
	selfState = {
		lists: {
			type: ['Clearance Certificate', 'Vehicle Registration Certificate', 'Work Manual', 'Work Procedure']
		}
	};

	constructor(props) {
		super(props);

		const {defaultValue} = this.props;
		if (defaultValue) {
			this.state.list = toJS(defaultValue);
		}

		const {onChange, name} = this.props;
		onChange && onChange(toJS(this.state.list.filter(v => !!v)), name, this);

		this.insertAt = this.insertAt.bind(this);
	}

	insertAt(list, form) {
		list.insertAt(list.length - 1, form);
	}

	renderItem(n, onClick) {
		const {readonly} = this.props;
		const item = this.state.list[n];
		if (item) {
			const {type, title, expiry, desc, doc} = item;
			return <TRow key={"item-" + n} className="tr-readonly w-full">
				<div className="td fixed-flex min-w-20"><span className="counter">{n + 1}</span></div>
				<div className="td fixed-flex min-w-160">{type}</div>
				<div className="td">{title}</div>
				<div className="td">{desc}</div>
				<div className="td fixed-flex min-w-160">
					<UploadButton
						ref={this.onSetRef}
						name="doc"
						buttonTitle="Upload Document"
						type={['PDF', 'Word']}
						defaultValue={doc}
						showOnlyIcon
						readonly={readonly}
						className="col-lg-12"
						onChange={this.onChange}
					/>
				</div>
				<div className="td fixed-flex min-w-160">{Dates.formatDate(expiry)}</div>
				{!readonly ? <div className="td fixed-flex min-w-50 padding-l-0">
					<Button idx={n} action="delete" className="btn btn-primary pull-right w-40" onClick={onClick}>
						<i className="fa fa-times-circle"/>
					</Button>
				</div> : null}
				{readonly ? <div className="td fixed-flex min-w-0 padding-0"/> : null}
			</TRow>;
		} else {
			// alert(this.list.length)
			return <TRow key="item-new" className="w-full grid-1 grid-gap-10 padding-t-10 padding-b-10">
				<ClearableInput ref={this.onSetRef} name="type" type="select" placeholder="Document Type"
				                required className="col-lg-12 w-full form-control margin-r-10" onChange={this.onChange} values={this.selfState.lists.type} returnValue/>
				<ClearableInput ref={this.onSetRef} name="title" type="text" placeholder="Title"
				                className="col-lg-12 w-full form-control margin-r-10" onChange={this.onChange}/>
				<ClearableInput ref={this.onSetRef} name="desc" type="textarea" placeholder="Description"
				                className="col-lg-12 w-full form-control margin-r-10" onChange={this.onChange}/>
				<UploadButton
					ref={this.onSetRef}
					name="doc"
					buttonTitle="Upload Document"
					type={['PDF', 'Word']}
					showOnlyIcon
					className="col-lg-12 w-full margin-t-10"
					onChange={this.onChange}
				/>
				<ClearableInput ref={this.onSetRef} name="expiry" type="date" placeholder="Expiry Date"
				                required className="col-lg-12 w-full form-control" onChange={this.onChange}/>
				<Button idx={n} action="save" className="btn btn-primary hor-center w-40" onClick={onClick}>
					<i className="fa fa-check"/>
				</Button>
			</TRow>;
		}
	}

	render() {
		const {readonly} = this.props;
		return (<Table
			className="NewDocumentTable w-full-calc-add-10 min-h-90 h-auto -margin-t-5 -margin-l-10 margin-b-10 padding-0">
			<THead className="align-left">
				<div className="td fixed-flex min-w-20">#</div>
				<div className="td fixed-flex min-w-160 font-size-14">Document Type</div>
				<div className="td font-size-14">Title</div>
				<div className="td font-size-14">Description</div>
				<div className="td fixed-flex min-w-160 font-size-14">Document</div>
				<div className="td fixed-flex min-w-160 font-size-14">Expiry</div>
				<div className={"td fixed-flex padding-0 min-w-" + (!readonly ? "60" : "0")}/>
			</THead>
			<TBody ref="body" title="Asset Documents" renderItem={this.renderItem} onClick={this.onClick}
			       state={this.state} onLoadList={this.onLoadList} disablePullToRefresh={false}/>
		</Table>);
	}
}

//</editor-fold>

export {
	NewMonitoringPlanWorkingHrsOrKmTable,
	NewMonitoringPlanFuelUsageTable,
	NewMaintenancePlanTable,
	NewCalibrationRecordTable,
	NewDocumentTable,
};