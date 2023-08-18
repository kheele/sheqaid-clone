//<editor-fold desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from "utils/Form";
import {Dates, execWhen} from 'utils/Utils';

import {
    onSelectLoadAssetConditions,
    onSelectLoadAssetLocations,
    onSelectLoadAssetManufacturers,
    onSelectLoadAssetModels,
    onSelectLoadAssetToolkits,
    onSelectLoadAssetVendors
} from "views/plugins/utils";
import {findDOMNode} from "react-dom";

//</editor-fold>

@observer
class AControls extends React.Component {
    //<editor-fold desc="fields">
    path = "plugin_sheq_assist/19_Maintenance/tools/";

    @observable
    state = {
        lists: {
            barcode_or_qr_code_types: [{text: "Barcode", value: "Barcode", checked: false}, {
                text: "QR Code",
                value: "QR Code",
                checked: false
            }],
            manufacturers: [],
            models: [],
            locations: [],
            toolkits: [],
            conditions: ['New', 'Good', 'Fair', 'Poor', 'Scrap'],
            vendors: [],
            depreciation_methods: ['Straight Line', 'Declining Balance', "Sum of the Year`s Digits"],
            partial_year_depreciations: [{text: "Yes", value: true, checked: false}, {
                text: "No",
                value: false,
                checked: true
            }],
            next_calibration_interval: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24].map(n => (n + " Months"))
        },
        showBarcode: false,
        showQRCode: false,
        loadedSelectLists: false,
        monitoring_plan_working_distance_or_time_list: [],
        monitoring_plan_fuel_usage_list: [],
        next_service_hrs_or_km: 0
    };
    //</editor-fold>

    //<editor-fold desc="constructor">
    constructor(props) {
        super(props);

        this.form = new Form();
        this.form.addChangeOne("asset_type", this.onChangeAssetType.bind(this));
        this.form.addChangeOne("barcode_or_qr_code_type", this.onChangeBarcodeOrQRCode.bind(this));
        this.form.addChangeOne("acquisition_value", this.onChangeAcquisitionValue.bind(this));
        this.form.addChangeOne("next_service_hrs_or_km", this.onChangeNextServiceDistanceOrTime.bind(this));
        this.form.addChangeOne("next_calibration_interval", this.onChangeCalibrationInterval.bind(this));
        this.form.addChangeMany(["monitoring_plan_working_distance_or_time_list", "monitoring_plan_fuel_usage_list"], this.onChangeMonitoringPlanLists.bind(this));
        this.form.addChangeOne("calibration_record_list", this.onChangeCalibrationRecordList.bind(this));
    }

    //</editor-fold>

    //<editor-fold desc="componentDidMount">
    componentDidMount() {
        const loads = {
            manufacturers: onSelectLoadAssetManufacturers,
            models: onSelectLoadAssetModels,
            locations: onSelectLoadAssetLocations,
            toolkits: onSelectLoadAssetToolkits,
            conditions: onSelectLoadAssetConditions,
            vendors: onSelectLoadAssetVendors
        };
        Promise.all(Object.keys(loads).map(k => {
            return loads[k]().then(res => {
                if (k === 'conditions') {
                    this.state.lists[k] = [...this.state.lists[k], ...res.map(v => v.value)].distinct();
                } else {
                    this.state.lists[k] = res;
                }
            });
        })).then(res => {
            this.state.loadedSelectLists = true;
        });

        const index = this.props.dialog.extraProp("index");
        if (index) {
            execWhen(() => {
                try {
                    return !!findDOMNode(this);
                } catch (e) {
                    return false;
                }
            }).then(() => {
                this.props.onFormGoto(index + 1);
            });
        }
    }

    //</editor-fold>

    //<editor-fold desc="onChangeAssetType">
    onChangeAssetType(el, val) {
        execWhen(() => this.refs.maintenance_plan_list &&
            this.refs.next_service_hrs_or_km &&
            this.refs.monitoring_plan_working_distance_or_time_list &&
            this.refs.monitoring_plan_fuel_usage_list &&
            //
            this.refs.monitoring_plan_stats_working_distance_or_time &&
            this.refs.monitoring_plan_stats_fuel_usage).then(() => {
            if (val) {
                const {
                    maintenance_plan_list,
                    next_service_hrs_or_km,
                    monitoring_plan_working_distance_or_time_list,
                    monitoring_plan_fuel_usage_list,
                    //
                    monitoring_plan_stats_working_distance_or_time,
                    monitoring_plan_stats_fuel_usage
                } = this.refs;

                const units = ['Vehicles', 'Small Plant'].contains(val) ? 'Distance' : 'Time';

                maintenance_plan_list.setUnits(units);
                next_service_hrs_or_km.setPlaceholder('Next Service ' + units);
                monitoring_plan_working_distance_or_time_list.setUnits(units);
                monitoring_plan_fuel_usage_list.setUnits(units);
                //
                monitoring_plan_stats_working_distance_or_time.setUnits(units);
                monitoring_plan_stats_fuel_usage.setUnits(units);
            }
        });
    }

    //</editor-fold>

    //<editor-fold desc="onChangeAcquisitionValue">
    onChangeAcquisitionValue(el, val) {
        execWhen(() => this.refs.asset_cost).then(asset_cost_ref => {
            if (val) {
                asset_cost_ref.setEditable(true);
                asset_cost_ref.onChange(val);
                asset_cost_ref.setEditable(false);
            }
        });
    }

    //</editor-fold>

    //<editor-fold desc="onChangeBarcodeOrQRCode">
    onChangeBarcodeOrQRCode(el, val) {
        this.state.showBarcode = val === 'Barcode';
        this.state.showQRCode = val === 'QR Code';
    }

    //</editor-fold>

    //<editor-fold desc="onChangeNextServiceDistanceOrTime">
    onChangeNextServiceDistanceOrTime(el, val) {
        this.state.next_service_hrs_or_km = isNullable(val) ? 0 : parseInt(val);
    }

    //</editor-fold>

    //<editor-fold desc="onChangeCalibrationInterval">
    onChangeCalibrationInterval(el, val) {
        execWhen(() => this.refs.next_calibration_date).then(next_calibration_date => {
            if (val) {
                const num = parseInt(val.replace("Months", "").trim());
                const currD = new Date().setMidnight().addMonths(num);
                next_calibration_date.setEditable(true);
                next_calibration_date.onChange(currD);
                next_calibration_date.setEditable(false);
            } else {
                const {next_calibration_interval} = this.refs;
                next_calibration_interval.onChange("12 Months");
            }
        });
    }

    //</editor-fold>

    //<editor-fold desc="onChangeMonitoringPlanLists">
    onChangeMonitoringPlanLists(el, name, val) {
        this.state[name] = val || [];
    }

    //</editor-fold>

    //<editor-fold desc="onChangeCalibrationRecordList">
    onChangeCalibrationRecordList(el, list) {
        execWhen(() => this.refs.next_calibration_date && this.refs.next_calibration_interval).then(() => {
            const {next_calibration_interval, next_calibration_date} = this.refs;
            if (!next_calibration_interval) {
                return;
            }

            let currD;
            const num = next_calibration_interval.hasValue ? parseInt(next_calibration_interval.value.replace("Months", "").trim()) : 12;
            if (list && !list.isEmpty()) {
                const {calibration_date} = list.getLastElement();
                if (calibration_date) {
                    currD = Dates.parse(calibration_date);
                } else {
                    currD = new Date().setMidnight();
                }
            } else {
                currD = new Date().setMidnight();
            }
            currD = currD.addMonths(num);
            next_calibration_date.setEditable(true);
            next_calibration_date.onChange(currD);
            next_calibration_date.setEditable(false);
        });
    }

    //</editor-fold>

}

export {
    AControls
};