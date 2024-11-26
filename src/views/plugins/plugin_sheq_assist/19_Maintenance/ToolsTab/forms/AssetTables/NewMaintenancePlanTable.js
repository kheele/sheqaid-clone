//<editor-fold desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {extendObservable, observable, toJS} from 'mobx';

import {CalculationUtils, Dates} from 'utils/Utils';

import {Button, ClearableInput} from 'components/inputs';
import {ATableSavable, Table, TBody, THead, TRow} from 'components/tables';

import NewPartCostAndReceiptDialog from "../../../PartsTab/forms/NewPartCostAndReceiptDialog";
import ProfilePartCostAndReceiptDialog from "../../../PartsTab/forms/ProfilePartCostAndReceiptDialog";
import ProfilePartDialog from "../../../PartsTab/forms/ProfilePartDialog";
import {MaintenancePlanStats} from "../AssetStats";
import {CostAndReceipt} from "../AssetComponents";
import NewPartsUsedListDialog from "../../../PartsTab/forms/NewPartsUsedListDialog";
import upsertAssetMaintenancePlanListItem from "mutations/all/Asset/upsertAssetMaintenancePlanListItem";
import {deleteAssetMaintenancePlanListItem} from "mutations/delete";
import insertAssetMaintenancePlan from "mutations/all/Asset/insertAssetMaintenancePlan";
//</editor-fold>

