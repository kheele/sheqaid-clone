import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';
import {
    onSelectLoadAssetLocations,
    onSelectLoadAssetManufacturers,
    onSelectLoadAssetModels,
    onSelectLoadAssetToolkits,
    onSelectLoadAssetVendors
} from 'views/plugins/utils';

import Tabs from 'components/tabs/Tabs';
import {Dates} from 'utils/Utils';
import {AProfileDialog} from 'components/dialogs';
import {ProfileField} from 'components/inputs';

import style from "./ProfileToolWrittenOffDialog.lazy.css";

@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfileToolWrittenOffDialog";

    constructor(props) {
        super(props, style);
    }

    title() {
        return "Asset Written off";
    }

    get controls() {
        return Controls;
    }
}

@observer
class Controls extends React.Component {

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
            vendors: []
        },
        showBarcode: false,
        showQRCode: false,
        loadedSelectLists: false,
        index: 0
    };

    constructor(props) {
        super(props);

        this.form = new Form();
    }

    componentDidMount() {
        const loads = {
            manufacturers: onSelectLoadAssetManufacturers,
            models: onSelectLoadAssetModels,
            locations: onSelectLoadAssetLocations,
            toolkits: onSelectLoadAssetToolkits,
            vendors: onSelectLoadAssetVendors
        };
        Promise.all(Object.keys(loads).map(k => {
            return loads[k]().then(res => {
                this.state.lists[k] = res;
            });
        })).then(res => {
            this.state.loadedSelectLists = true;
        });
    }

    get item() {
        return this.props.state.item;
    }

    render() {
        if (!this.item)
            return null;
        const {
            props: {dialog: {renderProfileCover}},
            item, item: {
                id, data: {
                    created_at,
                    name, asset_type, desc,
                    manufacturer, model, serial_num,
                    location, toolkit, condition,
                    barcode_or_qr_code_type, barcode_or_qr_code,
                    notes,
                    photo,
                    acquisition_date, vendor, acquisition_value, warranty_expiry, reference_num
                }
            }
        } = this;
        return <div className="controls-wrapper">
            <div className="controls">
                {renderProfileCover(<React.Fragment>
                    <h5>{'Created On ' + Dates.formatDate(created_at)}</h5>
                </React.Fragment>)}
                <div className="row">
                    <div className="row sec-group">
                        <ProfileField name="name" value={name} placeholder="Asset Name" required
                                      onChange={this.form.onChange}/>
                        <ProfileField name="asset_type" value={asset_type} placeholder="Asset Type"/>
                        <ProfileField name="desc" value={desc} type="textarea" placeholder="Description" required
                                      className="col-lg-12" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row">
                    <div className="row sec-group">
                        <SelectWrapper state={this.state} name="manufacturer" value={manufacturer}
                                       placeholder="Manufacturer" className="col-lg-4" onChange={this.form.onChange}
                                       values="manufacturers"/>
                        <SelectWrapper state={this.state} name="model" value={model} placeholder="Model"
                                       className="col-lg-4" onChange={this.form.onChange} values="models"/>
                        <ProfileField name="serial_num" value={serial_num} placeholder="Serial No." required
                                      className="col-lg-4" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row">
                    <div className="row sec-group">
                        <SelectWrapper state={this.state} name="location" value={location} placeholder="Location"
                                       onChange={this.form.onChange} className="col-lg-4" values="locations"/>
                        <SelectWrapper state={this.state} name="toolkit" value={toolkit} placeholder="Toolkit"
                                       onChange={this.form.onChange} className="col-lg-4" values="toolkits"/>
                        <SelectWrapper state={this.state} name="condition" value={condition} placeholder="Condition"
                                       onChange={this.form.onChange} className="col-lg-4" values="conditions"/>
                    </div>
                </div>
                <div className="row">
                    <div className="row sec-group">
                        <ProfileField name="barcode_or_qr_code_type" value={barcode_or_qr_code_type} type="radio"
                                      placeholder="Barcode / QR Code" required onChange={this.form.onChange}
                                      values={this.state.lists.barcode_or_qr_code_types}/>
                        <BarcodeWrapper state={this.state} value={barcode_or_qr_code} type={barcode_or_qr_code_type}
                                        onChange={this.form.onChange}/>
                        <QRCodeWrapper state={this.state} value={barcode_or_qr_code} type={barcode_or_qr_code_type}
                                       onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row">
                    <div className="row sec-group">
                        <ProfileField name="notes" value={notes} type="textarea" placeholder="Notes" required
                                      className="col-lg-12" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row row-photo col-lg-6 min-h-420">
                    <div className="row sec-group">
                        <ProfileField name="photo" value={photo} type="file" placeholder="Asset Photo" required
                                      className="col-lg-12" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row col-lg-6 pull-right min-h-420">
                    <label className="hor-center">Purchase Info.</label>
                    <div className="row sec-group">
                        <ProfileField name="acquisition_date" value={acquisition_date} type="date"
                                      placeholder="Date of Acquisition" className="col-lg-12" required
                                      onChange={this.form.onChange}/>
                        <SelectWrapper state={this.state} value={vendor} name="vendor" placeholder="Vendor"
                                       className="col-lg-12" onChange={this.form.onChange} values="vendors"/>
                        <ProfileField name="acquisition_value" value={acquisition_value} type="number"
                                      placeholder="Acquisition Value" className="col-lg-12" required
                                      onChange={this.form.onChange}/>
                        <ProfileField name="warranty_expiry" value={warranty_expiry} type="date"
                                      placeholder="Warranty Expiry Date" required onChange={this.form.onChange}/>
                        <ProfileField name="reference_num" value={reference_num} placeholder="Acquisition Reference No."
                                      required onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row col-lg-12 row-tabs">
                    <Tabs key="tabs" index={this.state.index} keepState={true}>
                        <CalibrationRecordTab ref="calibrationRecordTab" title="Calibration Record" item={item}/>
                        <MaintanancePlanTab ref="maintanancePlanTab" title="Maintanance Plan" item={item}/>
                        <MonitoringPlanTab ref="monitoringPlanTab" title="Monitoring Plan" item={item}/>
                    </Tabs>
                </div>
            </div>
        </div>;
    }

}

