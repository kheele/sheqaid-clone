import React from "react";
import {observer} from 'mobx-react';
import {extendObservable, observable} from 'mobx';

import Form from 'utils/Form';
import {onSelectLoadAssetLocations} from 'views/plugins/utils';

import {ClearableInput, SelectEmployeeInput} from 'components/inputs';
import ANewDialog from 'components/dialogs/ANewDialog';
import {SelectTable} from 'components/tables';
import {FormControls, Row} from 'components/FormComponents';
import {renderItem, renderTHead, SelectedAssets} from './SelectedAssets';

import CheckOutToolDialog from './CheckOutToolDialog.js';

import style from "./CheckInToolDialog.lazy.css";
import {Dates} from "utils/Dates";
import {insertAssetRegister} from "mutations/create";

@observer
class CheckInToolDialog extends ANewDialog {
    pageKey = "CheckInToolDialog";
    title = "Check In Asset";

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return Controls;
    }
}

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/19_Maintenance/tools/";

    @observable
    state = {
        lists: {
            toolkits: [],
            manufacturers: [],
            statuses: ['In Storage', 'Checked Out', 'Loaned Out', 'Out For Repair'],
            conditions: ['New', 'Good', 'Fair', 'Poor', 'Scrap'],
            barcode_or_qr_code_types: [{text: "Barcode", value: "Barcode", checked: false}, {
                text: "QR Code",
                value: "QR Code",
                checked: false
            }],
            locations: [],
            vendors: []
        },
        asset: null,
        assets: null,
        showBarcode: false,
        showQRCode: false,
        loadedSelectLists: false
    };

    constructor(props) {
        super(props);

        this.onFormChange = this.onFormChange.bind(this);

        this.onChangeAsset = this.onChangeAsset.bind(this);
        this.onLoadList = this.onLoadList.bind(this);
        this.renderTHead = renderTHead.bind(this);
        this.renderItem = renderItem.bind(this);

        this.form = new Form();
        this.form.addChangeOne("barcode_or_qr_code_type", this.onChangeBarcodeOrQRCode.bind(this));
        this.form.addChangeOne("status", this.onChangeStatus.bind(this));
    }

    componentDidMount() {
        const {dialog} = this.props;
        this.state.asset = dialog.extraProp('item');
        this.state.assets = dialog.extraProp('items');

        const loads = {locations: onSelectLoadAssetLocations};
        Promise.all(Object.keys(loads).map(k => {
            return loads[k]().then(res => {
                this.state.lists[k].push(...res);
                this.state.lists[k] = this.state.lists[k].distinct();
            });
        })).then(res => {
            this.state.loadedSelectLists = true;
        });
    }

    onLoadList() {
        const listByLogged = sockets.of("assets").fn('listByLogged');

        return listByLogged({
            written_off: false,
            //
            status: "!In Storage",
            //
            exact_orgs: true,
            data_export: true,
            //
            limit: 0,
            offset: 0,
        }).then((res) => {
            console.log('onLoadList res', res)
            return res;
        });
    }

    onChangeAsset() {
        this.refs.selectTable.open().then(list => {
            if (list.length === 1) {
                this.state.asset = list[0];
                this.state.assets = null;
            } else if (list.length > 1) {
                this.state.assets = list;
                this.state.asset = null;
            }
        });
    }

    onChangeBarcodeOrQRCode(el, val) {
        this.state.showBarcode = val === 'Barcode';
        this.state.showQRCode = val === 'QR Code';
    }

    onChangeStatus(el, val) {
        if (val) {
            if (val === 'Checked Out' || val === 'Loaned Out' || val === 'Out For Repair') {
                el.reset();
                this.refs.checkOutToolDialog.extraProp('status', val).extraProp('item', this.state.asset).extraProp('items', this.state.assets).open().then(res => {
//                  list.filter(v => !!res[v.id]).forEach(v => {
//                      if(!v.data.register_list) v.data.register_list = [];
//                      v.data.register_list.push(res[v.id]);
//                  });
                });
            }
        }
    }

    // <editor-fold defaultstate="collapsed" desc="onFormChange">
    onFormChange(idx) {
        const {dialog} = this.props;
        dialog.cssWidth = idx === 1 ? '700px' : '1400px';
        return true;
    }

    // </editor-fold>

    onSubmit(e, btn, onSaved) {
        const {form} = this;

        if (!form.isValid('status')) {
            infoDialog.open('Please Set Status');
            return;
        }

        const {asset, assets} = this.state;
        const {
            employee_returned_by,
            employee_return_accepted_by,
            returned_date,
            returned_time,
            status,
            condition,
            location,
            comments
        } = form.data;
        const data = {
            employee_returned_by_id: employee_returned_by && employee_returned_by.id,
            employee_return_accepted_by_id: employee_return_accepted_by && employee_return_accepted_by.id,
            status,
            condition,
            location,
            comments,
            returned_date: Dates.formatDateSQL(returned_date),
            returned_time,
            list: asset ? [asset.id] : assets ? assets.map(v => v.id) : [],
        };

        console.log(data)

        btn.text("Saving...").disabled();
        progressDialog.open();

        insertAssetRegister(data).then(res => {
            console.log("res", res)
            if (res) {
                extendObservable(asset.data, {status: status});
                if (asset.data.register_list) {
                    asset.data.register_list.push(...res);
                } else {
                    extendObservable(asset.data, {register_list: res});
                }
            }
            onSaved && onSaved(res);
            infoDialog.open("Record successfully checked in.");
            infoDialog.close(2000);
            this.props.close();
        }).finally(() => {
            btn.text("Save").enabled();
            setTimeout(() => progressDialog.close());
        });
    }

    render() {
        const {onFormNext, onFormBack, onFormOpen, onFormChange} = this.props;

        return <FormControls>
            <Row
                rendered
                active
                idx={1}
                title='Check In'
                sectionClassName="-margin-r-10"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
                onFormChange={onFormChange}
            >
                <SelectEmployeeInput name="employee_returned_by" type="select" placeholder="Returned By..." required
                                     className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <SelectEmployeeInput name="employee_return_accepted_by" type="select" placeholder="Accepted By..."
                                     required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="returned_date" type="date" placeholder="Date Returned..." required
                                className="col-lg-6 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="returned_time" type="time" placeholder="Time Returned..." required
                                className="col-lg-6 form-control" onChange={this.form.onChange}/>
                <SelectStatusWrapper state={this.state} onChange={this.form.onChange}/>
                <SelectWrapper state={this.state} name="condition" placeholder="Set Condition To..."
                               onChange={this.form.onChange} className="col-lg-12 form-control" values="conditions"/>
                <SelectWrapper state={this.state} name="location" placeholder="Set Location To..."
                               onChange={this.form.onChange} className="col-lg-12 form-control" values="locations"/>
                <ClearableInput name="reason" type="textarea" placeholder="Reason" className="col-lg-12 form-control"
                                onChange={this.form.onChange}/>
                <ClearableInput name="comments" type="textarea" placeholder="Comments" required
                                className="col-lg-12 form-control" onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={2}
                title="2. Asset Details"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormChange={onFormChange}
            >
                <SelectTable ref="selectTable" isDialog replaceCols name="asset" desc="Assets"
                             title="Select Asset(s) To Check In" className="col-lg-12 no-padding SelectAssetTable"
                             renderTHead={this.renderTHead}
                             defaultValue={this.state.assets ? this.state.assets : (this.state.asset ? [this.state.asset] : null)}
                             renderItem={this.renderItem} onLoadList={this.onLoadList}/>
                <SelectedAssets state={this.state} onChangeAsset={this.onChangeAsset}
                                title="Select Asset(s) To Check In"/>
            </Row>
            <CheckOutToolDialog ref="checkOutToolDialog"/>
        </FormControls>;
    }
}

