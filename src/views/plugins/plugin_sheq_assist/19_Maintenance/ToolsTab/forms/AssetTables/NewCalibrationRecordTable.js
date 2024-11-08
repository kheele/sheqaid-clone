//<editor-fold desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {extendObservable, observable, toJS} from 'mobx';

import {Dates} from 'utils/Utils';

import {Button, ClearableInput} from 'components/inputs';
import {ATableSavable, Table, TBody, THead, TRow} from 'components/tables';

import upsertAssetCalibrationRecordListItem from "mutations/all/Asset/upsertAssetCalibrationRecordListItem";
import deleteAssetCalibrationRecordListItem from "mutations/all/Asset/deleteAssetCalibrationRecordListItem";
import insertAssetCalibrationRecord from "mutations/all/Asset/insertAssetCalibrationRecord";
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
            return <TRow key={"item-" + n} className="tr-readonly min-h-40">
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
            return <TRow key="item-new" className="padding-l-0 padding-t-10 padding-b-10 grid-1 grid-gap-10">
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
        return (<Table
            className="NewCalibrationRecordTable w-full-calc-add-10 min-h-90 h-auto -margin-t-5 -margin-l-10 margin-b-10 padding-0">
            <THead className="align-left">
                <div className="td fixed-flex min-w-20">#</div>
                <div className="td font-size-14">Calibrating Company</div>
                <div className="td fixed-flex min-w-160 font-size-14">Reference Standard</div>
                <div className="td fixed-flex min-w-160 font-size-14">Certificate No.</div>
                <div className="td fixed-flex min-w-175 font-size-14">Calibration Date</div>
                <div className={"td fixed-flex padding-0 min-w-" + (!readonly ? "60" : "10")}/>
            </THead>
            <TBody ref="body" title="Asset Calibration Record" renderItem={this.renderItem} onClick={this.onClick}
                   state={this.state} onLoadList={this.onLoadList} disablePullToRefresh={true}/>
        </Table>);
    }
}

//</editor-fold>

export default NewCalibrationRecordTable;
