//<editor-fold desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import {Button, ClearableInput} from 'components/inputs';
//</editor-fold>

const unitsShort = {
    Time: "h", Distance: "km"
};

//<editor-fold desc="PartsUsed">
@observer
class PartsUsed extends React.Component {

    constructor(props) {
        super(props);

        this.onView = this.onView.bind(this);
        this.onEdit = this.onEdit.bind(this);
    }

    onView() {
        let {state, parts_used, defaultValue, onView} = this.props;
        onView && onView(parts_used);
    }

    onEdit() {
        let {state, item, parts_used, name, defaultValue, onChange, onEdit} = this.props;
        onEdit && onEdit(item ? parts_used : state && state.parts_used).then(val => {
            if (item) {
                item.parts_used = val;
            }
            if (state) {
                state.parts_used = val;
            }
            onChange && onChange(val, name, this);
        });
    }

    render() {
        let {state, parts_used, readonly, isEditable, name, defaultValue, onChange} = this.props;
        if (readonly) {
            parts_used = parts_used || [];
            return <div className="grid-2 grid-gap-10 h-30">
                {/*<Button*/}
                {/*    className={`btn btn-primary no-border font-size-11 bg-${parts_used.isNotEmpty() ? 'green' : 'red'} padding-0 h-30 hor-center w-120`}>*/}
                {/*    <i className={`fa fa-${parts_used.isNotEmpty() ? 'check' : 'times'}`}/> {parts_used.isNotEmpty() ? 'Parts Available' : 'No Parts'}*/}
                {/*</Button>*/}
                {/*<Button*/}
                {/*    className='btn btn-primary fixed-flex font-size-12 padding-5 w-120'*/}
                {/*    text={(isEditable ? (!parts_used.isEmpty() ? 'Edit/View' : 'Add') : 'View') + ' Receipt/Cost'}*/}
                {/*    onClick={isEditable ? this.onEdit : this.onView}*/}
                {/*    rendered={isEditable || !parts_used.isEmpty()}*/}
                {/*/>*/}
            </div>;
        } else {
            let {parts_used = []} = state || {};
            parts_used = parts_used || [];
            return <div className="grid-2 grid-gap-10 h-30">
                <Button
                    className={`btn btn-primary no-border font-size-11 bg-${parts_used.isNotEmpty() ? 'green' : 'red'} padding-0 h-30 hor-center w-120`}>
                    <i className={`fa fa-${parts_used.isNotEmpty() ? 'check' : 'times'}`}/> {parts_used.isNotEmpty() ? `${parts_used.length} Parts Available` : 'No Parts'}
                </Button>
                <Button
                    className='btn btn-primary fixed-flex font-size-12 padding-5 w-120'
                    text={(parts_used.isNotEmpty() ? 'Edit' : 'Add') + ' Parts'}
                    onClick={this.onEdit}
                />
            </div>;
        }
    }
}

//</editor-fold>

//<editor-fold desc="CostAndReceipt">
@observer
class CostAndReceipt extends React.Component {

    constructor(props) {
        super(props);

        this.onView = this.onView.bind(this);
        this.onEdit = this.onEdit.bind(this);
    }

    onView() {
        let {state, cost_and_receipt, defaultValue, onView} = this.props;
        onView && onView(cost_and_receipt);
    }

    onEdit() {
        let {state, item, cost_and_receipt, name, defaultValue, onChange, onEdit} = this.props;
        onEdit && onEdit(item ? cost_and_receipt : state && state.cost_and_receipt).then(val => {
            if (item) {
                item.cost_and_receipt = val;
            }
            if (state) {
                state.cost_and_receipt = val;
            }
            onChange && onChange(val, name, this);
        });
    }

    render() {
        let {state, cost_and_receipt, readonly, isEditable, name, defaultValue, onChange} = this.props;
        if (readonly) {
            cost_and_receipt = cost_and_receipt || {};
            const {cost, receipt} = cost_and_receipt || {};
            return <div className="grid-3 grid-gap-10 h-30">
                <Button
                    className={`btn btn-primary no-border font-size-11 bg-${receipt ? 'green' : 'red'} padding-0 h-30 hor-center w-85`}>
                    <i className={`fa fa-${receipt ? 'check' : 'times'}`}/> {receipt ? 'Receipt Available' : 'No Receipt'}
                </Button>
                <Button
                    className={`btn btn-primary no-border font-size-11 bg-${cost ? 'green' : 'red'} padding-0 h-30 hor-center w-70`}>
                    <i className={`fa fa-${cost ? 'check' : 'times'}`}/> {cost ? cost.replace('$', '').toCurrency('R') : 'No Cost'}
                </Button>
                <Button
                    className='btn btn-primary fixed-flex font-size-12 padding-5 w-110'
                    text={(isEditable ? (cost || receipt ? 'Edit/View' : 'Add') : 'View') + ' Receipt/Cost'}
                    onClick={isEditable ? this.onEdit : this.onView}
                />
            </div>;
        } else {
            const {cost_and_receipt} = state || {};
            const {cost, receipt} = cost_and_receipt || {};
            return <div className="grid-3 grid-gap-10 h-30">
                <Button
                    className={`btn btn-primary no-border font-size-11 bg-${receipt ? 'green' : 'red'} padding-0 h-30 hor-center w-85`}>
                    <i className={`fa fa-${receipt ? 'check' : 'times'}`}/> {receipt ? 'Receipt Available' : 'No Receipt'}
                </Button>
                <Button
                    className={`btn btn-primary no-border font-size-11 bg-${cost ? 'green' : 'red'} padding-0 h-30 hor-center w-70`}>
                    <i className={`fa fa-${cost ? 'check' : 'times'}`}/> {cost ? cost.replace('$', '').toCurrency('R') : 'No Cost'}
                </Button>
                <Button
                    className='btn btn-primary fixed-flex font-size-12 padding-5'
                    text={cost || receipt ? 'Edit' : 'Add'}
                    onClick={this.onEdit}
                />
            </div>;
        }
    }
}

