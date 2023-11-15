//<editor-fold desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, extendObservable, observable, toJS} from 'mobx';

import {CalculationUtils, Dates, execWhen, ShouldUpdate} from 'utils/Utils';

import {Button, ClearableInput, UploadButton} from 'components/inputs';
import {ATableSavable, Table, TBody, THead, TRow} from 'components/tables';

import NewPartCostAndReceiptDialog from "../../PartsTab/forms/NewPartCostAndReceiptDialog";
import ProfilePartCostAndReceiptDialog from "../../PartsTab/forms/ProfilePartCostAndReceiptDialog";
import ProfilePartDialog from "../../PartsTab/forms/ProfilePartDialog";
import {MaintenancePlanStats} from "./AssetStats";
import {CostAndReceipt, PartsUsed} from "./AssetComponents";
import NewPartsUsedListDialog from "../../PartsTab/forms/NewPartsUsedListDialog";
import upsertAssetCalibrationRecordListItem
    from "mutations/all/Asset/upsertAssetCalibrationRecordListItem";
import deleteAssetCalibrationRecordListItem
    from "mutations/all/Asset/deleteAssetCalibrationRecordListItem";
import upsertAssetMaintenancePlanListItem
    from "../../../../../../mutations/all/Asset/upsertAssetMaintenancePlanListItem";
import deleteAssetMaintenancePlanListItem
    from "../../../../../../mutations/all/Asset/deleteAssetMaintenancePlanListItem";
import deleteAssetMonitoringPlanFuelUsageListItem
    from "../../../../../../mutations/all/Asset/deleteAssetMonitoringPlanFuelUsageListItem";
import upsertAssetMonitoringPlanFuelUsageListItem
    from "../../../../../../mutations/all/Asset/upsertAssetMonitoringPlanFuelUsageListItem";
import upsertAssetMonitoringPlanWorkingHrsOrKmListItem
    from "../../../../../../mutations/all/Asset/upsertAssetMonitoringPlanWorkingHrsOrKmListItem";
import deleteAssetMonitoringPlanWorkingHrsOrKmListItem
    from "../../../../../../mutations/all/Asset/deleteAssetMonitoringPlanWorkingHrsOrKmListItem";