@observer
class SelectWrapper extends React.Component {

    render() {
        const {state, name, placeholder, className, onChange, value, values} = this.props;
        if (!state.loadedSelectLists) return null;
        return <ProfileField name={name} value={value} type="select" placeholder={placeholder} required
                             className={className} onChange={onChange} values={state.lists[values]} add/>;
    }
}

@observer
class BarcodeWrapper extends React.Component {

    render() {
        return this.props.type === 'Barcode' &&
            <ProfileField name="barcode_or_qr_code" type="text" placeholder="Barcode" onChange={this.props.onChange}/>;
    }
}

@observer
class QRCodeWrapper extends React.Component {

    render() {
        return this.props.type === 'QR Code' &&
            <ProfileField name="barcode_or_qr_code" type="text" placeholder="QR Code" onChange={this.props.onChange}/>;
    }
}

@observer
class CalibrationRecordTab extends React.Component {

    @observable
    state = {};

    constructor(props) {
        super(props);

        this.form = new Form();
    }

    render() {
        const {
            item: {
                id, data: {
                    optional_info
                }
            }
        } = this.props;
        const className = this.pageKey + "-tab" + (this.props.active ? ' active' : '');
        return <div id={this.pageKey + "-tab"} className={className}>
            <div className="controls-wrapper">
                {optional_info && <div className="controls col-lg-12">
                    <div className="row col-lg-12">
                        <ProfileField name="company_num" title="Company No." value={optional_info.company_num}
                                      className="col-lg-4" onChange={this.form.onChange}/>
                        <ProfileField name="supervisor_name" title="Supervisor Name"
                                      value={optional_info.supervisor_name} className="col-lg-4"
                                      onChange={this.form.onChange}/>
                        <ProfileField name="supervisor_phone" title="Supervisor Phone No."
                                      value={optional_info.supervisor_phone} className="col-lg-4"
                                      onChange={this.form.onChange}/>
                        <ProfileField name="supervisor_email" title="Supervisor Email Address"
                                      value={optional_info.supervisor_email} type="email" className="col-lg-4"
                                      onChange={this.form.onChange}/>
                        <ProfileField name="job_position" title="Job Position" type="select"
                                      value={optional_info.job_position} renderer={val => val.data.name}
                                      className="col-lg-4"/>
                    </div>
                </div>}
                {!optional_info && <p className="not-available">N/A</p>}
            </div>
        </div>
    }
}

