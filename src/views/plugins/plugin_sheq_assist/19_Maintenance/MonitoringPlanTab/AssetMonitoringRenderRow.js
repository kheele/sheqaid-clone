// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed} from 'mobx';
import Chip from "@material-ui/core/Chip";

import {ActionsButton} from 'components/inputs';
import {TRow} from 'components/tables';
import AssetNameCol from "../AssetNameCol";
import {Dates} from "utils/Dates";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="RenderRow">
@observer
class RenderRow extends React.Component {
    listName = 'monitoring_record_list';

    constructor() {
        super();
    }

    @computed get isAsset() {
        return this.props.view === "Asset";
    }

    @computed get isFuelUsage() {
        return this.props.view === "Fuel Usage";
    }

    @computed get isWorkingTimeOrDistance() {
        return this.props.view === "Working Time/Distance";
    }

    render() {
        const {item, idx, view, onClick, renderActionsCol, onView} = this.props;
        console.log('ARenderRow', view, item)
        if (this.isAsset) {
            return <RenderRowByAsset {...this.props} listName={this.listName}/>;
        } else if (this.isFuelUsage) {
            return <RenderRowByFuelUsage {...this.props} listName={this.listName}/>;
        } else if (this.isWorkingTimeOrDistance) {
            return <RenderRowByWorkingTimeOrDistance {...this.props} listName={this.listName}/>;
        } else {
            return null;
        }
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="RenderRowByAsset">
@observer
class RenderRowByAsset extends React.Component {

    render() {
        const {item, idx, view, onClick, renderActionsCol, listName, onView} = this.props;
        console.log('RenderRowByAsset', view, item);

        let {
            id,
            data: {
                // monitoring_plan_list: list,

                //computed
                status,
                monitoring_measurement_type,
                monitoring_measurement_unit,
                monitoring_plan_cost,
                monitoring_last_completed_date,

                total_fuel_usage_per_day,
                total_working_hrskm_per_day,
                total_fuel_usage_per_hrskm,

                total_fuel_usage_per_hrskm_per_day,
                total_fuel_usage_per_hrskm_per_week,
                total_fuel_usage_per_hrskm_per_month,
                total_fuel_usage_per_hrskm_per_year,
            },
        } = item;

        return <TRow key={id} className="w-full tr-header">
            <div className="td fixed-flex min-w-50">
                <h6 className="xs-shown font-size-13">ID</h6>
                {id}
            </div>
            {frag(item, idx, onView)}
            <div className="td fixed-flex min-w-300">{parseFloat(total_fuel_usage_per_hrskm).toFixed(1)} litres
                / {monitoring_measurement_unit}</div>
            <div className="td fixed-flex min-w-300">{parseFloat(total_fuel_usage_per_day).toFixed(1)} litres / Day
            </div>
            <div
                className="td fixed-flex min-w-300">{parseFloat(total_working_hrskm_per_day).toFixed(1)} {monitoring_measurement_unit} /
                Day
            </div>

            {/* <div className="td fixed-flex min-w-105">{last_monitoring && renderExpiryDateSpan(last_monitoring.next_monitoring_date)}</div> */}
            {/*<div className="td fixed-flex flex grid-gap-5 min-w-240">*/}
            {/*	/!* <ExpiryButtons item={item} listName={listName} /> *!/*/}
            {/*</div>*/}
            {renderActionsCol && renderActionsCol(item, idx, onClick)}
            {!renderActionsCol && <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
                <ActionsButton idx={idx} isEmployee className="btn btn-primary pull-right min-w-40"
                               onClick={onClick}/>
            </div>}
        </TRow>;
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="RenderRowByFuelUsage">
@observer
class RenderRowByFuelUsage extends React.Component {

    render() {
        const {item, idx, view, onClick, renderActionsCol, onView, isExport} = this.props;
        console.log('RenderRowByFuelUsage', view, item);

        let {
            id,
            data: {
                // monitoring_plan_list: list,
                upcoming_monitoring_list,
                last_monitoring_list,

                //computed
                status,
                monitoring_measurement_type,
                monitoring_measurement_unit,
                // monitoring_plan_cost,
                // monitoring_last_completed_date,

                last_fuel_usage,
                last_fuel_usage_date,
                last_fuel_usage_hrs_or_km,

                total_fuel_usage_per_day,
                total_fuel_usage_per_week,
                total_fuel_usage_per_month,
                total_fuel_usage_per_year,

                //consumption
                total_fuel_usage_per_hrskm,
                total_fuel_usage_per_hrskm_per_day,
                total_fuel_usage_per_hrskm_per_week,
                total_fuel_usage_per_hrskm_per_month,
                total_fuel_usage_per_hrskm_per_year,

            },
            // data: {
            // 	refilled_fuel,
            // 	current_hrs_or_km,
            // 	working_hrs_or_km,
            // 	date,
            // 	receipt,
            // 	cost,

            // 	monitoring_plan: {
            // 		asset: assetData
            // 	},
            // },
        } = item;

        const content = <React.Fragment key={id}>
            {frag(item, idx, onView)}
            <div className="td fixed-flex min-w-300">
                <h6 className="xs-shown font-size-13">Last Fuel Usage</h6>
                {last_fuel_usage} litres on {" "}
                {Dates.formatDate(last_fuel_usage_date)} with {" "}
                {last_fuel_usage_hrs_or_km}{monitoring_measurement_unit}
            </div>
            <div className="td fixed-flex min-w-300">
                <h6 className="xs-shown font-size-13">Average Fuel Usage</h6>
                <Chip
                    label={<>
                        <Chip
                            label={`${parseFloat(total_fuel_usage_per_day).toFixed(1)} litres/day`}
                            size="small"
                            color="primary"
                            className="cursor-pointer h-20"
                            sx={{
                                cursor: "pointer",
                                padding: "3px 6px !important",
                                backgroundColor: "white !important",
                                margin: '0 !important',
                                height: 'auto !important',
                                width: 'auto !important'
                            }}
                        />
                        <Chip
                            label={`${parseFloat(total_fuel_usage_per_hrskm).toFixed(1)} litres/${monitoring_measurement_unit}`}
                            size="small"
                            color="primary"
                            className="cursor-pointer h-20"
                            sx={{
                                cursor: "pointer",
                                padding: "3px 6px !important",
                                backgroundColor: "white !important",
                                margin: '0 !important',
                                height: 'auto !important',
                                width: 'auto !important'
                            }}
                        />
                    </>}
                    size="medium"
                    className="margin-v-5 h-50 border-radius-30"
                    sx={{
                        cursor: "pointer",
                        padding: "0 7px !important",
                        margin: '8px 0 !important',
                    }}
                />
            </div>
        </React.Fragment>;

        if (isExport) {
            return content;
        }

        return <TRow key={id} className="w-full">
            <div className="td fixed-flex min-w-50">
                <h6 className="xs-shown font-size-13">ID</h6>
                {id}
            </div>
            {content}
            {renderActionsCol && renderActionsCol(item, idx, onClick)}
            {!renderActionsCol && <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
                <ActionsButton idx={idx} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
            </div>}
        </TRow>;
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="RenderRowByWorkingTimeOrDistance">
@observer
class RenderRowByWorkingTimeOrDistance extends React.Component {

    render() {
        const {item, idx, view, onClick, renderActionsCol, onView, isExport} = this.props;
        console.log('RenderRowByWorkingTimeOrDistance', view, item);

        let {
            id,
            data: {
                // monitoring_plan_list: list,
                upcoming_monitoring_list,
                last_monitoring_list,

                //computed
                status,
                monitoring_measurement_type,
                monitoring_measurement_unit,
                // monitoring_plan_cost,
                // monitoring_last_completed_date,

                total_working_hrskm,
                // last_fuel_usage,
                // last_fuel_usage_date,
                // last_fuel_usage_hrs_or_km,

                total_working_hrskm_per_day,
                total_working_hrskm_per_week,
                total_working_hrskm_per_month,
                total_working_hrskm_per_year,

            },
            // data: {
            // 	working_hrs_or_km_opening,
            // 	working_hrs_or_km_closing,
            // 	date,
            // 	working_hrs_or_km,

            // 	monitoring_plan: {
            // 		asset: assetData
            // 	},
            // },
        } = item;

        const content = <React.Fragment key={id}>
            {frag(item, idx, onView)}
            {/* <div className="td fixed-flex min-w-300">
				<h6 className="xs-shown font-size-13">Last {monitoring_measurement_type} Usage</h6>
				{working_hrs_or_km_opening && `${working_hrs_or_km_opening}${monitoring_measurement_unit}`} -
				{working_hrs_or_km_closing && `${working_hrs_or_km_closing}${monitoring_measurement_unit}`}
			</div>
			<div className="td fixed-flex min-w-260">
				<h6 className="xs-shown font-size-13">Opening & Closing {monitoring_measurement_type}</h6>
				{working_hrs_or_km_opening && `${working_hrs_or_km_opening}${monitoring_measurement_unit}`} -
				{working_hrs_or_km_closing && `${working_hrs_or_km_closing}${monitoring_measurement_unit}`}
			</div> */}
            <div className="td fixed-flex min-w-300">
                <h6 className="xs-shown font-size-13">Average Working {monitoring_measurement_type}</h6>
                {parseFloat(total_working_hrskm_per_day).toFixed(1)} {monitoring_measurement_unit}/day
            </div>
            {/* <div className="td fixed-flex min-w-170">
				<h6 className="xs-shown font-size-13">Total Working {monitoring_measurement_type}</h6>
				{total_working_hrskm}{monitoring_measurement_unit}
			</div> */}
        </React.Fragment>;

        if (isExport) {
            return content;
        }

        return <TRow key={id} className="w-full">
            <div className="td fixed-flex min-w-50">
                <h6 className="xs-shown font-size-13">ID</h6>
                {id}
            </div>
            {content}
            {renderActionsCol && renderActionsCol(item, idx, onClick)}
            {!renderActionsCol && <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
                <ActionsButton idx={idx} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
            </div>}
        </TRow>;
    }
}

// </editor-fold>

function frag(item, idx, onView) {
    let {
        data: {
            asset_detail: {
                reg_num,
                serial_num,
                location,
            },
        }
    } = item;

    return <>
        <div className="td">
            <AssetNameCol
                idx={idx}
                onClick={onView}
                item={item}
            />
        </div>
        <div className="td">
            <h6 className="xs-shown font-size-13">Location</h6>
            {location || "N/A"}
        </div>
        <div className="td fixed-flex min-w-140">
            <h6 className="xs-shown font-size-13">Reg. No.</h6>
            {reg_num || 'N/A'}
        </div>
        <div className="td fixed-flex min-w-140">
            <h6 className="xs-shown font-size-13">Serial No.</h6>
            {serial_num || 'N/A'}
        </div>
    </>;
}

export default RenderRow;
//491