@observer
class SelectStatusWrapper extends React.Component {

    render() {
        const {state, state: {asset, assets, status}, onChange} = this.props;
        const statuses = asset ? state.lists.statuses.filter(v => v !== asset.data.status) : state.lists.statuses;
        const defaultValue = {label: "In Storage", value: "In Storage"};
        return <ClearableInput name="status" type="select" placeholder="Set Status To..." defaultValue={defaultValue}
                               required className="col-lg-12 form-control" onChange={onChange} values={statuses}
                               returnValue/>;
    }
}

@observer
class SelectWrapper extends React.Component {

    render() {
        const {state, name, placeholder, className, onChange, values} = this.props;
        if (!state.loadedSelectLists) return null;
        return <ClearableInput name={name} type="select" placeholder={placeholder} required className={className}
                               onChange={onChange} values={state.lists[values]} returnValue add/>;
    }
}

@observer
class BarcodeWrapper extends React.Component {

    render() {
        return this.props.state.showBarcode &&
            <ClearableInput name="barcode_or_qr_code" type="text" placeholder="Barcode"
                            className="col-lg-12 form-control" onChange={this.props.onChange}/>;
    }
}

@observer
class QRCodeWrapper extends React.Component {

    render() {
        return this.props.state.showQRCode &&
            <ClearableInput name="barcode_or_qr_code" type="text" placeholder="QR Code"
                            className="col-lg-12 form-control" onChange={this.props.onChange}/>;
    }
}

export default CheckInToolDialog;