@observer
class MaintanancePlanTab extends React.Component {

    @observable
    state = {};

    constructor(props) {
        super(props);

        this.form = new Form();
    }

    render() {
        const {
            item: {
                id, data: {
                    optional_info
                }
            }
        } = this.props;
        const className = this.pageKey + "-tab" + (this.props.active ? ' active' : '');
        return <div id={this.pageKey + "-tab"} className={className}>
            <div className="controls-wrapper">
                {optional_info && <div className="controls col-lg-12">
                    <div className="row col-lg-12">
                        <ProfileField name="company_num" title="Company No." value={optional_info.company_num}
                                      className="col-lg-4" onChange={this.form.onChange}/>
                        <ProfileField name="supervisor_name" title="Supervisor Name"
                                      value={optional_info.supervisor_name} className="col-lg-4"
                                      onChange={this.form.onChange}/>
                        <ProfileField name="supervisor_phone" title="Supervisor Phone No."
                                      value={optional_info.supervisor_phone} className="col-lg-4"
                                      onChange={this.form.onChange}/>
                        <ProfileField name="supervisor_email" title="Supervisor Email Address"
                                      value={optional_info.supervisor_email} type="email" className="col-lg-4"
                                      onChange={this.form.onChange}/>
                        <ProfileField name="job_position" title="Job Position" type="select"
                                      value={optional_info.job_position} renderer={val => val.data.name}
                                      className="col-lg-4"/>
                    </div>
                </div>}
                {!optional_info && <p className="not-available">N/A</p>}
            </div>
        </div>
    }
}

@observer
class MonitoringPlanTab extends React.Component {

    @observable
    state = {};

    constructor(props) {
        super(props);

        this.form = new Form();
    }

    render() {
        const {
            item: {
                id, data: {
                    optional_info
                }
            }
        } = this.props;
        const className = this.pageKey + "-tab" + (this.props.active ? ' active' : '');
        return <div id={this.pageKey + "-tab"} className={className}>
            <div className="controls-wrapper">
                {optional_info && <div className="controls col-lg-12">
                    <div className="row col-lg-12">
                        <ProfileField name="company_num" title="Company No." value={optional_info.company_num}
                                      className="col-lg-4" onChange={this.form.onChange}/>
                        <ProfileField name="supervisor_name" title="Supervisor Name"
                                      value={optional_info.supervisor_name} className="col-lg-4"
                                      onChange={this.form.onChange}/>
                        <ProfileField name="supervisor_phone" title="Supervisor Phone No."
                                      value={optional_info.supervisor_phone} className="col-lg-4"
                                      onChange={this.form.onChange}/>
                        <ProfileField name="supervisor_email" title="Supervisor Email Address"
                                      value={optional_info.supervisor_email} type="email" className="col-lg-4"
                                      onChange={this.form.onChange}/>
                        <ProfileField name="job_position" title="Job Position" type="select"
                                      value={optional_info.job_position} renderer={val => val.data.name}
                                      className="col-lg-4"/>
                    </div>
                </div>}
                {!optional_info && <p className="not-available">N/A</p>}
            </div>
        </div>
    }
}

export default ProfileDialog;