import insertAssetCalibrationRecord from "../../../../../../mutations/all/Asset/insertAssetCalibrationRecord";
import insertAssetMaintenancePlan from "../../../../../../mutations/all/Asset/insertAssetMaintenancePlan";
import insertAssetMonitoringPlan from "../../../../../../mutations/all/Asset/insertAssetMonitoringPlan";
import insertAssetDoc from "../../../../../../mutations/all/Asset/insertAssetDoc";
import updateAssetDoc from "../../../../../../mutations/all/Asset/updateAssetDoc";
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
        let {savable, item: assetItem, onUpdated} = this.props;

        if (savable && assetItem) {
            let {action, idx, item} = el.props;
            let {
                // id,
                data: old_data,
                data: {monitoring_plan_list}
            } = assetItem;

            //7 done
            const lastMonitoringPlan = (monitoring_plan_list || []).getLastElement();
            const {
                // id,
                working_distance_or_time_list = [],
            } = lastMonitoringPlan || {};

            const {id, working_hrs_or_km_opening, working_hrs_or_km_closing, working_hrs_or_km, date} = item;

            if (action === "save" || action === "saveEdit") {
                progressDialog.open();
                let promise;
                if (lastMonitoringPlan) {
                    promise = upsertAssetMonitoringPlanWorkingHrsOrKmListItem({
                        id,
                        monitoring_plan_id: lastMonitoringPlan.id,
                        working_hrs_or_km_opening,
                        working_hrs_or_km_closing,
                        date,
                    }).then(savedItem => {
                        if (!savedItem) {
                            if (id) {
                                infoDialog.open("Sorry! Record couldn't be updated.");
                            } else {
                                infoDialog.open("Sorry! Record couldn't be added.");
                            }
                        } else {
                            if (id) {
                                infoDialog.open("Record successfully updated.");
                            } else {
                                working_distance_or_time_list.push(savedItem.data);
                                infoDialog.open("Record successfully added.");
                            }

                            if (!monitoring_plan_list) {
                                monitoring_plan_list = [{working_distance_or_time_list}];
                            }

                            extendObservable(old_data, {monitoring_plan_list});
                        }

                        infoDialog.close(2000);
                    });
                } else {
                    promise = insertAssetMonitoringPlan({
                        asset_id: assetItem.id,
                        working_distance_or_time_list: {
                            data: [{
                                working_hrs_or_km_opening,
                                working_hrs_or_km_closing,
                                date: Dates.formatDateSQL(date),
                            }]
                        }
                    }).then(savedItem => {
                        if (!savedItem) {
                            infoDialog.open("Sorry! Record couldn't be added.");
                        } else {
                            infoDialog.open("Record successfully added.");
                            extendObservable(old_data, {
                                monitoring_plan_list: [savedItem.data]
                            });
                        }

                        infoDialog.close(2000);
                    });
                }
                promise.catch(err => {
                    infoDialog.open("An error occurred. Please try again later.");
                    infoDialog.close(2000);
                    console.error(err);
                }).finally(() => {
                    setTimeout(() => progressDialog.close());
                });
            } else if (action === "delete") {
                confirmDialog.open("Are you sure you want to remove the item?").then(res => {
                    if (!res) return;

                    progressDialog.open();
                    deleteAssetMonitoringPlanWorkingHrsOrKmListItem(id).then(savedItem => {
                        if (!savedItem) {
                            infoDialog.open("Sorry! Record couldn't be removed.");
                        } else {
                            infoDialog.open("Record successfully removed.");
                            working_distance_or_time_list.removeIf(v => v.id === id);
                        }

                        infoDialog.close(2000);
                    }).catch(err => {
                        infoDialog.open("An error occurred. Please try again later.");
                        infoDialog.close(2000);
                        console.error(err);
                    }).finally(() => {
                        setTimeout(() => progressDialog.close());
                    });
                });
            }
            // onUpdate && onUpdate(e, el);
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

            return <TRow key="item-new" className="w-full padding-t-10 padding-b-10 grid-1 grid-gap-10">
                <div className="td w-full grid-1 grid-gap-10">
                    <div className="td td-number flex">
                        <ClearableInput ref={this.onSetRef} name="working_hrs_or_km_opening" type="number"
                                        placeholder={`Opening ${this.selfState.units || 'Time/Distance'}`}
                                        isClearable={false}
                                        required className="form-control" onChange={this.onChange}/>
                        <label
                            className="fixed-flex min-w-45 margin-0 text-center">{unitsShort[this.selfState.units] || 'h/km'}</label>
                    </div>
                    <div className="td td-number flex">
                        <ClearableInput ref={this.onSetRef} name="working_hrs_or_km_closing" type="number"
                                        placeholder={`Closing ${this.selfState.units || 'Time/Distance'}`}
                                        isClearable={false}
                                        required className="form-control" onChange={this.onChange}/>
                        <label
                            className="fixed-flex min-w-45 margin-0 text-center">{unitsShort[this.selfState.units] || 'h/km'}</label>
                    </div>
                    <div className="td td-number flex">
                        <ClearableInput ref={this.onSetRef} name="working_hrs_or_km" type="number"
                                        placeholder={`Total ${this.selfState.units || 'Time/Distance'} Used`}
                                        isEditable={false} isClearable={false}
                                        required className="form-control" onChange={this.onChange}/>
                        <label
                            className="fixed-flex min-w-45 margin-0 text-center">{unitsShort[this.selfState.units] || 'h/km'}</label>
                    </div>
                    <ClearableInput ref={this.onSetRef} name="date" type="date"
                                    placeholder="Date"
                                    defaultValue={new Date()} required className="form-control margin-r-10"
                                    onChange={this.onChange}/>
                </div>
                <div className="td w-full flex-center">
                    <Button idx={n} action="save" className="btn btn-primary border-radius-20 hor-center w-100"
                            onClick={onClick}>
                        <i className="fa fa-plus"/> ADD
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
        let {savable, item: assetItem, onUpdated} = this.props;

        if (savable && assetItem) {
            let {action, idx, item} = el.props;
            let {
                // id,
                data: old_data,
                data: {monitoring_plan_list}
            } = assetItem;

            //7 done
            const lastMonitoringPlan = (monitoring_plan_list || []).getLastElement();
            const {
                // id,
                fuel_usage_list = [],
            } = lastMonitoringPlan || {};

            const {id, refilled_fuel, current_hrs_or_km, working_hrs_or_km, date, receipt, cost} = item;

            if (action === "save" || action === "saveEdit") {
                progressDialog.open();
                let promise;
                if (lastMonitoringPlan) {
                    promise = upsertAssetMonitoringPlanFuelUsageListItem({
                        id,
                        monitoring_plan_id: lastMonitoringPlan.id,
                        refilled_fuel,
                        current_hrs_or_km,
                        working_hrs_or_km,
                        date,
                        receipt,
                        cost,
                    }).then(savedItem => {
                        if (!savedItem) {
                            if (id) {
                                infoDialog.open("Sorry! Record couldn't be updated.");
                            } else {
                                infoDialog.open("Sorry! Record couldn't be added.");
                            }
                        } else {
                            if (id) {
                                infoDialog.open("Record successfully updated.");
                            } else {
                                fuel_usage_list.push(savedItem.data);
                                infoDialog.open("Record successfully added.");
                            }

                            if (!monitoring_plan_list) {
                                monitoring_plan_list = [{fuel_usage_list}];
                            }

                            extendObservable(old_data, {monitoring_plan_list});
                        }

                        infoDialog.close(2000);
                    });
                } else {
                    promise = insertAssetMonitoringPlan({
                        asset_id: assetItem.id,
                        fuel_usage_list: {
                            data: [{
                                refilled_fuel,
                                current_hrs_or_km,
                                working_hrs_or_km,
                                date: Dates.formatDateSQL(date),
                                receipt: receipt,
                                cost,
                            }]
                        }
                    }).then(savedItem => {
                        if (!savedItem) {
                            infoDialog.open("Sorry! Record couldn't be added.");
                        } else {
                            infoDialog.open("Record successfully added.");
                            extendObservable(old_data, {
                                monitoring_plan_list: [savedItem.data]
                            });
                        }

                        infoDialog.close(2000);
                    });
                }
                promise.catch(err => {
                    infoDialog.open("An error occurred. Please try again later.");
                    infoDialog.close(2000);
                    console.error(err);
                }).finally(() => {
                    setTimeout(() => progressDialog.close());
                });
            } else if (action === "delete") {
                confirmDialog.open("Are you sure you want to remove the item?").then(res => {
                    if (!res) return;

                    progressDialog.open();
                    deleteAssetMonitoringPlanFuelUsageListItem(id).then(savedItem => {
                        if (!savedItem) {
                            infoDialog.open("Sorry! Record couldn't be removed.");
                        } else {
                            infoDialog.open("Record successfully removed.");
                            fuel_usage_list.removeIf(v => v.id === id);
                        }

                        infoDialog.close(2000);
                    }).catch(err => {
                        infoDialog.open("An error occurred. Please try again later.");
                        infoDialog.close(2000);
                        console.error(err);
                    }).finally(() => {
                        setTimeout(() => progressDialog.close());
                    });
                });
            }
            // onUpdate && onUpdate(e, el);
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

            return <TRow key="item-new" className="w-full padding-t-10 padding-b-10 grid-1 grid-gap-10">
                <div className="td w-full grid-1 grid-gap-10">
                    <div className="td td-number flex">
                        <ClearableInput ref={this.onSetRef} name="refilled_fuel" type="number" required
                                        isClearable={false}
                                        placeholder="Refilled Fuel"
                                        className="form-control" onChange={this.onChange}/>
                        <label className="fixed-flex min-w-20 margin-0 text-center">l</label>
                    </div>
                    <div className="td td-number flex">
                        <ClearableInput ref={this.onSetRef} name="current_hrs_or_km" type="number" required
                                        isClearable={false}
                                        placeholder={`Current ${this.selfState.units || 'Time/Distance'}`}
                                        className="form-control" onChange={this.onChange}/>
                        <label
                            className="fixed-flex min-w-45 margin-0 text-center">{unitsShort[this.selfState.units] || 'h/km'}</label>
                    </div>
                    <div className="td td-number flex">
                        <ClearableInput ref={this.onSetRef} name="working_hrs_or_km" type="number" isEditable={false}
                                        isClearable={false}
                                        placeholder={`Used ${this.selfState.units || 'Time/Distance'}`}
                                        className="form-control" onChange={this.onChange}/>
                        <label
                            className="fixed-flex min-w-45 margin-0 text-center">{unitsShort[this.selfState.units] || 'h/km'}</label>
                    </div>
                    <ClearableInput ref={this.onSetRef} name="date" type="date" placeholder="dd/mm/yyyy"
                                    defaultValue={new Date()} required
                                    placeholder="Date"
                                    className="form-control margin-r-10"
                                    onChange={this.onChange}/>
                    <UploadButton ref={this.onSetRef} name='receipt' onChange={this.onChange}
                                  type={['Photo', 'Word', 'Excel', 'PDF']}
                                  buttonTitle='Receipt'
                                  showOnlyIcon
                                  className="form-control margin-t-10"/>
                    <ClearableInput ref={this.onSetRef} name="cost" type="number" placeholder="Cost"
                                    className="form-control" onChange={this.onChange}/>
                </div>
                <div className="td w-full flex-center">
                    <Button idx={n} action="save" className="btn btn-primary border-radius-20 hor-center w-100"
                            onClick={onClick}>
                        <i className="fa fa-plus"/> ADD
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
        let {savable, item: assetItem, onUpdated} = this.props;

        if (savable && assetItem) {
            let {action, idx, item} = el.props;
            let {
                // id,
                data: old_data,
                data: {maintenance_plan_list}
            } = assetItem;

            //8 done
            const lastMaintenancePlan = (maintenance_plan_list || []).getLastElement();
            const {
                // id,
                next_service_hrs_or_km,
                plan_list = [],
            } = lastMaintenancePlan || {};

            const {
                id,
                reason_for_service,
                service,
                service_hrs_or_km,
                service_date,
                parts_used,
                cost_and_receipt
            } = item;

            if (action === "save" || action === "saveEdit") {
                progressDialog.open();
                let promise;
                if (lastMaintenancePlan) {
                    promise = upsertAssetMaintenancePlanListItem({
                        id,
                        maintenance_plan_id: lastMaintenancePlan.id,
                        reason_for_service,
                        service,
                        service_hrs_or_km,
                        service_date,
                        parts_used,
                        cost: cost_and_receipt && cost_and_receipt.cost,
                        receipt: cost_and_receipt && cost_and_receipt.receipt,
                        parts_used_list: parts_used || [],
                    }).then(savedItem => {
                        if (!savedItem) {
                            if (id) {
                                infoDialog.open("Sorry! Record couldn't be updated.");
                            } else {
                                infoDialog.open("Sorry! Record couldn't be added.");
                            }
                        } else {
                            if (id) {
                                infoDialog.open("Record successfully updated.");
                            } else {
                                plan_list.push(savedItem.data);
                                infoDialog.open("Record successfully added.");
                            }

                            if (!maintenance_plan_list) {
                                maintenance_plan_list = [{plan_list}];
                            }

                            extendObservable(old_data, {maintenance_plan_list});
                        }

                        infoDialog.close(2000);
                    });
                } else {
                    promise = insertAssetMaintenancePlan({
                        asset_id: assetItem.id,
                        // next_service_hrs_or_km,
                        plan_list: {
                            data: [{
                                reason_for_service,
                                service,
                                service_hrs_or_km,
                                service_date: Dates.formatDateSQL(service_date),
                                cost: cost_and_receipt && cost_and_receipt.cost,
                                receipt: cost_and_receipt && cost_and_receipt.receipt,
                                parts_used_list: {data: parts_used || [],},
                            }]
                        }
                    }).then(savedItem => {
                        if (!savedItem) {
                            infoDialog.open("Sorry! Record couldn't be added.");
                        } else {
                            if (!savedItem) {
                                infoDialog.open("Sorry! Record couldn't be added.");
                            } else {
                                infoDialog.open("Record successfully added.");
                                extendObservable(old_data, {
                                    maintenance_plan_list: [savedItem.data]
                                });
                            }
                        }

                        infoDialog.close(2000);
                    });
                }
                promise.catch(err => {
                    infoDialog.open("An error occurred. Please try again later.");
                    infoDialog.close(2000);
                    console.error(err);
                }).finally(() => {
                    setTimeout(() => progressDialog.close());
                });
            } else if (action === "delete") {
                confirmDialog.open("Are you sure you want to remove the item?").then(res => {
                    if (!res) return;

                    progressDialog.open();
                    deleteAssetMaintenancePlanListItem(id).then(savedItem => {
                        if (!savedItem) {
                            infoDialog.open("Sorry! Record couldn't be removed.");
                        } else {
                            infoDialog.open("Record successfully removed.");
                            plan_list.removeIf(v => v.id === id);
                        }

                        infoDialog.close(2000);
                    }).catch(err => {
                        infoDialog.open("An error occurred. Please try again later.");
                        infoDialog.close(2000);
                        console.error(err);
                    }).finally(() => {
                        setTimeout(() => progressDialog.close());
                    });
                });
            }
            // onUpdate && onUpdate(e, el);
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
            const {
                id,
                reason_for_service,
                service,
                service_hrs_or_km,
                service_date,
                parts_used,
                cost_and_receipt
            } = item;
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
            return <TRow key="item-new" className="w-full padding-t-10 padding-b-10 grid-1 grid-gap-10">
                <div className="td w-full grid-1 grid-gap-10">
                    <ClearableInput ref={this.onSetRef} name="reason_for_service" type="select"
                                    placeholder="Reason For Service..."
                                    required className="form-control margin-r-10" onChange={this.onChange}
                                    values={this.selfState.lists.reason_for_service} returnValue/>
                    <ClearableInput ref={this.onSetRef} name="service" type="select" placeholder="Service..."
                                    className="form-control margin-r-10" onChange={this.onChange}
                                    values={this.selfState.lists.service} returnValue/>
                    <div className="td fixed-flex min-w-150 td-number flex">
                        <ClearableInput ref={this.onSetRef} name="service_hrs_or_km" type="number" isClearable={false}
                                        defaultValue={CalculationUtils.getTimeOrDistanceTakenFromLastService(asset)}
                                        className="form-control" onChange={this.onChange}/>
                        <label
                            className="fixed-flex min-w-45 margin-0 margin-r-10 text-center">{unitsShort[this.selfState.units] || 'h/km'}</label>
                    </div>
                    <ClearableInput ref={this.onSetRef} name="service_date" type="date" placeholder="Service Date..."
                                    required className="form-control margin-r-10" onChange={this.onChange}/>
                    <div className="td td-PartsUsed fixed-flex grid-1 grid-gap-10 flex-center min-w-140">
                        <PartsUsed
                            ref={this.onSetRef}
                            name='parts_used'
                            onEdit={this.onNewPartsUsedListDialog}
                            state={this.selfState}
                            onChange={this.onChange}
                        />
                    </div>
                    <div className="td td-CostAndReceipt fixed-flex grid-1 grid-gap-10 min-w-135">
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
                </div>
                <div className="td w-full flex-center">
                    <Button idx={n} action="save" className="btn btn-primary hor-center w-100" onClick={onClick}>
                        <i className="fa fa-plus"/> ADD
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
        let {savable, item: assetItem, onUpdated} = this.props;

        if (savable && assetItem) {
            let {action, idx, item} = el.props;
            let {
                // id,
                data: old_data,
                data: {calibration_record_list}
            } = assetItem;

            //9 done
            const lastCalibrationRecord = (calibration_record_list || []).getLastElement();
            const {
                // id,
                next_calibration_interval,
                next_calibration_date,
                calibration_list = [],
            } = lastCalibrationRecord || {};

            const {id, calibrating_company, reference_standard, certificate_num, calibration_date} = item;

            if (action === "save" || action === "saveEdit") {
                progressDialog.open();
                let promise;
                if (lastCalibrationRecord) {
                    promise = upsertAssetCalibrationRecordListItem({
                        id,
                        calibration_record_id: lastCalibrationRecord && lastCalibrationRecord.id,
                        calibrating_company,
                        reference_standard,
                        certificate_num,
                        calibration_date,
                    }).then(savedItem => {
                        if (!savedItem) {
                            if (id) {
                                infoDialog.open("Sorry! Record couldn't be updated.");
                            } else {
                                infoDialog.open("Sorry! Record couldn't be added.");
                            }
                        } else {
                            if (id) {
                                infoDialog.open("Record successfully updated.");
                            } else {
                                calibration_list.push(savedItem.data);
                                infoDialog.open("Record successfully added.");
                            }

                            if (!calibration_record_list) {
                                calibration_record_list = [{calibration_list}];
                            }

                            extendObservable(old_data, {calibration_record_list});
                        }

                        infoDialog.close(2000);
                    });
                } else {
                    promise = insertAssetCalibrationRecord({
                        asset_id: assetItem.id,
                        // next_calibration_interval,
                        // next_calibration_date,
                        calibration_list: {
                            data: [{
                                calibrating_company,
                                reference_standard,
                                certificate_num,
                                calibration_date: Dates.formatDateSQL(calibration_date),
                            }]
                        }
                    }).then(savedItem => {
                        if (!savedItem) {
                            infoDialog.open("Sorry! Record couldn't be added.");
                        } else {
                            if (!savedItem) {
                                infoDialog.open("Sorry! Record couldn't be added.");
                            } else {
                                infoDialog.open("Record successfully added.");
                                extendObservable(old_data, {
                                    calibration_record_list: [savedItem.data]
                                });
                            }
                        }

                        infoDialog.close(2000);
                    });
                }
                promise.catch(err => {
                    infoDialog.open("An error occurred. Please try again later.");
                    infoDialog.close(2000);
                    console.error(err);
                }).finally(() => {
                    setTimeout(() => progressDialog.close());
                });
            } else if (action === "delete") {
                confirmDialog.open("Are you sure you want to remove the item?").then(res => {
                    if (!res) return;

                    progressDialog.open();
                    deleteAssetCalibrationRecordListItem(id).then(savedItem => {
                        if (!savedItem) {
                            infoDialog.open("Sorry! Record couldn't be removed.");
                        } else {
                            infoDialog.open("Record successfully removed.");
                            calibration_list.removeIf(v => v.id === id);
                        }

                        infoDialog.close(2000);
                    }).catch(err => {
                        infoDialog.open("An error occurred. Please try again later.");
                        infoDialog.close(2000);
                        console.error(err);
                    }).finally(() => {
                        setTimeout(() => progressDialog.close());
                    });
                });
            }
            // onUpdate && onUpdate(e, el);
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
                <div className="td w-full grid-2 grid-gap-10">
                    <ClearableInput ref={this.onSetRef} name="calibrating_company" type="text"
                                    placeholder="Calibrating Company"
                                    required className="form-control" onChange={this.onChange}/>
                    <ClearableInput ref={this.onSetRef} name="reference_standard" type="text"
                                    placeholder="Reference Standard"
                                    className="form-control" onChange={this.onChange}/>
                    <ClearableInput ref={this.onSetRef} name="certificate_num" type="text" placeholder="Certificate No."
                                    className="form-control" onChange={this.onChange}/>
                    <ClearableInput ref={this.onSetRef} name="calibration_date" type="date"
                                    placeholder="Calibration Date"
                                    required className="form-control" onChange={this.onChange}/>
                </div>
                <div className="td w-full flex-center">
                    <Button idx={n} action="save" className="btn btn-primary hor-center w-100" onClick={onClick}>
                        <i className="fa fa-plus"/> ADD
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
            type: [
                'Clearance Certificate',
                'Vehicle Registration Certificate',
                'Work Manual',
                'Work Procedure',
                'Break Test Report',
                'Certificate of Fitness(C.O.F)',
                'Invoice',
                'Vehicle License',
            ]
        }
    };

    constructor(props) {
        super(props);

        const {defaultValue} = this.props;
        if (defaultValue) {
            this.state.list = defaultValue;
        }

        const {onChange, name} = this.props;
        onChange && onChange(toJS(this.state.list.filter(v => !!v)), name, this);

        this.insertAt = this.insertAt.bind(this);
    }

    insertAt(list, form) {
        list.insertAt(list.length - 1, form);
        this.ctrl_refs.doc.reset();
    }

    onClickComplete(e, el) {
        let {savable, item: assetItem, onUpdated} = this.props;

        if (savable && assetItem) {
            let {action, idx, item} = el.props;
            let {
                // id,
                data: old_data,
                data: {doc_list}
            } = assetItem;

            const {id, type, title, expiry, desc, doc} = item;
            console.log('onClickComplete item', item)

            if (action === "save" || action === "saveEdit") {
                progressDialog.open();
                let promise;
                if (id) {
                    const attrs = {};
                    ShouldUpdate.check(attrs, item, type, 'type');
                    ShouldUpdate.check(attrs, item, title, 'title');
                    ShouldUpdate.check(attrs, item, desc, 'desc');
                    ShouldUpdate.checkDate(attrs, item, expiry, 'expiry');
                    ShouldUpdate.checkFile(attrs, item, doc, 'doc');
                    promise = updateAssetDoc({
                        id, ...attrs,
                    }).then(savedItem => {
                        if (!savedItem) {
                            infoDialog.open("Sorry! Record couldn't be updated.");
                        } else {
                            infoDialog.open("Record successfully updated.");

                            doc_list.replaceIf(savedItem.data, v => v.id === id);
                        }

                        infoDialog.close(2000);
                    });
                } else {
                    promise = insertAssetDoc({
                        asset_id: assetItem.id, ...item, expiry: Dates.formatDateSQL(item.expiry)
                    }).then(savedItem => {
                        if (!savedItem) {
                            infoDialog.open("Sorry! Record couldn't be added.");
                        } else {
                            infoDialog.open("Record successfully added.");
                            if (doc_list) {
                                doc_list.push(savedItem.data);
                            } else {
                                extendObservable(old_data, {
                                    doc_list: [savedItem.data]
                                });
                            }
                        }

                        infoDialog.close(2000);
                    });
                }
                promise.catch(err => {
                    infoDialog.open("An error occurred. Please try again later.");
                    infoDialog.close(2000);
                    console.error(err);
                }).finally(() => {
                    setTimeout(() => progressDialog.close());
                });
            } else if (action === "delete") {
                confirmDialog.open("Are you sure you want to remove the item?").then(res => {
                    if (!res) return;

                    progressDialog.open();
                    updateAssetDoc({
                        id,
                        removed: true,
                    }).then(savedItem => {
                        if (!savedItem) {
                            infoDialog.open("Sorry! Record couldn't be removed.");
                        } else {
                            infoDialog.open("Record successfully removed.");
                            doc_list.removeIf(v => v.id === id);
                        }

                        infoDialog.close(2000);
                    }).catch(err => {
                        infoDialog.open("An error occurred. Please try again later.");
                        infoDialog.close(2000);
                        console.error(err);
                    }).finally(() => {
                        setTimeout(() => progressDialog.close());
                    });
                });
            }
            // onUpdate && onUpdate(e, el);
        }
    }

    renderItem(n, onClick) {
        const {readonly} = this.props;
        const item = this.state.list[n];
        if (item) {
            const {type, title, expiry, desc, doc} = item;
            return <TRow key={"item-" + n} className="tr-readonly w-full">
                <div className="td fixed-flex min-w-20"><span className="counter">{n + 1}</span></div>
                <div className="td fixed-flex min-w-140">{type}</div>
                <div className="td">{title}</div>
                <div className="td">{desc}</div>
                <div className="td fixed-flex min-w-200">
                    <UploadButton
                        ref={this.onSetRef}
                        name="doc"
                        buttonTitle={!readonly && "Upload Document"}
                        type={['PDF', 'Word']}
                        defaultValue={doc}
                        showOnlyIcon
                        readonly={readonly}
                        className="col-lg-12"
                        onChange={this.onChange}
                    />
                </div>
                <div className="td fixed-flex min-w-140">{Dates.formatDate(expiry)}</div>
                {!readonly ? <div className="td fixed-flex min-w-100 padding-l-0">
                    <Button idx={n} action="edit" className="btn btn-primary margin-r-10 pull-right w-40"
                            onClick={onClick}>
                        <i className="fa fa-pen"/>
                    </Button>
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
                                className="col-lg-12 w-full form-control margin-r-10" onChange={this.onChange}
                                values={this.selfState.lists.type} returnValue/>
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
                    className="col-lg-12 w-full"
                    onChange={this.onChange}
                />
                <ClearableInput ref={this.onSetRef} name="expiry" type="date" placeholder="Expiry Date"
                                className="col-lg-12 w-full form-control" onChange={this.onChange}/>
                <Button idx={n} action="save" className="btn btn-primary hor-center border-radius-20 w-100"
                        onClick={onClick}>
                    <i className="fa fa-check"/> ADD
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
                <div className="td fixed-flex min-w-140 font-size-14">Document Type</div>
                <div className="td font-size-14">Title</div>
                <div className="td font-size-14">Description</div>
                <div className="td fixed-flex min-w-200 font-size-14">Document</div>
                <div className="td fixed-flex min-w-150 font-size-14">Expiry</div>
                <div className={"td fixed-flex padding-0 min-w-" + (!readonly ? "60" : "0")}/>
            </THead>
            <TBody
                ref="body"
                title="Asset Documents"
                renderItem={this.renderItem}
                onClick={this.onClick}
                state={this.state}
                onLoadList={this.onLoadList}
                disablePullToRefresh={false}
            />
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
