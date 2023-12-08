import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';

import {ClearableInput, SelectEmployeeInput} from 'components/inputs';
import ANewDialog from 'components/dialogs/ANewDialog';
import {SelectTable} from 'components/tables';
import {FormControls, Row} from 'components/FormComponents';
import {renderItem, renderTHead, SelectedAssets} from './SelectedAssets';

import style from "./CheckOutToolDialog.lazy.css";

@observer
class CheckOutToolDialog extends ANewDialog {
    pageKey = "CheckOutToolDialog";
    title = "Check Out Asset";

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
            conditions: ['New', 'Good', 'Fair', 'Poor', 'Scrap'],
            barcode_or_qr_code_types: [{text: "Barcode", value: "Barcode", checked: false}, {text: "QR Code", value: "QR Code", checked: false}],
            vendors: [],
            statuses: ['Checked Out', 'Loaned Out', 'Out For Repair']
        },
        asset: null,
        assets: null,
        status: null,
        showBarcode: false,
        showQRCode: false
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
        this.state.status = dialog.extraProp('status');
    }
    
    onLoadList() {
        return neonBinding.events.emit(this.path + 'list/search_by', {key: '!status', value: 'Checked Out'});
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
        this.state.status = val;
    }

    onSubmit(e, btn, onSaved) {
        const {form} = this;

        if (!form.isValid('employee')) {
            infoDialog.open('Team Member is required');
            return;
        }

        const {asset, assets} = this.state;
        const {
            employee, due_return_date, comments
        } = form.data;
        const data = {
            employee: {id: employee.id, fname: employee.data.fname, lname: employee.data.lname}
        };
        if (comments) {
            data.comments = comments;
        }
        if (due_return_date) {
            data.due_return_date = due_return_date.getTime();
        }
        if (asset) {
            data.list = [asset.id];
        } else if (assets) {
            data.list = assets.map(v => v.id);
        }
        console.log(data)

        btn.text("Saving...").disabled();
        neonBinding.events.emit(this.path + "checkout", data).then(res => {
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
                title={<TitleWrapper state={this.state}/>} 
                sectionClassName="-margin-r-10"
                onFormOpen={onFormOpen} 
                onFormNext={onFormNext}
            >
                <SelectStatusWrapper state={this.state} onChange={this.form.onChange}/>
                <SelectEmployeeInput name="employee" type="select" placeholder="Team Member..." required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="due_return_date" type="date" placeholder="Due Return Date..." required defaultValue={new Date()} className="col-lg-12 form-control" onChange={this.form.onChange}/>
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
                <SelectTable ref="selectTable" isDialog replaceCols name="asset" desc="Assests" title="Select Asset(s) To Check Out" className="col-lg-12 no-padding SelectAssetTable" renderTHead={this.renderTHead} defaultValue={this.state.assets ? this.state.assets : (this.state.asset ? [this.state.asset] : null)} renderItem={this.renderItem} onLoadList={this.onLoadList}/>
                <SelectedAssets state={this.state} onChangeAsset={this.onChangeAsset} title="Select Asset(s) To Check Out"/>
            </Row>
        </FormControls>;
    }
}

@observer
class TitleWrapper extends React.Component {
    
    render() {
        const {state: {status}} = this.props;
        if(status) {
            return status;
        }
        return `Check Out${status !== 'Out For Repair' ? ' To' : ''}`;
    }
}

@observer
class SelectStatusWrapper extends React.Component {
    
    render() {
        const {state, state: {asset, assets, status}, onChange} = this.props;
        console.log('asset', asset)
        const statuses = asset ? state.lists.statuses.filter(v => v!== asset.data.status) : state.lists.statuses;
        return <ClearableInput name="status" type="select" placeholder="Set Status To..." defaultValue={status} required className="col-lg-12 form-control" onChange={onChange} values={statuses} returnValue/>;
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

export default CheckOutToolDialog;