//</editor-fold>

//<editor-fold desc="SelectWrapper">
@observer
class SelectWrapper extends React.Component {

    render() {
        const {state, name, placeholder, defaultValue, className, onChange, values, add} = this.props;
        if (!state.loadedSelectLists) return null;
        return <ClearableInput name={name} type="select" placeholder={placeholder} defaultValue={defaultValue}
                               className={className}
                               onChange={onChange} values={state.lists[values]} returnValue add={add}/>;
    }
}

//</editor-fold>

//<editor-fold desc="BarcodeWrapper">
@observer
class BarcodeWrapper extends React.Component {

    render() {
        const {type, defaultValue, state} = this.props;
        return (state.showBarcode) &&
            <ClearableInput name="barcode_or_qr_code" type="text" defaultValue={defaultValue} placeholder="Barcode"
                            className="col-lg-7 pull-left-2_5 form-control" onChange={this.props.onChange}/>;
    }
}

//</editor-fold>

//<editor-fold desc="QRCodeWrapper">
@observer
class QRCodeWrapper extends React.Component {

    render() {
        const {type, defaultValue, state} = this.props;
        return (state.showQRCode) &&
            <ClearableInput name="barcode_or_qr_code" type="text" defaultValue={defaultValue} placeholder="QR Code"
                            className="col-lg-7 pull-left-2_5 form-control" onChange={this.props.onChange}/>;
    }
}

//</editor-fold>

//<editor-fold desc="AFutureOrCurrentMaintenanceDistanceOrTime">
@observer
class AFutureOrCurrentMaintenanceDistanceOrTime extends React.Component {
    @observable
    state = {
        units: null
    };

    setUnits(units) {
        this.state.units = units;
    }

    @computed get newCurrVal() {
        const {next_service_hrs_or_km = 0, monitoring_plan_working_distance_or_time_list = []} = this.props.state;
        const list = [...monitoring_plan_working_distance_or_time_list];
        list.sortBy('date');
        const lastItem = list.pop();
        const newCurrVal = lastItem ? parseInt(lastItem.working_hrs_or_km_closing) : null;
        if (newCurrVal !== null) {
            const {unit} = this;
            if (this.key === 'FutureMaintenanceDistanceOrTime') {
                if (next_service_hrs_or_km) {
                    return newCurrVal + (next_service_hrs_or_km || 0) + unit;
                }
            } else {
                return newCurrVal + unit;
            }
        }
    }

    @computed get unit() {
        return unitsShort[this.state.units] || 'h/km';
    }

}

//</editor-fold>

//<editor-fold desc="CurrentDistanceOrTime">
@observer
class CurrentDistanceOrTime extends AFutureOrCurrentMaintenanceDistanceOrTime {
    key = 'CurrentDistanceOrTime';

    render() {
        const {units} = this.state;
        const {newCurrVal} = this;
        return <div
            className="CurrentDistanceOrTime fixed-flex min-w-170 grid-1 flex-center hor-center padding-10 font-size-13 w-200 border-radius-20">
            <label className="">Current {units || 'Time/Distance'}</label>
            {newCurrVal || '--'}
        </div>;
    }
}

//</editor-fold>

//<editor-fold desc="FutureMaintenanceDistanceOrTime">
@observer
class FutureMaintenanceDistanceOrTime extends AFutureOrCurrentMaintenanceDistanceOrTime {
    key = 'FutureMaintenanceDistanceOrTime';

    render() {
        const {newCurrVal} = this;
        return <div
            className="FutureMaintenanceDistanceOrTime fixed-flex min-w-170 grid-1 flex-center hor-center padding-10 font-size-13 w-200 border-radius-20">
            <label className="">Service Due In</label>
            {newCurrVal || '--'}
        </div>;
    }
}

//</editor-fold>

const CONSTANTS = {
    DOCUMENTS: 4,
    MONITORING: 7,
    MAINTENANCE: 8,
    CALIBRATION: 9,
    INSPECTIONS: 11,
    REGISTER: 12,
    PARTS: 13,
    JOB_CARDS: 14
};

export {
    PartsUsed,
    CostAndReceipt,
    SelectWrapper,
    BarcodeWrapper,
    QRCodeWrapper,
    CurrentDistanceOrTime,
    FutureMaintenanceDistanceOrTime,
    CONSTANTS
};
