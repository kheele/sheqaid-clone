import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';
import {onSelectLoadAssetLocations} from 'views/plugins/utils';

import {ClearableInput} from 'components/inputs';
import ANewDialog from 'components/dialogs/ANewDialog';
import {SelectTable} from 'components/tables';
import {FormControls, Row} from 'components/FormComponents';
import {renderItem, renderTHead, SelectedAssets} from './SelectedAssets';

import CheckOutToolDialog from './CheckOutToolDialog.js';

import style from "./CheckInToolDialog.lazy.css";

@observer
class CheckInToolDialog extends ANewDialog {
    pageKey = "CheckInToolDialog";
    title = "Check In Asset";

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return  Controls;
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
            barcode_or_qr_code_types: [{text: "Barcode", value: "Barcode", checked: false}, {text: "QR Code", value: "QR Code", checked: false}],
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
    }
    
    componentDidMount() {
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
        return neonBinding.events.emit(this.path + 'list/search_by', {key: '!status', value: 'In Storage'});
    }
    
    onChangeAsset(){
        this.refs.selectTable.open().then(list => {
            if(list.length === 1) {
                this.state.asset = list[0];
                this.state.assets = null;
            } else if(list.length > 1) {
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
        if(val) {
            if(val === 'Checked Out' || val === 'Loaned Out' || val === 'Out For Repair') {
                el.reset();
                this.refs.checkOutToolDialog.
                        extraProp('status', val).
                        extraProp('item', this.state.asset).
                        extraProp('items', this.state.assets).
                        open().then(res => {
//                  list.filter(v => !!res[v.id]).forEach(v => {
//                      if(!v.data.register_list) v.data.register_list = [];
//                      v.data.register_list.push(res[v.id]);
//                  });
                });
            }
        }
    }

    onSubmit(e, btn, onSaved) {
        const {form} = this;

        if (!form.isValid('status')) {
            infoDialog.open('Please Set Status');
            return;
        }

        const {asset, assets} = this.state;
        const {
            status, condition, location, comments
        } = form.data;
        const data = {
            status
        };
        if (condition) {
            data.condition = condition;
        }
        if (location) {
            data.location = location;
        }
        if (comments) {
            data.comments = comments;
        }
        if (asset) {
            data.list = [asset.id];
        } else if (assets) {
            data.list = assets.map(v => v.id);
        }
        console.log(data)

        btn.text("Saving...").disabled();
        neonBinding.events.emit(this.path + "checkin", data).then(res => {
            console.log("res", res)
            onSaved && onSaved(res);
            infoDialog.open("Record successfully saved.");
            infoDialog.close(2000);
            this.props.close();
        }).finally(() => {
            btn.text("Save").enabled();
        });
    }
    
    render() {
        const {onFormNext, onFormBack, onFormOpen} = this.props;
        
        return <FormControls>
            <Row 
                rendered 
                active
                idx={1}
                title='Check In' 
                sectionClassName="-margin-r-10"
                onFormOpen={onFormOpen} 
                onFormNext={onFormNext}
            >
                <SelectStatusWrapper state={this.state} onChange={this.form.onChange}/>
                <SelectWrapper state={this.state} name="condition" placeholder="Set Condition To..." onChange={this.form.onChange} className="col-lg-12 form-control" values="conditions"/>
                <SelectWrapper state={this.state} name="location" placeholder="Set Location To..." onChange={this.form.onChange} className="col-lg-12 form-control" values="locations"/>
                <ClearableInput name="reason" type="textarea" placeholder="Reason" className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="comments" type="textarea" placeholder="Comments" required className="col-lg-12 form-control" onChange={this.form.onChange}/>
            </Row>
            <Row 
                rendered 
                idx={2}
                title="2. Asset Details" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack}
            >
                <SelectTable ref="selectTable" isDialog replaceCols name="asset" desc="Assets" title="Select Asset(s) To Check In" className="col-lg-12 no-padding SelectAssetTable" renderTHead={this.renderTHead} defaultValue={this.state.assets ? this.state.assets : (this.state.asset ? [this.state.asset] : null)} renderItem={this.renderItem} onLoadList={this.onLoadList}/>
                <SelectedAssets state={this.state} onChangeAsset={this.onChangeAsset} title="Select Asset(s) To Check In"/>
            </Row>
            <CheckOutToolDialog ref="checkOutToolDialog"/>    
        </FormControls>;
    }
}

@observer
class SelectStatusWrapper extends React.Component {
    
    render() {
        const {state, state: {asset, assets}, onChange} = this.props;
        const statuses = asset ? state.lists.statuses.filter(v => v!== asset.data.status) : state.lists.statuses;
        const defaultValue = {label: "In Storage", value: "In Storage"};
        return <ClearableInput name="status" type="select" placeholder="Set Status To..." defaultValue={defaultValue} required className="col-lg-12 form-control" onChange={onChange} values={statuses} returnValue/>;
    }
}

@observer
class SelectWrapper extends React.Component {
    
    render() {
        const {state, name, placeholder, className, onChange, values} = this.props;
        if(!state.loadedSelectLists) return null;
        return <ClearableInput name={name} type="select" placeholder={placeholder} required className={className} onChange={onChange} values={state.lists[values]} returnValue add/>;
    }
}
  
@observer
class BarcodeWrapper extends React.Component {

    render() {
        return this.props.state.showBarcode && <ClearableInput name="barcode_or_qr_code" type="text" placeholder="Barcode" className="col-lg-12 form-control" onChange={this.props.onChange}/>;
    }
}

@observer
class QRCodeWrapper extends React.Component {

    render() {
        return this.props.state.showQRCode && <ClearableInput name="barcode_or_qr_code" type="text" placeholder="QR Code" className="col-lg-12 form-control" onChange={this.props.onChange}/>;
    }
}

export default CheckInToolDialog;
