//<editor-fold desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {extendObservable, observable, toJS} from 'mobx';

import {Dates, execWhen} from 'utils/Utils';

import {Button, ClearableInput} from 'components/inputs';
import {ATableSavable, Table, TBody, THead, TRow} from 'components/tables';

import upsertAssetMonitoringPlanWorkingHrsOrKmListItem
    from "mutations/all/Asset/upsertAssetMonitoringPlanWorkingHrsOrKmListItem";
import insertAssetMonitoringPlan from "mutations/all/Asset/insertAssetMonitoringPlan";
import {deleteAssetMonitoringPlanWorkingHrsOrKmListItem} from "mutations/delete";
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

        const {defaultValue, asset} = this.props;
        if (defaultValue) {
            this.state.list = toJS(defaultValue);
        }
        if (asset) {
            const {asset_type} = asset.data.asset_detail;
            const units = ['Vehicles', 'Small Plant'].contains(asset_type) ? 'Distance' : 'Time';
            this.selfState.units = units;
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
            return <TRow key={"item-" + n} className="tr-readonly min-h-40 w-full">
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
            className="NewMonitoringPlanTable NewMonitoringPlanTable-WorkingHrsOrKm w-full-calc-add-10 min-h-90 h-auto padding-0">
            <THead className="align-left">
                <div className="td fixed-flex min-w-30">#</div>
                <div className="td font-size-14">Opening {this.selfState.units || 'Time/Distance'}</div>
                <div className="td font-size-14">Closing {this.selfState.units || 'Time/Distance'}</div>
                <div className="td font-size-14">Total {this.selfState.units || 'Time/Distance'} Used</div>
                <div className="td fixed-flex min-w-165 font-size-14">Date</div>
                <div className={"td fixed-flex padding-0 min-w-" + (!readonly ? "60" : "10")}/>
            </THead>
            <TBody ref="body" title="Asset Monitoring Plan" renderItem={this.renderItem}
                   onClick={this.onClick}
                   state={this.state} onLoadList={this.onLoadList} disablePullToRefresh={true}/>
        </Table>;
    }
}

//</editor-fold>

export default NewMonitoringPlanWorkingHrsOrKmTable;