const unitsShort = {
    Time: "h", Distance: "km"
};

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
                        cost: cost_and_receipt && cost_and_receipt.cost,
                        receipt: cost_and_receipt && cost_and_receipt.receipt,
                        // parts_used_list: parts_used || [],
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
            return <TRow key={"item-" + n} className="min-h-60 tr-readonly">
                <div className="td fixed-flex min-w-30"><span className="counter">{n + 1}</span></div>
                <div className="td fixed-flex min-w-200">{reason_for_service}</div>
                <div className="td fixed-flex min-w-130">{service}</div>
                <div
                    className="td fixed-flex min-w-150">{service_hrs_or_km}{unitsShort[this.selfState.units] || 'h/km'}</div>
                <div className="td fixed-flex min-w-165">{Dates.formatDate(service_date)}</div>
                {/*<div className="td td-PartsUsed fixed-flex min-w-140">*/}
                {/*    <PartsUsed*/}
                {/*        name='parts_used'*/}
                {/*        onEdit={this.onNewPartsUsedListDialog}*/}
                {/*        onView={this.onViewPartDialog}*/}
                {/*        item={item}*/}
                {/*        parts_used={parts_used}*/}
                {/*        readonly*/}
                {/*        isEditable={!readonly}*/}
                {/*    />*/}
                {/*</div>*/}
                <div className="td td-CostAndReceipt fixed-flex min-w-285">
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
            const units = unitsShort[this.selfState.units] || 'h/km';
            return <TRow key="item-new" className="padding-l-0 padding-t-10 padding-b-10 grid-1 grid-gap-10">
                <div className="td w-full grid-1 grid-gap-10">
                    <ClearableInput ref={this.onSetRef} name="reason_for_service" type="select"
                                    placeholder="Reason For Service..."
                                    required className="form-control margin-r-10" onChange={this.onChange}
                                    values={this.selfState.lists.reason_for_service} returnValue/>
                    <ClearableInput ref={this.onSetRef} name="service" type="select" placeholder="Service..."
                                    className="form-control margin-r-10" onChange={this.onChange}
                                    values={this.selfState.lists.service} returnValue/>
                    <div className="td fixed-flex min-w-150 td-number flex">
                        <ClearableInput ref={this.onSetRef} name="service_hrs_or_km" type="number"
                                        placeholder={"Service " + units}
                                        isClearable={false}
                                        defaultValue={CalculationUtils.getTimeOrDistanceTakenFromLastService(asset)}
                                        className="form-control" onChange={this.onChange}/>
                        <label
                            className="fixed-flex min-w-45 margin-0 margin-r-10 text-center">{units}</label>
                    </div>
                    <ClearableInput ref={this.onSetRef} name="service_date" type="date" placeholder="Service Date..."
                                    required className="form-control margin-r-10" onChange={this.onChange}/>
                    {/*<div className="td td-PartsUsed fixed-flex grid-1 grid-gap-10 flex-center min-w-140">*/}
                    {/*    <label className="text-center padding-b-5">Parts Used</label>*/}
                    {/*    <PartsUsed*/}
                    {/*      ref={this.onSetRef}*/}
                    {/*      name='parts_used'*/}
                    {/*      onEdit={this.onNewPartsUsedListDialog}*/}
                    {/*      state={this.selfState}*/}
                    {/*      onChange={this.onChange}*/}
                    {/*    />*/}
                    {/*</div>*/}
                    {/*<div className="td td-CostAndReceipt fixed-flex grid-1 grid-gap-10 padding-10 min-w-135">*/}
                    {/*    <div className="grid-1 flex-center h-90 bg-white padding-10">*/}
                    {/*        <label className="text-center padding-b-5">Cost & Receipt</label>*/}
                    {/*        <hr/>*/}
                    {/*        <CostAndReceipt*/}
                    {/*            ref={this.onSetRef}*/}
                    {/*            name='cost_and_receipt'*/}
                    {/*            onEdit={this.onNewPartCostAndReceiptDialog}*/}
                    {/*            state={this.selfState}*/}
                    {/*            onChange={this.onChange}*/}
                    {/*        />*/}
                    {/*        /!*<UploadButton ref={this.onSetRef} name='receipt' onChange={this.onChange} required*!/*/}
                    {/*        /!*              type={['Photo', 'Word', 'Excel', 'PDF']}*!/*/}
                    {/*        /!*              buttonTitle='Receipt'*!/*/}
                    {/*        /!*              showOnlyIcon*!/*/}
                    {/*        /!*              className="form-control"/>*!/*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                </div>
                <div className="td w-full flex-center">
                    <Button
                        idx={n}
                        action="save"
                        className="btn btn-primary border-radius-20 hor-center w-100"
                        onClick={onClick}>
                        <i className="fa fa-plus"/> ADD
                    </Button>
                </div>
            </TRow>;
        }
    }

    render() {
        const {readonly, asset} = this.props;
        return (<Table
            className="NewMaintenancePlanTable w-full-calc-add-10 min-h-90 h-auto -margin-t-5 -margin-l-10 margin-b-10 padding-0">
            <THead className="align-left">
                <div className="td fixed-flex min-w-30">#</div>
                <div className="td fixed-flex min-w-200 font-size-14">Reason For Service</div>
                <div className="td fixed-flex min-w-130 font-size-14">Service</div>
                <div
                    className="td fixed-flex min-w-150 font-size-14">Service {this.selfState.units || 'Time/Distance'}</div>
                <div className="td fixed-flex min-w-165 font-size-14">Service Date</div>
                {/*<div className="td fixed-flex min-w-140 font-size-14">Parts Used</div>*/}
                <div className="td fixed-flex min-w-285 font-size-14">Cost & Receipt</div>
                <div className={"td fixed-flex padding-0 min-w-" + (!readonly ? "60" : "10")}/>
            </THead>
            <TBody ref="body" title="Asset Maintenance Plan" renderItem={this.renderItem} onClick={this.onClick}
                   state={this.state} onLoadList={this.onLoadList} disablePullToRefresh={true}>
                <MaintenancePlanStats asset={asset} state={this.state} selfState={this.selfState}/>
            </TBody>

            <NewPartCostAndReceiptDialog ref='newPartCostAndReceiptDialog'/>
            <ProfilePartCostAndReceiptDialog ref='profilePartCostAndReceiptDialog'/>

            <NewPartsUsedListDialog ref='newPartsUsedListDialog'/>
            <ProfilePartDialog ref='profilePartDialog'/>
        </Table>);
    }
}

//</editor-fold>

export default NewMaintenancePlanTable;
